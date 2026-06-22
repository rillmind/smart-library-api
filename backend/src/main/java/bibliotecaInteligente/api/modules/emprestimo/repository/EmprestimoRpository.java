package bibliotecaInteligente.api.modules.emprestimo.repository;

import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmprestimoRpository extends JpaRepository<Emprestimo, Integer> {
}
