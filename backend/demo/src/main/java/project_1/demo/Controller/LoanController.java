package project_1.demo.Controller;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.LoanModel;
import project_1.demo.Model.LoanStatus;
import project_1.demo.Service.LoanService;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:3000")
public class LoanController {

    @Autowired
    private LoanService loanService;

    // ADMIN: View all loan applications
    @GetMapping("/admin/all")
    public List<LoanModel> getAllLoans() {
        return loanService.findAllLoans();
    }

    // ADMIN: Update status (APPROVE/REJECT)
    @PostMapping("/admin/status/{id}/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @PathVariable String status) {
        try {
            LoanStatus loanStatus = LoanStatus.valueOf(status.toUpperCase());
            loanService.updateLoanStatus(id, loanStatus);
            return ResponseEntity.ok("Loan successfully " + status);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // USER: Submit application
    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody LoanModel loan) {
        try {
            return ResponseEntity.ok(loanService.createLoanRequest(loan));
        } catch (RuntimeException e) {
            // Return 400 Bad Request with the error message
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN: Create a template
    @PostMapping("/templates/create")
    public ResponseEntity<LoanModel> createTemplate(@RequestBody LoanModel template) {
        template.setAccountNumber("TEMPLATE");
        template.setStatus(LoanStatus.APPROVED); // Templates are essentially pre-approved
        return ResponseEntity.ok(loanService.createLoanRequest(template));
    }

    // Get all templates for the "Create Loan Model" page
    @GetMapping("/templates")
    public List<LoanModel> getTemplates() {
        return loanService.findTemplates();
    }

    // Delete a template from the "Create Loan Model" table
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable Long id) {
        try {
            loanService.deleteLoan(id);
            return ResponseEntity.ok("Template deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping("/pay")
    public ResponseEntity<?> payLoan(@RequestBody PaymentRequest request) {
        try {
            loanService.processPayment(
                    request.getLoanId(),
                    request.getAmount(),
                    request.isDirectPrincipal()
            );
            return ResponseEntity.ok("Payment processed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // Simple DTO class to handle the incoming JSON
    @Data
    public static class PaymentRequest {
        private Long loanId;
        private Double amount;
        private boolean isDirectPrincipal;
    }

}