package bibliotecaInteligente.api.modules.livro.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO responsável pela criação e transferência de dados de um Livro")
public class LivroDto {

    @Schema(description = "Título do livro", example = "Clean Code")
    @NotBlank(message = "O Título é obrigatório")
    private String titulo;

    @Schema(description = "Autor do livro", example = "Robert C. Martin")
    @NotBlank(message = "O Autor é obrigatório")
    private String autor;

    @Schema(description = "Descrição do livro", example = "Livro sobre boas práticas de programação")
    @NotBlank(message = "A Descrição é obrigatória")
    private String descricao;
}