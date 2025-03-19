# Integração com Inteligência Artificial no Brainlink

**Versão:** 2.0  
**Data:** 2025-03-19  
**Autor:** Equipe de Arquitetura Brainlink

## Índice

1. [Introdução](#introdução)
2. [Arquitetura de IA](#arquitetura-de-ia)
3. [Modelos Suportados](#modelos-suportados)
4. [Processamento de Linguagem Natural](#processamento-de-linguagem-natural)
5. [Sistema de Recomendação](#sistema-de-recomendação)
6. [Personalização e Aprendizado](#personalização-e-aprendizado)
7. [Segurança e Privacidade](#segurança-e-privacidade)
8. [Fluxo de Trabalho de IA](#fluxo-de-trabalho-de-ia)
9. [Melhores Práticas](#melhores-práticas)
10. [Implementação de Referência](#implementação-de-referência)

## Introdução

O Brainlink incorpora capacidades avançadas de inteligência artificial (IA) para enriquecer a experiência do usuário, automatizar tarefas complexas e extrair insights valiosos dos dados. Este documento descreve a arquitetura, componentes e fluxos de trabalho que permitem a integração perfeita de vários modelos de IA na plataforma.

A integração de IA no Brainlink é projetada com foco em três objetivos principais:

1. **Flexibilidade**: Suporte a múltiplos provedores e modelos de IA
2. **Escalabilidade**: Capacidade de processar desde solicitações simples até fluxos de trabalho complexos
3. **Segurança**: Proteção robusta de dados e conformidade com regulamentações

## Arquitetura de IA

A arquitetura de IA do Brainlink é composta por várias camadas que trabalham em conjunto para fornecer um sistema flexível e poderoso:

### Visão Geral da Arquitetura

```
┌───────────────────────────────────────────────────────────────┐
│                    Interface de Usuário                        │
└─────────────────────────────┬─────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    Camada de Aplicação                         │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │  Gestão de  │   │   Fluxos    │   │     Análise e       │  │
│  │  Prompts    │   │ de Trabalho │   │     Insights        │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
└─────────────────────────────┬─────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    Camada de Serviços de IA                    │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │ Orquestrador│   │ Gerenciador │   │  Processador de     │  │
│  │    de IA    │   │ de Contexto │   │     Respostas       │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │ Adaptadores │   │  Cache de   │   │  Analisador de      │  │
│  │  de Modelo  │   │  Resultado  │   │    Sentimento       │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
└─────────────────────────────┬─────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                Camada de Integração de Provedores              │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │  OpenAI     │   │  Azure AI   │   │      Anthropic      │  │
│  │  Adapter    │   │   Adapter   │   │       Adapter       │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │   Google    │   │   Modelos   │   │     Adaptador       │  │
│  │   Vertex    │   │   Locais    │   │     Customizado     │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
└─────────────────────────────┬─────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                   Provedores de Modelos                        │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │   OpenAI    │   │  Azure AI   │   │     Anthropic       │  │
│  │   (GPT-4)   │   │  Services   │   │     (Claude)        │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
│                                                               │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────────┐  │
│  │   Google    │   │    Hugging  │   │      Modelos        │  │
│  │   Vertex    │   │     Face    │   │      Internos       │  │
│  └─────────────┘   └─────────────┘   └─────────────────────┘  │
└───────────────────────────────────────────────────────────────┘
```

### Componentes Principais

1. **Orquestrador de IA**: Coordena o fluxo de solicitações entre os componentes do sistema, gerencia a seleção de modelos e orquestra fluxos de trabalho complexos de IA.

2. **Gerenciador de Contexto**: Mantém e manipula o contexto das conversas e interações, permitindo que os modelos tenham acesso a históricos relevantes para gerar respostas mais precisas.

3. **Adaptadores de Modelo**: Fornecem uma interface unificada para diferentes modelos de IA, abstraindo as peculiaridades de cada provedor.

4. **Processador de Respostas**: Pós-processa as respostas dos modelos para garantir qualidade, formato adequado e conformidade com políticas.

5. **Cache de Resultado**: Armazena resultados de solicitações frequentes para reduzir latência e custos.

6. **Analisador de Sentimento**: Avalia o sentimento das entradas e saídas para personalização e monitoramento de satisfação.

## Modelos Suportados

O Brainlink suporta uma ampla gama de modelos de IA, permitindo que os usuários escolham a melhor opção para suas necessidades específicas:

### Modelos de Linguagem

| Provedor | Modelos | Casos de Uso | Características |
|----------|---------|--------------|-----------------|
| OpenAI | GPT-4 Turbo, GPT-4o | Geração de conteúdo avançado, raciocínio complexo | Alta capacidade de raciocínio, baixa alucinação, multimodalidade |
| OpenAI | GPT-3.5 Turbo | Tarefas gerais, custo-benefício | Bom equilíbrio entre desempenho e custo |
| Anthropic | Claude 3 Opus, Sonnet, Haiku | Conteúdo longo, segurança | Excelente em seguir instruções complexas, ótimo para documentação |
| Google | Gemini Pro, Ultra | Análise multimodal, pesquisa | Forte integração com ferramentas Google, multimodalidade |
| Meta | Llama 3 | Implantação local, personalização | Open-source, possibilidade de fine-tuning |
| Mistral AI | Mistral Large, Medium, Small | Eficiência, multilíngue | Excelente performance em relação ao tamanho |

### Modelos de Embedding

| Provedor | Modelos | Casos de Uso | Características |
|----------|---------|--------------|-----------------|
| OpenAI | text-embedding-3-large/small | Pesquisa semântica, clustering | Alta precisão, dimensionalidade ajustável |
| Cohere | Embed v3 | Pesquisa multilíngue | Excelente em compatibilidade entre idiomas |
| Google | TextEmbedding-Gecko | Integração com Vertex | Boa relação custo-benefício |
| HuggingFace | BAAI/bge-large-en-v1.5 | Implantação local | Open-source, personalizável |

### Modelos Especializados

| Tipo | Provedor | Modelos | Casos de Uso |
|------|----------|---------|--------------|
| Visão Computacional | OpenAI | GPT-4o Vision | Análise de imagens, geração baseada em imagens |
| Geração de Imagens | OpenAI | DALL-E 3 | Criação de imagens a partir de texto |
| Reconhecimento de Fala | Azure | Speech Services | Transcrição, conversão fala-texto |
| Síntese de Fala | Elevenlabs | TTS Premium | Narração natural, vozes personalizadas |
| OCR | Google | Document AI | Extração de texto de documentos, compreensão de formulários |

### Implementação de Referência para o Adaptador de Modelo

```typescript
// lib/ai/adapters/modelAdapter.ts
import { AIModel, ModelType, ModelProvider, ModelCapability } from '@/types/ai';

export interface ModelRequestOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  timeout?: number;
  stream?: boolean;
}

export interface ModelResponse {
  id: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata: Record<string, any>;
}

export interface ModelAdapter {
  /**
   * Identifica o provedor e modelo suportados por este adaptador
   */
  getModelInfo(): {
    provider: ModelProvider;
    model: string;
    capabilities: ModelCapability[];
  };
  
  /**
   * Verifica se um modelo específico é suportado por este adaptador
   */
  supportsModel(model: string): boolean;
  
  /**
   * Faz uma requisição ao modelo
   */
  generateCompletion(
    prompt: string,
    options?: ModelRequestOptions
  ): Promise<ModelResponse>;
  
  /**
   * Faz uma requisição de chat ao modelo
   */
  generateChatCompletion(
    messages: Array<{role: string; content: string}>,
    options?: ModelRequestOptions
  ): Promise<ModelResponse>;
  
  /**
   * Gera embeddings para um texto
   */
  generateEmbedding(text: string): Promise<number[]>;
  
  /**
   * Obtém o custo estimado em USD para uma requisição
   */
  estimateCost(promptTokens: number, completionTokens: number): number;
}

/**
 * Fábrica para criar o adaptador apropriado
 */
export function createModelAdapter(
  provider: ModelProvider,
  model: string,
  apiKey?: string
): ModelAdapter {
  switch (provider) {
    case ModelProvider.OpenAI:
      return new OpenAIAdapter(model, apiKey);
    case ModelProvider.Azure:
      return new AzureAIAdapter(model, apiKey);
    case ModelProvider.Anthropic:
      return new AnthropicAdapter(model, apiKey);
    case ModelProvider.Google:
      return new GoogleVertexAdapter(model, apiKey);
    case ModelProvider.Local:
      return new LocalModelAdapter(model);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
```

### Exemplo de Implementação do Adaptador OpenAI

```typescript
// lib/ai/adapters/openaiAdapter.ts
import { Configuration, OpenAIApi } from 'openai';
import { ModelAdapter, ModelRequestOptions, ModelResponse } from './modelAdapter';
import { ModelProvider, ModelCapability } from '@/types/ai';

export class OpenAIAdapter implements ModelAdapter {
  private client: OpenAIApi;
  private modelName: string;
  
  constructor(model: string, apiKey?: string) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OpenAI API key is required');
    }
    
    const configuration = new Configuration({
      apiKey: key,
    });
    
    this.client = new OpenAIApi(configuration);
    this.modelName = model;
  }
  
  getModelInfo() {
    const capabilities = [ModelCapability.TextCompletion, ModelCapability.ChatCompletion];
    
    if (this.modelName.includes('gpt-4') && this.modelName.includes('vision')) {
      capabilities.push(ModelCapability.ImageUnderstanding);
    }
    
    if (this.modelName.includes('embedding')) {
      capabilities.push(ModelCapability.Embeddings);
    }
    
    return {
      provider: ModelProvider.OpenAI,
      model: this.modelName,
      capabilities,
    };
  }
  
  supportsModel(model: string): boolean {
    // Lista de modelos OpenAI suportados
    const supportedModels = [
      'gpt-4-turbo', 'gpt-4o', 'gpt-4-vision-preview',
      'gpt-3.5-turbo', 'text-embedding-3-large',
      'text-embedding-3-small', 'text-davinci-003'
    ];
    
    return supportedModels.includes(model) || model.startsWith('gpt-');
  }
  
  async generateCompletion(
    prompt: string,
    options: ModelRequestOptions = {}
  ): Promise<ModelResponse> {
    try {
      const completion = await this.client.createCompletion({
        model: this.modelName,
        prompt,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stopSequences,
      });
      
      return {
        id: completion.data.id,
        content: completion.data.choices[0]?.text || '',
        usage: {
          promptTokens: completion.data.usage?.prompt_tokens || 0,
          completionTokens: completion.data.usage?.completion_tokens || 0,
          totalTokens: completion.data.usage?.total_tokens || 0,
        },
        metadata: {
          model: this.modelName,
          provider: ModelProvider.OpenAI,
        },
      };
    } catch (error) {
      console.error('OpenAI completion error:', error);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }
  
  async generateChatCompletion(
    messages: Array<{role: string; content: string}>,
    options: ModelRequestOptions = {}
  ): Promise<ModelResponse> {
    try {
      const completion = await this.client.createChatCompletion({
        model: this.modelName,
        messages,
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stop: options.stopSequences,
      });
      
      return {
        id: completion.data.id,
        content: completion.data.choices[0]?.message?.content || '',
        usage: {
          promptTokens: completion.data.usage?.prompt_tokens || 0,
          completionTokens: completion.data.usage?.completion_tokens || 0,
          totalTokens: completion.data.usage?.total_tokens || 0,
        },
        metadata: {
          model: this.modelName,
          provider: ModelProvider.OpenAI,
        },
      };
    } catch (error) {
      console.error('OpenAI chat completion error:', error);
      throw new Error(`Failed to generate chat completion: ${error.message}`);
    }
  }
  
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.createEmbedding({
        model: this.modelName.includes('embedding') 
          ? this.modelName 
          : 'text-embedding-3-small',
        input: text,
      });
      
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embedding error:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }
  
  estimateCost(promptTokens: number, completionTokens: number): number {
    // Preços aproximados por 1K tokens (consultar documentação para valores atualizados)
    let promptPrice, completionPrice;
    
    if (this.modelName.includes('gpt-4-turbo')) {
      promptPrice = 0.01 / 1000;  // $0.01 por 1K tokens
      completionPrice = 0.03 / 1000;  // $0.03 por 1K tokens
    } else if (this.modelName.includes('gpt-4o')) {
      promptPrice = 0.005 / 1000;  // $0.005 por 1K tokens 
      completionPrice = 0.015 / 1000;  // $0.015 por 1K tokens
    } else if (this.modelName.includes('gpt-3.5')) {
      promptPrice = 0.0005 / 1000;  // $0.0005 por 1K tokens
      completionPrice = 0.0015 / 1000;  // $0.0015 por 1K tokens
    } else if (this.modelName.includes('embedding')) {
      promptPrice = 0.0001 / 1000;  // $0.0001 por 1K tokens
      completionPrice = 0; // Embeddings não têm tokens de completamento
    } else {
      // Default para outros modelos
      promptPrice = 0.005 / 1000;
      completionPrice = 0.015 / 1000;
    }
    
    const promptCost = (promptTokens / 1000) * promptPrice;
    const completionCost = (completionTokens / 1000) * completionPrice;
    
    return promptCost + completionCost;
  }
}
```

## Processamento de Linguagem Natural

O Brainlink implementa diversas capacidades de processamento de linguagem natural (NLP) para enriquecer a interação do usuário e melhorar a automação:

### Capacidades Principais de NLP

1. **Compreensão de Linguagem Natural**
   - Interpretação de consultas em linguagem natural
   - Extração de entidades e intenções
   - Análise de sentimento e emoção

2. **Geração de Linguagem Natural**
   - Criação de resumos automáticos
   - Geração de relatórios personalizados
   - Resposta a perguntas complexas

3. **Processamento Multilíngue**
   - Tradução automática
   - Detecção de idioma
   - Ajuste de conteúdo para contextos culturais específicos

### Implementação do Gerenciador de Contexto

```typescript
// lib/ai/contextManager.ts
import { ConversationMessage, ConversationContext } from '@/types/conversation';

const MAX_CONTEXT_MESSAGES = 20;
const MAX_CONTEXT_TOKENS = 4000;

export class ContextManager {
   /**
   * Prepara o contexto para uma solicitação de modelo de IA
   */
  static prepareContext(
    messages: ConversationMessage[],
    systemPrompt?: string,
    additionalContext?: Record<string, any>
  ): ConversationContext {
    // Limitar número de mensagens para evitar estourar contexto
    const limitedMessages = this.limitContextSize(messages);
    
    // Construir contexto
    const context: ConversationContext = {
      messages: limitedMessages,
      timestamp: new Date().toISOString(),
    };
    
    // Adicionar prompt do sistema se fornecido
    if (systemPrompt) {
      context.systemPrompt = systemPrompt;
    }
    
    // Adicionar contexto adicional
    if (additionalContext) {
      context.metadata = additionalContext;
    }
    
    return context;
  }
  
  /**
   * Limita o tamanho do contexto para evitar exceder limites do modelo
   */
  static limitContextSize(
    messages: ConversationMessage[],
    maxMessages: number = MAX_CONTEXT_MESSAGES,
    maxTokens: number = MAX_CONTEXT_TOKENS
  ): ConversationMessage[] {
    if (messages.length <= maxMessages) {
      return messages;
    }
    
    // Sempre manter a mensagem mais recente
    const latestMessage = messages[messages.length - 1];
    
    // Filtrar mensagens anteriores
    let filteredMessages = messages.slice(0, messages.length - 1);
    
    // Priorizar mensagens com base em relevância e recência
    filteredMessages = this.prioritizeMessages(filteredMessages);
    
    // Limitar número de mensagens
    filteredMessages = filteredMessages.slice(-maxMessages + 1);
    
    // Adicionar a mensagem mais recente de volta
    filteredMessages.push(latestMessage);
    
    // Verificar estimativa de tokens
    const tokenCount = this.estimateTokenCount(filteredMessages);
    if (tokenCount > maxTokens) {
      // Se ainda estiver acima do limite, reduzir ainda mais
      return this.truncateToTokenLimit(filteredMessages, maxTokens);
    }
    
    return filteredMessages;
  }
  
  /**
   * Estima o número de tokens em uma lista de mensagens
   */
  static estimateTokenCount(messages: ConversationMessage[]): number {
    // Implementação simplificada - na prática, usar um tokenizador específico do modelo
    let tokenCount = 0;
    
    for (const message of messages) {
      // Estimativa simples: ~4 caracteres = 1 token
      const contentLength = message.content ? message.content.length : 0;
      tokenCount += Math.ceil(contentLength / 4);
      
      // Overhead por mensagem
      tokenCount += 5;
    }
    
    return tokenCount;
  }
  
  /**
   * Prioriza mensagens com base em relevância
   */
  private static prioritizeMessages(
    messages: ConversationMessage[]
  ): ConversationMessage[] {
    // Implementação básica: priorizar mensagens marcadas como importantes
    // e manter a distribuição temporal para preservar o fluxo da conversa
    
    // Separar mensagens importantes
    const importantMessages = messages.filter(m => m.metadata?.important === true);
    const regularMessages = messages.filter(m => m.metadata?.important !== true);
    
    // Dividir mensagens regulares em grupos para manter distribuição temporal
    const messageGroups: ConversationMessage[][] = [];
    const groupSize = Math.ceil(regularMessages.length / 5);
    
    for (let i = 0; i < regularMessages.length; i += groupSize) {
      messageGroups.push(regularMessages.slice(i, i + groupSize));
    }
    
    // Selecionar pelo menos uma mensagem de cada grupo
    const selectedMessages = messageGroups.map(group => {
      // Selecionar a primeira mensagem de cada grupo
      return group[0];
    });
    
    // Combinar mensagens importantes com as selecionadas por distribuição temporal
    return [...importantMessages, ...selectedMessages].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampA - timestampB;
    });
  }
  
  /**
   * Trunca mensagens para ajustar ao limite de tokens
   */
  private static truncateToTokenLimit(
    messages: ConversationMessage[],
    maxTokens: number
  ): ConversationMessage[] {
    // Estimar o número de tokens da última mensagem (sempre mantida)
    const lastMessage = messages[messages.length - 1];
    const lastMessageTokens = this.estimateTokenCount([lastMessage]);
    
    // Tokens disponíveis para mensagens anteriores
    const availableTokens = maxTokens - lastMessageTokens;
    
    if (availableTokens <= 0) {
      // Se não houver espaço suficiente, truncar apenas a última mensagem
      const truncatedContent = lastMessage.content?.substring(0, maxTokens * 4);
      return [{
        ...lastMessage,
        content: truncatedContent,
        metadata: { ...lastMessage.metadata, truncated: true }
      }];
    }
    
    // Começar do mais recente (exceto a última mensagem)
    let result: ConversationMessage[] = [];
    let usedTokens = 0;
    
    for (let i = messages.length - 2; i >= 0; i--) {
      const message = messages[i];
      const messageTokens = this.estimateTokenCount([message]);
      
      if (usedTokens + messageTokens <= availableTokens) {
        result.unshift(message);
        usedTokens += messageTokens;
      } else {
        // Não há espaço para a mensagem completa
        break;
      }
    }
    
    // Adicionar a última mensagem
    result.push(lastMessage);
    
    return result;
  }
}
```

### Processador de Prompts

```typescript
// lib/ai/promptProcessor.ts
import { TemplateEngine } from '@/lib/templateEngine';
import { ContextManager } from './contextManager';

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  template: string;
  systemPrompt?: string;
  parameters?: Record<string, {
    type: 'string' | 'number' | 'boolean' | 'array';
    description?: string;
    required?: boolean;
    default?: any;
  }>;
  metadata?: {
    tags?: string[];
    category?: string;
    version?: string;
    author?: string;
  };
}

export class PromptProcessor {
  /**
   * Processa um template de prompt com os parâmetros fornecidos
   */
  static processPrompt(
    template: PromptTemplate,
    parameters: Record<string, any>,
    contextMessages: any[] = []
  ): {
    prompt: string;
    systemPrompt?: string;
    context: any;
  } {
    // Validar parâmetros
    this.validateParameters(template, parameters);
    
    // Compilar prompt principal
    const prompt = TemplateEngine.render(template.template, parameters);
    
    // Compilar prompt do sistema se disponível
    let systemPrompt = undefined;
    if (template.systemPrompt) {
      systemPrompt = TemplateEngine.render(template.systemPrompt, parameters);
    }
    
    // Preparar contexto
    const context = ContextManager.prepareContext(
      contextMessages,
      systemPrompt,
      {
        templateId: template.id,
        parameters,
      }
    );
    
    return {
      prompt,
      systemPrompt,
      context,
    };
  }
  
  /**
   * Valida os parâmetros fornecidos contra o template
   */
  private static validateParameters(
    template: PromptTemplate,
    parameters: Record<string, any>
  ): void {
    if (!template.parameters) {
      return;
    }
    
    // Verificar parâmetros obrigatórios
    for (const [key, param] of Object.entries(template.parameters)) {
      if (param.required && parameters[key] === undefined) {
        throw new Error(`Required parameter missing: ${key}`);
      }
      
      // Usar valor padrão se não fornecido
      if (parameters[key] === undefined && param.default !== undefined) {
        parameters[key] = param.default;
      }
      
      // Validar tipo
      if (parameters[key] !== undefined) {
        const paramType = Array.isArray(parameters[key]) ? 'array' : typeof parameters[key];
        if (param.type !== paramType) {
          throw new Error(`Parameter ${key} should be of type ${param.type}, got ${paramType}`);
        }
      }
    }
  }
}
```

## Sistema de Recomendação

O Brainlink implementa um sistema de recomendação para sugerir conteúdo, ações e recursos relevantes aos usuários:

### Componentes do Sistema de Recomendação

1. **Recomendação de Conteúdo**
   - Sugestão de documentos e recursos relevantes
   - Identificação de conteúdo similar
   - Recomendações baseadas no histórico de navegação

2. **Sugestões de Fluxo de Trabalho**
   - Recomendação de próximas etapas em processos
   - Sugestão de automações relevantes
   - Identificação de padrões para otimização de fluxo

3. **Recomendação de Pessoas e Conexões**
   - Sugestão de colaboradores para projetos
   - Identificação de especialistas para consulta
   - Facilitação de conexões para colaboração

### Implementação do Recomendador

```typescript
// lib/ai/recommender.ts
import { prisma } from '@/lib/db/prisma';
import { ModelService } from './modelService';
import { VectorDBService } from './vectorDBService';

export enum RecommendationType {
  CONTENT = 'content',
  WORKFLOW = 'workflow',
  PEOPLE = 'people',
  RESOURCES = 'resources',
}

export interface RecommendationOptions {
  userId: string;
  contextId?: string;  // project, workspace, etc.
  limit?: number;
  filters?: Record<string, any>;
  useHistory?: boolean;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description?: string;
  relevanceScore: number;
  source: string;
  metadata: Record<string, any>;
}

export class RecommenderService {
  /**
   * Gera recomendações personalizadas para um usuário
   */
  static async getRecommendations(
    type: RecommendationType,
    options: RecommendationOptions
  ): Promise<Recommendation[]> {
    // Obter dados do contexto atual
    const contextData = await this.getContextData(options);
    
    // Gerar embeddings para o contexto
    const contextEmbedding = await this.generateContextEmbedding(contextData);
    
    // Obter recomendações baseadas no tipo
    switch (type) {
      case RecommendationType.CONTENT:
        return this.getContentRecommendations(contextEmbedding, options);
      case RecommendationType.WORKFLOW:
        return this.getWorkflowRecommendations(contextEmbedding, options);
      case RecommendationType.PEOPLE:
        return this.getPeopleRecommendations(contextEmbedding, options);
      case RecommendationType.RESOURCES:
        return this.getResourceRecommendations(contextEmbedding, options);
      default:
        throw new Error(`Unsupported recommendation type: ${type}`);
    }
  }
  
  /**
   * Coleta dados de contexto para informar recomendações
   */
  private static async getContextData(
    options: RecommendationOptions
  ): Promise<string> {
    let contextData = '';
    
    // Adicionar dados do projeto atual se disponível
    if (options.contextId) {
      const project = await prisma.project.findUnique({
        where: { id: options.contextId },
        include: {
          files: { take: 5, orderBy: { updatedAt: 'desc' } },
          promptTemplates: { take: 5, orderBy: { updatedAt: 'desc' } },
        },
      });
      
      if (project) {
        contextData += `Project: ${project.name}\n`;
        contextData += `Description: ${project.description || ''}\n`;
        contextData += `Files: ${project.files.map(f => f.name).join(', ')}\n`;
        contextData += `Templates: ${project.promptTemplates.map(t => t.name).join(', ')}\n`;
      }
    }
    
    // Adicionar histórico recente de interações do usuário
    if (options.useHistory) {
      const userActivity = await prisma.userActivity.findMany({
        where: { userId: options.userId },
        orderBy: { timestamp: 'desc' },
        take: 10,
      });
      
      if (userActivity.length > 0) {
        contextData += 'Recent Activity:\n';
        userActivity.forEach(activity => {
          contextData += `- ${activity.type}: ${activity.details}\n`;
        });
      }
    }
    
    return contextData;
  }
  
  /**
   * Gera embedding para o contexto atual
   */
  private static async generateContextEmbedding(
    contextData: string
  ): Promise<number[]> {
    // Usar modelo para gerar embedding
    const modelService = new ModelService();
    return await modelService.generateEmbedding(contextData);
  }
  
  /**
   * Obtém recomendações de conteúdo
   */
  private static async getContentRecommendations(
    contextEmbedding: number[],
    options: RecommendationOptions
  ): Promise<Recommendation[]> {
    const limit = options.limit || 5;
    
    // Usar banco de dados vetorial para encontrar conteúdo similar
    const vectorDB = new VectorDBService();
    const results = await vectorDB.similaritySearch('content', contextEmbedding, limit);
    
    // Converter resultados para formato de recomendação
    return results.map(result => ({
      id: result.id,
      type: RecommendationType.CONTENT,
      title: result.metadata.title,
      description: result.metadata.description,
      relevanceScore: result.score,
      source: 'similarity_search',
      metadata: result.metadata,
    }));
  }
  
  /**
   * Obtém recomendações de fluxo de trabalho
   */
  private static async getWorkflowRecommendations(
    contextEmbedding: number[],
    options: RecommendationOptions
  ): Promise<Recommendation[]> {
    const limit = options.limit || 3;
    
    // Usar banco de dados vetorial para encontrar fluxos de trabalho relevantes
    const vectorDB = new VectorDBService();
    const results = await vectorDB.similaritySearch('workflow', contextEmbedding, limit);
    
    // Obter fluxos de trabalho populares para o caso de não haver resultados suficientes
    if (results.length < limit) {
      const popularWorkflows = await prisma.workflow.findMany({
              orderBy: { usageCount: 'desc' },
        take: limit - results.length,
      });
      
      // Converter para formato de recomendação
      popularWorkflows.forEach(workflow => {
        results.push({
          id: workflow.id,
          metadata: {
            title: workflow.name,
            description: workflow.description,
          },
          score: 0.5, // Score padrão para recomendações não baseadas em similaridade
        });
      });
    }
    
    // Converter resultados para formato de recomendação
    return results.map(result => ({
      id: result.id,
      type: RecommendationType.WORKFLOW,
      title: result.metadata.title,
      description: result.metadata.description,
      relevanceScore: result.score,
      source: result.score > 0.5 ? 'similarity_search' : 'popular',
      metadata: result.metadata,
    }));
  }
  
  /**
   * Obtém recomendações de pessoas
   */
  private static async getPeopleRecommendations(
    contextEmbedding: number[],
    options: RecommendationOptions
  ): Promise<Recommendation[]> {
    const limit = options.limit || 5;
    
    // Identificar colaboradores com base no contexto atual
    let collaborators: any[] = [];
    
    if (options.contextId) {
      // Buscar pessoas que trabalharam no mesmo projeto
      const projectCollaborators = await prisma.projectMember.findMany({
        where: { projectId: options.contextId },
        include: { user: true },
        take: limit * 2, // Buscar mais do que o necessário para filtrar
      });
      
      collaborators = projectCollaborators.map(collab => ({
        id: collab.user.id,
        metadata: {
          title: collab.user.name,
          description: collab.user.bio || `${collab.user.name} - ${collab.role}`,
          role: collab.role,
          expertise: collab.user.skills || [],
        },
        score: 0.7, // Base score para colaboradores de projeto
      }));
    }
    
    // Complementar com especialistas baseados em similaridade de perfil
    const vectorDB = new VectorDBService();
    const expertResults = await vectorDB.similaritySearch(
      'user_profile',
      contextEmbedding,
      limit - Math.min(collaborators.length, limit)
    );
    
    // Combinar resultados
    const combinedResults = [
      ...collaborators.slice(0, limit),
      ...expertResults,
    ].slice(0, limit);
    
    // Converter para formato de recomendação
    return combinedResults.map(result => ({
      id: result.id,
      type: RecommendationType.PEOPLE,
      title: result.metadata.title,
      description: result.metadata.description,
      relevanceScore: result.score,
      source: result.score >= 0.7 ? 'project_collaboration' : 'expertise_match',
      metadata: result.metadata,
    }));
  }
  
  /**
   * Obtém recomendações de recursos
   */
  private static async getResourceRecommendations(
    contextEmbedding: number[],
    options: RecommendationOptions
  ): Promise<Recommendation[]> {
    const limit = options.limit || 5;
    
    // Usar banco de dados vetorial para encontrar recursos relevantes
    const vectorDB = new VectorDBService();
    const results = await vectorDB.similaritySearch('resource', contextEmbedding, limit);
    
    // Converter resultados para formato de recomendação
    return results.map(result => ({
      id: result.id,
      type: RecommendationType.RESOURCES,
      title: result.metadata.title,
      description: result.metadata.description,
      relevanceScore: result.score,
      source: 'similarity_search',
      metadata: result.metadata,
    }));
  }
}
```

## Personalização e Aprendizado

O Brainlink implementa mecanismos de personalização e aprendizado contínuo para melhorar os resultados da IA ao longo do tempo:

### Mecanismos de Personalização

1. **Personalização Baseada em Preferências**
   - Ajustes explícitos de configurações pelo usuário
   - Perfis personalizados para diferentes contextos
   - Controles de privacidade granulares

2. **Personalização Baseada em Comportamento**
   - Aprendizado a partir de interações anteriores
   - Adaptação com base em feedback implícito
   - Ajuste automático de parâmetros

3. **Personalização por Organização**
   - Modelos de dados específicos por organização
   - Terminologia e vocabulário corporativo personalizado
   - Aderência a políticas organizacionais

### Sistema de Feedback e Aprendizado

```typescript
// lib/ai/feedbackSystem.ts
import { prisma } from '@/lib/db/prisma';

export enum FeedbackType {
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
  RATING = 'rating',
  CORRECTION = 'correction',
  SELECTION = 'selection',
}

export interface FeedbackData {
  userId: string;
  responseId: string;
  type: FeedbackType;
  value?: any;
  details?: string;
  metadata?: Record<string, any>;
}

export class FeedbackSystem {
  /**
   * Registra feedback do usuário sobre uma resposta de IA
   */
  static async recordFeedback(
    data: FeedbackData
  ): Promise<{
    success: boolean;
    feedbackId?: string;
    error?: string;
  }> {
    try {
      // Registrar feedback no banco de dados
      const feedback = await prisma.aiFeedback.create({
        data: {
          userId: data.userId,
          responseId: data.responseId,
          type: data.type,
          value: data.value,
          details: data.details,
          metadata: data.metadata,
          timestamp: new Date(),
        },
      });
      
      // Atualizar contadores de feedback para a resposta
      await this.updateFeedbackCounters(data.responseId, data.type, data.value);
      
      // Atualizar métricas de qualidade
      await this.updateQualityMetrics(data.responseId, data.type, data.value);
      
      return {
        success: true,
        feedbackId: feedback.id,
      };
    } catch (error) {
      console.error('Error recording feedback:', error);
      return {
        success: false,
        error: 'Failed to record feedback',
      };
    }
  }
  
  /**
   * Atualiza contadores de feedback
   */
  private static async updateFeedbackCounters(
    responseId: string,
    type: FeedbackType,
    value: any
  ): Promise<void> {
    try {
      const response = await prisma.aiResponse.findUnique({
        where: { id: responseId },
      });
      
      if (!response) return;
      
      // Preparar dados de atualização
      const updateData: Record<string, any> = {
        feedbackCount: { increment: 1 },
      };
      
      // Atualizar contadores específicos
      switch (type) {
        case FeedbackType.THUMBS_UP:
          updateData.positiveCount = { increment: 1 };
          break;
        case FeedbackType.THUMBS_DOWN:
          updateData.negativeCount = { increment: 1 };
          break;
        case FeedbackType.RATING:
          if (typeof value === 'number') {
            updateData.ratingSum = { increment: value };
            updateData.ratingCount = { increment: 1 };
          }
          break;
      }
      
      // Atualizar resposta
      await prisma.aiResponse.update({
        where: { id: responseId },
        data: updateData,
      });
    } catch (error) {
      console.error('Error updating feedback counters:', error);
    }
  }
  
  /**
   * Atualiza métricas de qualidade baseadas em feedback
   */
  private static async updateQualityMetrics(
    responseId: string,
    type: FeedbackType,
    value: any
  ): Promise<void> {
    try {
      const response = await prisma.aiResponse.findUnique({
        where: { id: responseId },
        include: {
          modelExecution: true,
        },
      });
      
      if (!response || !response.modelExecution) return;
      
      // Atualizar métricas do modelo
      await prisma.aiModelMetrics.upsert({
        where: {
          modelId_date: {
            modelId: response.modelExecution.modelId,
            date: new Date().toISOString().split('T')[0],
          },
        },
        create: {
          modelId: response.modelExecution.modelId,
          date: new Date().toISOString().split('T')[0],
          requestCount: 1,
          feedbackCount: 1,
          positiveCount: type === FeedbackType.THUMBS_UP ? 1 : 0,
          negativeCount: type === FeedbackType.THUMBS_DOWN ? 1 : 0,
          ratingSum: type === FeedbackType.RATING ? (value || 0) : 0,
          ratingCount: type === FeedbackType.RATING ? 1 : 0,
        },
        update: {
          feedbackCount: { increment: 1 },
          positiveCount: type === FeedbackType.THUMBS_UP ? { increment: 1 } : undefined,
          negativeCount: type === FeedbackType.THUMBS_DOWN ? { increment: 1 } : undefined,
          ratingSum: type === FeedbackType.RATING ? { increment: value || 0 } : undefined,
          ratingCount: type === FeedbackType.RATING ? { increment: 1 } : undefined,
        },
      });
      
      // Atualizar métricas de template, se aplicável
      if (response.templateId) {
        await prisma.templateMetrics.upsert({
          where: {
            templateId_date: {
              templateId: response.templateId,
              date: new Date().toISOString().split('T')[0],
            },
          },
          create: {
            templateId: response.templateId,
            date: new Date().toISOString().split('T')[0],
            usageCount: 1,
            feedbackCount: 1,
            positiveCount: type === FeedbackType.THUMBS_UP ? 1 : 0,
            negativeCount: type === FeedbackType.THUMBS_DOWN ? 1 : 0,
            ratingSum: type === FeedbackType.RATING ? (value || 0) : 0,
            ratingCount: type === FeedbackType.RATING ? 1 : 0,
          },
          update: {
            feedbackCount: { increment: 1 },
            positiveCount: type === FeedbackType.THUMBS_UP ? { increment: 1 } : undefined,
            negativeCount: type === FeedbackType.THUMBS_DOWN ? { increment: 1 } : undefined,
            ratingSum: type === FeedbackType.RATING ? { increment: value || 0 } : undefined,
            ratingCount: type === FeedbackType.RATING ? { increment: 1 } : undefined,
          },
        });
      }
    } catch (error) {
      console.error('Error updating quality metrics:', error);
    }
  }
  
  /**
   * Obtém métricas agregadas de feedback
   */
  static async getFeedbackMetrics(
    filters: {
      modelId?: string;
      templateId?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<any> {
    try {
      const where: any = {};
      
      if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        if (filters.startDate) where.timestamp.gte = filters.startDate;
        if (filters.endDate) where.timestamp.lte = filters.endDate;
      }
      
      if (filters.userId) where.userId = filters.userId;
      
      // Consultar respostas para filtrar por modelo ou template
      let responseIds: string[] = [];
      
      if (filters.modelId || filters.templateId) {
        const responsesWhere: any = {};
        
        if (filters.modelId) {
          responsesWhere.modelExecution = {
            modelId: filters.modelId,
          };
        }
        
        if (filters.templateId) {
          responsesWhere.templateId = filters.templateId;
        }
        
        const responses = await prisma.aiResponse.findMany({
          where: responsesWhere,
          select: { id: true },
        });
        
        responseIds = responses.map(r => r.id);
        
        if (responseIds.length === 0) {
          return {
            totalFeedback: 0,
            positiveFeedback: 0,
            negativeFeedback: 0,
            averageRating: 0,
            feedbackRatio: 0,
          };
        }
        
        where.responseId = { in: responseIds };
      }
      
      // Contar feedback
      const totalFeedback = await prisma.aiFeedback.count({ where });
      
      // Contar feedback positivo
      const positiveFeedback = await prisma.aiFeedback.count({
        where: {
          ...where,
          type: FeedbackType.THUMBS_UP,
        },
      });
      
      // Contar feedback negativo
      const negativeFeedback = await prisma.aiFeedback.count({
        where: {
          ...where,
          type: FeedbackType.THUMBS_DOWN,
        },
      });
      
      // Calcular média de avaliações
      const ratings = await prisma.aiFeedback.findMany({
        where: {
          ...where,
          type: FeedbackType.RATING,
        },
        select: {
          value: true,
        },
      });
      
      const ratingValues = ratings
        .map(r => r.value)
        .filter(v => typeof v === 'number');
      
      const averageRating = ratingValues.length > 0
        ? ratingValues.reduce((sum, v) => sum + v, 0) / ratingValues.length
        : 0;
      
      // Calcular taxa de feedback
      let feedbackRatio = 0;
      
      if (responseIds.length > 0) {
        const totalResponses = responseIds.length;
        feedbackRatio = totalFeedback / totalResponses;
      } else if (filters.modelId) {
        const totalExecutions = await prisma.modelExecution.count({
          where: {
            modelId: filters.modelId,
          },
        });
        
        feedbackRatio = totalExecutions > 0 ? totalFeedback / totalExecutions : 0;
      }
      
      return {
        totalFeedback,
        positiveFeedback,
        negativeFeedback,
        positiveRatio: totalFeedback > 0 ? positiveFeedback / totalFeedback : 0,
        averageRating,
        feedbackRatio,
      };
    } catch (error) {
      console.error('Error getting feedback metrics:', error);
           throw new Error('Failed to get feedback metrics');
    }
  }
  
  /**
   * Extrai insights a partir do feedback para melhorar o sistema
   */
  static async generateFeedbackInsights(
    timeframe: 'day' | 'week' | 'month' = 'week'
  ): Promise<{
    success: boolean;
    insights?: Array<{
      category: string;
      insight: string;
      score: number;
      suggestedAction?: string;
    }>;
    error?: string;
  }> {
    try {
      // Definir intervalo de datas
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeframe) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setDate(startDate.getDate() - 30);
          break;
      }
      
      // Coletar feedback com detalhes
      const feedbackData = await prisma.aiFeedback.findMany({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
          details: {
            not: null,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          response: {
            include: {
              modelExecution: {
                select: {
                  modelId: true,
                  prompt: true,
                },
              },
            },
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
      
      // Agrupar feedback por categorias
      const feedbackByModel: Record<string, any[]> = {};
      const feedbackByTemplate: Record<string, any[]> = {};
      const feedbackByType: Record<string, any[]> = {};
      
      for (const feedback of feedbackData) {
        if (feedback.response?.modelExecution?.modelId) {
          const modelId = feedback.response.modelExecution.modelId;
          if (!feedbackByModel[modelId]) feedbackByModel[modelId] = [];
          feedbackByModel[modelId].push(feedback);
        }
        
        if (feedback.response?.templateId) {
          const templateId = feedback.response.templateId;
          if (!feedbackByTemplate[templateId]) feedbackByTemplate[templateId] = [];
          feedbackByTemplate[templateId].push(feedback);
        }
        
        const type = feedback.type;
        if (!feedbackByType[type]) feedbackByType[type] = [];
        feedbackByType[type].push(feedback);
      }
      
      // Analisar e extrair insights
      const insights: Array<{
        category: string;
        insight: string;
        score: number;
        suggestedAction?: string;
      }> = [];
      
      // Insights por modelo
      for (const [modelId, modelFeedback] of Object.entries(feedbackByModel)) {
        const totalCount = modelFeedback.length;
        const negativeCount = modelFeedback.filter(f => f.type === FeedbackType.THUMBS_DOWN).length;
        const negativeRatio = totalCount > 0 ? negativeCount / totalCount : 0;
        
        if (negativeRatio > 0.3 && totalCount >= 10) {
          // Alto índice de feedback negativo
          insights.push({
            category: 'model_performance',
            insight: `High negative feedback ratio (${(negativeRatio * 100).toFixed(1)}%) for model ${modelId}`,
            score: 0.7 + (negativeRatio - 0.3),
            suggestedAction: 'Review model configuration or consider switching to an alternative model',
          });
        }
        
        // Analisar detalhes de feedback para padrões
        const negativeDetails = modelFeedback
          .filter(f => f.type === FeedbackType.THUMBS_DOWN && f.details)
          .map(f => f.details);
        
        if (negativeDetails.length >= 5) {
          // Aqui poderia usar NLP para agrupar feedback similar
          // Implementação simplificada para ilustrar
          const commonIssues = this.identifyCommonIssues(negativeDetails);
          
          for (const [issue, count] of Object.entries(commonIssues)) {
            if (count >= 3) {
              insights.push({
                category: 'common_issues',
                insight: `Common issue with model ${modelId}: "${issue}" (mentioned ${count} times)`,
                score: 0.6 + (count / negativeDetails.length),
                suggestedAction: 'Review and improve prompts related to this issue',
              });
            }
          }
        }
      }
      
      // Insights por template
      for (const [templateId, templateFeedback] of Object.entries(feedbackByTemplate)) {
        const totalCount = templateFeedback.length;
        const negativeCount = templateFeedback.filter(f => f.type === FeedbackType.THUMBS_DOWN).length;
        const negativeRatio = totalCount > 0 ? negativeCount / totalCount : 0;
        
        if (negativeRatio > 0.25 && totalCount >= 5) {
          insights.push({
            category: 'template_quality',
            insight: `Template ${templateId} has a high negative feedback ratio (${(negativeRatio * 100).toFixed(1)}%)`,
            score: 0.65 + (negativeRatio - 0.25),
            suggestedAction: 'Review and refine template instructions or parameters',
          });
        }
      }
      
      // Insights gerais sobre o sistema
      if (feedbackData.length > 0) {
        const overallNegativeRatio = feedbackByType[FeedbackType.THUMBS_DOWN]?.length / feedbackData.length || 0;
        
        if (overallNegativeRatio > 0.2 && feedbackData.length >= 20) {
          insights.push({
            category: 'system_performance',
            insight: `Overall negative feedback ratio (${(overallNegativeRatio * 100).toFixed(1)}%) is above threshold`,
            score: 0.6 + (overallNegativeRatio - 0.2),
            suggestedAction: 'Review system configuration and most used templates',
          });
        }
      }
      
      // Ordenar insights por pontuação (mais importantes primeiro)
      insights.sort((a, b) => b.score - a.score);
      
      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error('Error generating feedback insights:', error);
      return {
        success: false,
        error: 'Failed to generate feedback insights',
      };
    }
  }
  
  /**
   * Identifica problemas comuns a partir dos detalhes de feedback
   */
  private static identifyCommonIssues(details: string[]): Record<string, number> {
    // Implementação simplificada - na prática, usaria NLP para clustering
    const issues: Record<string, number> = {};
    
    // Lista de termos-chave para procurar
    const keyIssues = [
      'incorrect information',
      'hallucination',
      'too verbose',
      'too short',
      'not relevant',
      'formatting',
      'code error',
      'wrong language',
      'misunderstood',
      'incomplete',
    ];
    
    for (const detail of details) {
      const lowerDetail = detail.toLowerCase();
      
      for (const issue of keyIssues) {
        if (lowerDetail.includes(issue)) {
          issues[issue] = (issues[issue] || 0) + 1;
        }
      }
    }
    
    return issues;
  }
}
```

## Segurança e Privacidade

A segurança e privacidade são elementos fundamentais na integração de IA no Brainlink. O sistema implementa diversas medidas para proteger dados sensíveis e garantir o uso ético da inteligência artificial:

### Medidas de Segurança e Privacidade

1. **Filtragem e Sanitização de Dados**
   - Remoção de dados sensíveis antes do envio para modelos externos
   - Sanitização de prompts para prevenir exposição de informações
   - Validação de entradas para prevenir ataques via prompt

2. **Controle de Acesso a Modelos**
   - Permissões granulares por modelo e capacidade
   - Restrições baseadas em papéis e contexto
   - Auditoria completa de todas as solicitações a modelos

3. **Retração e Controle de Informações**
   - Detecção e retração automática de conteúdo sensível
   - Verificação de conformidade antes da exibição
   - Mecanismos para apagar ou corrigir informações imprecisas

### Implementação do Filtro de Dados Sensíveis

```typescript
// lib/ai/dataSecurity.ts
import { SensitiveDataTypes, SensitivityLevel } from '@/types/security';
import { EncryptionService } from '@/lib/security/encryption';

export interface SanitizationOptions {
  sensitivityLevel: SensitivityLevel;
  dataTypes?: SensitiveDataTypes[];
  preserveStructure?: boolean;
  preserveFormatting?: boolean;
  replacementChar?: string;
}

export interface SanitizedContent {
  sanitized: string;
  sensitive: boolean;
  sensitiveDataFound: SensitiveDataTypes[];
  replacements: Array<{
    original: string;
    sanitized: string;
    type: SensitiveDataTypes;
    position: [number, number];
  }>;
}

export class AIDataSecurity {
  // Expressões regulares para detectar dados sensíveis
  private static readonly PATTERNS = {
    [SensitiveDataTypes.EMAIL]: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    [SensitiveDataTypes.PHONE]: /\b(\+\d{1,3}[\s-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
    [SensitiveDataTypes.SSN]: /\b\d{3}-\d{2}-\d{4}\b/g,
    [SensitiveDataTypes.CREDIT_CARD]: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    [SensitiveDataTypes.API_KEY]: /\b([a-zA-Z0-9_-]+\.){2}[a-zA-Z0-9_-]+\b|((sk|pk|api|key)_[a-zA-Z0-9]{24,})\b/g,
    [SensitiveDataTypes.PASSWORD]: /\b(password|senha|pwd|secret)[\s:=]+[^\s]{6,}\b/gi,
    [SensitiveDataTypes.ADDRESS]: /\b\d+\s+([A-Za-z]+(\.?)(\s[A-Za-z]+)?)+,?\s+([A-Za-z]+\s*)+,\s+[A-Z]{2}\s+\d{5}(-\d{4})?\b/g,
  };
  
  /**
   * Sanitiza conteúdo removendo ou mascarando dados sensíveis
   */
  static sanitizeContent(
    content: string,
    options: SanitizationOptions
  ): SanitizedContent {
    if (!content) {
      return {
        sanitized: '',
        sensitive: false,
        sensitiveDataFound: [],
        replacements: [],
      };
    }
    
    // Determinar quais tipos de dados procurar
    const dataTypesToCheck = options.dataTypes || Object.values(SensitiveDataTypes);
    
    let sanitized = content;
    let sensitiveDataFound: SensitiveDataTypes[] = [];
    const replacements: any[] = [];
    
    // Aplicar regex para cada tipo de dado sensível
    for (const dataType of dataTypesToCheck) {
      const pattern = this.PATTERNS[dataType];
      if (!pattern) continue;
      
      let match;
      const regex = new RegExp(pattern);
      
      while ((match = regex.exec(sanitized)) !== null) {
        const original = match[0];
        const start = match.index;
        const end = start + original.length;
        
        // Determinar tipo de sanitização com base no nível de sensibilidade
        let sanitizedValue: string;
        
        switch (options.sensitivityLevel) {
          case SensitivityLevel.HIGH:
            // Remover completamente
            sanitizedValue = '[REDACTED]';
            break;
            
          case SensitivityLevel.MEDIUM:
            // Mascarar maior parte
            sanitizedValue = this.maskSensitiveData(original, dataType);
            break;
            
          case SensitivityLevel.LOW:
            // Mascarar parcialmente
            sanitizedValue = this.partiallyMaskData(original, dataType);
            break;
            
          default:
            sanitizedValue = original;
        }
        
        // Substituir no texto sanitizado
        sanitized = sanitized.substring(0, start) + sanitizedValue + sanitized.substring(end);
        
        // Ajustar a posição do regex para a próxima busca
        const lengthDiff = sanitizedValue.length - original.length;
        regex.lastIndex += lengthDiff;
        
        // Registrar substituição
        replacements.push({
          original,
          sanitized: sanitizedValue,
          type: dataType,
          position: [start, start + sanitizedValue.length],
        });
        
        // Registrar tipo de dados encontrado
        if (!sensitiveDataFound.includes(dataType)) {
          sensitiveDataFound.push(dataType);
        }
      }
    }
    
    return {
      sanitized,
      sensitive: sensitiveDataFound.length > 0,
      sensitiveDataFound,
      replacements,
    };
  }
  
  /**
   * Máscara dados sensíveis de acordo com seu tipo
   */
  private static maskSensitiveData(
    value: string,
    type: SensitiveDataTypes
  ): string {
    switch (type) {
      case SensitiveDataTypes.EMAIL:
        const [username, domain] = value.split('@');
        return `${username.charAt(0)}***@${domain.charAt(0)}***.${domain.split('.').pop()}`;
        
      case SensitiveDataTypes.PHONE:
        return value.replace(/\d(?=\d{4})/g, '*');
        
      case SensitiveDataTypes.SSN:
        return '***-**-' + value.slice(-4);
        
      case SensitiveDataTypes.CREDIT_CARD:
        return '**** **** **** ' + value.slice(-4).replace(/\s/g, '');
        
      case SensitiveDataTypes.API_KEY:
        return value.slice(0, 4) + '****************' + value.slice(-4);
        
      case SensitiveDataTypes.PASSWORD:
        return '[PASSWORD]';
        
      case SensitiveDataTypes.ADDRESS:
        return '[ADDRESS REDACTED]';
        
      default:
        return '**********';
    }
  }
    /**
   * Mascara parcialmente dados sensíveis
   */
  private static partiallyMaskData(
    value: string,
    type: SensitiveDataTypes
  ): string {
    switch (type) {
      case SensitiveDataTypes.EMAIL:
        const [username, domain] = value.split('@');
        return `${username.charAt(0)}${username.charAt(1)}***@${domain}`;
        
      case SensitiveDataTypes.PHONE:
        return value.replace(/\d(?=\d{2})/g, '*');
        
      case SensitiveDataTypes.SSN:
        return `***-*${value.slice(5)}`;
        
      case SensitiveDataTypes.CREDIT_CARD:
        // Preservar primeiro e últimos 4 dígitos
        const parts = value.replace(/\s/g, '').match(/.{1,4}/g) || [];
        if (parts.length >= 4) {
          return `${parts[0]} **** **** ${parts[3]}`;
        }
        return '**** **** **** ' + value.slice(-4).replace(/\s/g, '');
        
      case SensitiveDataTypes.API_KEY:
        return value.slice(0, 8) + '********' + value.slice(-8);
        
      case SensitiveDataTypes.PASSWORD:
        return '[SENSITIVE]';
        
      case SensitiveDataTypes.ADDRESS:
        // Preservar apenas cidade e estado/país
        const addressParts = value.split(',');
        if (addressParts.length > 1) {
          return `[Address in ${addressParts.slice(1).join(',').trim()}]`;
        }
        return '[ADDRESS]';
        
      default:
        return value.slice(0, 2) + '******' + value.slice(-2);
    }
  }
  
  /**
   * Verifica se uma solicitação de IA é segura
   */
  static validatePromptSafety(
    prompt: string,
    sensitivityContext: SensitivityLevel = SensitivityLevel.MEDIUM
  ): {
    safe: boolean;
    risks: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }>;
    sanitizedPrompt?: string;
  } {
    const risks: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
    }> = [];
    
    // Verificar dados sensíveis
    const sanitizationResult = this.sanitizeContent(prompt, {
      sensitivityLevel: sensitivityContext,
    });
    
    if (sanitizationResult.sensitive) {
      risks.push({
        type: 'sensitive_data',
        description: `Prompt contains sensitive data: ${sanitizationResult.sensitiveDataFound.join(', ')}`,
        severity: 'high',
      });
    }
    
    // Verificar padrões de ataque de prompt
    const promptInjectionPatterns = [
      'ignore previous instructions',
      'disregard',
      'forget all',
      'new instruction',
      'system instruction:',
      '<!-- ',
      'do not follow',
      'instead of',
    ];
    
    for (const pattern of promptInjectionPatterns) {
      if (prompt.toLowerCase().includes(pattern)) {
        risks.push({
          type: 'prompt_injection',
          description: `Potential prompt injection attempt detected: "${pattern}"`,
          severity: 'medium',
        });
      }
    }
    
    // Verificar solicitações para ignorar diretrizes éticas
    const ethicalConcernPatterns = [
      'bypass',
      'workaround',
      'circumvent',
      'illegal',
      'unethical',
      'harmful',
      'dangerous',
      'exploit',
    ];
    
    for (const pattern of ethicalConcernPatterns) {
      if (prompt.toLowerCase().includes(pattern)) {
        risks.push({
          type: 'ethical_concern',
          description: `Potential request to bypass ethical guidelines: "${pattern}"`,
          severity: 'medium',
        });
      }
    }
    
    // Determinar se o prompt é seguro
    const highSeverityRisks = risks.filter(r => r.severity === 'high').length;
    const mediumSeverityRisks = risks.filter(r => r.severity === 'medium').length;
    
    const safe = highSeverityRisks === 0 && mediumSeverityRisks <= 1;
    
    return {
      safe,
      risks,
      sanitizedPrompt: sanitizationResult.sanitized,
    };
  }
  
  /**
   * Verifica se uma resposta de IA é segura para exibição
   */
  static validateResponseSafety(
    response: string
  ): {
    safe: boolean;
    issues: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      position?: [number, number];
    }>;
    sanitizedResponse?: string;
  } {
    const issues: Array<{
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      position?: [number, number];
    }> = [];
    
    // Verificar dados sensíveis que podem ter sido gerados pelo modelo
    const sanitizationResult = this.sanitizeContent(response, {
      sensitivityLevel: SensitivityLevel.MEDIUM,
    });
    
    if (sanitizationResult.sensitive) {
      issues.push({
        type: 'leaked_sensitive_data',
        description: `Response contains sensitive data patterns: ${sanitizationResult.sensitiveDataFound.join(', ')}`,
        severity: 'high',
      });
    }
    
    // Verificar conteúdo potencialmente prejudicial
    const harmfulContentPatterns = [
      { pattern: /(how to|instructions for|steps to) (hack|crack|steal|illegally|exploit)/i, type: 'harmful_instructions' },
      { pattern: /(bomb|explosive|weapon|terror|attack) (instructions|making|building|creating)/i, type: 'dangerous_content' },
      { pattern: /([0-9]{16}|([0-9]{4}[- ]){3}[0-9]{4})/i, type: 'payment_card_number' },
    ];
    
    for (const { pattern, type } of harmfulContentPatterns) {
      const matches = response.match(pattern);
      
      if (matches) {
        for (const match of matches) {
          const position = response.indexOf(match);
          
          issues.push({
            type,
            description: `Response contains potentially harmful content: "${match}"`,
            severity: 'high',
            position: [position, position + match.length],
          });
        }
      }
    }
    
    // Determinar se a resposta é segura
    const highSeverityIssues = issues.filter(r => r.severity === 'high').length;
    const safe = highSeverityIssues === 0;
    
    return {
      safe,
      issues,
      sanitizedResponse: sanitizationResult.sanitized,
    };
  }
  
  /**
   * Gera um hash seguro para armazenar consultas de forma anônima
   */
  static async hashPromptForStorage(
    prompt: string,
    userId: string
  ): Promise<string> {
    return await EncryptionService.generateHash(
      `${prompt}:${userId}`,
      process.env.PROMPT_STORAGE_SALT || 'brainlink-prompt-salt'
    );
  }
}
```

## Fluxo de Trabalho de IA

A integração de IA no Brainlink permite a criação de fluxos de trabalho compostos e automações inteligentes:

### Componentes de Fluxo de Trabalho

1. **Nós de IA**
   - Geração de texto baseada em templates
   - Categorização e extração de informações
   - Análise de sentimento e intenção

2. **Composição de Modelos**
   - Encadeamento de múltiplos modelos
   - Agregação de resultados
   - Validação cruzada de saídas

3. **Automação Inteligente**
   - Gatilhos baseados em condições complexas
   - Rotas adaptativas baseadas em análise de conteúdo
   - Aprendizado a partir de execuções anteriores

### Orquestrador de IA

```typescript
// lib/ai/orchestrator.ts
import { ModelService } from './modelService';
import { PromptProcessor, PromptTemplate } from './promptProcessor';
import { ContextManager } from './contextManager';
import { AIDataSecurity, SensitivityLevel } from './dataSecurity';
import { ModelProvider, ModelCapability } from '@/types/ai';
import { prisma } from '@/lib/db/prisma';
import { v4 as uuidv4 } from 'uuid';

export interface OrchestrationOptions {
  userId: string;
  organizationId?: string;
  projectId?: string;
  modelProvider?: ModelProvider;
  modelId?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  sensitivityLevel?: SensitivityLevel;
  contextMessages?: any[];
  sessionId?: string;
  enableCache?: boolean;
  cacheTtl?: number;
  executionTimeout?: number;
}

export class AIOrchestrator {
  /**
   * Executar uma solicitação de IA com template
   */
  static async executeWithTemplate(
    templateId: string,
    parameters: Record<string, any>,
    options: OrchestrationOptions
  ): Promise<{
    success: boolean;
    result?: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    responseId?: string;
    error?: string;
  }> {
    try {
      // Registrar início da execução
      const executionId = uuidv4();
      const startTime = Date.now();
      
      // Buscar template
      const template = await prisma.promptTemplate.findUnique({
        where: { id: templateId },
      });
      
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }
      
      // Converter para formato de template do processador
      const promptTemplate: PromptTemplate = {
        id: template.id,
        name: template.name,
        description: template.description,
        template: template.content,
        systemPrompt: template.systemPrompt,
        parameters: template.parameters as Record<string, any>,
        metadata: template.metadata as Record<string, any>,
      };
      
      // Processar template com parâmetros
      const processedPrompt = PromptProcessor.processPrompt(
        promptTemplate,
        parameters,
        options.contextMessages || []
      );
      
      // Verificar segurança do prompt
      const promptSafetyCheck = AIDataSecurity.validatePromptSafety(
        processedPrompt.prompt,
        options.sensitivityLevel || SensitivityLevel.MEDIUM
      );
      
      if (!promptSafetyCheck.safe) {
        // Registrar tentativa de uso inseguro
        await prisma.securityAlert.create({
          data: {
            type: 'UNSAFE_PROMPT',
            userId: options.userId,
            details: {
              templateId,
              risks: promptSafetyCheck.risks,
            },
            timestamp: new Date(),
          },
        });
        
        throw new Error('Prompt contains unsafe content or sensitive data');
      }
      
      // Verificar se deve usar cache
      let cachedResult = null;
      
      if (options.enableCache) {
        const promptHash = await AIDataSecurity.hashPromptForStorage(
          processedPrompt.prompt,
          options.userId
        );
        
        cachedResult = await prisma.aiResponseCache.findFirst({
          where: {
            promptHash,
            modelId: options.modelId,
            expiresAt: {
              gt: new Date(),
            },
          },
        });
      }
      
      let result: any;
      let usage: any;
      let modelId = options.modelId;
      
      // Usar cache ou executar modelo
      if (cachedResult) {
        result = cachedResult.response;
        usage = cachedResult.usage;
        modelId = cachedResult.modelId;
      } else {
        // Configurar serviço de modelo
        const modelService = new ModelService();
        
        // Selecionar modelo adequado se não especificado
        if (!modelId) {
          modelId = await this.selectAppropriateModel(
            template.capabilities as ModelCapability[],
            options.modelProvider
          );
        }
        
        // Executar modelo
        const modelResult = await modelService.generateChatCompletion(
          modelId,
          [
            ...(processedPrompt.systemPrompt ? [{ role: 'system', content: processedPrompt.systemPrompt }] : []),
            ...processedPrompt.context.messages,
            { role: 'user', content: processedPrompt.prompt },
          ],
          {
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens,
            stream: options.stream,
          }
        );
        
        result = modelResult.content;
        usage = modelResult.usage;
        
        // Armazenar em cache se habilitado
        if (options.enableCache) {
          const promptHash = await AIDataSecurity.hashPromptForStorage(
            processedPrompt.prompt,
            options.userId
          );
          
          const ttl = options.cacheTtl || 3600; // 1 hora padrão
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + ttl);
          
          await prisma.aiResponseCache.create({
            data: {
              id: uuidv4(),
              promptHash,
              modelId,
              response: result,
              usage,
              createdAt: new Date(),
              expiresAt,
            },
          });
        }
      }
      
      // Verificar segurança da resposta
      const responseSafetyCheck = AIDataSecurity.validateResponseSafety(result);
      
      if (!responseSafetyCheck.safe) {
        result = responseSafetyCheck.sanitizedResponse || 'The response was filtered due to safety concerns';
        
        // Registrar problema de segurança na resposta
        await prisma.securityAlert.create({
          data: {
            type: 'UNSAFE_RESPONSE',
            userId: options.userId,
            details: {
              templateId,
              modelId,
              issues: responseSafetyCheck.issues,
            },
            timestamp: new Date(),
          },
        });
      }
      
      // Registrar execução concluída
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      const modelExecution = await prisma.modelExecution.create({
        data: {
          id: executionId,
          userId: options.userId,
          modelId,
          prompt: processedPrompt.prompt,
          systemPrompt: processedPrompt.systemPrompt,
          parameters,
          usage,
          executionTime,
          organizationId: options.organizationId,
          projectId: options.projectId,
          timestamp: new Date(),
        },
      });
      
           // Registrar resposta
      const response = await prisma.aiResponse.create({
        data: {
          id: uuidv4(),
          modelExecutionId: modelExecution.id,
          templateId,
          content: result,
          feedbackCount: 0,
          positiveCount: 0,
          negativeCount: 0,
          timestamp: new Date(),
        },
      });
      
      return {
        success: true,
        result,
        usage,
        responseId: response.id,
      };
    } catch (error) {
      console.error('Error executing AI request with template:', error);
      return {
        success: false,
        error: error.message || 'Failed to execute AI request',
      };
    }
  }
  
  /**
   * Executar uma solicitação direta de IA sem template
   */
  static async execute(
    prompt: string,
    options: OrchestrationOptions
  ): Promise<{
    success: boolean;
    result?: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    responseId?: string;
    error?: string;
  }> {
    try {
      // Registrar início da execução
      const executionId = uuidv4();
      const startTime = Date.now();
      
      // Verificar segurança do prompt
      const promptSafetyCheck = AIDataSecurity.validatePromptSafety(
        prompt,
        options.sensitivityLevel || SensitivityLevel.MEDIUM
      );
      
      if (!promptSafetyCheck.safe) {
        // Registrar tentativa de uso inseguro
        await prisma.securityAlert.create({
          data: {
            type: 'UNSAFE_PROMPT',
            userId: options.userId,
            details: {
              risks: promptSafetyCheck.risks,
            },
            timestamp: new Date(),
          },
        });
        
        throw new Error('Prompt contains unsafe content or sensitive data');
      }
      
      // Preparar contexto
      const contextMessages = options.contextMessages || [];
      const context = ContextManager.prepareContext(contextMessages);
      
      // Verificar se deve usar cache
      let cachedResult = null;
      
      if (options.enableCache) {
        const promptHash = await AIDataSecurity.hashPromptForStorage(
          prompt,
          options.userId
        );
        
        cachedResult = await prisma.aiResponseCache.findFirst({
          where: {
            promptHash,
            modelId: options.modelId,
            expiresAt: {
              gt: new Date(),
            },
          },
        });
      }
      
      let result: any;
      let usage: any;
      let modelId = options.modelId;
      
      // Usar cache ou executar modelo
      if (cachedResult) {
        result = cachedResult.response;
        usage = cachedResult.usage;
        modelId = cachedResult.modelId;
      } else {
        // Configurar serviço de modelo
        const modelService = new ModelService();
        
        // Selecionar modelo adequado se não especificado
        if (!modelId) {
          modelId = await this.selectAppropriateModel(
            [ModelCapability.ChatCompletion],
            options.modelProvider
          );
        }
        
        // Executar modelo
        const modelResult = await modelService.generateChatCompletion(
          modelId,
          [
            ...context.messages,
            { role: 'user', content: prompt },
          ],
          {
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens,
            stream: options.stream,
          }
        );
        
        result = modelResult.content;
        usage = modelResult.usage;
        
        // Armazenar em cache se habilitado
        if (options.enableCache) {
          const promptHash = await AIDataSecurity.hashPromptForStorage(
            prompt,
            options.userId
          );
          
          const ttl = options.cacheTtl || 3600; // 1 hora padrão
          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + ttl);
          
          await prisma.aiResponseCache.create({
            data: {
              id: uuidv4(),
              promptHash,
              modelId,
              response: result,
              usage,
              createdAt: new Date(),
              expiresAt,
            },
          });
        }
      }
      
      // Verificar segurança da resposta
      const responseSafetyCheck = AIDataSecurity.validateResponseSafety(result);
      
      if (!responseSafetyCheck.safe) {
        result = responseSafetyCheck.sanitizedResponse || 'The response was filtered due to safety concerns';
        
        // Registrar problema de segurança na resposta
        await prisma.securityAlert.create({
          data: {
            type: 'UNSAFE_RESPONSE',
            userId: options.userId,
            details: {
              modelId,
              issues: responseSafetyCheck.issues,
            },
            timestamp: new Date(),
          },
        });
      }
      
      // Registrar execução concluída
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      const modelExecution = await prisma.modelExecution.create({
        data: {
          id: executionId,
          userId: options.userId,
          modelId,
          prompt,
          usage,
          executionTime,
          organizationId: options.organizationId,
          projectId: options.projectId,
          timestamp: new Date(),
        },
      });
      
      // Registrar resposta
      const response = await prisma.aiResponse.create({
        data: {
          id: uuidv4(),
          modelExecutionId: modelExecution.id,
          content: result,
          feedbackCount: 0,
          positiveCount: 0,
          negativeCount: 0,
          timestamp: new Date(),
        },
      });
      
      return {
        success: true,
        result,
        usage,
        responseId: response.id,
      };
    } catch (error) {
      console.error('Error executing AI request:', error);
      return {
        success: false,
        error: error.message || 'Failed to execute AI request',
      };
    }
  }
  
  /**
   * Seleciona o modelo mais apropriado baseado nas capacidades requeridas
   */
  private static async selectAppropriateModel(
    requiredCapabilities: ModelCapability[],
    preferredProvider?: ModelProvider
  ): Promise<string> {
    // Buscar modelos disponíveis
    const availableModels = await prisma.aiModel.findMany({
      where: {
        active: true,
        ...(preferredProvider ? { provider: preferredProvider } : {}),
      },
    });
    
    // Filtrar modelos que atendem às capacidades requeridas
    const compatibleModels = availableModels.filter(model => {
      const modelCapabilities = model.capabilities as ModelCapability[];
      return requiredCapabilities.every(cap => modelCapabilities.includes(cap));
    });
    
    if (compatibleModels.length === 0) {
      throw new Error(`No compatible model found for required capabilities: ${requiredCapabilities.join(', ')}`);
    }
    
    // Priorizar modelos (lógica simplificada)
    // Em uma implementação real, considerar histórico de uso, custo, latência, etc.
    return compatibleModels[0].id;
  }
  
  /**
   * Executar um fluxo de trabalho composto de IA
   */
  static async executeWorkflow(
    workflowId: string,
    inputs: Record<string, any>,
    options: OrchestrationOptions
  ): Promise<{
    success: boolean;
    results?: Record<string, any>;
    error?: string;
  }> {
    try {
      // Buscar definição do fluxo
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: {
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }
      
      // Registrar início da execução
      const workflowExecutionId = uuidv4();
      const startTime = Date.now();
      
      // Executar passos na ordem definida
      const stepResults: Record<string, any> = {};
      const stepOutputs: Record<string, any> = { ...inputs };
      
      for (const step of workflow.steps) {
        try {
          // Preparar parâmetros para o passo
          const stepParameters: Record<string, any> = {};
          
          // Processar parâmetros, substituindo variáveis por valores de passos anteriores
          for (const [key, value] of Object.entries(step.parameters as Record<string, any>)) {
            if (typeof value === 'string' && value.startsWith('$')) {
              // Referenciar saída de passo anterior ou entrada
              const varPath = value.substring(1).split('.');
              let source = stepOutputs;
              
              for (const pathPart of varPath) {
                if (source === undefined) break;
                source = source[pathPart];
              }
              
              stepParameters[key] = source;
            } else {
              stepParameters[key] = value;
            }
          }
          
          // Executar passo baseado no tipo
          let stepResult: any;
          
          switch (step.type) {
            case 'prompt_template':
              const templateResult = await this.executeWithTemplate(
                step.templateId,
                stepParameters,
                options
              );
              
              if (!templateResult.success) {
                throw new Error(`Step execution failed: ${templateResult.error}`);
              }
              
              stepResult = templateResult.result;
              break;
              
            case 'raw_prompt':
              const prompt = step.content;
              const promptResult = await this.execute(
                prompt,
                {
                  ...options,
                  modelId: step.modelId || options.modelId,
                }
              );
              
              if (!promptResult.success) {
                throw new Error(`Step execution failed: ${promptResult.error}`);
              }
              
              stepResult = promptResult.result;
              break;
              
            case 'conditional':
              // Avaliar condição
              const condition = step.condition as Record<string, any>;
              const conditionMet = this.evaluateCondition(condition, stepOutputs);
              
              // Determinar próximo passo com base na condição
              const nextStepId = conditionMet
                ? condition.then
                : condition.else;
                
              // Pular para o próximo passo correspondente
              stepResult = { conditionMet, nextStepId };
              break;
              
            case 'transformation':
              // Aplicar transformação aos dados
              const transformation = step.transformation as Record<string, any>;
              stepResult = this.applyTransformation(transformation, stepParameters);
              break;
              
            case 'integration':
              // Executar integração com sistema externo
              stepResult = await this.executeIntegration(
                step.integration as Record<string, any>,
                stepParameters
              );
              break;
              
            default:
              throw new Error(`Unsupported step type: ${step.type}`);
          }
          
          // Armazenar resultado
          stepResults[step.id] = stepResult;
          
          // Adicionar à saídas disponíveis para próximos passos
          stepOutputs[step.key || step.id] = stepResult;
          
          // Registrar execução do passo
          await prisma.workflowStepExecution.create({
            data: {
              id: uuidv4(),
              workflowExecutionId,
              stepId: step.id,
              input: stepParameters,
              output: stepResult,
              successful: true,
              executionTime: Date.now() - startTime,
              timestamp: new Date(),
            },
          });
        } catch (error) {
          // Registrar falha no passo
          await prisma.workflowStepExecution.create({
            data: {
              id: uuidv4(),
              workflowExecutionId,
              stepId: step.id,
              input: step.parameters,
              successful: false,
              error: error.message,
              timestamp: new Date(),
            },
          });
          
          // Verificar como proceder em caso de erro
          if (step.errorBehavior === 'stop') {
            throw error;
          }
          
          // Continuar com o próximo passo em caso de configuração para ignorar erros
          stepResults[step.id] = { error: error.message };
          stepOutputs[step.key || step.id] = { error: error.message };
        }
      }
      
      // Registrar execução completa do fluxo
      await prisma.workflowExecution.create({
        data: {
          id: workflowExecutionId,
          workflowId,
          userId: options.userId,
          input: inputs,
          output: stepOutputs,
          successful: true,
          executionTime: Date.now() - startTime,
          organizationId: options.organizationId,
          projectId: options.projectId,
          timestamp: new Date(),
        },
      });
      
      // Incrementar contador de uso
      await prisma.workflow.update({
        where: { id: workflowId },
        data: {
          usageCount: {
            increment: 1,
          },
          lastUsed: new Date(),
        },
      });
      
      return {
        success: true,
        results: stepOutputs,
      };
    } catch (error) {
      console.error('Error executing workflow:', error);
      
      // Registrar falha na execução do fluxo
      await prisma.workflowExecution.create({
        data: {
          id: uuidv4(),
          workflowId,
          userId: options.userId,
          input: inputs,
          successful: false,
          error: error.message,
          executionTime: Date.now() - new Date().getTime(),
          organizationId: options.organizationId,
          projectId: options.projectId,
          timestamp: new Date(),
        },
      });
      
      return {
        success: false,
        error: error.message || 'Failed to execute workflow',
      };
    }
  }
  
  /**
   * Avalia uma condição em um fluxo de trabalho
   */
  private static evaluateCondition(
    condition: Record<string, any>,
    context: Record<string, any>
  ): boolean {
    // Obter valor do operando esquerdo
    let leftValue = condition.left;
    
    if (typeof leftValue === 'string' && leftValue.startsWith('$')) {
      const varPath = leftValue.substring(1).split('.');
      let source = context;
      
      for (const pathPart of varPath) {
        if (source === undefined) break;
        source = source[pathPart];
      }
      
      leftValue = source;
    }
    
    // Obter valor do operando direito
    let rightValue = condition.right;
    
    if (typeof rightValue === 'string' && rightValue.startsWith('$')) {
      const varPath = rightValue.substring(1).split('.');
      let source = context;
      
      for (const pathPart of varPath) {
        if (source ===       const varPath = rightValue.substring(1).split('.');
      let source = context;
      
      for (const pathPart of varPath) {
        if (source === undefined) break;
        source = source[pathPart];
      }
      
      rightValue = source;
    }
    
    // Avaliar condição
    switch (condition.operator) {
      case 'eq':
        return leftValue === rightValue;
      case 'neq':
        return leftValue !== rightValue;
      case 'gt':
        return leftValue > rightValue;
      case 'gte':
        return leftValue >= rightValue;
      case 'lt':
        return leftValue < rightValue;
      case 'lte':
        return leftValue <= rightValue;
      case 'contains':
        return String(leftValue).includes(String(rightValue));
      case 'startsWith':
        return String(leftValue).startsWith(String(rightValue));
      case 'endsWith':
        return String(leftValue).endsWith(String(rightValue));
      case 'exists':
        return leftValue !== undefined && leftValue !== null;
      case 'empty':
        return !leftValue || (Array.isArray(leftValue) && leftValue.length === 0);
      default:
        throw new Error(`Unsupported operator: ${condition.operator}`);
    }
  }
  
  /**
   * Aplica transformação aos dados
   */
  private static applyTransformation(
    transformation: Record<string, any>,
    data: Record<string, any>
  ): any {
    switch (transformation.type) {
      case 'extract_json':
        try {
          // Extrair JSON de string
          if (typeof data.input === 'string') {
            // Procurar conteúdo entre chaves
            const match = data.input.match(/\{[\s\S]*\}/);
            if (match) {
              return JSON.parse(match[0]);
            }
            throw new Error('No JSON found in input');
          }
          throw new Error('Input is not a string');
        } catch (error) {
          throw new Error(`JSON extraction failed: ${error.message}`);
        }
        
      case 'parse_json':
        try {
          // Converter string para JSON
          return JSON.parse(data.input);
        } catch (error) {
          throw new Error(`JSON parsing failed: ${error.message}`);
        }
        
      case 'extract_values':
        try {
          // Extrair valores específicos
          const result: Record<string, any> = {};
          
          for (const [key, path] of Object.entries(transformation.mappings)) {
            const pathParts = (path as string).split('.');
            let source = data;
            
            for (const part of pathParts) {
              if (source === undefined) break;
              source = source[part];
            }
            
            result[key] = source;
          }
          
          return result;
        } catch (error) {
          throw new Error(`Value extraction failed: ${error.message}`);
        }
        
      case 'format_template':
        try {
          // Formatar string com valores
          let template = transformation.template;
          
          // Substituir placeholders
          for (const [key, value] of Object.entries(data)) {
            template = template.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
          }
          
          return template;
        } catch (error) {
          throw new Error(`Template formatting failed: ${error.message}`);
        }
        
      case 'array_operation':
        try {
          // Operações em arrays
          const array = data.input;
          
          if (!Array.isArray(array)) {
            throw new Error('Input is not an array');
          }
          
          switch (transformation.operation) {
            case 'map':
              return array.map((item: any) => {
                // Aplicar transformação a cada item
                const itemData = { item };
                return this.applyTransformation(transformation.itemTransformation, itemData);
              });
              
            case 'filter':
              return array.filter((item: any) => {
                // Avaliar condição para cada item
                const context = { item };
                return this.evaluateCondition(transformation.condition, context);
              });
              
            case 'sort':
              return [...array].sort((a: any, b: any) => {
                const aValue = a[transformation.key];
                const bValue = b[transformation.key];
                return transformation.direction === 'desc' ? bValue - aValue : aValue - bValue;
              });
              
            case 'reduce':
              return array.reduce((acc: any, item: any) => {
                // Aplicar função de redução
                const context = { accumulator: acc, item };
                return this.applyTransformation(transformation.reducer, context);
              }, transformation.initialValue);
              
            default:
              throw new Error(`Unsupported array operation: ${transformation.operation}`);
          }
        } catch (error) {
          throw new Error(`Array operation failed: ${error.message}`);
        }
        
      default:
        throw new Error(`Unsupported transformation type: ${transformation.type}`);
    }
  }
  
  /**
   * Executa integração com sistema externo
   */
  private static async executeIntegration(
    integration: Record<string, any>,
    parameters: Record<string, any>
  ): Promise<any> {
    try {
      // Implementação básica para ilustrar o conceito
      switch (integration.type) {
        case 'api_request':
          // Fazer requisição para API externa
          const { default: fetch } = await import('node-fetch');
          
          const url = integration.url.replace(/\{([^}]+)\}/g, (match: string, key: string) => {
            return parameters[key] || match;
          });
          
          const headers: Record<string, string> = {};
          
          // Adicionar headers
          if (integration.headers) {
            for (const [key, value] of Object.entries(integration.headers)) {
              headers[key] = String(value).replace(/\{([^}]+)\}/g, (match: string, paramKey: string) => {
                return parameters[paramKey] || match;
              });
            }
          }
          
          // Preparar corpo da requisição
          let body = null;
          
          if (integration.method !== 'GET' && integration.body) {
            if (typeof integration.body === 'string') {
              body = integration.body.replace(/\{([^}]+)\}/g, (match: string, key: string) => {
                return parameters[key] || match;
              });
            } else {
              body = JSON.stringify(integration.body);
            }
          }
          
          // Executar requisição
          const response = await fetch(url, {
            method: integration.method || 'GET',
            headers,
            body,
          });
          
          // Processar resposta
          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          }
          
          return await response.text();
          
        case 'database_query':
          // Executar consulta no banco de dados
          const { query, values } = integration;
          
          // Substituir placeholders nos valores
          const parsedValues = values.map((value: any) => {
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              const key = value.slice(1, -1);
              return parameters[key];
            }
            return value;
          });
          
          // Na prática, usar Prisma ou outro ORM para executar a consulta
          // Implementação simulada para ilustrar
          return {
            success: true,
            message: 'Database query executed',
            query,
            values: parsedValues,
          };
          
        case 'event_dispatch':
          // Disparar evento para outros sistemas
          const eventData = {
            type: integration.eventType,
            payload: {},
          };
          
          // Construir payload
          for (const [key, value] of Object.entries(integration.payload)) {
            if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
              const paramKey = value.slice(1, -1);
              eventData.payload[key] = parameters[paramKey];
            } else {
              eventData.payload[key] = value;
            }
          }
          
          // Na prática, usar um sistema de eventos como Redis Pub/Sub, Kafka, etc.
          // Implementação simulada para ilustrar
          console.log('Event dispatched:', eventData);
          
          return {
            success: true,
            eventId: uuidv4(),
            timestamp: new Date().toISOString(),
          };
          
        default:
          throw new Error(`Unsupported integration type: ${integration.type}`);
      }
    } catch (error) {
      console.error('Integration execution error:', error);
      throw new Error(`Integration failed: ${error.message}`);
    }
  }
}
```

## Melhores Práticas

Para garantir o uso efetivo e responsável da IA no Brainlink, recomendamos as seguintes melhores práticas:

### Design de Prompts

1. **Seja específico e claro**
   - Forneça instruções detalhadas sobre o resultado desejado
   - Defina o formato, estilo e tom esperados
   - Inclua exemplos quando aplicável

2. **Use prompts de sistema adequadamente**
   - Reserve prompts de sistema para definir o papel e restrições gerais
   - Mantenha consistência entre prompts de sistema e prompts de usuário
   - Evite sobrecarga de instruções conflitantes

3. **Estruture prompts para raciocínio**
   - Divida problemas complexos em etapas
   - Solicite explicações do raciocínio (chain-of-thought)
   - Peça verificações e revisões quando necessário

### Gestão de Contexto

1. **Gerencie o tamanho do contexto**
   - Priorize informações mais relevantes quando o contexto for limitado
   - Resuma informações quando necessário para economizar tokens
   - Considere o uso de técnicas como recuperação de contexto dinâmico

2. **Mantenha o histórico relevante**
   - Remova interações não relevantes ao enviar um novo contexto
   - Preserve informações importantes para a continuidade da conversa
   - Considere o uso de resumos periódicos para conversas longas

3. **Personalize com informações contextuais**
   - Inclua dados relevantes do usuário ou projeto no contexto
   - Adapte o tom e estilo com base em preferências do usuário
   - Forneça contexto adicional para melhorar a relevância das respostas

### Avaliação e Melhoria

1. **Colete feedback estruturado**
   - Implemente mecanismos para avaliação fácil de respostas
   - Solicite detalhes sobre problemas específicos
   - Use métricas para medir a qualidade ao longo do tempo

2. **Iterate on templates**
   - Revise e atualize templates com base no feedback
   - Teste variações para identificar abordagens mais eficazes
   - Documente práticas bem-sucedidas para referência futura

3. **Monitore uso e impacto**
   - Acompanhe métricas de utilização e satisfação
   - Identifique casos de uso de alto valor
   - Avalie o ROI das diferentes implementações de IA

## Implementação de Referência

Para ilustrar a implementação da integração de IA, fornecemos um exemplo de API endpoint que utiliza os componentes descritos neste documento:

```typescript
// pages/api/ai/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AIOrchestrator } from '@/lib/ai/orchestrator';
import { withRateLimit } from '@/lib/middleware/rateLimit';
import { withErrorHandler } from '@/lib/middleware/errorHandler';
import { SensitivityLevel } from '@/types/security';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Verificar autenticação
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Extrair parâmetros
  const {
    templateId,
    parameters,
    prompt,
    modelId,
    temperature,
    maxTokens,
    contextMessages,
    stream,
    sensitivityLevel,
  } = req.body;
  
  try {
    // Configurar opções
    const options = {
      userId: session.user.id,
      organizationId: req.headers['x-organization-id'] as string,
      projectId: req.headers['x-project-id'] as string,
      modelId,
      temperature,
      maxTokens,
      stream: !!stream,
      sensitivityLevel: sensitivityLevel || SensitivityLevel.MEDIUM,
      contextMessages,
      enableCache: true,
    };
    
    let result;
    
    // Executar solicitação baseada em template ou prompt direto
    if (templateId) {
      // Verificar permissão para usar o template
      // ... implementação da verificação de permissão
      
      result = await AIOrchestrator.executeWithTemplate(
        templateId,
        parameters || {},
        options
      );
    } else if (prompt) {
      result = await AIOrchestrator.execute(
        prompt,
        options
      );
    } else {
      return res.status(400).json({
        error: 'Either templateId or prompt is required',
      });
    }
    
    if (result.success) {
      return res.status(200).json({
        content: result.result,
        usage: result.usage,
        responseId: result.responseId,
      });
    } else {
      return res.status(400).json({
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error in AI generate endpoint:', error);
    return res.status(500).json({
      error: 'Failed to process AI request',
    });
  }
};

// Aplicar middlewares
export default withErrorHandler(
  withRateLimit({
    type: 'user',
    points: 50,
    duration: 60,
  })(handler)
);
```

Os componentes e padrões descritos neste documento fornecem uma base sólida para implementar recursos avançados de IA na plataforma Brainlink, garantindo flexibilidade, escalabilidade e segurança.