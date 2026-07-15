package bibliotecaInteligente.api.modules.livro.controller;

import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.livro.service.LivroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livro")
@RequiredArgsConstructor
public class LivroController {
    private final LivroService livroService;

    @PostMapping
    public ResponseEntity<Void> salvarLivro(@RequestBody Livro livro){
        livroService.salvarLivro(livro);
        return ResponseEntity.ok().build();
    }
    @GetMapping
    public ResponseEntity<List<Livro>> listarLivros(){
        return ResponseEntity.ok(livroService.listarLivros());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarLivroPorId(@PathVariable Integer id){
        return ResponseEntity.ok(livroService.buscarLivroPorId(id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLivro(@PathVariable Integer id){
        livroService.deletarLivroPorId(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizarLivroPorId(@PathVariable Integer id,
                                                    @RequestBody Livro livro){
        livroService.atualizarLivroPorId(id, livro);
        return ResponseEntity.ok().build();
    }
}
