# Histórico de Alterações — Smart Library

Registro de todas as alterações realizadas no projeto para controle interno e acompanhamento da equipe.

## [2026-07-15] — Autenticação Real (Login e Cadastro), Fila de Espera e Correções Críticas de Estoque

### Adicionado
- **Cadastro e Login Reais no Frontend (RF01):**
  - Criei a tela de Cadastro de Usuários (`/auth/register`) no frontend com formulário completo validado reativamente e integrado ao endpoint `/register` do Spring Boot.
  - Atualizei a tela de Login (`/auth/login`) para expor formulário real de e-mail e senha conectado ao endpoint de autenticação real.
  - Desenvolvi a lógica no `AuthService` para realizar o login real e, na sequência, obter dinamicamente os detalhes do usuário chamando o endpoint `/listar` para identificar perfil de acesso (ADMIN vs LEITOR).
- **Módulo de Fila de Espera no Backend (RF05):**
  - Criei a entidade JPA `FilaEspera.java` (`tb_fila_espera`), repositório `FilaEsperaRepository.java`, serviço `FilaEsperaService.java` e controlador REST `FilaEsperaController.java` exposto no endpoint `/fila-espera`.
  - Desenvolvi a lógica de entrada e saída da fila, cálculo de posições reativas e acionamento automático de notificações.
- **Integração de Fila de Espera com Devoluções no Backend:**
  - Acoplei o serviço `FilaEsperaService.notificarProximo` ao fluxo do método `devolverEmprestimo` em `EmprestimoService.java`. Quando um exemplar é devolvido, a API notifica e altera o status do leitor que estava no topo da fila do livro para `NOTIFICADO`.
- **Módulo de Notificações no Backend (RF06):**
  - Criei a entidade JPA `Notificacao.java` (`tb_notificacao`), repositório `NotificacaoRepository.java`, serviço `NotificacaoService.java` e controlador REST `NotificacaoController.java` exposto no endpoint `/notificacao`.
  - Implementei regras de criação de mensagens estruturadas por tipo (`LIVRO_DISPONIVEL`, `EMPRESTIMO_VENCENDO`, `EMPRESTIMO_ATRASADO`), marcação de lida unitária/global e contagem de não lidas.
- **Interfaces e Serviços de Fila de Espera e Notificações no Frontend:**
  - Criei os serviços `waitlist.service.ts` e `notification.service.ts` com suporte total a dual-mode (mock local via `MockDataService` e consumo de API real baseado na flag `USE_MOCK`).
  - Adicionei dados de exemplo na base mockada para simular filas ativas e mensagens de teste.
- **Centro de Notificações no Frontend (RF06):**
  - Criei a tela `/notifications` com layout de lista dinâmico usando `@if` e `@for` control flows, agrupando os avisos por tipo com ícones dinâmicos do Material Design, marcação visual de não lidas e botões de ação rápidos de leitura e leitura global.
- **Badge do Sino Dinâmico no Header:**
  - Conectei o botão de notificações do `HeaderComponent` ao `unreadCount` reativo do `NotificationService`, exibindo em tempo real e de forma animada o número de mensagens pendentes de leitura.
- **Ações de Fila de Espera no Catálogo de Livros (RF05):**
  - Atualizei a listagem do catálogo `/books`. Para livros com cópias esgotadas (`availableCopies === 0`), exibo um botão de "Entrar na Fila" ou "Sair da Fila", calculando os status em tempo real com base no usuário logado.
- **Prorrogação Customizada com Calendário (MatDatepicker):**
  - Integrei o `MatDatepickerModule` do Angular Material na listagem de empréstimos e criei o modal de prorrogação interativo. Agora, ao renovar ou prorrogar, o administrador escolhe a data limite de devolução diretamente em um calendário visual premium, com a data padrão de +14 dias sugerida e datas passadas desabilitadas.
- **Máscara de CPF e Formatação Visual:**
  - Adicionei máscara interativa de CPF (`000.000.000-00`) em tempo de digitação no formulário de Cadastro de novos membros.
  - Criei métodos de formatação e apliquei a exibição estruturada com pontos e traços para todos os CPFs mostrados no Perfil do Usuário e na Listagem de Usuários do Administrador.

### Alterado
- **Estrutura de Rotas e Sidebar:**
  - Registrei a rota lazy-loaded de `/notifications` no `app.routes.ts`.
  - Inseri o atalho de Notificações com badge contador dinâmico na Sidebar de navegação lateral para todos os perfis.
