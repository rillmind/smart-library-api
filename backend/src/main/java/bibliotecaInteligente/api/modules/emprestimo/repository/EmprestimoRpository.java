package bibliotecaInteligente.api.modules.emprestimo.repository;

import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmprestimoRpository extends JpaRepository<Emprestimo, Integer> {

    @Query("SELECT COUNT(e) > 0 FROM Emprestimo e WHERE e.id_usuario = :usuario AND e.id_livro = :livro AND e.status IN :status")
    boolean existeEmprestimoAtivo(
            @Param("usuario") User usuario,
            @Param("livro") Livro livro,
            @Param("status") List<String> status
    );

    @Query("SELECT COUNT(e) FROM Emprestimo e WHERE e.id_livro = :livro AND e.status IN :status")
    long countEmprestimosAtivosDoLivro(
            @Param("livro") Livro livro,
            @Param("status") List<String> status
    );
}
