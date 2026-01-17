package project_1.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import project_1.demo.Model.AdminModel;
import project_1.demo.Repository.AdminRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner initAdminAccount(AdminRepository adminRepository) {
        return args -> {
            // Check if the admin email already exists to prevent duplicate entries
            String adminEmail = "admin@gmail.com";

            if (adminRepository.findByEmail(adminEmail).isEmpty()) {
                AdminModel admin = new AdminModel();

                // Fields based on your AdminModel and request
                admin.setAdminAccountNumber("ADM0000001"); // Must be 10 chars per your @Column
                admin.setName("admin");                    // Your requested username
                admin.setEmail(adminEmail);                // Your requested email
                admin.setPassword("admin");                // Your requested password
                admin.setRole("ADMIN");

                adminRepository.save(admin);

                System.out.println("----------------------------------------------");
                System.out.println("ADMIN ACCOUNT INITIALIZED SUCCESSFULLY");
                System.out.println("Email: admin@gmail.com");
                System.out.println("Password: admin");
                System.out.println("----------------------------------------------");
            }
        };
    }
}