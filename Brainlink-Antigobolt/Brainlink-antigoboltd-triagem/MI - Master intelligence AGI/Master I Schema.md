
Vou descrever a estrutura completa e detalhada do aplicativo finalizado, sem omitir nenhum componente ou módulo. Esta será a estrutura completa da aplicação quando estiver finalizada.

# Estrutura Completa da Aplicação

## Estrutura de Diretórios e Arquivos

### Raiz do Projeto

/
├── public/                    # Recursos estáticos
│   ├── favicon.ico           # Ícone do site
│   ├── robots.txt            # Configurações para crawlers
│   ├── manifest.json         # Manifest para PWA
│   └── assets/               # Outros assets estáticos
│       ├── images/           # Imagens públicas
│       └── fonts/            # Fontes customizadas
│
├── src/                       # Código-fonte da aplicação
│   ├── components/           # Componentes React
│   ├── hooks/                # Hooks personalizados
│   ├── services/             # Serviços e lógica de negócios
│   ├── pages/                # Páginas da aplicação
│   ├── store/                # Gerenciamento de estado
│   ├── utils/                # Utilitários
│   ├── types/                # Definições de tipos
│   ├── styles/               # Estilos globais
│   ├── lib/                  # Bibliotecas e utilitários
│   ├── integrations/         # Integrações com serviços externos
│   ├── config/               # Arquivos de configuração
│   ├── constants/            # Constantes da aplicação
│   ├── contexts/             # Contextos React
│   ├── plugins/              # Plugins da aplicação
│   ├── App.tsx               # Componente principal
│   └── main.tsx              # Ponto de entrada
│
├── supabase/                  # Código Supabase
│   ├── functions/            # Edge Functions
│   └── config.toml           # Configuração do Supabase
│
├── tests/                     # Testes
│   ├── unit/                 # Testes unitários
│   ├── integration/          # Testes de integração
│   └── e2e/                  # Testes end-to-end
│
├── docs/                      # Documentação
│   ├── API.md                # Documentação da API
│   └── ARCHITECTURE.md       # Documentação da arquitetura
│
├── .env.example              # Exemplo de variáveis de ambiente
├── tsconfig.json             # Configuração do TypeScript
├── vite.config.ts            # Configuração do Vite
├── tailwind.config.js        # Configuração do Tailwind CSS
├── package.json              # Dependências e scripts
└── README.md                 # Documentação principal

### Estrutura Detalhada dos Componentes (src/components/)

