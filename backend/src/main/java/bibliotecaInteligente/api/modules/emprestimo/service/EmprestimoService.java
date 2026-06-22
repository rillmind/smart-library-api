package bibliotecaInteligente.api.modules.emprestimo.service;

import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import bibliotecaInteligente.api.modules.emprestimo.repository.EmprestimoRpository;
import org.springframework.stereotype.Service;

@Service
public class EmprestimoService {
    private final EmprestimoRpository emprestimoRpository;

    public EmprestimoService(EmprestimoRpository emprestimoRpository) {
        this.emprestimoRpository = emprestimoRpository;
    }

    public void salvarEmprestimo(Emprestimo emprestimo) {
        emprestimoRpository.save(emprestimo);
    }
    public Emprestimo buscarEmprestimoPorId(Integer id) {
        return emprestimoRpository.findById(id).orElseThrow(
                () -> new RuntimeException("Id não encontrado!")
        );
    }
    public void deletarEmprestimoPorId(Integer id) {
        emprestimoRpository.deleteById(id);
    }
    public void atualizarEmprestimoPorId(Integer id, Emprestimo emprestimo) {
        Emprestimo emprestimoEntity = emprestimoRpository.findById(id).orElseThrow(() ->
                new RuntimeException("Emprestimo não encontrado!"));

        Emprestimo emprestimoAtualizado = Emprestimo.builder()
                .id(emprestimoEntity.getId())
                .data_emprestimo(emprestimo.getData_emprestimo() != null ? emprestimo.getData_emprestimo() : emprestimoEntity.getData_emprestimo())
                .data_emprestimo(emprestimo.getData_devolucao() != null ? emprestimo.getData_devolucao() : emprestimoEntity.getData_devolucao())
                .status(emprestimo.getStatus() != null ? emprestimo.getStatus() : emprestimoEntity.getStatus())
                .build();

        emprestimoRpository.saveAndFlush(emprestimoAtualizado);
    }
}
