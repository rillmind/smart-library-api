package bibliotecaInteligente.api.modules.notificacao.service;

import bibliotecaInteligente.api.modules.notificacao.model.Notificacao;
import bibliotecaInteligente.api.modules.notificacao.repository.NotificacaoRepository;
import bibliotecaInteligente.api.modules.user.model.User;
import bibliotecaInteligente.api.modules.user.repository.UserRpository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private UserRpository userRpository;

    public void criarNotificacao(String cpfUsuario, String titulo, String mensagem, String tipo) {
        User usuario = userRpository.findById(cpfUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        Notificacao notificacao = Notificacao.builder()
                .idUsuario(usuario)
                .titulo(titulo)
                .mensagem(mensagem)
                .tipo(tipo)
                .lida(false)
                .dataCriacao(LocalDate.now().toString())
                .build();

        notificacaoRepository.save(notificacao);
    }

    public List<Notificacao> listarPorUsuario(String cpf) {
        User usuario = userRpository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        return notificacaoRepository.findByIdUsuarioOrderByDataCriacaoDesc(usuario);
    }

    public void marcarComoLida(Integer id) {
        Notificacao notificacao = notificacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificação não encontrada!"));
        notificacao.setLida(true);
        notificacaoRepository.save(notificacao);
    }

    public void marcarTodasComoLidas(String cpf) {
        User usuario = userRpository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        List<Notificacao> notificacoes = notificacaoRepository.findByIdUsuarioOrderByDataCriacaoDesc(usuario);
        for (Notificacao n : notificacoes) {
            n.setLida(true);
        }
        notificacaoRepository.saveAll(notificacoes);
    }

    public long contarNaoLidas(String cpf) {
        User usuario = userRpository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        return notificacaoRepository.countByIdUsuarioAndLidaFalse(usuario);
    }
}
