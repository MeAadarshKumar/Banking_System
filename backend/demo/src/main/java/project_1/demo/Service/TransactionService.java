package project_1.demo.Service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project_1.demo.Model.TransactionModel;
import project_1.demo.Model.UserModel;
import project_1.demo.Repository.TransactionRepository;
import project_1.demo.Repository.UserRepository;

import java.util.List;

@Service
public class TransactionService {
    @Autowired
    private UserRepository userRepository;
    @Autowired private TransactionRepository transactionRepository;

    @Transactional
    public String transferMoney(String senderAcc, String receiverAcc, Double amount) {
        UserModel sender = userRepository.findById(senderAcc)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        UserModel receiver = userRepository.findById(receiverAcc)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getBalance() < amount) throw new RuntimeException("Insufficient funds");

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        userRepository.save(sender);
        userRepository.save(receiver);

        // Record Transaction
        TransactionModel tx = new TransactionModel();
        tx.setSenderAccountNumber(senderAcc);
        tx.setReceiverAccountNumber(receiverAcc);
        tx.setAmount(amount);
        tx.setType("TRANSFER");
        tx.setStatus("APPROVED");
        transactionRepository.save(tx);

        return "Transfer Successful";
    }

    public void requestDeposit(String accNo, Double amount) {
        TransactionModel deposit = new TransactionModel();
        deposit.setReceiverAccountNumber(accNo);
        deposit.setAmount(amount);
        deposit.setType("DEPOSIT");
        deposit.setStatus("PENDING");
        transactionRepository.save(deposit);
    }

    @Transactional
    public void approveDeposit(Long transactionId) {
        TransactionModel tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        UserModel user = userRepository.findById(tx.getReceiverAccountNumber())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBalance(user.getBalance() + tx.getAmount());
        tx.setStatus("APPROVED");

        userRepository.save(user);
        transactionRepository.save(tx);
    }

    @Transactional
    public List<TransactionModel> findPending() {
        return transactionRepository.findByStatus("PENDING");
    }
}
