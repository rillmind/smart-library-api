package bibliotecaInteligente.api.modules.notificacao.model;

import bibliotecaInteligente.api.modules.user.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tb_notificacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private User idUsuario;

    @Column
    private String titulo;

    @Column
    private String mensagem;

    @Column
    private String tipo;

    @Column
    private Boolean lida;

    @Column(name = "data_criacao")
    private String dataCriacao;
}
