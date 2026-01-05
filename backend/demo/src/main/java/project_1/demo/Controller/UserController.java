package project_1.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.UserModel;
import project_1.demo.Service.AdminService;
import project_1.demo.Service.TransactionService;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000") // Fixes the browser-side connection block
public class UserController {

    @Autowired
    private TransactionService bankingService;

    @Autowired
    private AdminService adminService;

    // Shared endpoint: Accessible by both USER and ADMIN roles
    @GetMapping("/details/{email}")
    public ResponseEntity<?> getUserDetails(@PathVariable String email) {
        try {
            // This service method must find the user by their email string
            UserModel user = adminService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestParam String from, @RequestParam String to, @RequestParam Double amount) {
        try {
            String result = bankingService.transferMoney(from, to, amount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/deposit-request")
    public ResponseEntity<?> deposit(@RequestParam String accNo, @RequestParam Double amount) {
        bankingService.requestDeposit(accNo, amount);
        return ResponseEntity.ok("Deposit request sent for admin approval");
    }
}