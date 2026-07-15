package bibliotecaInteligente.api.modules.user.controller;

import bibliotecaInteligente.api.modules.user.dto.UserDto;
import bibliotecaInteligente.api.modules.user.model.User;
import bibliotecaInteligente.api.modules.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.List;

@Tag(
        name = "Autenticação",
        description = "Endpoints responsáveis pelo cadastro, login e logout de usuários"
)
@RestController
@RequestMapping("/api/user")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Operation(
            summary = "Cadastrar usuário",
            description = "Realiza o cadastro de um novo usuário no sistema"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid UserDto dto){
        userService.registerUser(dto);
        return ResponseEntity.ok("Usuario cadastrado com sucesso!");
    }


    @Operation(
            summary = "Autenticar usuário",
            description = """
        Realiza a autenticação do usuário utilizando email e senha.
        Em caso de sucesso, uma sessão é criada e armazenada no Redis.
        O cookie de sessão deve ser enviado nas próximas requisições.
        """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody @Valid UserDto dto, HttpServletRequest request){
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
            );

            SecurityContext context = SecurityContextHolder.getContext();
            context.setAuthentication(authentication);
            request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", context);

            return ResponseEntity.ok("login realizado com sucesso! Cookie de sessao gerado.");

        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Credenciais Invalidas.");
        }
    }
    @GetMapping("/listar")
    public ResponseEntity<List<User>> listarUsuarios() {
        return ResponseEntity.ok(userService.listarUsuarios());
    }
    @PutMapping("/{cpf}")
    public ResponseEntity<Void> atualizarUsuario(
            @PathVariable String cpf,
            @RequestBody UserDto dto) {

        userService.atualizarUserPorCpf(cpf, dto);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/{cpf}/bloquear")
    public ResponseEntity<Void> bloquearUsuario(@PathVariable String cpf) {
        userService.bloquearUsuario(cpf);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/{cpf}/desbloquear")
    public ResponseEntity<Void> desbloquearUsuario(@PathVariable String cpf) {
        userService.desbloquearUsuario(cpf);
        return ResponseEntity.ok().build();
}

    @Operation(
            summary = "Encerrar sessão",
            description = "Invalida a sessão atual do usuário"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso")
    })
    @PostMapping("logout")
    public ResponseEntity<String> logout(HttpServletRequest request){
        HttpSession session = request.getSession(false);
        if(session != null){
            session.invalidate();
        }
        return ResponseEntity.ok("Logout realizado com sucesso.");
    }

}
