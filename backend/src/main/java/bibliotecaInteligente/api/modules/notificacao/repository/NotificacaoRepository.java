package bibliotecaInteligente.api.modules.notificacao.repository;

import bibliotecaInteligente.api.modules.notificacao.model.Notificacao;
import bibliotecaInteligente.api.modules.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Integer> {
    List<Notificacao> findByIdUsuarioOrderByDataCriacaoDesc(User idUsuario);
    long countByIdUsuarioAndLidaFalse(User idUsuario);
}
