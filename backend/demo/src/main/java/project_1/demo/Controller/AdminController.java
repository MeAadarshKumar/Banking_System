package project_1.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.DepositModel;
import project_1.demo.Model.TransactionModel;
import project_1.demo.Model.UserModel;
import project_1.demo.Service.AdminService;
import project_1.demo.Service.DepositService;
import project_1.demo.Service.TransactionService;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;



    @Autowired
    private DepositService depositService;

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
    public List<DepositModel> getPending() {
        return depositService.getAllPendingRequests();
    }

    @PostMapping("/approve-deposit/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        depositService.approveDepositRequest(id);
        return ResponseEntity.ok(Map.of("message", "Deposit Approved Successfully."));
    }

    @PostMapping("/reject-deposit/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        depositService.rejectDepositRequest(id);
        return ResponseEntity.ok(Map.of("message", "Deposit Rejected."));
    }
}