package project_1.demo.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class DepositModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String userEmail;
    private Double amount;
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    private LocalDateTime timestamp = LocalDateTime.now();
}