src/components/
├── ui/                        # Componentes de UI básicos
│   ├── accordion.tsx         # Componente de acordeão
│   ├── alert-dialog.tsx      # Diálogo de alerta
│   ├── alert.tsx             # Alerta informativo
│   ├── aspect-ratio.tsx      # Controle de proporção
│   ├── avatar.tsx            # Avatar de usuário
│   ├── badge.tsx             # Badge/etiqueta
│   ├── breadcrumb.tsx        # Navegação breadcrumb
│   ├── button.tsx            # Botão
│   ├── calendar.tsx          # Calendário
│   ├── card.tsx              # Card
│   ├── carousel.tsx          # Carrossel
│   ├── chart.tsx             # Componente de gráfico
│   ├── checkbox.tsx          # Checkbox
│   ├── collapsible.tsx       # Elemento colapsável
│   ├── command.tsx           # Interface de comando
│   ├── context-menu.tsx      # Menu de contexto
│   ├── dialog.tsx            # Diálogo modal
│   ├── drawer.tsx            # Gaveta lateral
│   ├── dropdown-menu.tsx     # Menu dropdown
│   ├── form.tsx              # Formulário
│   ├── hover-card.tsx        # Card de hover
│   ├── input-otp.tsx         # Entrada OTP
│   ├── input.tsx             # Campo de entrada
│   ├── label.tsx             # Rótulo
│   ├── menubar.tsx           # Barra de menu
│   ├── navigation-menu.tsx   # Menu de navegação
│   ├── pagination.tsx        # Paginação
│   ├── popover.tsx           # Popover
│   ├── progress.tsx          # Barra de progresso
│   ├── radio-group.tsx       # Grupo de radio
│   ├── resizable.tsx         # Elemento redimensionável
│   ├── scroll-area.tsx       # Área de rolagem
│   ├── select.tsx            # Seletor
│   ├── separator.tsx         # Separador
│   ├── sheet.tsx             # Sheet/modal lateral
│   ├── sidebar.tsx           # Barra lateral
│   ├── skeleton.tsx          # Esqueleto de carregamento
│   ├── slider.tsx            # Controle deslizante
│   ├── sonner.tsx            # Notificações Sonner
│   ├── switch.tsx            # Interruptor
│   ├── table.tsx             # Tabela
│   ├── tabs.tsx              # Abas
│   ├── textarea.tsx          # Área de texto
│   ├── toast.tsx             # Toast notifications
│   ├── toaster.tsx           # Gerenciador de toasts
│   ├── toggle-group.tsx      # Grupo de alternância
│   ├── toggle.tsx            # Alternador
│   ├── tooltip.tsx           # Tooltip
│   └── use-toast.ts          # Hook para toasts
│
├── layout/                    # Componentes de layout
│   ├── Layout.tsx            # Layout principal
│   ├── Header.tsx            # Cabeçalho
│   ├── Sidebar.tsx           # Barra lateral
│   ├── Footer.tsx            # Rodapé
│   ├── Breadcrumb.tsx        # Navegação breadcrumb
│   ├── MainMenu.tsx          # Menu principal
│   ├── SearchBar.tsx         # Barra de pesquisa
│   ├── UserMenu.tsx          # Menu do usuário
│   ├── ThemeToggle.tsx       # Alternar tema
│   ├── EditorLayout.tsx      # Layout para editor
│   ├── EditorStats.tsx       # Estatísticas do editor
│   ├── Logo.tsx              # Logo do aplicativo
│   └── StatusInfo.tsx        # Informações de status
│
├── file-explorer/             # Explorador de arquivos
│   ├── FileExplorer.tsx      # Explorador de arquivos
│   ├── FileTree.tsx          # Árvore de arquivos
│   ├── FolderItem.tsx        # Item de pasta
│   ├── FileItem.tsx          # Item de arquivo
│   ├── FileActions.tsx       # Ações de arquivo
│   ├── SearchFiles.tsx       # Pesquisa de arquivos
│   ├── ContextMenu.tsx       # Menu de contexto
│   ├── FileDetails.tsx       # Detalhes do arquivo
│   └── FileTreeItem.tsx      # Item da árvore de arquivos
│
├── editor/                    # Editor de markdown/código
│   ├── EditorPane.tsx        # Painel do editor
│   ├── EditorToolbar.tsx     # Barra de ferramentas
│   ├── PreviewPane.tsx       # Painel de visualização
│   ├── EditorSettings.tsx    # Configurações do editor
│   ├── EditorShortcuts.tsx   # Atalhos do editor
│   ├── MarkdownControls.tsx  # Controles de markdown
│   ├── CodeBlock.tsx         # Bloco de código
│   ├── SyntaxHighlighter.tsx # Destaque de sintaxe
│   └── EditorStats.tsx       # Estatísticas do editor
│
├── markdown-editor/           # Editor específico de markdown
│   ├── MarkdownEditor.tsx    # Editor principal de markdown
│   ├── Toolbar.tsx           # Barra de ferramentas específica
│   ├── Preview.tsx           # Visualização de markdown
│   ├── LinkDialog.tsx        # Diálogo para criação de links
│   ├── ImageDialog.tsx       # Diálogo para inserção de imagens
│   ├── TableGenerator.tsx    # Gerador de tabelas
│   ├── FormatButtons.tsx     # Botões de formatação
│   └── MarkdownShortcuts.tsx # Atalhos de markdown
│
├── document/                  # Componentes de documento
│   ├── DocumentInputCard.tsx        # Card de entrada de documento
│   ├── DocumentProcessorPanel.tsx   # Painel de processamento
│   ├── AnalysisTab.tsx              # Aba de análise
│   ├── StructureTab.tsx             # Aba de estrutura
│   ├── ValidationTab.tsx            # Aba de validação
│   ├── SuggestionsTab.tsx           # Aba de sugestões
│   ├── EmptyProcessorState.tsx      # Estado vazio do processador
│   ├── ProcessingProgress.tsx       # Progresso de processamento
│   ├── DocumentViewer.tsx           # Visualizador de documento
│   ├── DocumentTree.tsx             # Árvore de documento
│   ├── DocumentVersions.tsx         # Versões do documento
│   └── DocumentExport.tsx           # Exportação de documento
│
├── knowledge/                 # Componentes de gestão de conhecimento
│   ├── KnowledgePanel.tsx           # Painel de conhecimento
│   ├── CustomKnowledgeManager.tsx   # Gerenciador de conhecimento
│   ├── CustomPropertiesManager.tsx  # Gerenciador de propriedades
│   ├── PropertySchemaManager.tsx    # Gerenciador de esquema
│   ├── SchemaManagementPanel.tsx    # Painel de gestão de esquema
│   ├── DocumentProcessor.tsx        # Processador de documento
│   ├── EmptyState.tsx               # Estado vazio
│   ├── LoadingState.tsx             # Estado de carregamento
│   ├── properties/                  # Componentes de propriedades
│   │   ├── PropertyControls.tsx     # Controles de propriedade
│   │   ├── PropertyForm.tsx         # Formulário de propriedade
│   │   ├── PropertyItem.tsx         # Item de propriedade
│   │   └── PropertyList.tsx         # Lista de propriedades
│   └── tabs/                        # Abas do painel de conhecimento
│       ├── DetailsTab.tsx           # Aba de detalhes
│       ├── OverviewTab.tsx          # Aba de visão geral
│       ├── PropertiesTab.tsx        # Aba de propriedades
│       └── TabsContainer.tsx        # Contêiner de abas
│
├── llm/                       # Componentes de LLM
│   ├── LLMConfig.tsx                # Configuração de LLM
│   ├── LLMMonitoring.tsx            # Monitoramento de LLM
│   ├── LLMPipelinesManager.tsx      # Gerenciador de pipelines
│   ├── LLMProviderForm.tsx          # Formulário de provedor
│   ├── ProviderForm.tsx             # Formulário de provedor
│   ├── ProviderList.tsx             # Lista de provedores
│   ├── config/                      # Componentes de configuração
│   │   ├── LLMConfigHeader.tsx      # Cabeçalho de configuração
│   │   ├── LLMConfigTabs.tsx        # Abas de configuração
│   │   ├── LLMProvidersTab.tsx      # Aba de provedores
│   │   └── index.ts                 # Exportações
│   ├── monitoring/                  # Componentes de monitoramento
│   │   ├── LLMMonitoringHeader.tsx  # Cabeçalho de monitoramento
│   │   ├── LLMMonitoringTabs.tsx    # Abas de monitoramento
│   │   ├── MetricsCards.tsx         # Cards de métricas
│   │   ├── PerformanceChart.tsx     # Gráfico de desempenho
│   │   ├── TimelineChart.tsx        # Gráfico de linha do tempo
│   │   ├── UsageChart.tsx           # Gráfico de uso
│   │   └── index.ts                 # Exportações
│   ├── pipelines/                   # Componentes de pipeline
│   │   ├── LLMPipelinesManager.tsx  # Gerenciador de pipelines
│   │   ├── PipelineDetails.tsx      # Detalhes do pipeline
│   │   ├── PipelineStep.tsx         # Etapa do pipeline
│   │   ├── PipelineStepsList.tsx    # Lista de etapas
│   │   ├── PipelineTester.tsx       # Testador de pipeline
│   │   ├── PipelinesList.tsx        # Lista de pipelines
│   │   └── index.ts                 # Exportações
│   ├── provider-form/               # Formulários de provedor
│   │   ├── ApiConfigFields.tsx      # Campos de configuração de API
│   │   ├── BasicInfoFields.tsx      # Campos de informação básica
│   │   ├── CapabilitiesSection.tsx  # Seção de capacidades
│   │   ├── LLMProviderFormHeader.tsx # Cabeçalho do formulário
│   │   ├── ModelsField.tsx          # Campo de modelos
│   │   ├── ParametersSection.tsx    # Seção de parâmetros
│   │   └── index.ts                 # Exportações
│   └── index.ts                     # Exportações do módulo LLM
│
├── agents/                    # Componentes de agentes IA
│   ├── ActivityLog.tsx              # Log de atividade
│   ├── AgentCard.tsx                # Card de agente
│   ├── AgentControlPanel.tsx        # Painel de controle
│   ├── MetricsCharts.tsx            # Gráficos de métricas
│   ├── MetricsPanel.tsx             # Painel de métricas
│   ├── AgentForm.tsx                # Formulário de agente
│   ├── AgentList.tsx                # Lista de agentes
│   ├── AgentDetails.tsx             # Detalhes do agente
│   ├── AgentExecutor.tsx            # Executor de agente
│   └── AgentSettings.tsx            # Configurações de agente
│
├── connections/               # Componentes de conexões externas
│   ├── ConnectionCard.tsx           # Card de conexão
│   ├── ConnectionsList.tsx          # Lista de conexões
│   ├── ConnectionForm.tsx           # Formulário de conexão
│   ├── ConnectionDialogs.tsx        # Diálogos de conexão
│   ├── types.ts                     # Tipos de conexão
│   ├── form/                        # Componentes de formulário
│   │   ├── ActiveToggle.tsx         # Alternador de ativação
│   │   ├── ConnectionNameField.tsx  # Campo de nome
│   │   ├── CredentialFields.tsx     # Campos de credenciais
│   │   ├── FormActions.tsx          # Ações de formulário
│   │   ├── FormHeader.tsx           # Cabeçalho de formulário
│   │   ├── FormSection.tsx          # Seção de formulário
│   │   ├── ProviderSelector.tsx     # Seletor de provedor
│   │   ├── ServiceSelector.tsx      # Seletor de serviço
│   │   ├── StatusIndicator.tsx      # Indicador de status
│   │   ├── TestConnection.tsx       # Teste de conexão
│   │   └── index.ts                 # Exportações
│   └── index.ts                     # Exportações do módulo de conexões
│
├── explorer/                  # Explorador de arquivos
│   ├── FileExplorer.tsx             # Explorador de arquivos
│   └── FileTreeItem.tsx             # Item da árvore de arquivos
│
├── generator/                 # Geradores de conteúdo
│   ├── PromptGenerator.tsx          # Gerador de prompts
│   ├── CodeGenerator.tsx            # Gerador de código
│   ├── DocumentGenerator.tsx        # Gerador de documentos
│   └── TemplateSelector.tsx         # Seletor de templates
│
├── media/                     # Componentes de mídia
│   ├── MediaStatistics.tsx          # Estatísticas de mídia
│   ├── ProcessingMetrics.tsx        # Métricas de processamento
│   ├── MediaPlayer.tsx              # Player de mídia
│   ├── MediaViewer.tsx              # Visualizador de mídia
│   ├── metrics/                     # Componentes de métricas
│   │   ├── MetricCard.tsx           # Card de métrica
│   │   └── TypeSpecificMetrics.tsx  # Métricas específicas
│   └── statistics/                  # Componentes de estatísticas
│       ├── BarChart.tsx             # Gráfico de barras
│       ├── MediaTypeDetails.tsx     # Detalhes do tipo de mídia
│       ├── PieChart.tsx             # Gráfico de pizza
│       ├── RadarChart.tsx           # Gráfico de radar
│       ├── ScoreCard.tsx            # Card de pontuação
│       └── TimeCard.tsx             # Card de tempo
│
├── upload/                    # Componentes de upload
│   ├── MediaUploader.tsx            # Uploader de mídia
│   ├── UploadArea.tsx               # Área de upload
│   ├── components/                  # Subcomponentes
│   │   ├── DropzoneContent.tsx      # Conteúdo da dropzone
│   │   ├── FilePreview.tsx          # Visualização de arquivo
│   │   └── MediaUploaderActions.tsx # Ações do uploader
│   ├── hooks/                       # Hooks relacionados
│   │   └── useFileUpload.ts         # Hook de upload de arquivo
│   └── utils/                       # Utilitários
│       └── mediaTypeUtils.ts        # Utilitários de tipo de mídia
│
├── viewer/                    # Visualizadores
│   └── DocumentViewer.tsx           # Visualizador de documento
│
└── theme-provider.tsx         # Provedor de tema

### Estrutura Detalhada dos Hooks (src/hooks/)

