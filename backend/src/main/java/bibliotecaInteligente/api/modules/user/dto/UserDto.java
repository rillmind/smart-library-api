package bibliotecaInteligente.api.modules.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserDto {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;
    @NotBlank(message = "O Cpf é obrigatório")
    private String cpf;
    @NotBlank(message = "A senha é obrigatória")
    private String password;


}
