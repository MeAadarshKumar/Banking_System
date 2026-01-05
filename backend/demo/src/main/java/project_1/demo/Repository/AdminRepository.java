package project_1.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project_1.demo.Model.AdminModel;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<AdminModel, String> {
    Optional<AdminModel> findByEmail(String email);
}
