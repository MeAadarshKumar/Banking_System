package project_1.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project_1.demo.Model.LoginRequest;
import project_1.demo.Model.UserModel;
import project_1.demo.Service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserModel user) {
        // 1. Use registerUser for the initial sign-up
        String result = authService.registerUser(user);

        // 2. Now the "startsWith" check works correctly on a simple String
        if (result.startsWith("Error")) {
            return ResponseEntity.badRequest().body(Map.of("message", result));
        }

        return ResponseEntity.ok(Map.of("message", result));
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<?> completeProfile(@RequestBody UserModel user) {
        return ResponseEntity.ok(authService.completeProfile(user));
    }
}

