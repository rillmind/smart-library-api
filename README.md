# Smart Library — Monorepo

Sistema inteligente de gestão e compartilhamento de biblioteca, projetado no formato de monorepo para centralizar a infraestrutura do backend e a interface do frontend em um único repositório.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **Framework:** Angular 21 (Componentes Standalone e Signals para gerenciamento de estado reativo).
- **Design System:** Angular Material para os componentes de interface (UI) e SCSS para customizações de visual.
- **Estilização:** CSS Vanilla com variáveis customizadas para o sistema de temas (Claro e Escuro).
- **Tipografia:** Fonte *Inter* integrada diretamente do Google Fonts.
- **Gerenciador de Pacotes:** npm.

### Backend
- **Core:** Java 21 + Spring Boot 3.x.
- **Segurança:** Spring Security 6 (autenticação baseada em sessão com persistência no cache do Redis).
- **Persistência:** Spring Data JPA + PostgreSQL.
- **Cache e Sessão:** Redis.
- **Documentação:** OpenAPI 3 / Swagger UI.

---

## 📂 Estrutura de Pastas

A estrutura do monorepo organiza as pastas de frontend e backend da seguinte forma:

```text
Biblioteca/ (raiz)
├── backend/                                   # API Java / Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/bibliotecaInteligente/api/
│   │   │   │   ├── config/                    # Configurações de Segurança e OpenAPI
│   │   │   │   ├── modules/                   # Módulos de domínio da aplicação
│   │   │   │   │   ├── emprestimo/            # Entidades, regras e rotas de empréstimos
│   │   │   │   │   ├── livro/                 # Entidades, regras e rotas de livros
│   │   │   │   │   └── user/                  # Entidades, regras, rotas de usuários e logs
│   │   │   │   └── ApiApplication.java        # Classe de inicialização do Spring Boot
│   │   │   └── resources/
│   │   │       └── application.properties     # Configurações de conexão e variáveis
│   │   └── test/                              # Testes unitários e de integração
│   ├── Dockerfile                             # Configuração de build da imagem da API
│   ├── docker-compose.yml                     # Orquestração do Postgres, Redis e API
│   └── pom.xml                                # Dependências e dependências Maven
│
├── frontend/                                  # Aplicação Angular 21
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                          # Recursos globais (layouts, services, guards, interceptors)
│   │   │   ├── features/                      # Módulos com lazy loading (dashboard, auth, books, loans, users, audit)
│   │   │   ├── shared/                        # Componentes e serviços compartilhados (MockDataService)
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   └── package.json                           # Dependências e scripts npm
```

---

## 📋 Status das Tarefas (Requisitos Funcionais)

Lista de funcionalidades mapeadas e o status da implementação no sistema:

| ID | Requisito | O que foi feito / O que resta | Status |
| :--- | :--- | :--- | :---: |
| **RF01** | Cadastrar usuários | Desenvolvimento das operações de cadastro e controle de bloqueio de usuários. O registro de novos membros é feito pelo portal de Login | ✅ **Concluído** |
| **RF02** | Cadastrar livros | Desenvolvimento do formulário reativo e operações de cadastro, edição e remoção de livros | ✅ **Concluído** |
| **RF03** | Registrar empréstimos | Desenvolvimento do fluxo de registro, renovação e devolução de empréstimos na interface administrativa | ✅ **Concluído** |
| **RF04** | Registrar devoluções | Implementação da interface de devolução de livros com impacto em tempo real nas cópias do acervo | ✅ **Concluído** |
| **RF05** | Fila de espera | Sistema de fila de espera para livros indisponíveis integrado ao fluxo de acervo e devolução | ✅ **Concluído** |
| **RF06** | Enviar notificações | Sistema de notificações in-app avisando sobre livros disponíveis e status de empréstimos | ✅ **Concluído** |
| **RF07** | Permitir reservas online | Desenvolvimento da solicitação direta de empréstimos pelo aluno no acervo de livros | ✅ **Concluído** |
| **RF08** | Histórico de utilização | Desenvolvimento da tabela de histórico de empréstimos do usuário | ✅ **Concluído** |
| **RF09** | Múltiplas bibliotecas | Adicionado suporte a filiais e seletores no Sidebar/Cadastro | ✅ **Concluído** |
| **RF10** | Recomendação inteligente | Modelagem dos dados preparada nas classes de modelo da aplicação | ✅ **Concluído** |

