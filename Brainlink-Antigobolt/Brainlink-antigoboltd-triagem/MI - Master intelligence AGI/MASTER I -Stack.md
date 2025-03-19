## Stack Tecnológica Completa

### Frontend

- **Framework Base**: React com TypeScript
- **Build Tool**: Vite para desenvolvimento rápido e eficiente
- **Estilização**: Tailwind CSS para design responsivo
- **Componentes UI**: shadcn/ui (baseado em Radix UI) para componentes acessíveis e personalizáveis
- **Gerenciamento de Estado**:
    - Zustand para estado global
    - React Query para gerenciamento de dados remotos e cache
- **Roteamento**: React Router para navegação
- **Editor de Markdown**: Monaco Editor para edição avançada de texto e código
- **Funcionalidades de Arrastar e Soltar**: react-beautiful-dnd para reordenação de elementos
- **Notificações**: Sonner para toasts informativos
- **Visualização de Dados**: Recharts para gráficos e métricas
- **Utilitários de Data**: date-fns para manipulação de datas
- **Ícones**: Lucide React para ícones consistentes

### Backend (via Supabase)

- **Banco de Dados**: PostgreSQL gerenciado pelo Supabase
- **Autenticação**: Sistema de autenticação do Supabase
- **Storage**: Armazenamento de arquivos do Supabase
- **Edge Functions**: Funções serverless para processamento e integração com APIs externas
- **Segurança**: Políticas RLS (Row Level Security) para controle de acesso a dados

### Integração com IA

- **Provedores de LLM**:
    - OpenAI (GPT-4, GPT-3.5-turbo)
    - Anthropic (Claude)
    - Google (Gemini)
    - Suporte para modelos personalizados
- **Processamento de Mídia**:
    - Processamento de texto (Markdown)
    - Análise de imagens
    - Transcrição de áudio
    - Processamento de vídeo

### Conexões Externas

- **APIs de LLM**:
    - OpenAI API
    - Anthropic API
    - Google AI API
- **Repositórios**: Integração com GitHub
- **Bancos de Dados**: Integração com Supabase/PostgreSQL
- **Armazenamento em Nuvem**: Possibilidade de integração com serviços de armazenamento

## Funcionalidades Principais

### Processamento de Conhecimento

- Sistema de upload e análise de documentos Markdown
- Extração de conhecimento estruturado de diversos formatos de mídia
- Geração de prompts otimizados para desenvolvimento
- Pipelines de processamento com múltiplos LLMs

### Gerenciamento de LLMs

- Configuração de múltiplos provedores de LLM
- Criação e gerenciamento de pipelines de processamento
- Monitoramento de uso e desempenho
- Ferramentas para testar e otimizar prompts

### Documentação e Conhecimento

- Editor Markdown com visualização em tempo real
- Sistema de arquivos e pastas para organização
- Links entre documentos e referências cruzadas
- Etiquetagem e categorização de conteúdo

### Interface do Usuário

- Dashboard com métricas e informações relevantes
- Navegação intuitiva entre diferentes seções
- Design responsivo para diversos dispositivos
- Sistema de notificações para eventos importantes

## Arquitetura de Dados

### Tabelas Principais no Supabase

- Conexões (connections)
- Documentos de conhecimento (knowledge_documents)
- Configurações de LLM (llm_configurations)
- Pipelines de processamento (triage_funnels, triage_steps)
- Templates de processamento (processing_templates)
- Sistemas meta (meta_systems)
- Trabalhos de processamento (processing_jobs)
- Timeline de prompts (prompt_timelines, prompt_nodes)

## Fluxo de Trabalho do Sistema

1. **Upload e Gestão de Conteúdo**:
    
    - Upload de documentos Markdown e mídia
    - Organização em sistema de arquivos e categorias
2. **Processamento de Conhecimento**:
    
    - Análise inicial do conteúdo
    - Processamento por pipelines configurados com múltiplos LLMs
    - Extração de conhecimento estruturado
3. **Geração de Prompts e Documentação**:
    
    - Geração de prompts otimizados a partir do conhecimento extraído
    - Criação de documentação estruturada
    - Organização em timeline de desenvolvimento
4. **Execução e Integração**:
    
    - Execução dos prompts para desenvolvimento
    - Integração com ferramentas de desenvolvimento
    - Monitoramento e otimização contínua

Esta stack tecnológica completa fornece todas as ferramentas necessárias para implementar o sistema de processamento de conhecimento conforme descrito, com foco em modularidade, escalabilidade e eficiência.