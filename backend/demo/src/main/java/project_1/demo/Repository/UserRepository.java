package project_1.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project_1.demo.Model.UserModel;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel, String> {
    Optional<UserModel> findByEmail(String email);
//    boolean existsByAccountNumber(String accountNumber);
//    void deleteByAccountNumber(String accountNumber);
//    Optional<UserModel> findByAccountNumber(String accountNumber);
}