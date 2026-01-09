package project_1.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    public void updateLoanStatus(Long loanId, LoanStatus status) {
        // Correct use of Optional to find the loan
        LoanModel loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.PENDING) {
            throw new IllegalStateException("Loan has already been processed");
        }

        if (status == LoanStatus.APPROVED) {
            // Liquidity Check Logic
            Double userDeposits = userRepository.getTotalBalanceSum();
            Double bankTotalCapital = OWNER_INVESTMENT + (userDeposits != null ? userDeposits : 0.0);

            if (bankTotalCapital < loan.getPrincipal()) {
                throw new RuntimeException("Bank liquidity insufficient for this loan amount!");
            }
            // Retrieval of UserModel using direct repository method
            UserModel user = userRepository.findByAccountNumber(loan.getAccountNumber());
            if (user != null) {
                user.setBalance(user.getBalance() + loan.getPrincipal());
                userRepository.save(user);
            }
        }
        loan.setStatus(status);
        loanRepository.save(loan);
    }

    public LoanModel createLoanRequest(LoanModel loan) {
        // 1. Constraint Check: Prevent duplicate active/pending applications

        if (!"TEMPLATE".equals(loan.getAccountNumber())) {
            boolean alreadyExists = loanRepository.existsByAccountNumberAndPrincipalAndStatusNot(
                    loan.getAccountNumber(),
                    loan.getPrincipal(),
                    LoanStatus.REJECTED
            );

            if (alreadyExists) {
                throw new RuntimeException("Application Denied: You already have a pending or approved loan for this amount.");
            }
        }

        double principal = loan.getPrincipal();
        double rate = loan.getInterestRate() / 100.0;
        double timeInYears = loan.getDurationMonths() / 12.0;
        loan.setTotalRepayment(principal + (principal * rate * timeInYears));

        // Note: UserLoanRequest.js already sets status to PENDING, but setting it here ensures backend integrity.
        loan.setStatus(LoanStatus.PENDING);
        loan.setAppliedDate(LocalDateTime.now());

        return loanRepository.save(loan);
    }

    public List<LoanModel> findAllLoans() {
        return loanRepository.findAll();
    }


    public List<LoanModel> findTemplates() {
        return loanRepository.findByAccountNumber("TEMPLATE");
    }

    public void deleteLoan(Long id) {
        if (loanRepository.existsById(id)) {
            loanRepository.deleteById(id);
        } else {
            throw new RuntimeException("Loan record not found with ID: " + id);
        }
    }
}