**WORKFLOWS DO SISTEMA DE PROCESSAMENTO DE CONHECIMENTO**

---

# **VISÃO GERAL DO USUÁRIO (FRONTEND)**

```mermaid
graph TD
    A[ENTRADA DO USUÁRIO] --> B[UPLOAD DE DOCUMENTO/MÍDIA]
    B --> C{TIPO DE CONTEÚDO}
    C -->|Texto/Markdown| D[EDITOR DE MARKDOWN]
    C -->|Imagem| E[PROCESSADOR DE IMAGEM]
    C -->|Áudio| F[PROCESSADOR DE ÁUDIO]
    C -->|Vídeo| G[PROCESSADOR DE VÍDEO]
    
    D --> H[CONFIGURAÇÃO DE PIPELINE LLM]
    E --> H
    F --> H
    G --> H
    
    H --> I[SELEÇÃO DE PROVEDORES LLM]
    I --> J[CONFIGURAÇÃO DE PASSOS DO PIPELINE]
    J --> K[EXECUÇÃO DO PROCESSAMENTO]
    K --> L[VISUALIZAÇÃO DE RESULTADOS]
    
    L --> M[CONHECIMENTO ESTRUTURADO]
    L --> N[DOCUMENTAÇÃO GERADA]
    L --> O[TIMELINE DE PROMPTS]
    
    M --> P[EXPORTAÇÃO]
    N --> P
    O --> Q[EXECUÇÃO DE PROMPTS]
    
    P --> R[DOCUMENTO FINAL]
    Q --> S[CÓDIGO/PROJETO GERADO]
```

---

# **ARQUITETURA DO BACKEND**

```mermaid
graph TD
    A[REQUISIÇÃO FRONTEND] --> B[EDGE FUNCTIONS SUPABASE]
    
    B --> C[PROCESSADOR DE CONHECIMENTO]
    B --> D[PROCESSADOR DE MÍDIA]
    B --> E[PIPELINE DE CONHECIMENTO]
    B --> F[VALIDADOR DE CONEXÕES]
    
    C --> G[INTEGRAÇÕES COM APIs LLM]
    D --> G
    E --> G
    
    G -->|OpenAI| H[SERVIÇOS DE IA EXTERNOS]
    G -->|Anthropic| H
    G -->|Outros LLMs| H
    
    C --> I[BANCO DE DADOS SUPABASE]
    D --> I
    E --> I
    F --> I
    
    I --> J[RESULTS CACHE]
    I --> K[ARMAZENAMENTO PERSISTENTE]
    I --> L[MONITORAMENTO/LOGS]
    
    H --> M[TRANSFORMAÇÃO DE DADOS]
    M --> N[RETORNO PARA FRONTEND]
```

---

# **ARQUITETURA DO BANCO DE DADOS**

```mermaid
graph TD
    A[BANCO DE DADOS SUPABASE] --> B[TABELAS PRINCIPAIS]
    
    B --> C[knowledge_documents]
    B --> D[processing_jobs]
    B --> E[triage_funnels]
    B --> F[triage_steps]
    B --> G[processing_results]
    B --> H[media_processing_records]
    B --> I[llm_configurations]
    B --> J[processing_templates]
    B --> K[meta_systems]
    B --> L[prompt_timelines]
    B --> M[prompt_nodes]
```

---

# **PIPELINE DE PROCESSAMENTO DE CONHECIMENTO**

```mermaid
graph LR
    A[ENTRADA DE DOCUMENTO] --> B[ANÁLISE INICIAL]
    B --> C[ETAPA LLM 1: TRIAGEM]
    C --> D[ETAPA LLM 2: ESTRUTURAÇÃO]
    D --> E[ETAPA LLM 3: EXPANSÃO]
    E --> F[ETAPA LLM N: FINALIZAÇÃO]
    F --> G[DOCUMENTO ESTRUTURADO]
    G --> H[GERAÇÃO DE TIMELINE]
    H --> I[EXECUÇÃO DE PROMPTS]
```

---

# **CRIAÇÃO E EXTENSÃO DE RECURSOS**

```mermaid
graph TD
    A[DESENVOLVEDORES] --> B{TIPO DE RECURSO}
    
    B -->|Novos Provedores LLM| C[IMPLEMENTAÇÃO DE CONNECTOR]
    B -->|Templates de Processamento| D[CRIAÇÃO DE TEMPLATES MARKDOWN]
    B -->|Meta-sistemas| E[DEFINIÇÃO DE REGRAS E LIMITAÇÕES]
    B -->|Plugins de Análise| F[IMPLEMENTAÇÃO DE PLUGIN]
    B -->|Novos Tipos de Mídia| G[EXTENSÃO DE PROCESSADORES]
    
    C --> H[REGISTRO NO SISTEMA]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[TESTES E VALIDAÇÃO]
    I --> J[IMPLEMENTAÇÃO NO SISTEMA]
    J --> K[DISPONIBILIZAÇÃO PARA USUÁRIOS]
```

---

# **DETALHAMENTO DOS FLUXOS**

## **FLUXO DE USUÁRIO COMPLETO**

1. **ENTRADA DE CONTEÚDO**
    - Upload de documento Markdown
    - Upload de imagem, áudio ou vídeo
    - Criação direta via editor
2. **CONFIGURAÇÃO DE PROCESSAMENTO**
    - Seleção de funil de triagem existente
    - Configuração personalizada de pipeline
    - Seleção de LLMs para cada etapa
    - Configuração de templates
3. **EXECUÇÃO DO PROCESSAMENTO**
    - Documentos seguem através do pipeline configurado
    - Cada LLM aplica seu processamento específico
    - Resultados intermediários são armazenados
    - Métricas de desempenho são monitoradas
4. **VISUALIZAÇÃO E UTILIZAÇÃO**
    - Análise de estrutura e metadados extraídos
    - Revisão do documento processado
    - Geração de timeline de prompts
    - Execução de prompts para gerar código ou outros recursos

---

## **EXTENSIBILIDADE DO SISTEMA**

1. **NOVOS PROVEDORES LLM**
    - Implementação de conectores para novas APIs
    - Configuração de modelos e parâmetros
    - Integração com sistema de monitoramento
2. **TEMPLATES DE PROCESSAMENTO**
    - Criação em formato Markdown ou JSON
    - Definição de placeholders para inputs
    - Exemplos de uso e validação
3. **META-SISTEMAS**
    - Conjuntos de regras para guiar LLMs
    - Restrições de processamento
    - Objetivos de saída
4. **PLUGINS DE ANÁLISE**
    - Implementação da interface Plugin
    - Especialização em tipos específicos de análise
    - Integração com pipeline existente
5. **PROCESSADORES DE MÍDIA**
    - Extensão para novos formatos
    - Integração com APIs especializadas
    - Extração de conteúdo e metadados

```

Este documento foi atualizado com todos os fluxos detalhados para o sistema de processamento de conhecimento, garantindo estruturação adequada para ser utilizado no **Obsidian**.

```