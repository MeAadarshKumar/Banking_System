package project_1.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project_1.demo.Model.TransactionModel;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionModel, Long> {
    List<TransactionModel> findByStatus(String status); // For Admin verification
}