- **Validação de Segurança com Senha Atual no Perfil:**
  - Reestruturei o formulário de edição de dados do perfil do usuário comum para exigir o preenchimento da **Senha Atual**. O frontend realiza uma validação síncrona contra o endpoint de login do backend antes de aceitar e processar as atualizações, garantindo a proteção da conta.
- **Bloqueio de Edição de Dados Sensíveis de Membros:**
  - Desabilitei visualmente os campos de CPF, Telefone, Tipo de Membro e Biblioteca no modal de edição de membros para administradores. Isso evita inconsistências, visto que o backend não persiste ou atualiza essas propriedades sensíveis em tempo de execução.
- **Tradução Reativa de Status de Empréstimos:**
  - Mapeei os status `ACTIVE`, `RETURNED`, `OVERDUE` e `RESERVED` no `TranslationService`. Substituí a exibição de labels fixas por chamadas dinâmicas para acompanhar o idioma ativo na Home do Dashboard, na Listagem Geral de Empréstimos e no Perfil do Leitor.
- **Ordenação Prioritária de Empréstimos:**
  - Modifiquei a propriedade computada `filteredLoans` do administrador para ordenar e fixar automaticamente os empréstimos em aberto (Ativos e Atrasados) no topo da tabela, facilitando o gerenciamento do acervo.
- **Parse de Mensagens de Erro Brutas:**
  - Adicionei tratamento no interceptor global de erros para capturar strings JSON de erros do Spring Boot e realizar o parse automático para exibir textos amigáveis no SnackBar em vez do payload técnico.

---

## [2026-07-14] — Temas/Idiomas, Solicitação de Empréstimos, Auditoria Real e Correções Críticas de API

### Adicionado
- **Barra de Pesquisa Global Sincronizada (SearchService):**
  - Desenvolvi o `SearchService` reativo no core que sincroniza instantaneamente a caixa de busca do Header com o feed do catálogo de livros. Se o leitor iniciar a pesquisa de outra rota, o sistema o redireciona automaticamente para o acervo (`/books`).
- **Alternador de Menu Hambúrguer (SidebarService):**
  - Desenvolvi o `SidebarService` para gerenciar o estado recolhido (collapse) da barra lateral quando o botão de menu da navbar superior for clicado, ocultando textos e centralizando ícones com transição suave.
- **Navegação no Menu do Usuário do Header:**
  - Vinculei os botões de "Meu Perfil" e "Configurações" no menu do Header aos `routerLink` correspondentes.
- **Tradução Inteligente de Logs do Banco de Dados (Regex Parser):**
  - Implementei um analisador reativo no `TranslationService` que intercepta as strings em português salvas pelo Spring Boot na tabela de auditoria e reconstrói as frases dinamicamente em tempo de execução na Timeline de Logs e no feed do Dashboard para Inglês e Espanhol.
- **Internacionalização de Listagens e Formulários Administrativos:**
  - Conectei e traduzi por completo o Portal de Login de homologação, as tabelas de Empréstimos e Usuários e os diálogos de detalhamento e de cadastro de novos livros/membros.
- **Tradução de Categorias e Filiais de Bibliotecas:**
  - Ajustei o processador estatístico do Dashboard para expor a chave bruta do enum da categoria, permitindo traduzir o gráfico de "Categorias Populares" e todos os dropdowns de bibliotecas/categorias de forma totalmente dinâmica e reativa.
- **Suporte Dinâmico a Multi-Idiomas (Tradução Reativa):**
  - Criei o serviço `TranslationService` no core para gerenciar chaves de tradução reativas (Português, Inglês e Espanhol) usando Signals do Angular 21, persistindo a preferência no LocalStorage do navegador.
  - Conectei as traduções na Sidebar (menus e rodapé), no Header (dados e busca), na tela de Configurações (todos os campos e frequências), no Dashboard (painéis estatísticos, títulos, cabeçalho de tabelas e status) e na Gaveta de Catalogação de Livros (`book-form-drawer`).
- **Tema Escuro Nativo no Design System (Angular Material Overrides):**
  - Configurei a classe `.dark-theme` no `styles.scss` substituindo as variáveis CSS de cores por tonalidades e escalas escuras e limpas.
  - Adicionei overrides de estilos específicos para forçar a renderização escura e com legibilidade e contraste premium em componentes do Angular Material no modo escuro, incluindo Cards, Tabelas, Dialogs, Inputs de Formulários Outlined e Selects.
  - Integrei a seleção de temas na tela de Configurações, aplicando a classe ao elemento `html` em tempo real e persistindo no LocalStorage.
