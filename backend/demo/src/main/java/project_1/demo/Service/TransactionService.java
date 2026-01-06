package project_1.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_1.demo.Model.TransactionModel;
import project_1.demo.Model.UserModel;
import project_1.demo.Repository.TransactionRepository;
import project_1.demo.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {
    @Autowired private UserRepository userRepository;
    @Autowired private TransactionRepository transactionRepository;

    @Transactional
    public String transferMoney(String senderAcc, String receiverAcc, Double amount) {
        if (senderAcc.equals(receiverAcc)) throw new RuntimeException("Cannot transfer to yourself");

        UserModel sender = userRepository.findById(senderAcc)
                .orElseThrow(() -> new RuntimeException("Sender account not found"));
        UserModel receiver = userRepository.findById(receiverAcc)
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        if (sender.getBalance() < amount) throw new RuntimeException("Insufficient funds");

        // Deduct and Add
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
        tx.setTimestamp(LocalDateTime.now()); // Good practice to track time
        transactionRepository.save(tx);

        return "Transfer Successful";
    }
}