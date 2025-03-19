

### Template 1: Adicionar Novo Componente/Feature

Por favor, gere um prompt de solicitação para adicionar [NOME_DA_FEATURE] seguindo esta estrutura:

1. TIPO DE ADIÇÃO:
- [ ] Novo componente UI
- [ ] Nova funcionalidade
- [ ] Nova integração
- [ ] Novo módulo

2. DESCRIÇÃO BÁSICA:
- Nome da feature:
- Propósito principal:
- Localização na interface:

3. REQUISITOS TÉCNICOS:
- Arquivos a serem criados:
- Dependências necessárias:
- Tipos/Interfaces necessários:

4. INTEGRAÇÃO:
- Como se integra com componentes existentes:
- Hooks necessários:
- Eventos/comunicação entre componentes:

5. UI/UX:
- Localização no layout:
- Comportamento responsivo:
- Estados da interface:

6. CONSIDERAÇÕES:
- Impacto em features existentes:
- Requisitos de performance:
- Requisitos de acessibilidade:

7. EXEMPLOS DE USO:
- Caso de uso principal:
- Interações esperadas:

### Template 2: Adicionar Nova Integração com LLM

Por favor, gere um prompt de solicitação para integrar [NOME_DO_LLM] seguindo esta estrutura:

1. DETALHES DO PROVEDOR:
- Nome do LLM:
- API Base URL:
- Modelos suportados:
- Capacidades específicas:

2. REQUISITOS DE IMPLEMENTAÇÃO:
- Novos tipos necessários:
- Arquivos a serem criados:
- Configurações necessárias:

3. INTEGRAÇÃO COM SISTEMA EXISTENTE:
- Ponto de integração no PipelineManager:
- Adaptações necessárias:
- Configurações de ambiente:

4. INTERFACE DE USUÁRIO:
- Campos de configuração específicos:
- Opções de modelo:
- Visualização de resultados:

5. TRATAMENTO DE ERROS:
- Casos específicos:
- Fallbacks necessários:
- Mensagens ao usuário:

6. MONITORAMENTO:
- Métricas específicas:
- Logs necessários:

### Template 3: Adicionar Novo Processador de Mídia

Por favor, gere um prompt de solicitação para adicionar suporte a [TIPO_DE_MÍDIA] seguindo esta estrutura:

1. ESPECIFICAÇÕES DO TIPO DE MÍDIA:
- Extensões suportadas:
- Limites de tamanho:
- Formatos aceitos:

2. PROCESSAMENTO:
- Etapas de processamento:
- Extração de metadados:
- Transformações necessárias:

3. IMPLEMENTAÇÃO TÉCNICA:
- Novos serviços necessários:
- Interfaces/tipos a serem criados:
- Utilitários necessários:

4. INTEGRAÇÃO COM SISTEMA:
- Ponto de integração no MediaProcessor:
- Adaptações necessárias:
- Cache e armazenamento:

5. INTERFACE DE USUÁRIO:
- Componentes de preview:
- Controles específicos:
- Feedback visual:

6. VALIDAÇÃO E ERRO:
- Validações específicas:
- Tratamento de erros:
- Mensagens ao usuário:

### Template 4: Adicionar Novo Plugin

Por favor, gere um prompt de solicitação para criar plugin [NOME_DO_PLUGIN] seguindo esta estrutura:

1. DETALHES DO PLUGIN:
- Nome do plugin:
- Funcionalidade principal:
- Casos de uso:

2. IMPLEMENTAÇÃO:
- Estrutura de arquivos:
- Interfaces necessárias:
- Hooks específicos:

3. INTEGRAÇÃO:
- Pontos de extensão utilizados:
- Eventos necessários:
- Comunicação com sistema:

4. CONFIGURAÇÃO:
- Opções configuráveis:
- Valores padrão:
- Validações:

5. INTERFACE DE USUÁRIO:
- Componentes necessários:
- Localização na interface:
- Estados visuais:

6. PERFORMANCE:
- Considerações de carregamento:
- Cache necessário:
- Otimizações:

### Como Usar os Templates:

1. Escolha o template apropriado para sua necessidade
2. Preencha todos os campos com detalhes específicos
3. Envie para a IA geradora de prompts
4. Revise o prompt gerado
5. Use o prompt final para solicitar a implementação

### Diretrizes Importantes:

1. **Manter Coesão:**

- Especifique como a nova funcionalidade se integra ao existente
- Mantenha consistência com padrões atuais
- Respeite a arquitetura modular

2. **Interface do Usuário:**

- Mantenha consistência com design system atual
- Respeite hierarquia visual existente
- Siga padrões de UX estabelecidos

3. **Código:**

- Mantenha separação de responsabilidades
- Use tipos TypeScript existentes
- Siga padrões de nomeação atuais

4. **Performance:**

- Considere impacto em performance
- Planeje estratégias de cache
- Otimize carregamento

5. **Manutenibilidade:**

- Documente adequadamente
- Crie testes apropriados
- Mantenha modularidade

Usando estes templates, você garantirá que as solicitações geradas:

- Sejam completas e bem estruturadas
- Respeitem a arquitetura existente
- Mantenham consistência com o sistema
- Sejam facilmente implementáveis
- Não interfiram com funcionalidades existentes