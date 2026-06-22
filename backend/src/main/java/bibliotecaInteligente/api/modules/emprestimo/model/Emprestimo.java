package bibliotecaInteligente.api.modules.emprestimo.model;

import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_emprestimo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Entidade que representa o empréstimo de um livro para um usuário")
public class Emprestimo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID do empréstimo", example = "1")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @Schema(description = "Usuário que realizou o empréstimo")
    private User id_usuario;

    @ManyToOne
    @JoinColumn(name = "id_livro")
    @Schema(description = "Livro emprestado")
    private Livro id_livro;

    @Column
    @Schema(description = "Data em que o empréstimo foi realizado", example = "2026-06-09")
    private String data_emprestimo;

    @Column
    @Schema(description = "Data prevista ou real de devolução", example = "2026-06-20")
    private String data_devolucao;

    @Column
    @Schema(description = "Status do empréstimo", example = "ATIVO")
    private String status;
}