- **Ação de Solicitar Empréstimo para Alunos:**
  - Implementei o botão "Solicitar" nos cards de livros do Acervo (`/books`) disponível para alunos comuns (membros) quando houver cópias no banco, chamando o método `requestLoan()` que cria um empréstimo ativo no servidor e atualiza os totais.
- **Módulo de Auditoria de Logs Persistido no Backend:**
  - Criei a entidade JPA `AuditLog.java` no backend para salvar as ações administrativas do sistema na tabela `tb_audit_logs`.
  - Criei o repositório `AuditLogRepository.java`, o serviço `AuditLogService.java` e o controlador REST `AuditLogController.java` exposto no endpoint `GET /api/logs`.
  - Integrei o `AuditLogService` nos serviços existentes do Spring Boot (`UserService`, `BookService`, `EmprestimoService`) para registrar automaticamente as ações mais críticas do sistema (catalogação de livros, cadastro e bloqueio/desbloqueio de membros, e realização/renovação/devolução de empréstimos) com indicação do autor/operador.
- **Tela de Auditoria de Logs no Frontend (Formato Timeline):**
  - Desenvolvi a tela de Auditoria (`/audit`) em Angular 21, contendo uma **linha do tempo interativa e premium** de eventos em vez de tabela crua, exibindo ícones dinâmicos por tipo de ação, badges coloridos por operador e animações suaves.
  - Criei o serviço de chamadas `audit.service.ts` integrado ao novo endpoint do backend.
  - Registrei a nova rota `/audit` protegida com `adminGuard` e inseri o menu correspondente na Sidebar da aplicação para controle restrito de administradores.
- **Interceptor Global de Erros de API:**
  - Criei o interceptor funcional de requisições `error.interceptor.ts` para capturar falhas de requisições HTTP (status 400, 401, 500, etc.) em qualquer chamada ao servidor.
  - Integrei a exibição de toasts de erros animados utilizando o `MatSnackBar` do Angular Material com uma folha de estilos personalizada (`.error-snackbar`) no arquivo global `styles.scss`, garantindo um feedback visual de alto contraste.
  - Registrei o `errorInterceptor` na configuração geral do provedor HttpClient no `app.config.ts`.
- **Ações de Devolução e Renovação de Empréstimos:**
  - Criei os endpoints semânticos `@PatchMapping("/{id}/devolver")` e `@PatchMapping("/{id}/renovar")` no `EmprestimoController.java` e implementei a lógica de negócio correspondente no `EmprestimoService.java` (atualização automática de status e prazos de devolução no Postgres).
  - Adicionei os botões de ação rápida de Devolver e Renovar diretamente na tabela de listagem de empréstimos ativos no frontend, chamando o `LoanService` com parada de propagação de eventos do mouse.

### Alterado
- **Remoção do Botão "New User" no Painel Administrativo:**
  - Removi o botão de cadastro de novos membros do painel de gestão de usuários (`user-list.component.html`), já que o registro de novos alunos/professores é feito exclusivamente pela tela de login/registro e não faz sentido o administrador criar contas manualmente.
- **Mapeamento de Dados no PUT de Livros (BookService):**
  - Corrigi o `mapToBackend()` para enviar apenas `{ titulo, autor, descricao }` no body do PUT (sem `id`, `posse` ou `livros`), já que o `id` vai na URL e os campos de relacionamento (`posse`, `livros`) não devem ser enviados pelo frontend — o `LivroService.atualizarLivroPorId` do Spring Boot fazia `.build()` sem esses campos, causando o erro 500.
- **Feedback de Erro com Snackbar no CRUD de Livros:**
  - Adicionei tratamento de erro com `MatSnackBar` no `onSave()` do drawer de livros e no `deleteBook()` da listagem, para exibir mensagens claras de falha ao invés de falhas silenciosas ou toasts genéricos do interceptor.
- **Edição de Perfil de Usuário com Chamadas Reais:**
  - Implementei um modal interativo de alteração de dados no `UserProfileComponent` para permitir que o usuário logado edite seu Nome, E-mail e Senha no sistema.
  - Integrei o formulário reativo de edição ao método `updateUser` do `UserService` no Angular, refletindo os dados editados em tempo real no `AuthService` com atualização imediata do avatar e menu global.
  - Atualizei a DTO de persistência de usuários no `UserService` e no cadastro no frontend para enviar também o parâmetro `nome` de forma consistente com os validadores de request do Spring Boot.