src/hooks/
├── llm/                      # Hooks relacionados a LLMs
│   ├── index.ts              # Exportações
│   ├── llmServiceInstance.ts # Instância do serviço LLM
│   ├── useCompletions.ts     # Gerenciamento de completions
│   ├── useLLM.ts             # Hook principal de LLM
│   ├── usePipelines.ts       # Gerenciamento de pipelines
│   ├── useProviderManagement.ts # Gerenciamento de provedores
│   └── useProviderStats.ts   # Estatísticas de provedores
│
├── connections/              # Hooks de conexões
│   ├── index.ts              # Exportações
│   ├── useConnectionActions.ts # Ações de conexão
│   ├── useConnectionForm.ts  # Formulário de conexão
│   ├── useConnectionQueries.ts # Queries de conexão
│   ├── useConnectionState.ts # Estado de conexão
│   └── useConnections.ts     # Hook principal de conexões
│
├── media/                    # Hooks de mídia
│   ├── useAudioProcessor.ts  # Processador de áudio
│   ├── useImageProcessor.ts  # Processador de imagem
│   ├── useVideoProcessor.ts  # Processador de vídeo
│   └── useMediaProcessor.ts  # Processador de mídia geral
│
├── search/                   # Hooks de busca
│   ├── useCombinedSearch.ts  # Busca combinada
│   ├── useDocumentSearch.ts  # Busca de documentos
│   ├── usePropertySearch.ts  # Busca de propriedades
│   ├── usePropertySearchOperations.ts # Operações de busca de propriedades
│   ├── useSearchOperations.ts # Operações de busca
│   ├── useSearchResults.ts   # Resultados de busca
│   ├── useSearchState.ts     # Estado de busca
│   ├── useSearchUtils.ts     # Utilitários de busca
│   ├── useTextSearch.ts      # Busca de texto
│   ├── useTextSearchOperations.ts # Operações de busca de texto
│   └── useUnifiedSearch.ts   # Busca unificada
│
├── file/                     # Hooks de arquivo
│   ├── useFileOperations.ts  # Operações de arquivo
│   ├── useFileUpload.ts      # Upload de arquivo
│   └── useFileSystem.ts      # Sistema de arquivos
│
├── document/                 # Hooks de documento
│   ├── useDocumentHandlers.ts # Manipuladores de documento
│   ├── useDocumentProcessing.ts # Processamento de documento
│   ├── useDocumentProcessor.ts # Processador de documento
│   └── useDocumentSearch.ts  # Busca de documento
│
├── knowledge/                # Hooks de conhecimento
│   ├── useCustomKnowledge.ts # Conhecimento personalizado
│   ├── useKnowledgeService.ts # Serviço de conhecimento
│   ├── usePropertyHandlers.ts # Manipuladores de propriedade
│   ├── usePropertyManagement.ts # Gerenciamento de propriedades
│   └── usePropertySchemas.ts # Esquemas de propriedade
│
├── ui/                       # Hooks de UI
│   ├── use-mobile.tsx        # Detecção de dispositivo móvel
│   ├── use-toast.ts          # Toast notifications
│   ├── useTheme.ts           # Gerenciamento de tema
│   └── useModal.ts           # Gerenciamento de modal
│
├── auth/                     # Hooks de autenticação
│   ├── useAuth.ts            # Autenticação principal
│   └── usePermissions.ts     # Permissões
│
└── common/                   # Hooks comuns
    ├── useDebounce.ts        # Debounce para inputs
    ├── useLocalStorage.ts    # Persistência em localStorage
    ├── useOnClickOutside.ts  # Detecção de clique fora
    └── useWindowSize.ts      # Dimensões da janela

### Estrutura Detalhada dos Serviços (src/services/)

src/services/
├── agent/                    # Serviços de agente
│   ├── AgentService.ts       # Serviço principal de agente
│   ├── LLM.ts                # Interface com LLM
│   ├── TaskManager.ts        # Gerenciador de tarefas
│   └── __tests__/            # Testes
│       └── TaskManager.test.ts # Teste do gerenciador de tarefas
│
├── ai/                       # Serviços de IA
│   ├── OpenAIService.ts      # Serviço OpenAI
│   ├── AnthropicService.ts   # Serviço Anthropic
│   └── GoogleAIService.ts    # Serviço Google AI
│
├── cache/                    # Serviços de cache
│   └── CacheService.ts       # Serviço de cache
│
├── connections/              # Serviços de conexões
│   ├── index.ts              # Exportações
│   ├── ConnectionService.ts  # Serviço principal
│   ├── modificationService.ts # Serviço de modificação
│   ├── retrievalService.ts   # Serviço de recuperação
│   ├── types.ts              # Tipos
│   └── utils.ts              # Utilitários
│
├── document/                 # Serviços de documento
│   ├── DocumentProcessor.ts  # Processador de documento
│   ├── DocumentStructureService.ts # Serviço de estrutura
│   ├── DocumentValidationService.ts # Serviço de validação
│   └── SuggestionService.ts  # Serviço de sugestões
│
├── knowledge/                # Serviços de conhecimento
│   ├── KnowledgeService.ts   # Serviço principal
│   ├── analyzers/            # Analisadores
│   │   └── ContentAnalyzer.ts # Analisador de conteúdo
│   ├── extractors/           # Extratores
│   │   └── KnowledgeExtractor.ts # Extrator de conhecimento
│   ├── generators/           # Geradores
│   │   ├── MetadataGenerator.ts # Gerador de metadados
│   │   ├── PromptGenerator.ts # Gerador de prompts
│   │   ├── StructureGenerator.ts # Gerador de estrutura
│   │   ├── analyzers/        # Analisadores de geração
│   │   │   └── ComplexityAnalyzer.ts # Analisador de complexidade
│   │   ├── extractors/       # Extratores de geração
│   │   │   └── SummaryExtractor.ts # Extrator de resumo
│   │   ├── interfaces/       # Interfaces de geração
│   │   │   └── TokenInterfaces.ts # Interfaces de token
│   │   └── utils/            # Utilitários de geração
│   │       └── metadataUtils.ts # Utilitários de metadados
│   └── validators/           # Validadores
│       └── OutputValidator.ts # Validador de saída
│
├── llm/                      # Serviço de LLM
│   └── LLMService.ts         # Serviço principal de LLM
│
├── markdown/                 # Serviços de markdown
│   └── MarkdownProcessor.ts  # Processador de markdown
│
├── media/                    # Serviços de mídia
│   ├── AudioProcessor.ts     # Processador de áudio
│   ├── BaseMediaProcessor.ts # Processador base
│   ├── ImageProcessor.ts     # Processador de imagem
│   ├── MediaProcessor.ts     # Processador de mídia
│   ├── MediaRecordService.ts # Serviço de gravação
│   ├── VideoProcessor.ts     # Processador de vídeo
│   └── __tests__/            # Testes
│       └── MediaProcessor.test.ts # Teste do processador
│
├── messaging/                # Serviços de mensagens
│   ├── MessageBus.ts         # Barramento de mensagens
│   └── __tests__/            # Testes
│       └── MessageBus.test.ts # Teste do barramento
│
└── monitoring/               # Serviços de monitoramento
    └── MonitoringService.ts  # Serviço de monitoramento

### Estrutura Detalhada das Páginas (src/pages/)

src/pages/
├── Home.tsx                  # Página inicial
├── Index.tsx                 # Página de índice
├── NotFound.tsx              # Página 404
├── _app.tsx                  # App principal
├── Agents.tsx                # Página de agentes
├── ConnectionsPage.tsx       # Página de conexões
├── Demo.tsx                  # Página de demonstração
├── LLMManagerPage.tsx        # Gerenciador de LLM
├── MediaProcessorPage.tsx    # Processador de mídia
├── documents.tsx             # Página de documentos
├── markdown-editor.tsx       # Editor de markdown
├── media.tsx                 # Página de mídia
├── metrics.tsx               # Página de métricas
└── dashboard/                # Páginas de dashboard
    ├── index.tsx             # Dashboard principal
    ├── analytics.tsx         # Análises
    └── settings.tsx          # Configurações

### Estrutura Detalhada dos Tipos (src/types/)

