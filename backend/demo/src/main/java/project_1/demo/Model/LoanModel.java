package project_1.demo.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Entity
@Data
@Table(name = "loans")
public class LoanModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long loanId;

    private String accountNumber;
    private Double principal;
    private Double interestRate; // e.g., 5.0 for 5%
    private Integer durationMonths;
    private Double totalRepayment;
    private Double fine; // Added if late payment exists

    @Enumerated(EnumType.STRING)
    private LoanStatus status; // PENDING, APPROVED, REJECTED, PAID

    private LocalDateTime appliedDate;

    // Add this field to your LoanModel class
    private Double remainingPrincipal;
    private Double emiAmount; // To store the calculated monthly payment
    private Double totalPaid;
}

