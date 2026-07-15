package bibliotecaInteligente.api.modules.user.service;

import bibliotecaInteligente.api.modules.user.model.AuditLog;
import bibliotecaInteligente.api.modules.user.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository repository;

    public void registrarLog(String acao, String autor) {
        AuditLog log = AuditLog.builder()
                .acao(acao)
                .autor(autor != null ? autor : "Sistema")
                .timestamp(LocalDateTime.now())
                .build();
        repository.save(log);
    }

    public List<AuditLog> listarLogs() {
        return repository.findAllByOrderByTimestampDesc();
    }
}