src/types/
├── agent.ts                  # Tipos de agente
├── file.ts                   # Tipos de arquivo
├── knowledge.ts              # Tipos de conhecimento
├── llm.ts                    # Tipos de LLM
├── media.ts                  # Tipos de mídia
├── plugin.ts                 # Tipos de plugin
├── task.ts                   # Tipos de tarefa
├── react-beautiful-dnd.d.ts  # Definições para react-beautiful-dnd
└── ui.ts                     # Tipos de UI

### Estrutura da Loja de Estado (src/store/)

src/store/
├── editorStore.ts            # Estado do editor
├── fileStore/                # Estado de arquivos
│   ├── fileOperations.ts     # Operações de arquivo
│   ├── fileStore.ts          # Estado principal
│   ├── index.ts              # Exportações
│   └── types.ts              # Tipos
├── llmStore.ts               # Estado de LLM
├── documentStore.ts          # Estado de documentos
├── userStore.ts              # Estado do usuário
├── knowledgeStore.ts         # Estado de conhecimento
└── themeStore.ts             # Estado do tema

### Estrutura das Edge Functions Supabase (supabase/functions/)

supabase/functions/
├── knowledge-pipeline/       # Pipeline de conhecimento
│   └── index.ts              # Função principal
├── knowledge-processor/      # Processador de conhecimento
│   └── index.ts              # Função principal
├── process-media/            # Processamento de mídia
│   ├── index.ts              # Função principal
│   ├── types/                # Tipos
│   │   └── media.ts          # Tipos de mídia
│   ├── services/             # Serviços
│   │   ├── audio-service.ts  # Serviço de áudio
│   │   ├── category-service.ts # Serviço de categoria
│   │   ├── image-service.ts  # Serviço de imagem
│   │   ├── insights-service.ts # Serviço de insights
│   │   ├── media-service.ts  # Serviço de mídia
│   │   ├── openai-service.ts # Serviço OpenAI
│   │   └── video-service.ts  # Serviço de vídeo
│   └── utils/                # Utilitários
│       └── cors.ts           # Utilitários CORS
├── process-text/             # Processamento de texto
│   └── index.ts              # Função principal
└── test-connection/          # Teste de conexão
    └── index.ts              # Função principal

### Estrutura Detalhada de APIs e Modelos de Dados

#### API - Documentos

`// API de Documentos GET    /api/documents                 // Listar documentos POST   /api/documents                 // Criar documento GET    /api/documents/:id             // Obter documento PUT    /api/documents/:id             // Atualizar documento DELETE /api/documents/:id             // Excluir documento POST   /api/documents/:id/process     // Processar documento GET    /api/documents/:id/history     // Histórico de documento // Modelo de Dados - Documento interface Document {   id: string;  title: string;  content: string;  summary?: string;  structure?: DocumentStructure;  metadata: Record<string, any>;  tags: string[];  userId: string;  createdAt: string;  updatedAt: string; } interface DocumentStructure {   sections: Section[];  concepts: Concept[];  relationships: Relationship[]; } interface Section {   id: string;  title: string;  content: string;  level: number;  position: number; } interface Concept {   id: string;  name: string;  description: string;  references: string[]; } interface Relationship {   id: string;  sourceId: string;  targetId: string;  type: string;  description?: string; }`

#### API - LLM

`// API de LLM GET    /api/llm/providers              // Listar provedores POST   /api/llm/providers              // Criar provedor GET    /api/llm/providers/:id          // Obter provedor PUT    /api/llm/providers/:id          // Atualizar provedor DELETE /api/llm/providers/:id          // Excluir provedor POST   /api/llm/complete               // Solicitar completion POST   /api/llm/analyze                // Analisar texto GET    /api/llm/pipelines              // Listar pipelines POST   /api/llm/pipelines              // Criar pipeline GET    /api/llm/pipelines/:id          // Obter pipeline PUT    /api/llm/pipelines/:id          // Atualizar pipeline DELETE /api/llm/pipelines/:id          // Excluir pipeline POST   /api/llm/pipelines/:id/execute  // Executar pipeline // Modelo de Dados - LLM interface LLMProvider {   id: string;  name: string;  provider: string;  apiKeyName: string;  model: string;  capabilities: string[];  parameters: Record<string, any>;  isActive: boolean;  userId: string;  createdAt: string;  updatedAt: string; } interface LLMPipeline {   id: string;  name: string;  description?: string;  steps: PipelineStep[];  userId: string;  createdAt: string;  updatedAt: string; } interface PipelineStep {   id: string;  providerId: string;  role: "input" | "processor" | "output";  order: number;  systemPrompt?: string; } interface ProcessingTemplate {   id: string;  name: string;  description?: string;  category: string;  content: string;  parameters: Record<string, any>;  examples: ProcessingExample[];  userId: string;  createdAt: string;  updatedAt: string; } interface ProcessingExample {   input: string;  output: string;  explanation: string; } interface MetaSystem {   id: string;  name: string;  description?: string;  rules: string[];  constraints: string[];  goals: string[];  userId: string;  createdAt: string;  updatedAt: string; }`

#### API - Mídia

`// API de Mídia POST   /api/media/upload               // Upload de mídia POST   /api/media/process              // Processar mídia GET    /api/media/:id                  // Obter mídia DELETE /api/media/:id                  // Excluir mídia GET    /api/media/statistics           // Estatísticas de mídia // Modelo de Dados - Mídia interface MediaRecord {   id: string;  fileName: string;  fileType: string;  fileSize: number;  mediaType: 'image' | 'audio' | 'video' | 'text' | 'markdown';  processingTime?: number;  status: 'completed' | 'processing' | 'failed';  result?: MediaProcessingResult;  userId: string;  createdAt: string; } interface MediaProcessingResult {   analysis: string;  mediaType: string;  detailLevel: string;  categoryDistribution?: CategoryDistribution;  insights?: MediaInsights;  content?: string;  metadata?: MediaMetadata;  // Propriedades específicas para tipos de mídia  transcript?: string;  sentiment?: 'positive' | 'negative' | 'neutral';  objects?: string[];  tags?: string[];  description?: string; } interface MediaMetadata {   name: string;  size: number;  type: string;  dimensions?: {    width: number;    height: number;  };  format?: string;  duration?: number;  language?: string;  resolution?: string; }`

#### API - Conexões

`// API de Conexões GET    /api/connections                // Listar conexões POST   /api/connections                // Criar conexão GET    /api/connections/:id            // Obter conexão PUT    /api/connections/:id            // Atualizar conexão DELETE /api/connections/:id            // Excluir conexão POST   /api/connections/:id/test       // Testar conexão // Modelo de Dados - Conexões interface Connection {   id: string;  name: string;  provider: string;  service: string;  credentials: Record<string, any>;  isActive: boolean;  userId: string;  createdAt: string;  updatedAt: string; }`

### Estrutura de Testes

tests/
├── unit/                     # Testes unitários
│   ├── components/           # Testes de componentes
│   ├── hooks/                # Testes de hooks
│   ├── services/             # Testes de serviços
│   └── utils/                # Testes de utilitários
├── integration/              # Testes de integração
│   ├── api/                  # Testes de API
│   ├── llm/                  # Testes de LLM
│   └── media/                # Testes de mídia
└── e2e/                      # Testes end-to-end
    ├── document-flow.spec.ts # Fluxo de documentos
    ├── llm-pipeline.spec.ts  # Pipeline de LLM
    └── media-processing.spec.ts # Processamento de mídia

Esta é a estrutura completa e detalhada do aplicativo finalizado, abrangendo todos os módulos, arquivos, APIs e modelos de dados necessários para implementar o sistema de processamento de conhecimento conforme descrito. Não omiti nenhuma parte da estrutura e forneci detalhes sobre cada componente e sua função no sistema.

Vou descrever a estrutura completa e detalhada do aplicativo finalizado, sem omitir nenhum componente ou módulo. Esta será a estrutura completa da aplicação quando estiver finalizada.

# Estrutura Completa da Aplicação

## Estrutura de Diretórios e Arquivos

### Raiz do Projeto

