package project_1.demo.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class UserModel {
    @Id
    @Column(length = 10)
    private String accountNumber; // Now the Primary Key

    @Column(unique = true, nullable = false)
    private String email;
    private String name;
    private String password;
    private String role = "USER";
    private boolean isCompleted = false;
    private Double balance = 0.0;
    // Profile details
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String panNumber;
    private String aadharNumber;
    private Integer age;
    private String gender;
    private String dob;
    private String fatherName;
    private String motherName;
}