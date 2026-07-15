package bibliotecaInteligente.api.modules.emprestimo.service;

import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import bibliotecaInteligente.api.modules.emprestimo.repository.EmprestimoRpository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmprestimoService {
    private final EmprestimoRpository emprestimoRpository;

    @org.springframework.beans.factory.annotation.Autowired
    private bibliotecaInteligente.api.modules.user.service.AuditLogService auditLogService;

    @org.springframework.beans.factory.annotation.Autowired
    private bibliotecaInteligente.api.modules.user.repository.UserRpository userRpository;

    @org.springframework.beans.factory.annotation.Autowired
    private bibliotecaInteligente.api.modules.livro.service.LivroService livroService;

    @org.springframework.beans.factory.annotation.Autowired
    private bibliotecaInteligente.api.modules.fila.service.FilaEsperaService filaEsperaService;

    public EmprestimoService(EmprestimoRpository emprestimoRpository) {
        this.emprestimoRpository = emprestimoRpository;
    }

    public void salvarEmprestimo(Emprestimo emprestimo) {
        bibliotecaInteligente.api.modules.user.model.User usuario = userRpository.findById(emprestimo.getId_usuario().getCpf()).orElseThrow(
                () -> new RuntimeException("Usuário não encontrado!")
        );
        bibliotecaInteligente.api.modules.livro.model.Livro livro = livroService.buscarLivroPorId(emprestimo.getId_livro().getId());

        emprestimo.setId_usuario(usuario);
        emprestimo.setId_livro(livro);

        emprestimoRpository.save(emprestimo);
        auditLogService.registrarLog("Empréstimo realizado: Livro " + livro.getTitulo() + " para Usuário " + usuario.getNome(), "Administrador");
    }
    public List<Emprestimo> listarEmprestimos() {
        return emprestimoRpository.findAll();
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
                .data_devolucao(emprestimo.getData_devolucao() != null ? emprestimo.getData_devolucao() : emprestimoEntity.getData_devolucao())
                .status(emprestimo.getStatus() != null ? emprestimo.getStatus() : emprestimoEntity.getStatus())
                .build();

        emprestimoRpository.saveAndFlush(emprestimoAtualizado);
        auditLogService.registrarLog("Empréstimo atualizado: ID " + id, "Administrador");
    }
    public void devolverEmprestimo(Integer id) {
        Emprestimo emprestimo = buscarEmprestimoPorId(id);
        emprestimo.setStatus("RETURNED");
        emprestimo.setData_devolucao(java.time.LocalDate.now().toString());
        emprestimoRpository.save(emprestimo);
        auditLogService.registrarLog("Livro devolvido: Empréstimo ID " + id, "Administrador");
        try {
            if (emprestimo.getId_livro() != null) {
                filaEsperaService.notificarProximo(emprestimo.getId_livro().getId());
            }
        } catch (Exception e) {
            // Silencioso para não bloquear a devolução do livro
        }
    }
    public void renovarEmprestimo(Integer id) {
        Emprestimo emprestimo = buscarEmprestimoPorId(id);
        try {
            java.time.LocalDate dataAtual = java.time.LocalDate.parse(emprestimo.getData_devolucao());
            emprestimo.setData_devolucao(dataAtual.plusDays(14).toString());
        } catch (Exception e) {
            emprestimo.setData_devolucao(java.time.LocalDate.now().plusDays(14).toString());
        }
        emprestimoRpository.save(emprestimo);
        auditLogService.registrarLog("Empréstimo renovado: ID " + id + " (Nova data: " + emprestimo.getData_devolucao() + ")", "Administrador");
    }
}
