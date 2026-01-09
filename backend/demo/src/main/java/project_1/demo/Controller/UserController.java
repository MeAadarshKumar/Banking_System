package project_1.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.UserModel;
import project_1.demo.Service.AdminService;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/details/{email}")
    public ResponseEntity<?> getUserDetails(@PathVariable String email) {
        try {
            UserModel user = adminService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of("error", "User not found"));
            }
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}