package project_1.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import project_1.demo.Model.UserModel;
import java.util.Optional; // Must import this

@Repository
public interface UserRepository extends JpaRepository<UserModel, String> {

    // CHANGE THIS: Return Optional instead of UserModel
    Optional<UserModel> findByEmail(String email);

    UserModel findByAccountNumber(String accountNumber);

    @Query("SELECT SUM(u.balance) FROM UserModel u")
    Double getTotalBalanceSum();
}