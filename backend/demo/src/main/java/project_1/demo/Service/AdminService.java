package project_1.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project_1.demo.Model.UserModel;
import project_1.demo.Repository.UserRepository;
import java.util.List;

@Service
public class AdminService {
    @Autowired private UserRepository userRepository;

    // Fetches all users for the Admin Dashboard table
    public List<UserModel> findAllUsers() {
        return userRepository.findAll();
    }

    // Used for the "View Full Profile" feature
    public UserModel getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public String deleteUserByAccountNumber(String accNo) {
        // Since accountNumber is the @Id, we use existsById
        if (userRepository.existsById(accNo)) {
            // Use deleteById for the Primary Key
            userRepository.deleteById(accNo);
            return "User account " + accNo + " deleted successfully";
        }
        return "Error: Account number " + accNo + " not found";
    }
}