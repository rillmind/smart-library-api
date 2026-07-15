package bibliotecaInteligente.api.modules.livro.model;

import io.swagger.v3.oas.annotations.media.Schema;
import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import bibliotecaInteligente.api.modules.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_livros")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(
            description = "Identificador único do livro",
            example = "1",
            accessMode = Schema.AccessMode.READ_ONLY
    )
    private Integer id;

    @Column
    @Schema(
            description = "Título da obra",
            example = "Dom Casmurro"
    )
    private String titulo;

    @Column
    @Schema(
            description = "Autor do livro",
            example = "Machado de Assis"
    )
    private String autor;

    @Column
    @Schema(
            description = "Descrição ou resumo da obra",
            example = "Romance clássico da literatura brasileira."
    )
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "cpf_usuario")
    @Schema(
            description = "Usuário proprietário do livro"
    )
    private User posse;

    @Column
    private String isbn;

    @Column
    private String editora;

    @Column
    private Integer ano;

    @Column
    private String categoria;

    @Column(name = "total_copies")
    private Integer totalCopies;

    @Column(name = "library_id")
    private String libraryId;

    @JsonIgnore
    @OneToMany(mappedBy = "id_livro")
    @Schema(
            description = "Histórico de empréstimos associados ao livro"
    )
    private List<Emprestimo> livros;

    @Transient
    public Integer getAvailableCopies() {
        int total = this.totalCopies != null ? this.totalCopies : 1;
        if (this.livros == null) {
            return total;
        }
        long ativos = this.livros.stream()
                .filter(e -> "ACTIVE".equals(e.getStatus()) || "ATIVO".equals(e.getStatus()) || "OVERDUE".equals(e.getStatus()) || "ATRASADO".equals(e.getStatus()))
                .count();
        return Math.max(0, total - (int) ativos);
    }
}