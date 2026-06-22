package bibliotecaInteligente.api.modules.livro.service;

import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.livro.repository.LivroRpository;
import org.springframework.stereotype.Service;

@Service
public class LivroService {
    private final LivroRpository livroRpository;

    public LivroService(LivroRpository livroRpository) {
        this.livroRpository = livroRpository;
    }

    public void salvarLivro(Livro livro) {
        livroRpository.save(livro);
    }
    public Livro buscarLivroPorId(Integer id) {
        return livroRpository.findById(id).orElseThrow(
                () -> new RuntimeException("Id não encontrado!")
        );
    }
    public void deletarLivroPorId(Integer id) {
        livroRpository.deleteById(id);
    }
    public void atualizarLivroPorId(Integer id, Livro livro) {
        Livro livroEntity = livroRpository.findById(id).orElseThrow(() ->
                new RuntimeException("Livro não encontrado!"));

        Livro livroAtualizado = Livro.builder()
                .id(livroEntity.getId())
                .titulo(livro.getTitulo() != null ? livro.getTitulo() : livroEntity.getTitulo())
                .autor(livro.getAutor() != null ? livro.getAutor() : livroEntity.getAutor())
                .descricao(livro.getDescricao() != null ? livro.getDescricao() : livroEntity.getDescricao())
                .build();

        livroRpository.saveAndFlush(livroAtualizado);
    }
}
