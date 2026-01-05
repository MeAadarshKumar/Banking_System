package project_1.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_1.demo.Model.AdminModel;
import project_1.demo.Model.UserModel;
import project_1.demo.Repository.AdminRepository;
import project_1.demo.Repository.UserRepository;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired private UserRepository userRepository;
    @Autowired private AdminRepository adminRepository;

    // Inside project_1.demo.Service.AuthService
    public Map<String, Object> authenticate(String email, String password) {
        // 1. Check Admin Table
        Optional<AdminModel> admin = adminRepository.findByEmail(email);
        if (admin.isPresent() && admin.get().getPassword().equals(password)) {
            // We put the object inside the "user" key to match the frontend state
            return Map.of("role", "ADMIN", "user", admin.get());
        }

        // 2. Check User Table
        Optional<UserModel> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            if (!user.get().isCompleted()) {
                return Map.of("role", "INCOMPLETE", "email", email);
            }
            // Consistent with Admin: "user" key holds the object
            return Map.of("role", "USER", "user", user.get());
        }
        throw new RuntimeException("Invalid Credentials");
    }

    @Transactional
    public String registerUser(UserModel user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Error: Email is already in use!";
        }

        // Generate a unique 10-digit account number
        String newAccNo;
        do {
            newAccNo = String.valueOf((long) (Math.random() * 9000000000L) + 1000000000L);
        } while (userRepository.existsById(newAccNo)); // Changed to existsById

        user.setAccountNumber(newAccNo);
        user.setRole("USER");
        user.setCompleted(false);
        user.setBalance(0.0); // Ensure balance is initialized

        userRepository.save(user);
        return "User registered successfully!";
    }

    @Transactional
    public Map<String, String> completeProfile(UserModel profileData) {
        // Strictly fetch from UserRepository to avoid Admin interference
        UserModel user = userRepository.findByEmail(profileData.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update all 11 required fields
        user.setFirstName(profileData.getFirstName());
        user.setLastName(profileData.getLastName());
        user.setPhoneNumber(profileData.getPhoneNumber());
        user.setAddress(profileData.getAddress());
        user.setPanNumber(profileData.getPanNumber());
        user.setAadharNumber(profileData.getAadharNumber());
        user.setAge(profileData.getAge());
        user.setGender(profileData.getGender());
        user.setDob(profileData.getDob());
        user.setFatherName(profileData.getFatherName());
        user.setMotherName(profileData.getMotherName());

        user.setCompleted(true); // Profile is now active
        userRepository.save(user);

        return Map.of("message", "Profile completed successfully");
    }
}