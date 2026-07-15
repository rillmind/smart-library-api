package bibliotecaInteligente.api.modules.fila.controller;

import bibliotecaInteligente.api.modules.fila.model.FilaEspera;
import bibliotecaInteligente.api.modules.fila.service.FilaEsperaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fila-espera")
public class FilaEsperaController {

    @Autowired
    private FilaEsperaService filaEsperaService;

    @PostMapping
    public ResponseEntity<Void> entrarNaFila(@RequestParam String cpf, @RequestParam Integer livroId) {
        filaEsperaService.entrarNaFila(cpf, livroId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/livro/{idLivro}")
    public ResponseEntity<List<FilaEspera>> listarFilaPorLivro(@PathVariable Integer idLivro) {
        return ResponseEntity.ok(filaEsperaService.listarFilaPorLivro(idLivro));
    }

    @GetMapping("/usuario/{cpf}")
    public ResponseEntity<List<FilaEspera>> listarFilaPorUsuario(@PathVariable String cpf) {
        return ResponseEntity.ok(filaEsperaService.listarFilaPorUsuario(cpf));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> sairDaFila(@PathVariable Integer id) {
        filaEsperaService.sairDaFila(id);
        return ResponseEntity.ok().build();
    }
}