### Corrigido
- **Reavaliação de Signals Angular (Clonagem de Referências):**
  - Corrigi o comportamento de atualização de dados nos templates no modo mock. Como passamos a expor a referência do array real do `MockDataService` (para permitir persistência), a alteração de itens no array preservava a mesma referência de memória do objeto, fazendo com que o Angular Signal (`set`) achasse que o valor não havia mudado. Ajustei os métodos `loadBooks()` (livros), `loadData()` (usuários/bibliotecas) e `loadData()` (empréstimos) para definirem os Signals criando cópias clonadas (`[...lista]`), disparando a renderização na hora.
- **Atualização do Acervo após Edição de Livros:**
  - Corrigi o binding de evento de salvamento do formulário de livros no template `book-list.component.html`. O seletor `<app-book-form-drawer>` estava emitindo o output `bookSaved`, mas a listagem de livros tentava escutar `(saved)="onBookSaved()"`. Corrigindo para `(bookSaved)="onBookSaved()"`, o acervo é recarregado dinamicamente com as alterações salvas.
- **Falha de Persistência no Modo Mock (MockDataService):**
  - Corrigi a recuperação de dados das entidades para expor a referência real em memória do array interno do `MockDataService` ao invés de cópias estruturais desvinculadas (`[...]`). Isso resolveu o problema de a edição e cadastro de livros, usuários e empréstimos não persistirem localmente em tempo de execução.
- **Legibilidade de Badges de Operador no Modo Escuro:**
  - Corrigi a definição de classes em `audit-list.component.scss` para que o texto do badge do administrador herde `var(--color-primary)`, solucionando o baixo contraste visual (texto azul escuro sobre fundo azul escuro) no tema escuro.
- **Erro de Desserialização de Empréstimo (400 Bad Request):**
  - Mudei a propriedade `bloqueado` de `User.java` no backend de tipo primitivo `boolean` para o wrapper classe `Boolean`. Isso evita falhas de parse do Jackson quando o frontend envia apenas o CPF de usuários em relacionamentos de empréstimo (que deixavam o campo nulo no mapeamento de tipo primitivo).
  - Corrigi o `EmprestimoService.java` para buscar entidades reais de `User` e `Livro` no Postgres antes de realizar a associação e salvar o empréstimo.
- **Falha de Cadastro de Membro sem Senha (500 Internal Error):**
  - Ajustei o backend (`UserService.java`) para associar o CPF como senha padrão provisória de acesso caso o Administrador realize o cadastro de novos membros sem senha informada no DTO.
  - Renomeei o input de cadastro de "Matrícula" para "CPF (11 números)" no frontend com máscara de validação no Angular para evitar rejeições do Hibernate.
  - Corrigi o update de usuários no Angular para manter a busca no banco pelo CPF original (`editingUserId`) e não o alterado no form.
- **Visual Esmagado do Botão "Solicitar":**
  - Adicionei regras de estilo específicas para botões `[mat-flat-button]` dentro do card de livros no `book-list.component.scss`, corrigindo o conflito que esmagava o botão em caixas de 32px.
- **Travamentos Silenciosos na Busca de Livros:**
  - Ajustei a lógica de filtro de string em `book-list.component.ts` para verificar de forma segura e nula todas as propriedades (`title`, `author`, `isbn`) antes de chamar `.toLowerCase()`.
- **Persistência de Data de Devolução no Backend:**
  - Corrigi o bug de copiar e colar na linha 38 do `EmprestimoService.java` do backend, que salvava a data de devolução modificada na propriedade `data_emprestimo` ao invés de atualizar o campo `data_devolucao` da entidade.

## [2026-07-08] — Integração com a API Real e Configuração do CORS

### Adicionado
- **Configuração de API Dinâmica:**
  - Criei o arquivo [api.config.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/config/api.config.ts) para centralizar a URL do backend e a chave `USE_MOCK`, permitindo chavear facilmente entre os dados mockados locais e a API do Spring Boot.
  - Desenvolvi o [credentials.interceptor.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/interceptors/credentials.interceptor.ts) para adicionar automaticamente a propriedade `withCredentials: true` em todas as requisições enviadas ao backend, viabilizando o fluxo de autenticação por cookies de sessão (`JSESSIONID`).
