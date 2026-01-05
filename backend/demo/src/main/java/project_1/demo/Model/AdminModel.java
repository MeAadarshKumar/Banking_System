package project_1.demo.Model;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "admins")
@Data
public class AdminModel {
    @Id
    @Column(length = 10)
    private String adminAccountNumber; // Now the Primary Key

    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String role = "ADMIN";
}
