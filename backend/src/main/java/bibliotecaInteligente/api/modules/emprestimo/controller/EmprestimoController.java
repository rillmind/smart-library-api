package bibliotecaInteligente.api.modules.emprestimo.controller;

import bibliotecaInteligente.api.modules.emprestimo.model.Emprestimo;
import bibliotecaInteligente.api.modules.emprestimo.service.EmprestimoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emprestimo")
@RequiredArgsConstructor
@Tag(name = "Empréstimos", description = "Gerenciamento de empréstimos de livros")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;

    @PostMapping
    @Operation(
            summary = "Criar empréstimo",
            description = "Cria um novo empréstimo de livro"
    )
    @ApiResponse(responseCode = "200", description = "Empréstimo criado com sucesso")
    public ResponseEntity<Void> salvarEmprestimo(@RequestBody Emprestimo emprestimo) {
        emprestimoService.salvarEmprestimo(emprestimo);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(
            summary = "Buscar empréstimo por ID",
            description = "Retorna um empréstimo específico pelo seu ID"
    )
    @ApiResponse(responseCode = "200", description = "Empréstimo encontrado")
    @ApiResponse(responseCode = "404", description = "Empréstimo não encontrado")
    public ResponseEntity<Emprestimo> buscarEmprestimoPorId(
            @Parameter(description = "ID do empréstimo", example = "1")
            @RequestParam Integer id
    ) {
        return ResponseEntity.ok(emprestimoService.buscarEmprestimoPorId(id));
    }

    @DeleteMapping
    @Operation(
            summary = "Deletar empréstimo",
            description = "Remove um empréstimo pelo ID"
    )
    @ApiResponse(responseCode = "200", description = "Empréstimo deletado com sucesso")
    public ResponseEntity<Void> deletarEmprestimo(
            @Parameter(description = "ID do empréstimo", example = "1")
            @RequestParam Integer id
    ) {
        emprestimoService.deletarEmprestimoPorId(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    @Operation(
            summary = "Atualizar empréstimo",
            description = "Atualiza os dados de um empréstimo existente"
    )
    @ApiResponse(responseCode = "200", description = "Empréstimo atualizado com sucesso")
    public ResponseEntity<Void> atualizarEmprestimoPorId(
            @Parameter(description = "ID do empréstimo", example = "1")
            @RequestParam Integer id,
            @RequestBody Emprestimo emprestimo
    ) {
        emprestimoService.atualizarEmprestimoPorId(id, emprestimo);
        return ResponseEntity.ok().build();
    }
}