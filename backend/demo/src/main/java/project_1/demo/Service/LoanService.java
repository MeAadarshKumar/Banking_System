package project_1.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_1.demo.Model.LoanModel;
import project_1.demo.Model.LoanStatus;
import project_1.demo.Model.UserModel;
import project_1.demo.Repository.LoanRepository;
import project_1.demo.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    private final Double OWNER_INVESTMENT = 100000.0;

    @Transactional
    public void updateLoanStatus(Long loanId, LoanStatus status) {
        LoanModel loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalStateException("Loan has already been processed");
        }

        if (status == LoanStatus.APPROVED) {
            Double userDeposits = userRepository.getTotalBalanceSum();
            Double bankTotalCapital = OWNER_INVESTMENT + (userDeposits != null ? userDeposits : 0.0);

            if (bankTotalCapital < loan.getPrincipal()) {
                throw new RuntimeException("Bank liquidity insufficient for this loan amount!");
            }

            userRepository.findByAccountNumber(loan.getAccountNumber())
                    .ifPresent(user -> {
                        user.setBalance(user.getBalance() + loan.getPrincipal());
                        userRepository.save(user);
                    });

            // IMPORTANT: Initialize remaining principal and total paid upon approval
            loan.setRemainingPrincipal(loan.getPrincipal());
            loan.setTotalPaid(0.0);

            // Pre-calculate EMI for the user's convenience
            calculateEmi(loan);
        }
        loan.setStatus(status);
        loanRepository.save(loan);
    }

    public LoanModel createLoanRequest(LoanModel loan) {
        if (!"TEMPLATE".equals(loan.getAccountNumber())) {
            boolean alreadyExists = loanRepository.existsByAccountNumberAndPrincipalAndStatusNot(
                    loan.getAccountNumber(),
                    loan.getPrincipal(),
                    LoanStatus.REJECTED
            );

            if (alreadyExists) {
                throw new RuntimeException("Application Denied: You already have a pending or approved loan.");
            }
        }

        double principal = loan.getPrincipal();
        double rate = loan.getInterestRate() / 100.0;
        double timeInYears = loan.getDurationMonths() / 12.0;
        loan.setTotalRepayment(principal + (principal * rate * timeInYears));

        loan.setStatus(LoanStatus.PENDING);
        loan.setAppliedDate(LocalDateTime.now());

        return loanRepository.save(loan);
    }

    public LoanModel calculateEmi(LoanModel loan) {
        // Ensure we don't have nulls during calculation
        double p = (loan.getRemainingPrincipal() != null) ? loan.getRemainingPrincipal() : loan.getPrincipal();
        double annualRate = (loan.getInterestRate() != null) ? loan.getInterestRate() : 0.0;
        int n = (loan.getDurationMonths() != null && loan.getDurationMonths() > 0) ? loan.getDurationMonths() : 12;

        double r = (annualRate / 100) / 12;

        if (r == 0) {
            loan.setEmiAmount(p / n);
        } else {
            double emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            loan.setEmiAmount(emi);
        }
        return loan;
    }

    @Transactional
    public void processPayment(Long loanId, Double paymentAmount, boolean isDirectPrincipal) {
        LoanModel loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        UserModel user = userRepository.findByAccountNumber(loan.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Balance Check
        if (user.getBalance() < paymentAmount) {
            throw new RuntimeException("Insufficient balance. Required: " + paymentAmount);
        }

        // 2. Logic for Principal vs EMI
        // Initialize if null to avoid NullPointerException
        if (loan.getRemainingPrincipal() == null) loan.setRemainingPrincipal(loan.getPrincipal());
        if (loan.getTotalPaid() == null) loan.setTotalPaid(0.0);

        if (isDirectPrincipal) {
            loan.setRemainingPrincipal(loan.getRemainingPrincipal() - paymentAmount);
            // RECALCULATE EMI after reducing principal to show the new lower monthly cost
            calculateEmi(loan);
        } else {
            double monthlyRate = (loan.getInterestRate() / 100) / 12;
            double interestPortion = loan.getRemainingPrincipal() * monthlyRate;
            double principalPortion = paymentAmount - interestPortion;

            loan.setRemainingPrincipal(loan.getRemainingPrincipal() - principalPortion);
            loan.setTotalPaid(loan.getTotalPaid() + paymentAmount);
        }

        // 3. Status Update and Finalize
        if (loan.getRemainingPrincipal() <= 0.1) { // 0.1 buffer for double precision
            loan.setRemainingPrincipal(0.0);
            loan.setStatus(LoanStatus.PAID);
        }

        user.setBalance(user.getBalance() - paymentAmount);
        userRepository.save(user);
        loanRepository.save(loan);
    }

    public List<LoanModel> findAllLoans() { return loanRepository.findAll(); }
    public List<LoanModel> findTemplates() { return loanRepository.findByAccountNumber("TEMPLATE"); }
    public void deleteLoan(Long id) { loanRepository.deleteById(id); }
}