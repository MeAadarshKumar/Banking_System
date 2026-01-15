package project_1.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.TransactionModel;
import project_1.demo.Service.TransactionService;
import project_1.demo.Service.DepositService;

import java.util.List;

@RestController
@RequestMapping("/api/transactions") // Dedicated base path
//@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private DepositService depositService;

    // POST /api/transactions/transfer
    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestParam String from, @RequestParam String to, @RequestParam Double amount) {
        try {
            String result = transactionService.transferMoney(from, to, amount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/transactions/deposit-request
    @PostMapping("/deposit-request")
    public ResponseEntity<?> deposit(@RequestParam String accNo, @RequestParam Double amount, @RequestParam String email) {
        depositService.createDepositRequest(accNo, amount, email);
        return ResponseEntity.ok("Deposit request submitted successfully.");
    }

    // GET /api/transactions/history/{accNo}
    @GetMapping("/history/{accNo}")
    public List<TransactionModel> getMyTransactions(@PathVariable String accNo) {
        return transactionService.getUserTransactionHistory(accNo);
    }
}
