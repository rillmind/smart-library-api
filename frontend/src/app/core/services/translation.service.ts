import { Injectable, signal } from '@angular/core';

export type Language = 'pt-BR' | 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  currentLang = signal<Language>((localStorage.getItem('language') as Language) || 'pt-BR');

  private translations: Record<Language, Record<string, string>> = {
    'pt-BR': {
      dashboard: 'Dashboard',
      books: 'Livros',
      loans: 'Empréstimos',
      users: 'Usuários',
      audit: 'Auditoria de Logs',
      profile: 'Meu Perfil',
      settings: 'Configurações',
      logout: 'Sair',
      theme: 'Tema do Painel',
      language: 'Idioma Padrão',
      save_settings: 'Salvar Configurações',
      notifications: 'Notificações',
      email_notif: 'Receber notificações por e-mail sobre novas movimentações',
      due_notif: 'Alertar-me sobre devoluções próximas do prazo de vencimento',
      alert_freq: 'Frequência de Alertas',
      daily: 'Diário',
      weekly: 'Semanal',
      monthly: 'Mensal',
      theme_light: 'Tema Claro',
      theme_dark: 'Tema Escuro',
      search_placeholder: 'Buscar livros, autores, ISBN...',
      my_profile: 'Meu Perfil',
      system: 'Sistema',
      operator: 'Operador',
      actions: 'Ações',
      active: 'Ativo',
      inactive: 'Inativo',
      new_loan: 'Novo Empréstimo',
      new_user: 'Novo Usuário',
      new_book: 'Novo Livro',
      edit_book: 'Editar Livro',
      save: 'Salvar',
      cancel: 'Cancelar',
      title: 'Título',
      author: 'Autor',
      publisher: 'Editora',
      year: 'Ano',
      category: 'Categoria',
      copies: 'Exemplares',
      library: 'Biblioteca',
      description: 'Descrição',
      book: 'Livro',
      user: 'Usuário',
      date: 'Data',
      due_date: 'Devolução',
      status: 'Status',
      dashboard_subtitle: 'Visão geral do sistema de biblioteca',
      dashboard_user_subtitle: 'Meu painel pessoal do leitor',
      recent_loans: 'Empréstimos Recentes',
      recent_loans_user: 'Meus Empréstimos Recentes',
      popular_categories: 'Categorias Populares',
      recommended_books: 'Livros Recomendados',
      recent_activities: 'Atividades Recentes (Auditoria)',
      recent_activities_user: 'Minhas Atividades Recentes',
      status_summary: 'Resumo de Status Geral',
      status_summary_user: 'Resumo de Status Pessoal',
      total_books: 'Total de Livros',
      registered_users: 'Usuários Cadastrados',
      active_loans: 'Empréstimos Ativos',
      active_loans_user: 'Meus Empréstimos Ativos',
      overdue_loans: 'Em Atraso',
      overdue_loans_user: 'Meus Livros Atrasados',
      books_read: 'Livros Lidos',
      next_due: 'Próximo Vencimento',
      available: 'Disponível',
      no_recommendations: 'Nenhuma recomendação disponível no momento.',
      no_activities: 'Nenhuma atividade registrada.',
      no_categories: 'Nenhuma categoria registrada.',
      books_unit: 'livro(s)',
      active_units: 'ativos',
      overdue_units: 'atrasados',
      available_books: 'Livros Disponíveis no Acervo',
      read_books: 'Livros Lidos e Devolvidos',
      available_unit: 'disp.',
      read_units: 'lidos',
      library_central: 'Biblioteca Central',
      library_address: 'Bloco A, Térreo',
      visual_language: 'Visual e Idioma',
      settings_subtitle: 'Personalize a sua experiência no Smart Library',
      main_menu: 'MENU PRINCIPAL',
      account: 'CONTA',
      books_subtitle: 'Acervo completo da biblioteca',
      available_units: 'disponível(is)',
      unavailable: 'Indisponível',
      request: 'Solicitar',
      no_books_found: 'Nenhum livro encontrado.',
      enrollment: 'Matrícula',
      member_since: 'Membro desde',
      edit_profile: 'Editar Perfil',
      total_loans: 'Total de Empréstimos',
      loan_history: 'Histórico de Empréstimos',
      returned_at: 'Devolvido em',
      pending: 'Pendente',
      no_loans: 'Nenhum empréstimo registrado ainda.',
      edit_profile_title: 'Editar Dados do Perfil',
      new_password_placeholder: 'Nova Senha (deixe em branco para manter)',
      save_changes: 'Salvar Alterações',
      ENGINEERING: 'Engenharia',
      SCIENCE: 'Ciências',
      LITERATURE: 'Literatura',
      HISTORY: 'História',
      PHILOSOPHY: 'Filosofia',
      ARTS: 'Artes',
      TECHNOLOGY: 'Tecnologia',
      MATHEMATICS: 'Matemática',
      LAW: 'Direito',
      MEDICINE: 'Medicina',
      OTHER: 'Outros',
      loans_subtitle: 'Gerenciamento e controle de empréstimos de livros',
      search_book_user: 'Buscar por livro ou usuário',
      search_book: 'Buscar por livro',
      type_to_search: 'Digite para buscar...',
      search_book_placeholder: 'Buscar por livro...',
      filter_status: 'Filtrar por Status',
      all_status: 'Todos os status',
      loan_date: 'Data Empréstimo',
      effective_date: 'Data Efetiva',
      no_loans_found_filters: 'Nenhum empréstimo encontrado com os filtros selecionados.',
      loan_details: 'Detalhes do Empréstimo',
      loan_code: 'Código do Empréstimo',
      book_data: 'Dados do Livro',
      book_id: 'ID do Livro',
      member_data: 'Dados do Membro',
      user_id: 'ID do Usuário',
      operation_details: 'Detalhes da Operação',
      effective_return_date: 'Data Efetiva de Devolução',
      open_status: 'Em aberto',
      accepted_by: 'Aceito Por',
      renew: 'Renovar',
      return: 'Devolver',
      register_new_loan: 'Registrar Novo Empréstimo',
      select_book: 'Selecionar Livro',
      select_member: 'Selecionar Membro',
      due_date_limit: 'Data Limite de Devolução',
      operator_responsible: 'Operador Responsável',
      confirm_loan: 'Confirmar Empréstimo',
      users_subtitle: 'Gerenciamento de membros da instituição',
      edit_member: 'Editar Membro',
      register_new_member: 'Cadastrar Novo Membro',
      email_institutional: 'E-mail Institucional',
      cpf_label: 'CPF (11 números)',
      member_type: 'Tipo de Membro',
      save_registration: 'Salvar Cadastro',
      STUDENT: 'Aluno',
      PROFESSOR: 'Professor',
      STAFF: 'Funcionário',
      audit_subtitle: 'Rastreamento detalhado de segurança e eventos operacionais do sistema',
      filter_logs_placeholder: 'Filtrar logs por ação, evento ou operador',
      type_to_filter: 'Digite para filtrar...',
      no_audit_logs: 'Nenhum registro de auditoria encontrado.',
      login_platform_subtitle: 'Plataforma Inteligente de Biblioteca',
      login_portal_title: 'Portal de Acesso',
      login_portal_subtitle: 'Ambiente temporário de homologação. Escolha um perfil para entrar:',
      login_admin_title: 'Entrar como Administrador',
      login_admin_subtitle: 'Gerencie o acervo de livros, registre e devolva empréstimos, controle membros e audite logs.',
      login_user_title: 'Entrar como Membro',
      login_user_subtitle: 'Visualize o catálogo de livros disponíveis, consulte seus empréstimos ativos e veja seu perfil.',
      login_footer: '© 2026 Smart Library — Protótipo de Homologação',
      'Biblioteca Central': 'Biblioteca Central',
      'Biblioteca de Engenharia': 'Biblioteca de Engenharia',
      'Biblioteca de Humanas': 'Biblioteca de Humanas',
      'Sistema': 'Sistema',
      'Administrador': 'Administrador',
      'Usuário': 'Usuário',
    },
    'en': {
      dashboard: 'Dashboard',
      books: 'Books',
      loans: 'Loans',
      users: 'Users',
      audit: 'Audit Logs',
      profile: 'My Profile',
      settings: 'Settings',
      logout: 'Logout',
      theme: 'Panel Theme',
      language: 'Default Language',
      save_settings: 'Save Settings',
      notifications: 'Notifications',
      email_notif: 'Receive email notifications about new movements',
      due_notif: 'Alert me about returns close to the due date',
      alert_freq: 'Alert Frequency',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      theme_light: 'Light Theme',
      theme_dark: 'Dark Theme',
      search_placeholder: 'Search books, authors, ISBN...',
      my_profile: 'My Profile',
      system: 'System',
      operator: 'Operator',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      new_loan: 'New Loan',
      new_user: 'New User',
      new_book: 'New Book',
      edit_book: 'Edit Book',
      save: 'Save',
      cancel: 'Cancel',
      title: 'Title',
      author: 'Author',
      publisher: 'Publisher',
      year: 'Year',
      category: 'Category',
      copies: 'Copies',
      library: 'Library',
      description: 'Description',
      book: 'Book',
      user: 'User',
      date: 'Date',
      due_date: 'Due Date',
      status: 'Status',
      dashboard_subtitle: 'Library system overview',
      dashboard_user_subtitle: 'My reader dashboard',
      recent_loans: 'Recent Loans',
      recent_loans_user: 'My Recent Loans',
      popular_categories: 'Popular Categories',
      recommended_books: 'Recommended Books',
      recent_activities: 'Recent Activities (Audit)',
      recent_activities_user: 'My Recent Activities',
      status_summary: 'General Status Summary',
      status_summary_user: 'Personal Status Summary',
      total_books: 'Total Books',
      registered_users: 'Registered Members',
      active_loans: 'Active Loans',
      active_loans_user: 'My Active Loans',
      overdue_loans: 'Overdue Loans',
      overdue_loans_user: 'My Overdue Books',
      books_read: 'Books Read',
      next_due: 'Next Due Date',
      available: 'Available',
      no_recommendations: 'No recommendations available at this time.',
      no_activities: 'No activity recorded.',
      no_categories: 'No categories recorded.',
      books_unit: 'book(s)',
      active_units: 'active',
      overdue_units: 'overdue',
      available_books: 'Available Books in Stock',
      read_books: 'Books Read & Returned',
      available_unit: 'avail.',
      read_units: 'read',
      library_central: 'Central Library',
      library_address: 'Block A, Ground Floor',
      visual_language: 'Visual & Language',
      settings_subtitle: 'Customize your Smart Library experience',
      main_menu: 'MAIN MENU',
      account: 'ACCOUNT',
      books_subtitle: 'Complete library collection',
      available_units: 'available',
      unavailable: 'Unavailable',
      request: 'Request',
      no_books_found: 'No books found.',
      enrollment: 'Enrollment',
      member_since: 'Member since',
      edit_profile: 'Edit Profile',
      total_loans: 'Total Loans',
      loan_history: 'Loan History',
      returned_at: 'Returned on',
      pending: 'Pending',
      no_loans: 'No loans recorded yet.',
      edit_profile_title: 'Edit Profile Data',
      new_password_placeholder: 'New Password (leave blank to keep)',
      save_changes: 'Save Changes',
      ENGINEERING: 'Engineering',
      SCIENCE: 'Science',
      LITERATURE: 'Literature',
      HISTORY: 'History',
      PHILOSOPHY: 'Philosophy',
      ARTS: 'Arts',
      TECHNOLOGY: 'Technology',
      MATHEMATICS: 'Mathematics',
      LAW: 'Law',
      MEDICINE: 'Medicine',
      OTHER: 'Other',
      loans_subtitle: 'Management and control of book loans',
      search_book_user: 'Search by book or user',
      search_book: 'Search by book',
      type_to_search: 'Type to search...',
      search_book_placeholder: 'Search by book...',
      filter_status: 'Filter by Status',
      all_status: 'All statuses',
      loan_date: 'Loan Date',
      effective_date: 'Effective Date',
      no_loans_found_filters: 'No loans found with the selected filters.',
      loan_details: 'Loan Details',
      loan_code: 'Loan Code',
      book_data: 'Book Data',
      book_id: 'Book ID',
      member_data: 'Member Data',
      user_id: 'User ID',
      operation_details: 'Operation Details',
      effective_return_date: 'Effective Return Date',
      open_status: 'Open',
      accepted_by: 'Accepted By',
      renew: 'Renew',
      return: 'Return',
      register_new_loan: 'Register New Loan',
      select_book: 'Select Book',
      select_member: 'Select Member',
      due_date_limit: 'Due Date Limit',
      operator_responsible: 'Responsible Operator',
      confirm_loan: 'Confirm Loan',
      users_subtitle: 'Institution members management',
      edit_member: 'Edit Member',
      register_new_member: 'Register New Member',
      email_institutional: 'Institutional Email',
      cpf_label: 'CPF (11 digits)',
      member_type: 'Member Type',
      save_registration: 'Save Registration',
      STUDENT: 'Student',
      PROFESSOR: 'Professor',
      STAFF: 'Staff',
      audit_subtitle: 'Detailed security and operational system events tracking',
      filter_logs_placeholder: 'Filter logs by action, event, or operator',
      type_to_filter: 'Type to filter...',
      no_audit_logs: 'No audit logs found.',
      login_platform_subtitle: 'Smart Library Platform',
      login_portal_title: 'Access Portal',
      login_portal_subtitle: 'Temporary staging environment. Choose a profile to enter:',
      login_admin_title: 'Enter as Admin',
      login_admin_subtitle: 'Manage book collection, register and return loans, control members, and audit logs.',
      login_user_title: 'Enter as Member',
      login_user_subtitle: 'View available books catalog, check your active loans, and see your profile.',
      login_footer: '© 2026 Smart Library — Staging Prototype',
      'Biblioteca Central': 'Central Library',
      'Biblioteca de Engenharia': 'Engineering Library',
      'Biblioteca de Humanas': 'Humanities Library',
      'Sistema': 'System',
      'Administrador': 'Administrator',
      'Usuário': 'User',
    },
    'es': {
      dashboard: 'Tablero',
      books: 'Libros',
      loans: 'Préstamos',
      users: 'Usuarios',
      audit: 'Auditoría',
      profile: 'Mi Perfil',
      settings: 'Configuraciones',
      logout: 'Salir',
      theme: 'Tema del Panel',
      language: 'Idioma Predeterminado',
      save_settings: 'Guardar Configuraciones',
      notifications: 'Notificaciones',
      email_notif: 'Recibir notificaciones por correo electrónico sobre nuevos movimientos',
      due_notif: 'Alertarme sobre devoluciones cercanas a la fecha de vencimiento',
      alert_freq: 'Frecuencia de Alertas',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      theme_light: 'Tema Claro',
      theme_dark: 'Tema Oscuro',
      search_placeholder: 'Buscar livros, autores, ISBN...',
      my_profile: 'Mi Perfil',
      system: 'Sistema',
      operator: 'Operador',
      actions: 'Acciones',
      active: 'Activo',
      inactive: 'Inactivo',
      new_loan: 'Nuevo Préstamo',
      new_user: 'Nuevo Usuario',
      new_book: 'Nuevo Libro',
      edit_book: 'Editar Libro',
      save: 'Guardar',
      cancel: 'Cancelar',
      title: 'Título',
      author: 'Autor',
      publisher: 'Editorial',
      year: 'Año',
      category: 'Categoría',
      copies: 'Ejemplares',
      library: 'Biblioteca',
      description: 'Descripción',
      book: 'Libro',
      user: 'Usuario',
      date: 'Fecha',
      due_date: 'Devolución',
      status: 'Estado',
      dashboard_subtitle: 'Descripción general del sistema de biblioteca',
      dashboard_user_subtitle: 'Mi panel personal de lector',
      recent_loans: 'Préstamos Recientes',
      recent_loans_user: 'Mis Préstamos Recientes',
      popular_categories: 'Categorías Populares',
      recommended_books: 'Libros Recomendados',
      recent_activities: 'Actividades Recientes (Auditoría)',
      recent_activities_user: 'Mis Actividades Recientes',
      status_summary: 'Resumen de Estado General',
      status_summary_user: 'Resumen de Estado Personal',
      total_books: 'Total de Libros',
      registered_users: 'Usuarios Registrados',
      active_loans: 'Préstamos Activos',
      active_loans_user: 'Mis Préstamos Activos',
      overdue_loans: 'En Atraso',
      overdue_loans_user: 'Mis Libros Atrasados',
      books_read: 'Libros Leídos',
      next_due: 'Próximo Vencimiento',
      available: 'Disponible',
      no_recommendations: 'Ninguna recomendación disponible en este momento.',
      no_activities: 'Ninguna actividad registrada.',
      no_categories: 'Ninguna categoría registrada.',
      books_unit: 'libro(s)',
      active_units: 'activos',
      overdue_units: 'atrasados',
      available_books: 'Libros Disponibles en Stock',
      read_books: 'Libros Leídos y Devueltos',
      available_unit: 'disp.',
      read_units: 'leídos',
      library_central: 'Biblioteca Central',
      library_address: 'Bloque A, Planta Baja',
      visual_language: 'Visual e Idioma',
      settings_subtitle: 'Personalice su experiencia en Smart Library',
      main_menu: 'MENÚ PRINCIPAL',
      account: 'CUENTA',
      books_subtitle: 'Colección completa de la biblioteca',
      available_units: 'disponible(s)',
      unavailable: 'No disponible',
      request: 'Solicitar',
      no_books_found: 'No se encontraron libros.',
      enrollment: 'Matrícula',
      member_since: 'Miembro desde',
      edit_profile: 'Editar Perfil',
      total_loans: 'Total de Préstamos',
      loan_history: 'Historial de Préstamos',
      returned_at: 'Devuelto el',
      pending: 'Pendiente',
      no_loans: 'Ningún préstamo registrado aún.',
      edit_profile_title: 'Editar Datos del Perfil',
      new_password_placeholder: 'Nueva Contraseña (dejar en blanco para conservar)',
      save_changes: 'Guardar Cambios',
      ENGINEERING: 'Ingeniería',
      SCIENCE: 'Ciencias',
      LITERATURE: 'Literatura',
      HISTORY: 'Historia',
      PHILOSOPHY: 'Filosofía',
      ARTS: 'Artes',
      TECHNOLOGY: 'Tecnología',
      MATHEMATICS: 'Matemáticas',
      LAW: 'Derecho',
      MEDICINE: 'Medicina',
      OTHER: 'Otros',
      loans_subtitle: 'Gestión y control de préstamos de libros',
      search_book_user: 'Buscar por libro o usuario',
      search_book: 'Buscar por libro',
      type_to_search: 'Escriba para buscar...',
      search_book_placeholder: 'Buscar por libro...',
      filter_status: 'Filtrar por Estado',
      all_status: 'Todos los estados',
      loan_date: 'Fecha del Préstamo',
      effective_date: 'Fecha Efectiva',
      no_loans_found_filters: 'No se encontraron préstamos con los filtros seleccionados.',
      loan_details: 'Detalles del Préstamo',
      loan_code: 'Código del Préstamo',
      book_data: 'Datos del Libro',
      book_id: 'ID del Libro',
      member_data: 'Datos del Miembro',
      user_id: 'ID del Usuario',
      operation_details: 'Detalles de la Operación',
      effective_return_date: 'Fecha Efectiva de Devolución',
      open_status: 'En abierto',
      accepted_by: 'Aceptado Por',
      renew: 'Renovar',
      return: 'Devolver',
      register_new_loan: 'Registrar Nuevo Préstamo',
      select_book: 'Seleccionar Libro',
      select_member: 'Seleccionar Miembro',
      due_date_limit: 'Fecha Límite de Devolución',
      operator_responsible: 'Operador Responsable',
      confirm_loan: 'Confirmar Préstamo',
      users_subtitle: 'Gestión de miembros de la institución',
      edit_member: 'Editar Miembro',
      register_new_member: 'Registrar Nuevo Miembro',
      email_institutional: 'Correo Institucional',
      cpf_label: 'CPF (11 dígitos)',
      member_type: 'Tipo de Miembro',
      save_registration: 'Guardar Registro',
      STUDENT: 'Estudiante',
      PROFESSOR: 'Profesor',
      STAFF: 'Empleado',
      audit_subtitle: 'Rastreo detallado de seguridad y eventos operativos del sistema',
      filter_logs_placeholder: 'Filtrar registros por acción, evento u operador',
      type_to_filter: 'Escriba para filtrar...',
      no_audit_logs: 'Ninguna actividad registrada.',
      login_platform_subtitle: 'Plataforma Inteligente de Biblioteca',
      login_portal_title: 'Portal de Acceso',
      login_portal_subtitle: 'Ambiente temporal de homologación. Elija un perfil para ingresar:',
      login_admin_title: 'Ingresar como Administrador',
      login_admin_subtitle: 'Administre la colección de libros, registre y devuelva préstamos, controle miembros y audite registros.',
      login_user_title: 'Ingresar como Miembro',
      login_user_subtitle: 'Visualice el catálogo de livros disponibles, consulte sus préstamos activos y vea su perfil.',
      login_footer: '© 2026 Smart Library — Prototipo de Homologação',
      'Biblioteca Central': 'Biblioteca Central',
      'Biblioteca de Engenharia': 'Biblioteca de Ingeniería',
      'Biblioteca de Humanas': 'Biblioteca de Humanidades',
      'Sistema': 'Sistema',
      'Administrador': 'Administrador',
      'Usuário': 'Usuario',
    },
  };

  translate(key: string): string {
    const lang = this.currentLang();
    return this.translations[lang]?.[key] || key;
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    localStorage.setItem('language', lang);
  }

  translateLog(action: string): string {
    const lang = this.currentLang();
    if (lang === 'pt-BR') return action;

    if (action === 'Sistema iniciado com sucesso.') {
      return lang === 'en' ? 'System started successfully.' : 'Sistema iniciado con éxito.';
    }

    let match = action.match(/Empréstimo realizado: Livro (.+?) para Usuário (.+)/);
    if (match) {
      const book = match[1];
      const user = match[2];
      return lang === 'en'
        ? `Loan registered: Book "${book}" for User ${user}`
        : `Préstamo registrado: Libro "${book}" para Usuario ${user}`;
    }

    match = action.match(/Livro "(.+?)" retirado pelo usuário (.+)\./);
    if (match) {
      const book = match[1];
      const user = match[2];
      return lang === 'en'
        ? `Book "${book}" borrowed by user ${user}.`
        : `Libro "${book}" retirado por el usuario ${user}.`;
    }

    match = action.match(/Empréstimo #(\d+) devolvido pelo usuário (.+)\./);
    if (match) {
      const id = match[1];
      const user = match[2];
      return lang === 'en'
        ? `Loan #${id} returned by user ${user}.`
        : `Préstamo #${id} devuelto por el usuario ${user}.`;
    }

    match = action.match(/Empréstimo #(\d+) devolvido\./);
    if (match) {
      const id = match[1];
      return lang === 'en' ? `Loan #${id} returned.` : `Préstamo #${id} devuelto.`;
    }

    match = action.match(/Membro cadastrado: (.+?) \(CPF: (\d+)\)/);
    if (match) {
      const name = match[1];
      const cpf = match[2];
      return lang === 'en'
        ? `Member registered: ${name} (CPF: ${cpf})`
        : `Miembro registrado: ${name} (CPF: ${cpf})`;
    }

    match = action.match(/Perfil de membro atualizado: CPF (\d+)/);
    if (match) {
      const cpf = match[1];
      return lang === 'en'
        ? `Member profile updated: CPF ${cpf}`
        : `Perfil de miembro actualizado: CPF ${cpf}`;
    }

    match = action.match(/Membro bloqueado: CPF (\d+)/);
    if (match) {
      const cpf = match[1];
      return lang === 'en' ? `Member blocked: CPF ${cpf}` : `Miembro bloqueado: CPF ${cpf}`;
    }

    match = action.match(/Membro desbloqueado: CPF (\d+)/);
    if (match) {
      const cpf = match[1];
      return lang === 'en' ? `Member unblocked: CPF ${cpf}` : `Miembro desbloqueado: CPF ${cpf}`;
    }

    match = action.match(/Livro "(.+?)" cadastrado no acervo\./);
    if (match) {
      const book = match[1];
      return lang === 'en'
        ? `Book "${book}" registered in the collection.`
        : `Libro "${book}" registrado en la colección.`;
    }

    match = action.match(/Empréstimo #(\d+) renovado pelo usuário (.+)\./);
    if (match) {
      const id = match[1];
      const user = match[2];
      return lang === 'en'
        ? `Loan #${id} renewed by user ${user}.`
        : `Préstamo #${id} renovado por el usuario ${user}.`;
    }

    match = action.match(/Livro devolvido: Empréstimo ID (\d+)/);
    if (match) {
      const id = match[1];
      return lang === 'en' ? `Book returned: Loan ID ${id}` : `Libro devuelto: Préstamo ID ${id}`;
    }

    match = action.match(/Empréstimo renovado: ID (\d+) \(Nova data: ([\d-]+)\)/);
    if (match) {
      const id = match[1];
      const date = match[2];
      return lang === 'en'
        ? `Loan renewed: ID ${id} (New date: ${date})`
        : `Préstamo renovado: ID ${id} (Nueva fecha: ${date})`;
    }

    return action;
  }
}
