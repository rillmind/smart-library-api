package bibliotecaInteligente.api.modules.livro.model;

import io.swagger.v3.oas.annotations.media.Schema;
import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import bibliotecaInteligente.api.modules.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;

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

    @OneToMany
    @JoinColumn(name = "livro_id")
    @Schema(
            description = "Histórico de empréstimos associados ao livro"
    )
    private ArrayList<Emprestimo> livros;
}