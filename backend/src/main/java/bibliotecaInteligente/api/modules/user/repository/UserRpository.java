package bibliotecaInteligente.api.modules.user.repository;

import bibliotecaInteligente.api.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRpository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
