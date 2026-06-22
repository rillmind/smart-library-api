# Regras de Escopo de Desenvolvimento — Smart Library

## Escopo Exclusivo do Frontend
- Toda e qualquer modificação de código fonte, criação de componentes, refatorações ou configurações de desenvolvimento devem ser realizadas **exclusivamente na pasta do frontend** (`frontend/`).
- É **terminantemente proibido** realizar qualquer alteração, inserção ou exclusão de código nos arquivos do backend (`backend/`), incluindo códigos Java, arquivos de configuração do Spring Boot (`application.properties`), scripts do Maven (`pom.xml`) ou configurações de Docker.
- A atuação em relação ao backend limita-se estritamente à análise, diagnóstico e testes de endpoints (como leitura e relatórios de conformidade da API) para fins de comunicação, sem nenhuma intervenção direta no código fonte da API.
