package bibliotecaInteligente.api.modules.livro.service;

import bibliotecaInteligente.api.modules.emprestimo.repository.EmprestimoRpository;
import bibliotecaInteligente.api.modules.fila.repository.FilaEsperaRepository;
import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.livro.repository.LivroRpository;
import bibliotecaInteligente.api.modules.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LivroService {
    private final LivroRpository livroRepository;
    private final EmprestimoRpository emprestimoRepository;
    private final FilaEsperaRepository filaEsperaRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private bibliotecaInteligente.api.modules.user.service.AuditLogService auditLogService;

    public LivroService(LivroRpository livroRpository, EmprestimoRpository emprestimoRpository, FilaEsperaRepository filaEsperaRepository) {
        this.livroRepository = livroRpository;
        this.emprestimoRepository = emprestimoRpository;
        this.filaEsperaRepository = filaEsperaRepository;
    }

    public void salvarLivro(Livro livro) {
        livroRepository.save(livro);
        auditLogService.registrarLog("Livro catalogado: " + livro.getTitulo() + " (Autor: " + livro.getAutor() + ")", "Administrador");
    }

    public List<Livro> listarLivros() {
        return livroRepository.findAll();
    }

    public Livro buscarLivroPorId(Integer id) {
        return livroRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Id não encontrado!")
        );
    }

    @Transactional
    public void deletarLivroPorId(Integer id) {
        Livro livro = buscarLivroPorId(id);

        filaEsperaRepository.findByIdLivroOrderByPosicaoAsc(livro)
                .forEach(filaEsperaRepository::delete);

        List<bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo> emprestimos = emprestimoRepository.findAll()
                .stream()
                .filter(e -> e.getId_livro() != null && e.getId_livro().getId().equals(id))
                .toList();

        for (bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo emp : emprestimos) {
            emp.setId_livro(null);
        }
        emprestimoRepository.saveAll(emprestimos);

        if (livro.getPosse() != null) {
            livro.setPosse(null);
        }

        livro.setLivros(null);
        livroRepository.saveAndFlush(livro);

        livroRepository.deleteById(id);
        auditLogService.registrarLog("Livro removido: " + livro.getTitulo() + " (ID: " + id + ")", "Administrador");
    }

    @Transactional
    public void atualizarLivroPorId(Integer id, Livro livro) {
        Livro livroEntity = livroRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Livro não encontrado!"));

        if (livro.getTitulo() != null) {
            livroEntity.setTitulo(livro.getTitulo());
        }
        if (livro.getAutor() != null) {
            livroEntity.setAutor(livro.getAutor());
        }
        if (livro.getDescricao() != null) {
            livroEntity.setDescricao(livro.getDescricao());
        }
        if (livro.getIsbn() != null) {
            livroEntity.setIsbn(livro.getIsbn());
        }
        if (livro.getEditora() != null) {
            livroEntity.setEditora(livro.getEditora());
        }
        if (livro.getAno() != null) {
            livroEntity.setAno(livro.getAno());
        }
        if (livro.getCategoria() != null) {
            livroEntity.setCategoria(livro.getCategoria());
        }
        if (livro.getTotalCopies() != null) {
            livroEntity.setTotalCopies(livro.getTotalCopies());
        }
        if (livro.getLibraryId() != null) {
            livroEntity.setLibraryId(livro.getLibraryId());
        }

        livroRepository.saveAndFlush(livroEntity);
        auditLogService.registrarLog("Livro updated: " + livroEntity.getTitulo() + " (ID: " + id + ")", "Administrador");
    }

    @Transactional
    public void atualizarPosse(Integer id, User usuario) {
        Livro livro = buscarLivroPorId(id);
        livro.setPosse(usuario);
        livroRepository.saveAndFlush(livro);
    }
}
