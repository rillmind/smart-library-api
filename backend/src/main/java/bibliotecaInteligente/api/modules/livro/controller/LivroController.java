package bibliotecaInteligente.api.modules.livro.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import bibliotecaInteligente.api.modules.livro.model.Livro;
import bibliotecaInteligente.api.modules.livro.service.LivroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "Livros",
        description = "Operações de gerenciamento do acervo da biblioteca"
)
@RestController
@RequestMapping("/livro")
@RequiredArgsConstructor
public class LivroController {

    private final LivroService livroService;

    @Operation(
            summary = "Cadastrar livro",
            description = "Adiciona um novo livro ao acervo da biblioteca"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @PostMapping
    public ResponseEntity<Void> salvarLivro(@RequestBody Livro livro){
        livroService.salvarLivro(livro);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Buscar livro por ID",
            description = "Retorna os dados de um livro específico"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro encontrado"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado"),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @GetMapping
    public ResponseEntity<Livro> buscarLivroPorId(
            @Parameter(description = "ID do livro")
            @RequestParam Integer id){

        return ResponseEntity.ok(
                livroService.buscarLivroPorId(id)
        );
    }

    @Operation(
            summary = "Remover livro",
            description = "Remove um livro do acervo pelo ID"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado"),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @DeleteMapping
    public ResponseEntity<Void> deletarLivro(
            @Parameter(description = "ID do livro")
            @RequestParam Integer id){

        livroService.deletarLivroPorId(id);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Atualizar livro",
            description = "Atualiza os dados de um livro existente"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Livro atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Livro não encontrado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @PutMapping
    public ResponseEntity<Void> atualizarLivroPorId(
            @Parameter(description = "ID do livro")
            @RequestParam Integer id,

            @RequestBody Livro livro){

        livroService.atualizarLivroPorId(id, livro);
        return ResponseEntity.ok().build();
    }
}
