package bibliotecaInteligente.api.modules.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDto {

    @NotBlank(message = "O email ou CPF é obrigatório")
    private String login;

    @NotBlank(message = "A senha é obrigatória")
    private String password;
}