/
├── public/                    # Recursos estáticos
│   ├── favicon.ico           # Ícone do site
│   ├── robots.txt            # Configurações para crawlers
│   ├── manifest.json         # Manifest para PWA
│   └── assets/               # Outros assets estáticos
│       ├── images/           # Imagens públicas
│       └── fonts/            # Fontes customizadas
│
├── src/                       # Código-fonte da aplicação
│   ├── components/           # Componentes React
│   ├── hooks/                # Hooks personalizados
│   ├── services/             # Serviços e lógica de negócios
│   ├── pages/                # Páginas da aplicação
│   ├── store/                # Gerenciamento de estado
│   ├── utils/                # Utilitários
│   ├── types/                # Definições de tipos
│   ├── styles/               # Estilos globais
│   ├── lib/                  # Bibliotecas e utilitários
│   ├── integrations/         # Integrações com serviços externos
│   ├── config/               # Arquivos de configuração
│   ├── constants/            # Constantes da aplicação
│   ├── contexts/             # Contextos React
│   ├── plugins/              # Plugins da aplicação
│   ├── App.tsx               # Componente principal
│   └── main.tsx              # Ponto de entrada
│
├── supabase/                  # Código Supabase
│   ├── functions/            # Edge Functions
│   └── config.toml           # Configuração do Supabase
│
├── tests/                     # Testes
│   ├── unit/                 # Testes unitários
│   ├── integration/          # Testes de integração
│   └── e2e/                  # Testes end-to-end
│
├── docs/                      # Documentação
│   ├── API.md                # Documentação da API
│   └── ARCHITECTURE.md       # Documentação da arquitetura
│
├── .env.example              # Exemplo de variáveis de ambiente
├── tsconfig.json             # Configuração do TypeScript
├── vite.config.ts            # Configuração do Vite
├── tailwind.config.js        # Configuração do Tailwind CSS
├── package.json              # Dependências e scripts
└── README.md                 # Documentação principal

### Estrutura Detalhada dos Componentes (src/components/)

