package bibliotecaInteligente.api.modules.emprestimo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmprestimoDto {
    @NotBlank(message = "A Data do Emprestimo é obrigatória")
    private String data_emprestimo;
    @NotBlank(message = "A Data de Devolucao é obrigatória")
    private String data_devolucao;
    @NotBlank(message = "O Status do Emprestimo é obrigatório")
    private String status;
}
