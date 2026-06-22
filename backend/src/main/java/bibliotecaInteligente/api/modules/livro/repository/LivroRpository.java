package bibliotecaInteligente.api.modules.livro.repository;

import bibliotecaInteligente.api.modules.livro.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRpository extends JpaRepository<Livro, Integer> {
}
