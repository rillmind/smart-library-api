package bibliotecaInteligente.api.modules.user.controller;

import bibliotecaInteligente.api.modules.user.model.AuditLog;
import bibliotecaInteligente.api.modules.user.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> listarLogs() {
        return ResponseEntity.ok(auditLogService.listarLogs());
    }
}
