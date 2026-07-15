package bibliotecaInteligente.api.modules.fila.model;

import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.user.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_fila_espera")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilaEspera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private User idUsuario;

    @ManyToOne
    @JoinColumn(name = "id_livro")
    private Livro idLivro;

    @Column(name = "data_entrada")
    private String dataEntrada;

    @Column
    private Integer posicao;

    @Column
    private String status;
}
