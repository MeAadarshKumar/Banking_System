package project_1.demo.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "loan_templates")
public class LoanTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId;
    private Double principal;
    private Double interestRate;
    private Integer durationMonths;
}