src/components/
├── ui/                        # Componentes de UI básicos
│   ├── accordion.tsx         # Componente de acordeão
│   ├── alert-dialog.tsx      # Diálogo de alerta
│   ├── alert.tsx             # Alerta informativo
│   ├── aspect-ratio.tsx      # Controle de proporção
│   ├── avatar.tsx            # Avatar de usuário
│   ├── badge.tsx             # Badge/etiqueta
│   ├── breadcrumb.tsx        # Navegação breadcrumb
│   ├── button.tsx            # Botão
│   ├── calendar.tsx          # Calendário
│   ├── card.tsx              # Card
│   ├── carousel.tsx          # Carrossel
│   ├── chart.tsx             # Componente de gráfico
│   ├── checkbox.tsx          # Checkbox
│   ├── collapsible.tsx       # Elemento colapsável
│   ├── command.tsx           # Interface de comando
│   ├── context-menu.tsx      # Menu de contexto
│   ├── dialog.tsx            # Diálogo modal
│   ├── drawer.tsx            # Gaveta lateral
│   ├── dropdown-menu.tsx     # Menu dropdown
│   ├── form.tsx              # Formulário
│   ├── hover-card.tsx        # Card de hover
│   ├── input-otp.tsx         # Entrada OTP
│   ├── input.tsx             # Campo de entrada
│   ├── label.tsx             # Rótulo
│   ├── menubar.tsx           # Barra de menu
│   ├── navigation-menu.tsx   # Menu de navegação
│   ├── pagination.tsx        # Paginação
│   ├── popover.tsx           # Popover
│   ├── progress.tsx          # Barra de progresso
│   ├── radio-group.tsx       # Grupo de radio
│   ├── resizable.tsx         # Elemento redimensionável
│   ├── scroll-area.tsx       # Área de rolagem
│   ├── select.tsx            # Seletor
│   ├── separator.tsx         # Separador
│   ├── sheet.tsx             # Sheet/modal lateral
│   ├── sidebar.tsx           # Barra lateral
│   ├── skeleton.tsx          # Esqueleto de carregamento
│   ├── slider.tsx            # Controle deslizante
│   ├── sonner.tsx            # Notificações Sonner
│   ├── switch.tsx            # Interruptor
│   ├── table.tsx             # Tabela
│   ├── tabs.tsx              # Abas
│   ├── textarea.tsx          # Área de texto
│   ├── toast.tsx             # Toast notifications
│   ├── toaster.tsx           # Gerenciador de toasts
│   ├── toggle-group.tsx      # Grupo de alternância
│   ├── toggle.tsx            # Alternador
│   ├── tooltip.tsx           # Tooltip
│   └── use-toast.ts          # Hook para toasts
│
├── layout/                    # Componentes de layout
│   ├── Layout.tsx            # Layout principal
│   ├── Header.tsx            # Cabeçalho
│   ├── Sidebar.tsx           # Barra lateral
│   ├── Footer.tsx            # Rodapé
│   ├── Breadcrumb.tsx        # Navegação breadcrumb
│   ├── MainMenu.tsx          # Menu principal
│   ├── SearchBar.tsx         # Barra de pesquisa
│   ├── UserMenu.tsx          # Menu do usuário
│   ├── ThemeToggle.tsx       # Alternar tema
│   ├── EditorLayout.tsx      # Layout para editor
│   ├── EditorStats.tsx       # Estatísticas do editor
│   ├── Logo.tsx              # Logo do aplicativo
│   └── StatusInfo.tsx        # Informações de status
│
├── file-explorer/             # Explorador de arquivos
│   ├── FileExplorer.tsx      # Explorador de arquivos
│   ├── FileTree.tsx          # Árvore de arquivos
│   ├── FolderItem.tsx        # Item de pasta
│   ├── FileItem.tsx          # Item de arquivo
│   ├── FileActions.tsx       # Ações de arquivo
│   ├── SearchFiles.tsx       # Pesquisa de arquivos
│   ├── ContextMenu.tsx       # Menu de contexto
│   ├── FileDetails.tsx       # Detalhes do arquivo
│   └── FileTreeItem.tsx      # Item da árvore de arquivos
│
├── editor/                    # Editor de markdown/código
│   ├── EditorPane.tsx        # Painel do editor
│   ├── EditorToolbar.tsx     # Barra de ferramentas
│   ├── PreviewPane.tsx       # Painel de visualização
│   ├── EditorSettings.tsx    # Configurações do editor
│   ├── EditorShortcuts.tsx   # Atalhos do editor
│   ├── MarkdownControls.tsx  # Controles de markdown
│   ├── CodeBlock.tsx         # Bloco de código
│   ├── SyntaxHighlighter.tsx # Destaque de sintaxe
│   └── EditorStats.tsx       # Estatísticas do editor
│
├── markdown-editor/           # Editor específico de markdown
│   ├── MarkdownEditor.tsx    # Editor principal de markdown
│   ├── Toolbar.tsx           # Barra de ferramentas específica
│   ├── Preview.tsx           # Visualização de markdown
│   ├── LinkDialog.tsx        # Diálogo para criação de links
│   ├── ImageDialog.tsx       # Diálogo para inserção de imagens
│   ├── TableGenerator.tsx    # Gerador de tabelas
│   ├── FormatButtons.tsx     # Botões de formatação
│   └── MarkdownShortcuts.tsx # Atalhos de markdown
│
├── document/                  # Componentes de documento
│   ├── DocumentInputCard.tsx        # Card de entrada de documento
│   ├── DocumentProcessorPanel.tsx   # Painel de processamento
│   ├── AnalysisTab.tsx              # Aba de análise
│   ├── StructureTab.tsx             # Aba de estrutura
│   ├── ValidationTab.tsx            # Aba de validação
│   ├── SuggestionsTab.tsx           # Aba de sugestões
│   ├── EmptyProcessorState.tsx      # Estado vazio do processador
│   ├── ProcessingProgress.tsx       # Progresso de processamento
│   ├── DocumentViewer.tsx           # Visualizador de documento
│   ├── DocumentTree.tsx             # Árvore de documento
│   ├── DocumentVersions.tsx         # Versões do documento
│   └── DocumentExport.tsx           # Exportação de documento
│
├── knowledge/                 # Componentes de gestão de conhecimento
│   ├── KnowledgePanel.tsx           # Painel de conhecimento
│   ├── CustomKnowledgeManager.tsx   # Gerenciador de conhecimento
│   ├── CustomPropertiesManager.tsx  # Gerenciador de propriedades
│   ├── PropertySchemaManager.tsx    # Gerenciador de esquema
│   ├── SchemaManagementPanel.tsx    # Painel de gestão de esquema
│   ├── DocumentProcessor.tsx        # Processador de documento
│   ├── EmptyState.tsx               # Estado vazio
│   ├── LoadingState.tsx             # Estado de carregamento
│   ├── properties/                  # Componentes de propriedades
│   │   ├── PropertyControls.tsx     # Controles de propriedade
│   │   ├── PropertyForm.tsx         # Formulário de propriedade
│   │   ├── PropertyItem.tsx         # Item de propriedade
│   │   └── PropertyList.tsx         # Lista de propriedades
│   └── tabs/                        # Abas do painel de conhecimento
│       ├── DetailsTab.tsx           # Aba de detalhes
│       ├── OverviewTab.tsx          # Aba de visão geral
│       ├── PropertiesTab.tsx        # Aba de propriedades
│       └── TabsContainer.tsx        # Contêiner de abas
│
├── llm/                       # Componentes de LLM
│   ├── LLMConfig.tsx                # Configuração de LLM
│   ├── LLMMonitoring.tsx            # Monitoramento de LLM
│   ├── LLMPipelinesManager.tsx      # Gerenciador de pipelines
│   ├── LLMProviderForm.tsx          # Formulário de provedor
│   ├── ProviderForm.tsx             # Formulário de provedor
│   ├── ProviderList.tsx             # Lista de provedores
│   ├── config/                      # Componentes de configuração
│   │   ├── LLMConfigHeader.tsx      # Cabeçalho de configuração
│   │   ├── LLMConfigTabs.tsx        # Abas de configuração
│   │   ├── LLMProvidersTab.tsx      # Aba de provedores
│   │   └── index.ts                 # Exportações
│   ├── monitoring/                  # Componentes de monitoramento
│   │   ├── LLMMonitoringHeader.tsx  # Cabeçalho de monitoramento
│   │   ├── LLMMonitoringTabs.tsx    # Abas de monitoramento
│   │   ├── MetricsCards.tsx         # Cards de métricas
│   │   ├── PerformanceChart.tsx     # Gráfico de desempenho
│   │   ├── TimelineChart.tsx        # Gráfico de linha do tempo
│   │   ├── UsageChart.tsx           # Gráfico de uso
│   │   └── index.ts                 # Exportações
│   ├── pipelines/                   # Componentes de pipeline
│   │   ├── LLMPipelinesManager.tsx  # Gerenciador de pipelines
│   │   ├── PipelineDetails.tsx      # Detalhes do pipeline
│   │   ├── PipelineStep.tsx         # Etapa do pipeline
│   │   ├── PipelineStepsList.tsx    # Lista de etapas
│   │   ├── PipelineTester.tsx       # Testador de pipeline
│   │   ├── PipelinesList.tsx        # Lista de pipelines
│   │   └── index.ts                 # Exportações
│   ├── provider-form/               # Formulários de provedor
│   │   ├── ApiConfigFields.tsx      # Campos de configuração de API
│   │   ├── BasicInfoFields.tsx      # Campos de informação básica
│   │   ├── CapabilitiesSection.tsx  # Seção de capacidades
│   │   ├── LLMProviderFormHeader.tsx # Cabeçalho do formulário
│   │   ├── ModelsField.tsx          # Campo de modelos
│   │   ├── ParametersSection.tsx    # Seção de parâmetros
│   │   └── index.ts                 # Exportações
│   └── index.ts                     # Exportações do módulo LLM
│
├── agents/                    # Componentes de agentes IA
│   ├── ActivityLog.tsx              # Log de atividade
│   ├── AgentCard.tsx                # Card de agente
│   ├── AgentControlPanel.tsx        # Painel de controle
│   ├── MetricsCharts.tsx            # Gráficos de métricas
│   ├── MetricsPanel.tsx             # Painel de métricas
│   ├── AgentForm.tsx                # Formulário de agente
│   ├── AgentList.tsx                # Lista de agentes
│   ├── AgentDetails.tsx             # Detalhes do agente
│   ├── AgentExecutor.tsx            # Executor de agente
│   └── AgentSettings.tsx            # Configurações de agente
│
├── connections/               # Componentes de conexões externas
│   ├── ConnectionCard.tsx           # Card de conexão
│   ├── ConnectionsList.tsx          # Lista de conexões
│   ├── ConnectionForm.tsx           # Formulário de conexão
│   ├── ConnectionDialogs.tsx        # Diálogos de conexão
│   ├── types.ts                     # Tipos de conexão
│   ├── form/                        # Componentes de formulário
│   │   ├── ActiveToggle.tsx         # Alternador de ativação
│   │   ├── ConnectionNameField.tsx  # Campo de nome
│   │   ├── CredentialFields.tsx     # Campos de credenciais
│   │   ├── FormActions.tsx          # Ações de formulário
│   │   ├── FormHeader.tsx           # Cabeçalho de formulário
│   │   ├── FormSection.tsx          # Seção de formulário
│   │   ├── ProviderSelector.tsx     # Seletor de provedor
│   │   ├── ServiceSelector.tsx      # Seletor de serviço
│   │   ├── StatusIndicator.tsx      # Indicador de status
│   │   ├── TestConnection.tsx       # Teste de conexão
│   │   └── index.ts                 # Exportações
│   └── index.ts                     # Exportações do módulo de conexões
│
├── explorer/                  # Explorador de arquivos
│   ├── FileExplorer.tsx             # Explorador de arquivos
│   └── FileTreeItem.tsx             # Item da árvore de arquivos
│
├── generator/                 # Geradores de conteúdo
│   ├── PromptGenerator.tsx          # Gerador de prompts
│   ├── CodeGenerator.tsx            # Gerador de código
│   ├── DocumentGenerator.tsx        # Gerador de documentos
│   └── TemplateSelector.tsx         # Seletor de templates
│
├── media/                     # Componentes de mídia
│   ├── MediaStatistics.tsx          # Estatísticas de mídia
│   ├── ProcessingMetrics.tsx        # Métricas de processamento
│   ├── MediaPlayer.tsx              # Player de mídia
│   ├── MediaViewer.tsx              # Visualizador de mídia
│   ├── metrics/                     # Componentes de métricas
│   │   ├── MetricCard.tsx           # Card de métrica
│   │   └── TypeSpecificMetrics.tsx  # Métricas específicas
│   └── statistics/                  # Componentes de estatísticas
│       ├── BarChart.tsx             # Gráfico de barras
│       ├── MediaTypeDetails.tsx     # Detalhes do tipo de mídia
│       ├── PieChart.tsx             # Gráfico de pizza
│       ├── RadarChart.tsx           # Gráfico de radar
│       ├── ScoreCard.tsx            # Card de pontuação
│       └── TimeCard.tsx             # Card de tempo
│
├── upload/                    # Componentes de upload
│   ├── MediaUploader.tsx            # Uploader de mídia
│   ├── UploadArea.tsx               # Área de upload
│   ├── components/                  # Subcomponentes
│   │   ├── DropzoneContent.tsx      # Conteúdo da dropzone
│   │   ├── FilePreview.tsx          # Visualização de arquivo
│   │   └── MediaUploaderActions.tsx # Ações do uploader
│   ├── hooks/                       # Hooks relacionados
│   │   └── useFileUpload.ts         # Hook de upload de arquivo
│   └── utils/                       # Utilitários
│       └── mediaTypeUtils.ts        # Utilitários de tipo de mídia
│
├── viewer/                    # Visualizadores
│   └── DocumentViewer.tsx           # Visualizador de documento
│
└── theme-provider.tsx         # Provedor de tema

### Estrutura Detalhada dos Hooks (src/hooks/)

