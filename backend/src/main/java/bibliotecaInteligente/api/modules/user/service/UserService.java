package bibliotecaInteligente.api.modules.user.service;

import bibliotecaInteligente.api.modules.user.dto.UserDto;
import bibliotecaInteligente.api.modules.user.model.User;
import bibliotecaInteligente.api.modules.user.repository.UserRpository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRpository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(UserDto dto){
        if (repository.findByEmail(dto.getEmail()).isPresent()){
            throw new RuntimeException("Email ja cadastrado");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        repository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException{
        User user = repository.findByEmailOrCpf(login, login)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
    public void deletarUserPorCpf(Integer cpf) {
        repository.deleteById(cpf);
    }
    public void atualizarUserPorCpf(Integer cpf, User user) {
        User userEntity = repository.findById(cpf).orElseThrow(() ->
                new RuntimeException("Usuario não encontrado!"));

        User userAtualizado = User.builder()
                .nome(user.getNome() != null ? user.getNome() : userEntity.getNome())
                .cpf(user.getCpf() != null ? user.getCpf() : userEntity.getCpf())
                .email(user.getEmail() != null ? user.getEmail() : userEntity.getEmail())
                .password(user.getPassword() != null ? user.getPassword() : userEntity.getPassword())
                .build();

        repository.saveAndFlush(userAtualizado);
    }


}
