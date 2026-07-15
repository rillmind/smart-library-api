package bibliotecaInteligente.api.modules.fila.repository;

import bibliotecaInteligente.api.modules.fila.model.FilaEspera;
import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilaEsperaRepository extends JpaRepository<FilaEspera, Integer> {
    List<FilaEspera> findByIdLivroOrderByPosicaoAsc(Livro idLivro);
    List<FilaEspera> findByIdUsuario(User idUsuario);
    long countByIdLivroAndStatus(Livro idLivro, String status);
    Optional<FilaEspera> findFirstByIdLivroAndStatusOrderByPosicaoAsc(Livro idLivro, String status);
    boolean existsByIdUsuarioAndIdLivroAndStatus(User idUsuario, Livro idLivro, String status);
}