src/hooks/
├── llm/                      # Hooks relacionados a LLMs
│   ├── index.ts              # Exportações
│   ├── llmServiceInstance.ts # Instância do serviço LLM
│   ├── useCompletions.ts     # Gerenciamento de completions
│   ├── useLLM.ts             # Hook principal de LLM
│   ├── usePipelines.ts       # Gerenciamento de pipelines
│   ├── useProviderManagement.ts # Gerenciamento de provedores
│   └── useProviderStats.ts   # Estatísticas de provedores
│
├── connections/              # Hooks de conexões
│   ├── index.ts              # Exportações
│   ├── useConnectionActions.ts # Ações de conexão
│   ├── useConnectionForm.ts  # Formulário de conexão
│   ├── useConnectionQueries.ts # Queries de conexão
│   ├── useConnectionState.ts # Estado de conexão
│   └── useConnections.ts     # Hook principal de conexões
│
├── media/                    # Hooks de mídia
│   ├── useAudioProcessor.ts  # Processador de áudio
│   ├── useImageProcessor.ts  # Processador de imagem
│   ├── useVideoProcessor.ts  # Processador de vídeo
│   └── useMediaProcessor.ts  # Processador de mídia geral
│
├── search/                   # Hooks de busca
│   ├── useCombinedSearch.ts  # Busca combinada
│   ├── useDocumentSearch.ts  # Busca de documentos
│   ├── usePropertySearch.ts  # Busca de propriedades
│   ├── usePropertySearchOperations.ts # Operações de busca de propriedades
│   ├── useSearchOperations.ts # Operações de busca
│   ├── useSearchResults.ts   # Resultados de busca
│   ├── useSearchState.ts     # Estado de busca
│   ├── useSearchUtils.ts     # Utilitários de busca
│   ├── useTextSearch.ts      # Busca de texto
│   ├── useTextSearchOperations.ts # Operações de busca de texto
│   └── useUnifiedSearch.ts   # Busca unificada
│
├── file/                     # Hooks de arquivo
│   ├── useFileOperations.ts  # Operações de arquivo
│   ├── useFileUpload.ts      # Upload de arquivo
│   └── useFileSystem.ts      # Sistema de arquivos
│
├── document/                 # Hooks de documento
│   ├── useDocumentHandlers.ts # Manipuladores de documento
│   ├── useDocumentProcessing.ts # Processamento de documento
│   ├── useDocumentProcessor.ts # Processador de documento
│   └── useDocumentSearch.ts  # Busca de documento
│
├── knowledge/                # Hooks de conhecimento
│   ├── useCustomKnowledge.ts # Conhecimento personalizado
│   ├── useKnowledgeService.ts # Serviço de conhecimento
│   ├── usePropertyHandlers.ts # Manipuladores de propriedade
│   ├── usePropertyManagement.ts # Gerenciamento de propriedades
│   └── usePropertySchemas.ts # Esquemas de propriedade
│
├── ui/                       # Hooks de UI
│   ├── use-mobile.tsx        # Detecção de dispositivo móvel
│   ├── use-toast.ts          # Toast notifications
│   ├── useTheme.ts           # Gerenciamento de tema
│   └── useModal.ts           # Gerenciamento de modal
│
├── auth/                     # Hooks de autenticação
│   ├── useAuth.ts            # Autenticação principal
│   └── usePermissions.ts     # Permissões
│
└── common/                   # Hooks comuns
    ├── useDebounce.ts        # Debounce para inputs
    ├── useLocalStorage.ts    # Persistência em localStorage
    ├── useOnClickOutside.ts  # Detecção de clique fora
    └── useWindowSize.ts      # Dimensões da janela

### Estrutura Detalhada dos Serviços (src/services/)

src/services/
├── agent/                    # Serviços de agente
│   ├── AgentService.ts       # Serviço principal de agente
│   ├── LLM.ts                # Interface com LLM
│   ├── TaskManager.ts        # Gerenciador de tarefas
│   └── __tests__/            # Testes
│       └── TaskManager.test.ts # Teste do gerenciador de tarefas
│
├── ai/                       # Serviços de IA
│   ├── OpenAIService.ts      # Serviço OpenAI
│   ├── AnthropicService.ts   # Serviço Anthropic
│   └── GoogleAIService.ts    # Serviço Google AI
│
├── cache/                    # Serviços de cache
│   └── CacheService.ts       # Serviço de cache
│
├── connections/              # Serviços de conexões
│   ├── index.ts              # Exportações
│   ├── ConnectionService.ts  # Serviço principal
│   ├── modificationService.ts # Serviço de modificação
│   ├── retrievalService.ts   # Serviço de recuperação
│   ├── types.ts              # Tipos
│   └── utils.ts              # Utilitários
│
├── document/                 # Serviços de documento
│   ├── DocumentProcessor.ts  # Processador de documento
│   ├── DocumentStructureService.ts # Serviço de estrutura
│   ├── DocumentValidationService.ts # Serviço de validação
│   └── SuggestionService.ts  # Serviço de sugestões
│
├── knowledge/                # Serviços de conhecimento
│   ├── KnowledgeService.ts   # Serviço principal
│   ├── analyzers/            # Analisadores
│   │   └── ContentAnalyzer.ts # Analisador de conteúdo
│   ├── extractors/           # Extratores
│   │   └── KnowledgeExtractor.ts # Extrator de conhecimento
│   ├── generators/           # Geradores
│   │   ├── MetadataGenerator.ts # Gerador de metadados
│   │   ├── PromptGenerator.ts # Gerador de prompts
│   │   ├── StructureGenerator.ts # Gerador de estrutura
│   │   ├── analyzers/        # Analisadores de geração
│   │   │   └── ComplexityAnalyzer.ts # Analisador de complexidade
│   │   ├── extractors/       # Extratores de geração
│   │   │   └── SummaryExtractor.ts # Extrator de resumo
│   │   ├── interfaces/       # Interfaces de geração
│   │   │   └── TokenInterfaces.ts # Interfaces de token
│   │   └── utils/            # Utilitários de geração
│   │       └── metadataUtils.ts # Utilitários de metadados
│   └── validators/           # Validadores
│       └── OutputValidator.ts # Validador de saída
│
├── llm/                      # Serviço de LLM
│   └── LLMService.ts         # Serviço principal de LLM
│
├── markdown/                 # Serviços de markdown
│   └── MarkdownProcessor.ts  # Processador de markdown
│
├── media/                    # Serviços de mídia
│   ├── AudioProcessor.ts     # Processador de áudio
│   ├── BaseMediaProcessor.ts # Processador base
│   ├── ImageProcessor.ts     # Processador de imagem
│   ├── MediaProcessor.ts     # Processador de mídia
│   ├── MediaRecordService.ts # Serviço de gravação
│   ├── VideoProcessor.ts     # Processador de vídeo
│   └── __tests__/            # Testes
│       └── MediaProcessor.test.ts # Teste do processador
│
├── messaging/                # Serviços de mensagens
│   ├── MessageBus.ts         # Barramento de mensagens
│   └── __tests__/            # Testes
│       └── MessageBus.test.ts # Teste do barramento
│
└── monitoring/               # Serviços de monitoramento
    └── MonitoringService.ts  # Serviço de monitoramento

### Estrutura Detalhada das Páginas (src/pages/)

src/pages/
├── Home.tsx                  # Página inicial
├── Index.tsx                 # Página de índice
├── NotFound.tsx              # Página 404
├── _app.tsx                  # App principal
├── Agents.tsx                # Página de agentes
├── ConnectionsPage.tsx       # Página de conexões
├── Demo.tsx                  # Página de demonstração
├── LLMManagerPage.tsx        # Gerenciador de LLM
├── MediaProcessorPage.tsx    # Processador de mídia
├── documents.tsx             # Página de documentos
├── markdown-editor.tsx       # Editor de markdown
├── media.tsx                 # Página de mídia
├── metrics.tsx               # Página de métricas
└── dashboard/                # Páginas de dashboard
    ├── index.tsx             # Dashboard principal
    ├── analytics.tsx         # Análises
    └── settings.tsx          # Configurações

### Estrutura Detalhada dos Tipos (src/types/)

src/types/
├── agent.ts                  # Tipos de agente
├── file.ts                   # Tipos de arquivo
├── knowledge.ts              # Tipos de conhecimento
├── llm.ts                    # Tipos de LLM
├── media.ts                  # Tipos de mídia
├── plugin.ts                 # Tipos de plugin
├── task.ts                   # Tipos de tarefa
├── react-beautiful-dnd.d.ts  # Definições para react-beautiful-dnd
└── ui.ts                     # Tipos de UI

### Estrutura da Loja de Estado (src/store/)

src/store/
├── editorStore.ts            # Estado do editor
├── fileStore/                # Estado de arquivos
│   ├── fileOperations.ts     # Operações de arquivo
│   ├── fileStore.ts          # Estado principal
│   ├── index.ts              # Exportações
│   └── types.ts              # Tipos
├── llmStore.ts               # Estado de LLM
├── documentStore.ts          # Estado de documentos
├── userStore.ts              # Estado do usuário
├── knowledgeStore.ts         # Estado de conhecimento
└── themeStore.ts             # Estado do tema

### Estrutura das Edge Functions Supabase (supabase/functions/)

