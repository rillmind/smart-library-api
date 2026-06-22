# Smart Library — Monorepo

Organizei o projeto no formato de monorepo para centralizar os códigos das equipes de frontend e backend em um único repositório.

> [!IMPORTANT]
> O meu trabalho de desenvolvimento e as minhas alterações de código são feitos **exclusivamente na pasta `frontend/`**. A pasta `backend/` é de responsabilidade dos meninos do backend (João e Geferson) e do Raul (Tech Lead), portanto eu não realizo modificações no código da API Spring Boot.

---

## 🚀 Tecnologias Utilizadas

- **Core:** Angular 21 (utilização de Componentes Standalone e Signals para gerenciamento de estado moderno).
- **Design System:** Angular Material para os componentes de interface (UI) e SCSS para customizações.
- **Estilização:** CSS Vanilla com variáveis customizadas para facilitar a manutenção de cores e espaçamentos.
- **Tipografia:** Fonte *Inter* integrada diretamente do Google Fonts.
- **Testes:** Vitest.
- **Gerenciador de Pacotes:** npm.

---

## 📂 Estrutura de Pastas

Estruturei o monorepo dividindo os escopos de frontend e backend da seguinte forma:

```text
Biblioteca/ (raiz)
├── backend/                   # API Java / Spring Boot (equipe separada)
├── frontend/                  # Aplicação Angular 21 (meu escopo)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Recursos globais e comuns da aplicação (layouts, models, guards)
│   │   │   ├── features/      # Módulos com lazy loading (dashboard, auth, books, loans, users)
│   │   │   ├── shared/        # Recursos compartilhados (MockDataService)
│   │   │   ├── app.component.ts
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── assets/            # Arquivos estáticos
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
```

---

## 📋 Status das Tarefas (Requisitos Funcionais)

Lista de funcionalidades mapeadas e o status atual da implementação no frontend:

| ID | Requisito | O que foi feito / O que resta | Status |
| :--- | :--- | :--- | :---: |
| **RF01** | Cadastrar usuários | Desenvolvidas as operações de cadastro, edição e controle de bloqueio de usuários no frontend | ✅ **Concluído** |
| **RF02** | Cadastrar livros | Desenvolvido o formulário reativo e as operações de cadastro, edição e remoção de livros | ✅ **Concluído** |
| **RF03** | Registrar empréstimos | Desenvolvido o fluxo de registro, renovação e devolução de empréstimos na interface administrativa | ✅ **Concluído** |
| **RF04** | Registrar devoluções | Implementada a interface de devolução de livros com impacto em tempo real nas cópias do acervo | ✅ **Concluído** |
| **RF05** | Fila de espera | Planejado para a próxima sprint | 📋 *Planejado* |
| **RF06** | Enviar notificações | Planejado para a próxima sprint | 📋 *Planejado* |
| **RF07** | Permitir reservas online | Planejado para a próxima sprint | 📋 *Planejado* |
| **RF08** | Histórico de utilização | Desenvolvida a tabela de histórico de empréstimos do usuário | ✅ **Concluído** |
| **RF09** | Múltiplas bibliotecas | Adicionado suporte a filiais e seletores no Sidebar/Cadastro | ✅ **Concluído** |
| **RF10** | Recomendação inteligente | Modelagem dos dados preparada nas classes de modelo da aplicação | ✅ **Concluído** |

---

## ⚙️ Como rodar o projeto localmente

Para rodar e testar a nossa aplicação localmente:

1. Clonar o repositório principal.
2. Acessar a pasta do frontend:
   ```bash
   cd frontend
   ```
3. Instalar as dependências necessárias do Angular:
   ```bash
   npm install
   ```
4. Subir o servidor de desenvolvimento:
   ```bash
   npm start
   ```
5. Acessar `http://localhost:4200/` no seu navegador. O servidor local roda com live-reload, atualizando tudo na hora em que salvamos os arquivos.

---

## 🎨 Convenções e Padrões Adotados

Diretrizes e padrões adotados no desenvolvimento para garantir a padronização do código:
- **Nomes de pastas e arquivos:** Sempre em inglês e em formato kebab-case (ex: `user-profile.component.ts`).
- **Nomes no código:** camelCase para variáveis/métodos e PascalCase para classes/interfaces.
- **Signals:** Utilização de Signals (`signal()`) do Angular em todas as reatividades locais.
- **Estruturas no HTML:** Utilização da nova sintaxe de control flow (`@if`, `@for`, `@switch`) do Angular 21.
- **Internacionalização:** Configuração da localização global para `pt-BR` no `app.config.ts`, permitindo a formatação automática de datas e meses em português.
- **Controle de Acesso (RBAC):** Proteção de rotas e adaptação dinâmica da interface por meio de guards funcionais baseados no papel do usuário ativo (Administrador vs Membro).
