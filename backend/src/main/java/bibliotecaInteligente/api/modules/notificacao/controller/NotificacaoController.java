package bibliotecaInteligente.api.modules.notificacao.controller;

import bibliotecaInteligente.api.modules.notificacao.model.Notificacao;
import bibliotecaInteligente.api.modules.notificacao.service.NotificacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notificacao")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @GetMapping("/usuario/{cpf}")
    public ResponseEntity<List<Notificacao>> listarPorUsuario(@PathVariable String cpf) {
        return ResponseEntity.ok(notificacaoService.listarPorUsuario(cpf));
    }

    @GetMapping("/usuario/{cpf}/nao-lidas")
    public ResponseEntity<Long> contarNaoLidas(@PathVariable String cpf) {
        return ResponseEntity.ok(notificacaoService.contarNaoLidas(cpf));
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Integer id) {
        notificacaoService.marcarComoLida(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/usuario/{cpf}/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLidas(@PathVariable String cpf) {
        notificacaoService.marcarTodasComoLidas(cpf);
        return ResponseEntity.ok().build();
    }
}
