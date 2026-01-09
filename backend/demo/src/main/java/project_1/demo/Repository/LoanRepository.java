package project_1.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project_1.demo.Model.LoanModel;
import project_1.demo.Model.LoanStatus;

import java.util.List;

public interface LoanRepository extends JpaRepository<LoanModel, Long> {

    // Finds all loan offerings created by admin
    List<LoanModel> findByAccountNumber(String accountNumber);

    // Finds only actual user requests (not templates)
    List<LoanModel> findByAccountNumberNot(String accountNumber);

    boolean existsByAccountNumberAndPrincipalAndStatusNot(String accountNumber, Double principal, LoanStatus status);
}
