package bibliotecaInteligente.api.modules.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDto {

    @Schema(
            description = "Email ou cpf usuário usado para login",
            example = "usuario@email.com"
    )
    @NotBlank(message = "O e-mail ou cpf é obrigatório")
    @Email(message = "Login inválido")
    private String login;

    @Schema(
            description = "Senha do usuário",
            example = "123456"
    )
    @NotBlank(message = "A senha é obrigatória")
    private String password;
}