package project_1.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_1.demo.Model.DepositModel;
import project_1.demo.Model.TransactionModel;
import project_1.demo.Model.UserModel;
import project_1.demo.Repository.DepositRepository;
import project_1.demo.Repository.TransactionRepository;
import project_1.demo.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepositService {

    @Autowired
    private DepositRepository depositRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;
    @Transactional
    public void createDepositRequest(String accNo, Double amount, String email) {
        if (!userRepository.existsById(accNo)) {
            throw new RuntimeException("Account number " + accNo + " does not exist.");
        }

        DepositModel deposit = new DepositModel();
        deposit.setAccountNumber(accNo);
        deposit.setAmount(amount);
        deposit.setUserEmail(email);
        deposit.setStatus("PENDING");
        deposit.setTimestamp(LocalDateTime.now());

        depositRepository.save(deposit);
    }

    @Transactional
    public void approveDepositRequest(Long requestId) {
        DepositModel request = depositRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Deposit request not found."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("This request has already been processed.");
        }

        UserModel user = userRepository.findById(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("User associated with this account not found."));

        // 1. Update balance
        user.setBalance(user.getBalance() + request.getAmount());
        userRepository.save(user);

        // 2. Mark the specific deposit request as APPROVED
        request.setStatus("APPROVED");
        depositRepository.save(request);

        // 3. NEW: Record this in the general Transaction history so the user can see it
        TransactionModel history = new TransactionModel();
        history.setReceiverAccountNumber(request.getAccountNumber());
        history.setAmount(request.getAmount());
        history.setType("DEPOSIT");
        history.setStatus("APPROVED");
        history.setTimestamp(LocalDateTime.now());
        transactionRepository.save(history); // Requires @Autowired TransactionRepository
    }

    @Transactional
    public void rejectDepositRequest(Long requestId) {
        DepositModel request = depositRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Deposit request not found."));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Only pending requests can be rejected.");
        }

        request.setStatus("REJECTED");
        depositRepository.save(request);
    }

    public List<DepositModel> getAllPendingRequests() {
        return depositRepository.findByStatus("PENDING");
    }
}