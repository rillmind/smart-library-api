package bibliotecaInteligente.api.modules.fila.service;

import bibliotecaInteligente.api.modules.fila.model.FilaEspera;
import bibliotecaInteligente.api.modules.fila.repository.FilaEsperaRepository;
import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.livro.repository.LivroRpository;
import bibliotecaInteligente.api.modules.notificacao.service.NotificacaoService;
import bibliotecaInteligente.api.modules.user.model.User;
import bibliotecaInteligente.api.modules.user.repository.UserRpository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FilaEsperaService {

    @Autowired
    private FilaEsperaRepository filaEsperaRepository;

    @Autowired
    private UserRpository userRpository;

    @Autowired
    private LivroRpository livroRpository;

    @Autowired
    private NotificacaoService notificacaoService;

    public void entrarNaFila(String cpfUsuario, Integer idLivro) {
        User usuario = userRpository.findById(cpfUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));

        Livro livro = livroRpository.findById(idLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

        boolean jaFila = filaEsperaRepository.existsByIdUsuarioAndIdLivroAndStatus(usuario, livro, "AGUARDANDO");
        if (jaFila) {
            throw new RuntimeException("Usuário já está na fila de espera deste livro!");
        }

        long count = filaEsperaRepository.countByIdLivroAndStatus(livro, "AGUARDANDO");

        FilaEspera entrada = FilaEspera.builder()
                .idUsuario(usuario)
                .idLivro(livro)
                .dataEntrada(LocalDate.now().toString())
                .posicao((int) count + 1)
                .status("AGUARDANDO")
                .build();

        filaEsperaRepository.save(entrada);
    }

    public void sairDaFila(Integer id) {
        FilaEspera entrada = filaEsperaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrada da fila de espera não encontrada!"));
        entrada.setStatus("CANCELADO");
        filaEsperaRepository.save(entrada);
    }

    public List<FilaEspera> listarFilaPorLivro(Integer idLivro) {
        Livro livro = livroRpository.findById(idLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));
        return filaEsperaRepository.findByIdLivroOrderByPosicaoAsc(livro);
    }

    public List<FilaEspera> listarFilaPorUsuario(String cpf) {
        User usuario = userRpository.findById(cpf)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado!"));
        return filaEsperaRepository.findByIdUsuario(usuario);
    }

    public void notificarProximo(Integer idLivro) {
        Livro livro = livroRpository.findById(idLivro)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

        Optional<FilaEspera> proximoOpt = filaEsperaRepository
                .findFirstByIdLivroAndStatusOrderByPosicaoAsc(livro, "AGUARDANDO");

        if (proximoOpt.isPresent()) {
            FilaEspera proximo = proximoOpt.get();
            proximo.setStatus("NOTIFICADO");
            filaEsperaRepository.save(proximo);

            notificacaoService.criarNotificacao(
                    proximo.getIdUsuario().getCpf(),
                    "Livro disponível!",
                    "O livro \"" + livro.getTitulo() + "\" está disponível para empréstimo.",
                    "LIVRO_DISPONIVEL"
            );
        }
    }
}
