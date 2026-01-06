package project_1.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project_1.demo.Model.DepositModel;
import java.util.List;

@Repository
public interface DepositRepository extends JpaRepository<DepositModel, Long> {
    List<DepositModel> findByStatus(String status);
}
