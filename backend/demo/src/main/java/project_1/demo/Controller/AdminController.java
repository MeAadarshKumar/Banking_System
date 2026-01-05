package project_1.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.TransactionModel;
import project_1.demo.Model.UserModel;
import project_1.demo.Service.AdminService;
import project_1.demo.Service.TransactionService;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired private AdminService adminService;
    @Autowired private TransactionService transactionService;

    @GetMapping("/users")
    public List<UserModel> findAllUsers(){
        return adminService.findAllUsers();
    }

    @DeleteMapping("/delete-user/{accNo}")
    public ResponseEntity<?> deleteUser(@PathVariable String accNo) {
        String result = adminService.deleteUserByAccountNumber(accNo);
        if (result.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("message", result));
        }
        return ResponseEntity.ok(Map.of("message", result));
    }

    @GetMapping("/pending-deposits")
    public List<TransactionModel> getPending() {
        return transactionService.findPending();
    }

    @PostMapping("/approve-deposit/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        transactionService.approveDeposit(id);
        return ResponseEntity.ok(Map.of("message", "Deposit Approved"));
    }
}