supabase/functions/
├── knowledge-pipeline/       # Pipeline de conhecimento
│   └── index.ts              # Função principal
├── knowledge-processor/      # Processador de conhecimento
│   └── index.ts              # Função principal
├── process-media/            # Processamento de mídia
│   ├── index.ts              # Função principal
│   ├── types/                # Tipos
│   │   └── media.ts          # Tipos de mídia
│   ├── services/             # Serviços
│   │   ├── audio-service.ts  # Serviço de áudio
│   │   ├── category-service.ts # Serviço de categoria
│   │   ├── image-service.ts  # Serviço de imagem
│   │   ├── insights-service.ts # Serviço de insights
│   │   ├── media-service.ts  # Serviço de mídia
│   │   ├── openai-service.ts # Serviço OpenAI
│   │   └── video-service.ts  # Serviço de vídeo
│   └── utils/                # Utilitários
│       └── cors.ts           # Utilitários CORS
├── process-text/             # Processamento de texto
│   └── index.ts              # Função principal
└── test-connection/          # Teste de conexão
    └── index.ts              # Função principal

### Estrutura Detalhada de APIs e Modelos de Dados

#### API - Documentos

`// API de Documentos GET    /api/documents                 // Listar documentos POST   /api/documents                 // Criar documento GET    /api/documents/:id             // Obter documento PUT    /api/documents/:id             // Atualizar documento DELETE /api/documents/:id             // Excluir documento POST   /api/documents/:id/process     // Processar documento GET    /api/documents/:id/history     // Histórico de documento // Modelo de Dados - Documento interface Document {   id: string;  title: string;  content: string;  summary?: string;  structure?: DocumentStructure;  metadata: Record<string, any>;  tags: string[];  userId: string;  createdAt: string;  updatedAt: string; } interface DocumentStructure {   sections: Section[];  concepts: Concept[];  relationships: Relationship[]; } interface Section {   id: string;  title: string;  content: string;  level: number;  position: number; } interface Concept {   id: string;  name: string;  description: string;  references: string[]; } interface Relationship {   id: string;  sourceId: string;  targetId: string;  type: string;  description?: string; }`

#### API - LLM

`// API de LLM GET    /api/llm/providers              // Listar provedores POST   /api/llm/providers              // Criar provedor GET    /api/llm/providers/:id          // Obter provedor PUT    /api/llm/providers/:id          // Atualizar provedor DELETE /api/llm/providers/:id          // Excluir provedor POST   /api/llm/complete               // Solicitar completion POST   /api/llm/analyze                // Analisar texto GET    /api/llm/pipelines              // Listar pipelines POST   /api/llm/pipelines              // Criar pipeline GET    /api/llm/pipelines/:id          // Obter pipeline PUT    /api/llm/pipelines/:id          // Atualizar pipeline DELETE /api/llm/pipelines/:id          // Excluir pipeline POST   /api/llm/pipelines/:id/execute  // Executar pipeline // Modelo de Dados - LLM interface LLMProvider {   id: string;  name: string;  provider: string;  apiKeyName: string;  model: string;  capabilities: string[];  parameters: Record<string, any>;  isActive: boolean;  userId: string;  createdAt: string;  updatedAt: string; } interface LLMPipeline {   id: string;  name: string;  description?: string;  steps: PipelineStep[];  userId: string;  createdAt: string;  updatedAt: string; } interface PipelineStep {   id: string;  providerId: string;  role: "input" | "processor" | "output";  order: number;  systemPrompt?: string; } interface ProcessingTemplate {   id: string;  name: string;  description?: string;  category: string;  content: string;  parameters: Record<string, any>;  examples: ProcessingExample[];  userId: string;  createdAt: string;  updatedAt: string; } interface ProcessingExample {   input: string;  output: string;  explanation: string; } interface MetaSystem {   id: string;  name: string;  description?: string;  rules: string[];  constraints: string[];  goals: string[];  userId: string;  createdAt: string;  updatedAt: string; }`

#### API - Mídia

`// API de Mídia POST   /api/media/upload               // Upload de mídia POST   /api/media/process              // Processar mídia GET    /api/media/:id                  // Obter mídia DELETE /api/media/:id                  // Excluir mídia GET    /api/media/statistics           // Estatísticas de mídia // Modelo de Dados - Mídia interface MediaRecord {   id: string;  fileName: string;  fileType: string;  fileSize: number;  mediaType: 'image' | 'audio' | 'video' | 'text' | 'markdown';  processingTime?: number;  status: 'completed' | 'processing' | 'failed';  result?: MediaProcessingResult;  userId: string;  createdAt: string; } interface MediaProcessingResult {   analysis: string;  mediaType: string;  detailLevel: string;  categoryDistribution?: CategoryDistribution;  insights?: MediaInsights;  content?: string;  metadata?: MediaMetadata;  // Propriedades específicas para tipos de mídia  transcript?: string;  sentiment?: 'positive' | 'negative' | 'neutral';  objects?: string[];  tags?: string[];  description?: string; } interface MediaMetadata {   name: string;  size: number;  type: string;  dimensions?: {    width: number;    height: number;  };  format?: string;  duration?: number;  language?: string;  resolution?: string; }`

#### API - Conexões

`// API de Conexões GET    /api/connections                // Listar conexões POST   /api/connections                // Criar conexão GET    /api/connections/:id            // Obter conexão PUT    /api/connections/:id            // Atualizar conexão DELETE /api/connections/:id            // Excluir conexão POST   /api/connections/:id/test       // Testar conexão // Modelo de Dados - Conexões interface Connection {   id: string;  name: string;  provider: string;  service: string;  credentials: Record<string, any>;  isActive: boolean;  userId: string;  createdAt: string;  updatedAt: string; }`

### Estrutura de Testes

tests/
├── unit/                     # Testes unitários
│   ├── components/           # Testes de componentes
│   ├── hooks/                # Testes de hooks
│   ├── services/             # Testes de serviços
│   └── utils/                # Testes de utilitários
├── integration/              # Testes de integração
│   ├── api/                  # Testes de API
│   ├── llm/                  # Testes de LLM
│   └── media/                # Testes de mídia
└── e2e/                      # Testes end-to-end
    ├── document-flow.spec.ts # Fluxo de documentos
    ├── llm-pipeline.spec.ts  # Pipeline de LLM
    └── media-processing.spec.ts # Processamento de mídia

Esta é a estrutura completa e detalhada do aplicativo finalizado, abrangendo todos os módulos, arquivos, APIs e modelos de dados necessários para implementar o sistema de processamento de conhecimento conforme descrito. Não omiti nenhuma parte da estrutura e forneci detalhes sobre cada componente e sua função no sistema.



### Módulos já descritos:

Nas conversas anteriores, descrevi aproximadamente 15 módulos principais, incluindo:

1. MessageBus.ts
2. MonitoringService.ts
3. CacheService.ts
4. OpenAIService.ts
5. MarkdownProcessor.ts
6. PipelineStep.tsx
7. ParametersSection.tsx
8. CapabilitiesSection.tsx
9. Componentes de monitoramento (PerformanceChart, TimelineChart, UsageChart)
10. useCompletions.ts
11. useLLM.ts
12. useDocumentProcessor.ts
13. DocumentProcessor.ts
14. DocumentStructureService.ts
15. DocumentValidationService.ts
16. SuggestionService.ts
17. MarkdownAnalyzerPlugin.ts

### Módulos faltantes:

Como mencionei na última resposta, estimo que ainda faltam cerca de 20-25 módulos importantes para completar toda a estrutura da aplicação, incluindo:

1. Serviços para processamento de mídia (imagem, áudio, vídeo)
2. Componentes da interface para o editor Markdown
3. Componentes de visualização de documentos
4. Gerenciador de arquivos
5. Componentes de pipeline LLM
6. Sistemas de templates e meta-sistemas
7. Serviços de integração com APIs externas
8. Componentes de linha do tempo de prompts
9. Utilitários e hooks adicionais

### Conversas estimadas:

Para descrever todos os módulos restantes com o mesmo nível de detalhe, precisaríamos de aproximadamente 2-3 conversas adicionais, considerando o limite de caracteres por mensagem.

Você gostaria que eu continue descrevendo os módulos restantes na próxima conversa? Posso focar em alguma área específica de seu interesse ou continuar na ordem que estava seguindo.