---

## 🔌 Integração Frontend e Backend

A integração do frontend com a API real do backend local conta com as seguintes características:
- **Chaveamento Dinâmico (Mock vs API Real):** O arquivo `api.config.ts` gerencia o chaveamento do ambiente. Alterando a constante `USE_MOCK` para `false`, todo o fluxo de dados do frontend passa a consumir diretamente a API do Spring Boot na porta `8080`.
- **Autenticação e Sessão:** O interceptor de credenciais `credentials.interceptor.ts` injeta a propriedade `withCredentials: true` nas requisições HTTP do Angular, permitindo o armazenamento e transmissão do cookie de sessão (`JSESSIONID`) exigido pelo Spring Security.
- **Auditoria de Logs:** Sistema de auditoria de logs gravado no banco de dados PostgreSQL e consumido pela interface de Logs do frontend, fornecendo rastreabilidade em tempo real de todas as ações administrativas.
- **Tratamento Global de Erros:** O interceptor global de erros HTTP exibe caixas de alerta (`MatSnackBar`) animadas toda vez que o servidor rejeita uma requisição (ex: CPF já cadastrado ou credenciais inválidas).
- **Múltiplos Idiomas e Temas:** O `TranslationService` gerencia traduções reativas em Português, Inglês e Espanhol. O visual escuro é aplicado através da classe `.dark-theme` com variáveis de cores customizadas aplicadas no `document.documentElement` com persistência no LocalStorage.
- **Mapeamento de Dados:** Adaptação do modelo simplificado das entidades do backend para a tipagem do frontend através de classes de mapeamento nos serviços Angular (`BookService`, `UserService` e `LoanService`).

---

## ⚙️ Como rodar o projeto localmente

### Pré-requisitos
- **Java JDK 21**
- **Node.js (versão 18 ou superior)**
- **Docker e Docker Desktop**

### 1. Inicializar os Serviços de Infraestrutura (Banco e Cache)
Inicie os contêineres do PostgreSQL e do Redis a partir do diretório raiz:
```bash
cd backend
docker compose up -d postgres-db redis-cache
```

### 2. Rodar o Backend (API Spring Boot)
Existem duas formas de executar o backend da aplicação:

#### Opção A: Rodar como contêiner Docker (Pronto para uso)
Se desejar executar a API já compilada no contêiner:
```bash
docker compose up -d --build api-service
```

#### Opção B: Rodar via terminal com Maven (Ideal para depuração)
Se desejar executar a API diretamente no console local (com o banco e cache já rodando no Docker):
```bash
# No diretório backend/
# Compilar e empacotar
./mvnw.cmd package -DskipTests
# Rodar a aplicação
./mvnw.cmd spring-boot:run
```
A API iniciará no endereço `http://localhost:8080`.
A documentação interativa do Swagger poderá ser acessada em `http://localhost:8080/swagger-ui/index.html`.

### 3. Rodar o Frontend (Angular)
Acesse a pasta do frontend e inicie a interface do usuário:
```bash
cd ../frontend
# Instalar as dependências do projeto
npm install
# Iniciar o servidor de desenvolvimento do Angular
npm start
```
O frontend ficará disponível em `http://localhost:4200/`.

---

## 🎨 Convenções e Padrões Adotados

Diretrizes e padrões adotados no desenvolvimento para garantir a padronização do código:
- **Nomes de pastas e arquivos:** kebab-case (ex: `user-profile.component.ts`).
- **Nomes no código:** camelCase para variáveis/métodos e PascalCase para classes/interfaces.
- **Signals:** Utilização de Signals do Angular para gerenciamento de estado reativo.
- **Estruturas no HTML:** Utilização da nova sintaxe de control flow (`@if`, `@for`, `@switch`) do Angular 21.
- **Internacionalização:** Configuração da localização global para `pt-BR` no `app.config.ts`, permitindo a formatação automática de datas e números.
- **Controle de Acesso (RBAC):** Proteção de rotas e adaptação da interface por meio de guards baseados no papel do usuário ativo (Administrador vs Membro).