- **Serviços HTTP de Integração:**
  - Criei o [book.service.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/services/book.service.ts) para gerenciamento assíncrono do catálogo de livros no backend, incluindo o mapeamento bidirecional de dados para compatibilidade com o formato simplificado da API.
  - Criei o [loan.service.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/services/loan.service.ts) para registrar, listar e gerenciar o ciclo de vida dos empréstimos em comunicação com a API.
  - Criei o [user.service.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/services/user.service.ts) para cadastro, listagem, atualização e controle de bloqueio de membros integrando com os novos endpoints da API na branch `dev`.

### Alterado
- **Autenticação Real:**
  - Adaptei o [auth.service.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/services/auth.service.ts) para realizar chamadas reais de login, registro e logout na API do Spring Boot. Adicionei um fluxo inteligente de auto-cadastro na nuvem caso o usuário administrativo ou membro de homologação ainda não existam no banco de dados.
- **Componentes do Frontend:**
  - Registrei o `provideHttpClient` com o interceptor de credenciais no [app.config.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/app.config.ts).
  - Adaptei o [book-list.component.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/features/books/pages/book-list/book-list.component.ts) e o [book-form-drawer.component.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/features/books/components/book-form-drawer/book-form-drawer.component.ts) para carregar e persistir as ações do catálogo por meio do `BookService` de forma assíncrona.
  - Adaptei a listagem de empréstimos [loan-list.component.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/features/loans/pages/loan-list/loan-list.component.ts) para ler as listagens de livros, membros e empréstimos das chamadas HTTP, removendo o construtor antigo e migrando as ações de devolução e renovação de empréstimos para atualizações da API.
  - Adaptei o gerenciamento de membros [user-list.component.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/features/users/pages/user-list/user-list.component.ts) para listar, cadastrar, editar e aplicar o bloqueio de membros integrando com o `UserService`.
  - Adaptei o painel principal [dashboard-home.component.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/features/dashboard/pages/dashboard-home/dashboard-home.component.ts) para computar de forma reativa os totais, feeds e gráficos a partir dos dados do banco real, removendo as leituras estáticas.
