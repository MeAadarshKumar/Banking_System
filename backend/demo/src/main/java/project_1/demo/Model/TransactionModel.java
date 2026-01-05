package project_1.demo.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class TransactionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderAccountNumber;
    private String receiverAccountNumber;
    private Double amount;
    private String type; // "TRANSFER" or "DEPOSIT"
    private String status; // "PENDING", "APPROVED", "REJECTED"
    private LocalDateTime timestamp = LocalDateTime.now();
}