- **Modelagem de Dados:**
  - Tornei opcional o campo `acceptedBy` no modelo [loan.model.ts](file:///c:/Users/Guga/Documents/Biblioteca/frontend/src/app/core/models/loan.model.ts) para garantir a compilação do TypeScript, uma vez que a API do backend não gerencia essa informação.

## [2026-06-22] — Reestruturação do Monorepo

### Adicionado
- **Organização do Monorepo:**
  - Reestruturei a organização do repositório movendo a aplicação Angular para o diretório `frontend/` e o projeto de API Spring Boot para o diretório `backend/`.
  - Ajustei o arquivo `.gitignore` global para ignorar de forma correta as pastas `node_modules/` e `.angular/cache/` localizadas no subdiretório do frontend, além do diretório de build `target/` e arquivos de IDE no backend Java.

### Alterado
- **Documentação de Execução:**
  - Ajustei o `README.md` principal detalhando a nova hierarquia de pastas do monorepo e atualizando os passos de instalação e execução local para que o desenvolvedor entre no diretório `frontend/` primeiro.

## [2026-06-10] — Painel de Administração, Sistema de Permissões e Controle de Acesso

### Adicionado
- **Autenticação Temporária:**
  - Criado o `AuthService` para gerenciamento de sessão local (Signals e `localStorage`) com suporte a login rápido de Admin e Membro.
  - Reestruturada a interface de Login com cards interativos de acesso rápido para simplificação dos testes de homologação.
  - Desenvolvidos os guards funcionais `AuthGuard` e `AdminGuard` para proteção de rotas privadas e validação de acessos administrativos.
- **Diferenciação de Papéis de Acesso:**
  - Adaptada a Sidebar para computar reativamente os links visíveis conforme o nível do usuário logado (Membros comuns visualizam apenas acervo e empréstimos próprios).
  - Adaptada a visualização do Header para exibir dinamicamente iniciais no avatar, nome e e-mail no menu, e implementar a ação de Logout.
  - Ocultados recursos de criação, edição e exclusão de livros para usuários comuns na listagem de acervo.
  - Restringido o histórico de empréstimos ao ID do usuário ativo quando logado como Membro, com ocultação dos botões de devolução/renovação/registro de empréstimos.
- **Dashboard Único do Leitor (Membro):**
  - Desenvolvido o painel estatístico pessoal do leitor na página inicial do dashboard para usuários comuns.
  - Inseridos indicadores de controle de leitura (Livros lidos, empréstimos ativos, livros em atraso e data do próximo vencimento).
  - Adicionado feed de atividades recentes pessoais e seção de livros recomendados dinamicamente com base nas categorias do acervo.
- **Módulo de Configurações:**
  - Desenvolvida a feature de configurações (`/settings`) com formulário reativo para personalização do tema, idioma e frequência de alertas.
- **Operações Administrativas completas:**
  - Desenvolvido formulário reativo de Novo Empréstimo para cadastro de transações.
  - Implementadas ações de "Devolver" e "Renovar" empréstimo diretamente no modal de detalhes, atualizando dinamicamente o status e a quantidade de exemplares disponíveis do livro.
  - Implementadas ações de edição e exclusão de livros na listagem.
  - Adaptado o Drawer lateral de livros para operar de forma híbrida (cadastro e edição de dados).
  - Implementado o cadastro e edição de membros com formulário reativo em modal.
  - Adicionada a ação rápida de "Bloquear/Desbloquear" usuários com reatividade de tela imediata.
- **Dashboard Admin & Auditoria:**
  - Desenvolvidos gráficos estatísticos estilizados via CSS e SVG para distribuição por categorias e resumo de status de empréstimos.
  - Adicionado feed de logs de atividades (auditoria simples) exibindo as últimas ações tomadas pelos administradores em tempo real.
- **Estilos Globais:**
  - Movidas as classes de estilização de modais e diálogos para o arquivo de estilo global (`styles.scss`) para reutilização unificada.

### Corrigido
- **Tabela de Empréstimos e Dashboard:**
  - Corrigido o erro de runtime causado pela falta de invocação explícita do Signal computed `displayedColumns()` nos templates HTML da listagem de empréstimos e do dashboard.
- **Roteamento de Perfil:**
  - Corrigido o bloqueio da página de perfil do usuário (`/users/profile`) para membros comuns ao mover a restrição de permissão do `AdminGuard` do escopo da rota pai `/users` para a rota de listagem de membros.
  - Corrigida a fixação de perfil no componente de visualização de perfil para puxar os dados do usuário autenticado no momento via `AuthService`.
- **Importações e Tipagem:**
  - Corrigida a assinatura do método de criação de usuários no mock de dados para omitir propriedades geradas de forma interna.
  - Corrigida a importação ausente da função `inject` no componente de empréstimos.

## [2026-05-23] — Detalhes de Empréstimo e Modal de Visualização

### Adicionado
- **Modal de Detalhes do Empréstimo:** Implementada a exibição de um modal detalhado (diálogo) ao clicar em qualquer registro de empréstimo na tabela.
- **Campos do Empréstimo:** Inclusão de dados no modal como ID do livro, ID do usuário, data de empréstimo, data de devolução prevista, data efetiva de devolução, status e o operador responsável que aceitou a operação.
- **Modelos e Simulação:** Adicionado o campo `acceptedBy` na interface `Loan` e preenchidos os dados de teste correspondentes no `MockDataService`.

## [2026-05-21] — Setup Inicial, Telas e Ajustes de Navegação

### Adicionado
- **Tela de Empréstimos (`/loans`):** Criada listagem de empréstimos ativos, atrasados e devolvidos, com suporte a busca dinâmica e filtros por status.
- **Tela de Membros/Usuários (`/users`):** Criada listagem de membros do sistema integrada com a simulação de dados de teste.
- **Esqueleto de Telas e Navegação:**
  - Desenvolvido Dashboard principal com os indicadores e empréstimos recentes.
  - Implementada tela de gerenciamento de livros do acervo, incluindo busca por texto, filtros de categoria e gaveta lateral (Drawer) para cadastro de novos livros.
  - Criada tela de exibição do Perfil com histórico de leituras.
  - Desenvolvida estrutura de login com as validações de campos preparadas para a integração com a API.
- **Estrutura Base do App:**
  - Configurado roteamento geral do app com Lazy Loading utilizando os componentes standalone do Angular 21.
  - Estruturados os modelos de dados principais para `User`, `Book`, `Loan` e `Library`.
  - Criado `MockDataService` para simulação das chamadas de API do backend.
  - Configurado layout principal do sistema (Header, Sidebar e MainLayout) usando a fonte Inter e o Angular Material.

### Corrigido
- **Navegação Geral:** Corrigido o roteamento de empréstimos na barra lateral e ajustado o destaque de abas ativas para evitar a marcação simultânea indesejada de abas relacionadas a usuários.
