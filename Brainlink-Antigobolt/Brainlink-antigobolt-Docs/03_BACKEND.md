# BACKEND: BRAINLINK

**ID Documento**: BL-BE-001  
**Versão**: 1.0.0  
**Data**: 2025-03-19  
**Dependências**: BL-VC-001, BL-AT-001  

## Visão Geral de Backend

O backend do Brainlink é projetado como uma arquitetura híbrida que combina componentes serverless, APIs RESTful e processamento local. Esta abordagem permite flexibilidade de implantação tanto em ambientes web quanto desktop, otimizando o acesso a recursos do sistema e o processamento de IA.

A arquitetura de backend prioriza a segurança, escalabilidade e extensibilidade, fornecendo uma interface unificada para gerenciar acesso a arquivos, comunicação com LLMs, execução de código, processamento de plugins e integração com serviços externos.

### Objetivos Principais do Backend

1. **Processamento Eficiente**: Otimizar comunicação com modelos de IA e execução de código
2. **Segurança Robusta**: Proteger dados sensíveis e isolar execução de código não confiável
3. **Extensibilidade Via API**: Fornecer interfaces estáveis para plugins e integrações
4. **Acesso Unificado a Recursos**: Abstrair acesso a sistemas de arquivos locais e remotos
5. **Adaptabilidade de Implantação**: Funcionar tanto em ambientes serverless quanto desktop

## Stack e Frameworks

### Tecnologias Core

1. **Next.js API Routes** - Camada principal de API para aplicação web
   - Serverless functions com APIs RESTful
   - Integração com autenticação NextAuth.js
   - Edge runtime para processamento otimizado
   - Middleware para autorização e validação

2. **FastAPI (Python)** - Microserviço para processamento pesado de IA
   - Endpoints otimizados para streaming de respostas de LLMs
   - Integração nativa com bibliotecas Python de ML/IA
   - Processamento assíncrono para respostas rápidas
   - Deploy como serviço separado ou integrado via API proxy

3. **Electron/Tauri Backend** - Para versão desktop
   - APIs nativas para acesso ao sistema operacional
   - Execução de comandos do sistema e shell
   - Gestão de processos isolados para segurança
   - Bridge para comunicação com frontend

### Armazenamento de Dados

1. **Supabase** - Backend-as-a-Service principal
   - PostgreSQL para dados estruturados
   - Row-Level Security para controle de acesso granular
   - Storage para arquivos e assets
   - Autenticação e gestão de usuários

2. **Local Storage APIs**
   - IndexedDB para persistência no navegador
   - File System Access API para acesso a arquivos (web)
   - APIs nativas de filesystem para versão desktop
   - LocalForage como camada de abstração

3. **Distributed Storage**
   - Integração com GitHub/GitLab para código e versionamento
   - Conexão com provedores de armazenamento (GDrive, Dropbox)
   - Sincronização seletiva entre ambientes

### APIs e Integrações

1. **LLM Connectors**
   - OpenAI API (GPT-4, GPT-3.5)
   - Anthropic API (Claude)
   - Groq API (Mixtral, LLaMA)
   - Ollama para modelos locais
   - SDK para integração de provedores personalizados

2. **Development Tools Integration**
   - GitHub/GitLab API para gerenciamento de repos
   - Vercel/Netlify API para deploy automatizado
   - NPM/Yarn/PNPM para gerenciamento de pacotes
   - Cloud IDEs (GitHub Codespaces, Gitpod) para desenvolvimento remoto

3. **Serviços Externos**
   - Google APIs (Drive, Docs, Sheets)
   - Supabase/Firebase/MongoDB para dados
   - Stripe para pagamentos (versão premium futura)
   - OAuth para integrações diversas

### Sistema de Plugins

1. **Plugin SDK**
   - API TypeScript para desenvolvimento de plugins
   - Sistema de comunicação entre plugins e core
   - Versionamento semântico para compatibilidade
   - Documentação e ferramentas de validação

2. **Sandbox de Execução**
   - Isolamento de plugins via Web Workers
   - Permission system para controle de acesso
   - Rate limiting e monitoramento de recursos
   - Estado isolado para prevenção de conflitos

## Arquitetura de API

A arquitetura de API do Brainlink segue o paradigma RESTful com adições estratégicas de WebSockets para comunicação em tempo real e streaming:

### 1. API Central

A API central do Brainlink é organizada em torno de recursos chave:

#### Estrutura de Endpoints

```
/api/
├── auth/                     # Autenticação e gestão de sessões
│   ├── login                 # Login com diferentes providers
│   ├── logout                # Encerramento de sessão
│   ├── session               # Status da sessão atual
│   └── providers/            # Provedores OAuth disponíveis
│
├── workspaces/               # Gerenciamento de workspaces
│   ├── [id]                  # Operações em workspace específico
│   └── templates/            # Templates de workspace
│
├── files/                    # Sistema de arquivos virtual
│   ├── local/                # Acesso a arquivos locais (FSA API)
│   ├── remote/               # Arquivos em armazenamento remoto
│   └── [provider]/           # Arquivos em provedores específicos
│
├── llm/                      # Interfaces de IA e LLM
│   ├── providers/            # Configuração de provedores
│   ├── chat                  # Endpoint de chat com streaming
│   ├── completion            # Endpoint de completion
│   └── tools/                # Ferramentas específicas de IA
│
├── execution/                # Execução de código
│   ├── run                   # Executa código em ambiente seguro
│   ├── terminal              # Opera comandos no terminal
│   └── environments/         # Ambientes de execução disponíveis
│
├── plugins/                  # Sistema de plugins
│   ├── registry              # Gerenciamento do registry de plugins
│   ├── [id]/                 # Operações em plugins específicos
│   └── marketplace/          # Descoberta e instalação
│
├── integrations/             # Integrações com serviços externos
│   ├── github/               # GitHub API
│   ├── vercel/               # Vercel API
│   ├── supabase/             # Supabase API
│   └── ...                   # Outras integrações
│
└── system/                   # Operações do sistema
    ├── logs                  # Acesso a logs
    ├── health                # Status de saúde
    └── settings              # Configurações globais
```

#### Padrões de Endpoint

Seguimos convenções RESTful consistentes:

- `GET /api/resource` - Lista recursos
- `GET /api/resource/:id` - Obtém detalhes de um recurso
- `POST /api/resource` - Cria novo recurso
- `PUT /api/resource/:id` - Atualiza recurso completo
- `PATCH /api/resource/:id` - Atualiza recurso parcialmente
- `DELETE /api/resource/:id` - Remove recurso

### 2. Implementação de API REST

```typescript
// pages/api/workspaces/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createWorkspace, getWorkspaces } from '@/lib/services/workspace';
import { z } from 'zod';

const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  template: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method === 'GET') {
    try {
      const workspaces = await getWorkspaces(session.user.id);
      return res.status(200).json(workspaces);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      return res.status(500).json({ error: 'Failed to retrieve workspaces' });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const validation = CreateWorkspaceSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: 'Invalid request data', 
          details: validation.error.format() 
        });
      }
      
      const workspace = await createWorkspace({
        ...validation.data,
        userId: session.user.id,
      });
      
      return res.status(201).json(workspace);
    } catch (error) {
      console.error('Error creating workspace:', error);
      return res.status(500).json({ error: 'Failed to create workspace' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

### 3. Implementação de WebSockets para Streaming

O Brainlink utiliza WebSockets para streaming de respostas de IA e ações em tempo real:

```typescript
// lib/server/websocket.ts
import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { verifyToken } from '@/lib/auth/token';

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  
  io.use(async (socket, next) => {
    // Autenticação do socket
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = await verifyToken(token);
      socket.data.user = decoded.user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    const userId = socket.data.user.id;
    
    // Juntar o usuário à sua sala própria para mensagens específicas
    socket.join(`user:${userId}`);
    
    // Configurar handlers para eventos específicos
    
    // Streaming de chat
    socket.on('llm:stream:start', async (data) => {
      // Handler para iniciar streaming de resposta de LLM
      // ...
    });
    
    // Notificação de atualizações de arquivo
    socket.on('file:update', (data) => {
      // Broadcast para outros clientes conectados do mesmo usuário
      socket.to(`user:${userId}`).emit('file:updated', data);
    });
    
    // Terminal
    socket.on('terminal:command', async (data) => {
      // Processamento de comandos de terminal
      // ...
    });
    
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
  
  return io;
};
```

### 4. API FastAPI para Processamento de IA

O módulo de IA em Python utiliza FastAPI para endpoints de alta performance:

```python
# fastapi_service/main.py
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional, Dict, Any, List
import asyncio
import json
from pydantic import BaseModel
from .auth import validate_token
from .llm_providers import get_llm_provider
from .models import ChatMessage, ChatResponse, StreamChunk

app = FastAPI(title="Brainlink AI Backend")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://brainlink.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    provider: str
    model: str
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = None
    stream: Optional[bool] = False
    tools: Optional[List[Dict[str, Any]]] = None

@app.post("/api/chat")
async def chat_endpoint(
    request: ChatRequest,
    current_user: Dict = Depends(validate_token),
):
    try:
        provider = get_llm_provider(request.provider)
        
        if request.stream:
            return StreamingResponse(
                provider.stream_chat(
                    messages=request.messages,
                    model=request.model,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                    tools=request.tools,
                ),
                media_type="text/event-stream"
            )
        else:
            response = await provider.chat(
                messages=request.messages,
                model=request.model,
                temperature=request.temperature,
                max_tokens=request.max_tokens,
                tools=request.tools,
            )
            return response
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/text-to-speech")
async def text_to_speech(
    text: str,
    voice: str = "alloy",
    current_user: Dict = Depends(validate_token),
):
    # Implementação do endpoint de text-to-speech
    # ...

@app.post("/api/whisper/transcribe")
async def transcribe_audio(
    audio_file: UploadFile,
    background_tasks: BackgroundTasks,
    current_user: Dict = Depends(validate_token),
):
    # Implementação da transcrição de áudio
    # ...

# Mais endpoints...
```

## Serviços e Microserviços

O Brainlink implementa uma arquitetura de serviços modulares que podem funcionar tanto de forma monolítica quanto distribuída, dependendo do ambiente de implantação:

### 1. Core API Service

Serviço principal que coordena outros módulos e gerencia o estado global:

```typescript
// lib/services/core.ts
import { EventEmitter } from 'events';

export class CoreService {
  private static instance: CoreService;
  private eventBus: EventEmitter;
  private services: Map<string, any>;
  
  private constructor() {
    this.eventBus = new EventEmitter();
    this.eventBus.setMaxListeners(100); // Suporte a muitos listeners
    this.services = new Map();
  }
  
  public static getInstance(): CoreService {
    if (!CoreService.instance) {
      CoreService.instance = new CoreService();
    }
    return CoreService.instance;
  }
  
  public registerService(name: string, service: any): void {
    this.services.set(name, service);
    this.eventBus.emit('service:registered', { name });
  }
  
  public getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not registered`);
    }
    return service as T;
  }
  
  public on(event: string, listener: (...args: any[]) => void): void {
    this.eventBus.on(event, listener);
  }
  
  public emit(event: string, data: any): void {
    this.eventBus.emit(event, data);
  }
  
  public async initialize(): Promise<void> {
    // Inicializar serviços core na ordem correta
    this.eventBus.emit('core:initializing');
    
    // Registro de serviços básicos
    // ...
    
    this.eventBus.emit('core:initialized');
  }
}

export const coreService = CoreService.getInstance();
```

### 2. Workspace Service

Gerencia workspaces e suas configurações:

```typescript
// lib/services/workspace.ts
import { coreService } from './core';
import { supabaseClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { Workspace, Panel } from '@/types';

export class WorkspaceService {
  constructor() {
    coreService.registerService('workspace', this);
  }
  
  async getWorkspaces(userId: string): Promise<Workspace[]> {
    const { data, error } = await supabaseClient
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
      
    if (error) {
      throw new Error(`Failed to fetch workspaces: ${error.message}`);
    }
    
    return data;
  }
  
  async getWorkspace(id: string): Promise<Workspace> {
    const { data, error } = await supabaseClient
      .from('workspaces')
      .select('*, panels(*)')
      .eq('id', id)
      .single();
      
    if (error) {
      throw new Error(`Failed to fetch workspace: ${error.message}`);
    }
    
    return data;
  }
  
  async createWorkspace(data: {
    name: string;
    description?: string;
    userId: string;
    template?: string;
  }): Promise<Workspace> {
    const workspaceId = uuidv4();
    
    // Criar workspace básico
    const { data: workspace, error } = await supabaseClient
      .from('workspaces')
      .insert({
        id: workspaceId,
        name: data.name,
        description: data.description || '',
        user_id: data.userId,
      })
      .select()
      .single();
      
    if (error) {
      throw new Error(`Failed to create workspace: ${error.message}`);
    }
    
    // Se houver template, criar painéis iniciais baseados no template
    if (data.template) {
      await this.applyTemplate(workspaceId, data.template);
    }
    
    coreService.emit('workspace:created', { workspace });
    
    return workspace;
  }
  
  async updateWorkspace(
    id: string, 
    data: Partial<Workspace>
  ): Promise<Workspace> {
    const { data: workspace, error } = await supabaseClient
      .from('workspaces')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw new Error(`Failed to update workspace: ${error.message}`);
    }
    
    coreService.emit('workspace:updated', { workspace });
    
    return workspace;
  }
  
  async deleteWorkspace(id: string): Promise<void> {
    // Primeiro excluir painéis relacionados (cascade não é garantido)
    const { error: panelsError } = await supabaseClient
      .from('panels')
      .delete()
      .eq('workspace_id', id);
      
    if (panelsError) {
      throw new Error(`Failed to delete workspace panels: ${panelsError.message}`);
    }
    
    const { error } = await supabaseClient
      .from('workspaces')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw new Error(`Failed to delete workspace: ${error.message}`);
    }
    
    coreService.emit('workspace:deleted', { id });
  }
  
  private async applyTemplate(workspaceId: string, templateId: string): Promise<void> {
    // Implementação da aplicação de template
    // ...
  }
  
  // Outros métodos relacionados a workspaces...
}

// Inicializar o serviço
export const workspaceService = new WorkspaceService();
```

### 3. File Service

Gerencia acesso a arquivos locais e remotos:

```typescript
// lib/services/file.ts
import { coreService } from './core';
import { supabaseClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import type { FileInfo, FileContent, FileTree } from '@/types';

export class FileService {
  constructor() {
    coreService.registerService('file', this);
  }
  
  // Acesso a arquivos locais via FileSystem Access API
  async accessLocalFiles(): Promise<FileSystemDirectoryHandle | null> {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      return directoryHandle;
    } catch (error) {
      console.error('Error accessing local files:', error);
      return null;
    }
  }
  
  async readLocalFile(fileHandle: FileSystemFileHandle): Promise<string> {
    const file = await fileHandle.getFile();
    return await file.text();
  }
  
  async writeLocalFile(
    fileHandle: FileSystemFileHandle, 
    content: string
  ): Promise<void> {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  }
  
  // Acesso a arquivos no Supabase Storage
  async listRemoteFiles(
    userId: string, 
    path: string = ''
  ): Promise<FileInfo[]> {
    const { data, error } = await supabaseClient
      .storage
      .from('user-files')
      .list(`${userId}/${path}`);
      
    if (error) {
      throw new Error(`Failed to list files: ${error.message}`);
    }
    
    return data.map(item => ({
      id: item.id || uuidv4(),
      name: item.name,
      path: path ? `${path}/${item.name}` : item.name,
      type: item.metadata?.mimetype || (item.id ? 'file' : 'directory'),
      size: item.metadata?.size || 0,
      lastModified: item.updated_at,
      isRemote: true,
    }));
  }
  
  async getRemoteFile(
    userId: string, 
    path: string
  ): Promise<FileContent> {
    const { data, error } = await supabaseClient
      .storage
      .from('user-files')
      .download(`${userId}/${path}`);
      
    if (error) {
      throw new Error(`Failed to get file: ${error.message}`);
    }
    
    // Converter para texto ou outro formato conforme necessário
    const text = await data.text();
    
    return {
      content: text,
      path,
      type: data.type,
      lastModified: new Date().toISOString(),
      isRemote: true,
    };
  }
  
  async putRemoteFile(
    userId: string, 
    path: string, 
    content: string | Blob
  ): Promise<void> {
    const { error } = await supabaseClient
      .storage
      .from('user-files')
      .upload(`${userId}/${path}`, content, {
        upsert: true,
      });
      
    if (error) {
      throw new Error(`Failed to put file: ${error.message}`);
    }
    
    coreService.emit('file:updated', { path, isRemote: true });
  }
  
  // Métodos para interagir com GitHub/GitLab
  async listGitHubFiles(
    repo: string, 
    path: string = '', 
    branch: string = 'main'
  ): Promise<FileInfo[]> {
    // Implementação...
    return [];
  }
  
  // Outros métodos relacionados a arquivos...
}

// Inicializar o serviço
export const fileService = new FileService();
```

### 4. LLM Service

Gerencia comunicação com diferentes provedores de LLM:

```typescript
// lib/services/llm.ts
import { coreService } from './core';
import OpenAI from 'openai';
import { Anthropic } from '@anthropic-ai/sdk';
import { GroqClient } from 'groq-sdk';
import type { ChatMessage, ChatOptions, LLMProvider, StreamCallbacks } from '@/types';

export class LLMService {
  private providers: Map<string, LLMProvider>;
  
  constructor() {
    this.providers = new Map();
    coreService.registerService('llm', this);
    
    // Registrar providers padrão
    this.registerBuiltInProviders();
  }
  
  private registerBuiltInProviders(): void {
    // OpenAI Provider
    this.registerProvider('openai', {
      id: 'openai',
      name: 'OpenAI',
      models: [
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
      ],
      requiresApiKey: true,
      
      async chat(messages, options) {
        const client = new OpenAI({ apiKey: options.apiKey });
        const response = await client.chat.completions.create({
          model: options.model,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            name: m.name,
          })),
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: false,
          tools: options.tools,
        });
        
        return {
          id: response.id,
          message: {
            role: 'assistant',
            content: response.choices[0]?.message.content || '',
            toolCalls: response.choices[0]?.message.tool_calls,
          },
          usage: response.usage ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          } : undefined,
        };
      },
      
      async streamChat(messages, options, callbacks) {
        const client = new OpenAI({ apiKey: options.apiKey });
        const stream = await client.chat.completions.create({
          model: options.model,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            name: m.name,
          })),
          temperature: options.temperature,
          max_tokens: options.maxTokens,
          stream: true,
          tools: options.tools,
        });
        
        let responseId = '';
        let accumulatedContent = '';
        
        for await (const chunk of stream) {
          if (!responseId && chunk.id) {
            responseId = chunk.id;
            callbacks.onStart?.(responseId);
          }
          
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            accumulatedContent += content;
            callbacks.onToken?.(content);
          }
          
          // Processar tool calls se presentes
          if (chunk.choices[0]?.delta?.tool_calls) {
            // Implementação para tool calls em streaming
          }
        }
        
        callbacks.onComplete?.({
          id: responseId,
          message: {
            role: 'assistant',
            content: accumulatedContent,
          },
        });
      },
    });
    
    // Implementações semelhantes para outros provedores...
  }
  
  public registerProvider(id: string, provider: LLMProvider): void {
    this.providers.set(id, provider);
    coreService.emit('llm:provider:registered', { id, name: provider.name });
  }
  
  public getProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }
  
  public getProvider(id: string): LLMProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`LLM provider ${id} not found`);
    }
    return provider;
  }
  
  public async chat(
    providerId: string, 
    messages: ChatMessage[], 
    options: ChatOptions
  ) {
    const provider = this.getProvider(providerId);
    return await provider.chat(messages, options);
  }
  
  public async streamChat(
    providerId: string, 
    messages: ChatMessage[], 
    options: ChatOptions, 
    callbacks: StreamCallbacks
  ) {
    const provider = this.getProvider(providerId);
    return await provider.streamChat(messages, options, callbacks);
  }
}

// Inicializar o serviço
export const llmService = new LLMService();
```

### 5. Executor Service

Responsável por executar código de forma segura:

```typescript
// lib/services/executor.ts
import { coreService } from './core';
import { createSandbox } from '@/lib/sandbox';
import type { ExecutionResult, ExecutionOptions } from '@/types';

export class ExecutorService {
  constructor() {
    coreService.registerService('executor', this);
  }
  
  async executeJavaScript(
    code: string, 
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const sandbox = createSandbox({
      allowNetwork: options.allowNetwork || false,
      timeout: options.timeout || 5000,
      console: {
        log: (...args) => this.handleConsoleOutput('log', ...args),
        error: (...args) => this.handleConsoleOutput('error', ...args),
        warn: (...args) => this.handleConsoleOutput('warn', ...args),
        info: (...args) => this.handleConsoleOutput('info', ...args),
      },
    });
    
    try {
      const startTime = performance.now();
      const result = await sandbox.executeCode(code);
      const endTime = performance.now();
      
      return {
        success: true,
        result,
        executionTime: endTime - startTime,
        output: sandbox.getConsoleOutput(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        output: sandbox.getConsoleOutput(),
      };
    }
  }
  
  async executeCommand(
    command: string, 
    options: { cwd?: string, env?: Record<string, string> } = {}
  ): Promise<ExecutionResult> {
    // Na versão web, isso dependerá de uma API
    // Na versão desktop, podemos usar APIs nativas
    
    if (typeof window !== 'undefined' && !window.electron) {
      // Versão web - chamar API
      const response = await fetch('/api/execution/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, options }),
      });
      
      return await response.json();
    } else {
      // Versão desktop com Electron/Tauri
      // Implementação usando APIs nativas...
      return {
        success: false,
        error: 'Not implemented in this environment',
        output: [],
      };
    }
  }
  
  private handleConsoleOutput(type: string, ...args: any[]): void {
    const output = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
    
    coreService.emit('executor:console', {
      type,
      output,
      timestamp: new Date().toISOString(),
    });
  }
}

// Inicializar o serviço
export const executorService = new ExecutorService();
```

## Processamento de Dados

O Brainlink implementa estratégias eficientes para processamento de dados em diferentes contextos:

### 1. Transcrição e Processamento de Áudio

```typescript
// lib/services/audio.ts
import { coreService } from './core';
import OpenAI from 'openai';
import { createChunkDecoder, createEncoder } from '@/lib/utils/audio';
import type { AudioTranscriptionOptions, AudioTranscriptionResult } from '@/types';

export class AudioService {
  constructor() {
    coreService.registerService('audio', this);
  }
  
  async recordAudio(): Promise<Blob> {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];
        
        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          resolve(audioBlob);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        });
        
        // Configurar timeout
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 30000); // Máximo 30 segundos
        
        mediaRecorder.start();
        
        // Expor o controlador para o sistema
        coreService.emit('audio:recording:started', { 
          stop: () => mediaRecorder.stop() 
        });
        
      } catch (error) {
        reject(error);
      }
    });
  }
  
  async transcribeAudio(
    audio: Blob | File, 
    options: AudioTranscriptionOptions = {}
  ): Promise<AudioTranscriptionResult> {
    // Se temos API key local, fazer transcrição direta
    const apiKey = options.apiKey || (await this.getApiKey('openai'));
    
    if (apiKey) {
      const client = new OpenAI({ apiKey });
      
      const formData = new FormData();
      formData.append('file', audio);
      formData.append('model', options.model || 'whisper-1');
      
      if (options.language) {
        formData.append('language', options.language);
      }
      
      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }
      
      const response = await client.audio.transcriptions.create({
        file: audio as File,
        model: options.model || 'whisper-1',
        language: options.language,
        prompt: options.prompt,
      });
      
      return {
        text: response.text,
        language: response.language || undefined,
      };
    } else {
      // Caso contrário, enviar para nosso endpoint de API
      const formData = new FormData();
      formData.append('audio', audio);
      
      if (options.language) {
        formData.append('language', options.language);
      }
      
      if (options.prompt) {
        formData.append('prompt', options.prompt);
      }
      
      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      return await response.json();
    }
  }
  
  private async getApiKey(provider: string): Promise<string | null> {
    // Buscar chave de API do armazenamento seguro
    try {
      const apiKeys = JSON.parse(localStorage.getItem('secureApiKeys') || '{}');
      return apiKeys[provider] || null;
    } catch {
      return null;
    }
  }
}

// Inicializar o serviço
export const audioService = new AudioService();
```

### 2. Processamento de Prompts

```typescript
// lib/services/reprompter.ts
import { coreService } from './core';
import { llmService } from './llm';
import type { RepromptResult, RepromptOptions } from '@/types';

export class ReprompterService {
  constructor() {
    coreService.registerService('reprompter', this);
  }
  
  async optimizePrompt(
    prompt: string, 
    options: RepromptOptions = {}
  ): Promise<RepromptResult> {
    const mode = options.mode || 'auto';
    
    switch (mode) {
      case 'auto':
        return await this.automaticOptimization(prompt, options);
      case 'grammar':
        return await this.grammarCorrection(prompt);
      case 'expand':
        return await this.expandPrompt(prompt, options);
      case 'simplify':
        return await this.simplifyPrompt(prompt);
      case 'structure':
        return await this.structurePrompt(prompt, options);
      default:
        return { 
          original: prompt, 
          optimized: prompt,
          changes: []
        };
    }
  }
  
  private async automaticOptimization(
    prompt: string,
    options: RepromptOptions
  ): Promise<RepromptResult> {
    // Usar LLM para otimizar automaticamente
    const systemPrompt = `
      You are an expert prompt optimizer. Your task is to improve the given prompt to make it:
            1. More clear and specific
      2. Free of ambiguities
      3. Structured effectively
      4. Optimized for the specific LLM being used
      
      Return a JSON object with the optimized prompt and explanations for the changes.
    `;
    
    try {
      const response = await llmService.chat('openai', [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Original prompt: "${prompt}"` }
      ], {
        model: 'gpt-3.5-turbo',
        temperature: 0.3,
        apiKey: options.apiKey,
      });
      
      let result;
      try {
        result = JSON.parse(response.message.content);
      } catch {
        // Se não for JSON válido, usar resposta como texto
        result = {
          optimized: response.message.content,
          changes: [{ type: 'auto', description: 'Automatic optimization' }]
        };
      }
      
      return {
        original: prompt,
        optimized: result.optimized || response.message.content,
        changes: result.changes || []
      };
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      return { original: prompt, optimized: prompt, changes: [] };
    }
  }
  
  private async grammarCorrection(prompt: string): Promise<RepromptResult> {
    // Corrigir gramática e ortografia sem alterar significado
    const systemPrompt = `
      You are a grammar and spelling correction assistant. Fix any grammar and spelling issues in the text, 
      but preserve the exact meaning and intent. Do not add interpretations or change the content in any way.
    `;
    
    try {
      const response = await llmService.chat('openai', [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ], {
        model: 'gpt-3.5-turbo',
        temperature: 0.1,
      });
      
      return {
        original: prompt,
        optimized: response.message.content,
        changes: [{ type: 'grammar', description: 'Grammar and spelling corrections' }]
      };
    } catch (error) {
      console.error('Error correcting grammar:', error);
      return { original: prompt, optimized: prompt, changes: [] };
    }
  }
  
  // Outros métodos de otimização de prompts...
}

// Inicializar o serviço
export const reprompterService = new ReprompterService();
```

### 3. Motor de Execução de Pipelines de Prompt

```typescript
// lib/services/pipeline.ts
import { coreService } from './core';
import { llmService } from './llm';
import { reprompterService } from './reprompter';
import { v4 as uuidv4 } from 'uuid';
import type {
  Pipeline,
  PipelineNode,
  PipelineResult,
  PipelineExecutionOptions
} from '@/types';

export class PipelineService {
  private pipelines: Map<string, Pipeline>;
  
  constructor() {
    this.pipelines = new Map();
    coreService.registerService('pipeline', this);
  }
  
  createPipeline(name: string, description?: string): Pipeline {
    const id = uuidv4();
    const pipeline: Pipeline = {
      id,
      name,
      description,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.pipelines.set(id, pipeline);
    return pipeline;
  }
  
  getPipeline(id: string): Pipeline | undefined {
    return this.pipelines.get(id);
  }
  
  savePipeline(pipeline: Pipeline): void {
    pipeline.updatedAt = new Date().toISOString();
    this.pipelines.set(pipeline.id, pipeline);
    
    // Persistir pipeline no armazenamento
    try {
      const storedPipelines = JSON.parse(localStorage.getItem('pipelines') || '{}');
      storedPipelines[pipeline.id] = pipeline;
      localStorage.setItem('pipelines', JSON.stringify(storedPipelines));
    } catch (error) {
      console.error('Failed to save pipeline:', error);
    }
  }
  
  async executePipeline(
    pipelineId: string, 
    initialInput: string,
    options: PipelineExecutionOptions = {}
  ): Promise<PipelineResult> {
    const pipeline = this.getPipeline(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline with ID ${pipelineId} not found`);
    }
    
    const executionId = uuidv4();
    const startTime = Date.now();
    const nodeResults = new Map<string, any>();
    
    // Encontrar os nós de entrada (sem arestas de entrada)
    const incomingEdges = new Map<string, string[]>();
    for (const edge of pipeline.edges) {
      if (!incomingEdges.has(edge.target)) {
        incomingEdges.set(edge.target, []);
      }
      incomingEdges.get(edge.target)?.push(edge.source);
    }
    
    const entryNodes = pipeline.nodes.filter(node => 
      !incomingEdges.has(node.id)
    );
    
    // Mapear nós por ID para acesso rápido
    const nodesById = new Map(
      pipeline.nodes.map(node => [node.id, node])
    );
    
    // Mapear arestas de saída para cada nó
    const outgoingEdges = new Map<string, string[]>();
    for (const edge of pipeline.edges) {
      if (!outgoingEdges.has(edge.source)) {
        outgoingEdges.set(edge.source, []);
      }
      outgoingEdges.get(edge.source)?.push(edge.target);
    }
    
    // Configurar a fila de execução inicial com os nós de entrada
    let executionQueue = [...entryNodes];
    
    // Rastrear progresso para callback
    const totalNodes = pipeline.nodes.length;
    let completedNodes = 0;
    
    // Executar loop principal até que todos os nós sejam processados
    while (executionQueue.length > 0) {
      const currentNode = executionQueue.shift()!;
      
      // Verificar se todos os nós de entrada foram processados
      const incomingNodeIds = incomingEdges.get(currentNode.id) || [];
      const allInputsReady = incomingNodeIds.every(nodeId => 
        nodeResults.has(nodeId)
      );
      
      if (!allInputsReady) {
        // Colocar de volta na fila se nem todas as entradas estiverem prontas
        executionQueue.push(currentNode);
        continue;
      }
      
      try {
        // Buscar entradas para este nó
        let nodeInput = initialInput;
        
        // Se não for um nó de entrada, combinar resultados dos nós anteriores
        if (incomingNodeIds.length > 0) {
          // Lógica de combinação depende do tipo de nó
          if (currentNode.type === 'combiner') {
            nodeInput = incomingNodeIds
              .map(nodeId => nodeResults.get(nodeId))
              .join('\n\n');
          } else {
            // Por padrão, usar resultado do primeiro nó de entrada
            nodeInput = nodeResults.get(incomingNodeIds[0]);
          }
        }
        
        // Processar o nó atual
        let nodeResult;
        
        switch (currentNode.type) {
          case 'prompt':
            // Nó de envio de prompt para LLM
            nodeResult = await this.executePromptNode(currentNode, nodeInput);
            break;
            
          case 'reprompt':
            // Nó de otimização de prompt
            nodeResult = await this.executeRepromptNode(currentNode, nodeInput);
            break;
            
          case 'conditional':
            // Nó de bifurcação condicional
            nodeResult = await this.executeConditionalNode(currentNode, nodeInput);
            break;
            
          case 'transform':
            // Nó de transformação de texto
            nodeResult = this.executeTransformNode(currentNode, nodeInput);
            break;
            
          default:
            // Tipo de nó desconhecido - passar input direto
            nodeResult = nodeInput;
        }
        
        // Armazenar o resultado
        nodeResults.set(currentNode.id, nodeResult);
        
        // Notificar progresso
        completedNodes++;
        options.onProgress?.(completedNodes / totalNodes, currentNode);
        
        // Adicionar próximos nós à fila
        const nextNodeIds = outgoingEdges.get(currentNode.id) || [];
        for (const nextNodeId of nextNodeIds) {
          const nextNode = nodesById.get(nextNodeId);
          if (nextNode) {
            executionQueue.push(nextNode);
          }
        }
      } catch (error) {
        console.error(`Error executing node ${currentNode.id}:`, error);
        options.onError?.(error as Error, currentNode);
      }
    }
    
    // Encontrar nós de saída (sem arestas de saída)
    const exitNodes = pipeline.nodes.filter(node => 
      !outgoingEdges.has(node.id) || outgoingEdges.get(node.id)?.length === 0
    );
    
    // Obter resultados finais
    const results = exitNodes.map(node => ({
      nodeId: node.id,
      result: nodeResults.get(node.id)
    }));
    
    const endTime = Date.now();
    
    return {
      executionId,
      pipelineId,
      results,
      duration: endTime - startTime,
      nodeResults: Object.fromEntries(nodeResults),
    };
  }
  
  // Implementações dos executores de nós específicos
  private async executePromptNode(node: PipelineNode, input: string): Promise<string> {
    // Extrair configurações do nó
    const config = node.config || {};
    const provider = config.provider || 'openai';
    const model = config.model || 'gpt-3.5-turbo';
    const systemPrompt = config.systemPrompt || '';
    
    // Executar a chamada de LLM
    const response = await llmService.chat(provider, [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      { role: 'user', content: input }
    ], {
      model,
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens,
    });
    
    return response.message.content;
  }
  
  private async executeRepromptNode(node: PipelineNode, input: string): Promise<string> {
    const config = node.config || {};
    const mode = config.mode || 'auto';
    
    const result = await reprompterService.optimizePrompt(input, {
      mode,
      ...config
    });
    
    return result.optimized;
  }
  
  private async executeConditionalNode(node: PipelineNode, input: string): Promise<string> {
    const config = node.config || {};
    const condition = config.condition || '';
    const trueOutput = config.trueOutput || input;
    const falseOutput = config.falseOutput || input;
    
    // Avaliar condição via LLM para maior flexibilidade
    const systemPrompt = `
      Evaluate if the following input meets this condition: "${condition}"
      Respond with only "true" or "false".
    `;
    
    const response = await llmService.chat('openai', [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: input }
    ], {
      model: 'gpt-3.5-turbo',
      temperature: 0.1,
    });
    
    const result = response.message.content.toLowerCase().trim();
    
    return result.includes('true') ? trueOutput : falseOutput;
  }
  
  private executeTransformNode(node: PipelineNode, input: string): string {
    const config = node.config || {};
    const transformationType = config.type || 'passthrough';
    
    switch (transformationType) {
      case 'uppercase':
        return input.toUpperCase();
      case 'lowercase':
        return input.toLowerCase();
      case 'trim':
        return input.trim();
      case 'replace':
        const search = config.search || '';
        const replacement = config.replacement || '';
        return input.replace(new RegExp(search, 'g'), replacement);
      case 'extract':
        const pattern = config.pattern || '';
        try {
          const regex = new RegExp(pattern);
          const match = regex.exec(input);
          return match ? match[0] : '';
        } catch {
          return '';
        }
      case 'passthrough':
      default:
        return input;
    }
  }
}

// Inicializar o serviço
export const pipelineService = new PipelineService();
```

## Integrações Externas

O Brainlink implementa conectores para diversos serviços externos, facilitando integração com ferramentas de desenvolvimento populares e serviços cloud:

### 1. Integração com GitHub

```typescript
// lib/integrations/github.ts
import { Octokit } from '@octokit/rest';
import { coreService } from '@/lib/services/core';
import type { GitHubConfig, Repository, Branch, Commit, PullRequest } from '@/types';

export class GitHubIntegration {
  private octokit: Octokit | null = null;
  
  constructor() {
    coreService.registerService('integration:github', this);
  }
  
  async initialize(config: GitHubConfig): Promise<void> {
    this.octokit = new Octokit({
      auth: config.accessToken,
      userAgent: 'Brainlink App v1.0',
    });
  }
  
  async getUserRepositories(): Promise<Repository[]> {
    if (!this.octokit) {
      throw new Error('GitHub integration not initialized');
    }
    
    const response = await this.octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    });
    
    return response.data.map(repo => ({
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      url: repo.html_url,
      isPrivate: repo.private,
      updatedAt: repo.updated_at,
      language: repo.language || 'Unknown',
      owner: {
        id: repo.owner?.id.toString() || '',
        login: repo.owner?.login || '',
        avatarUrl: repo.owner?.avatar_url || '',
      },
    }));
  }
  
  async getRepository(owner: string, repo: string): Promise<Repository> {
    if (!this.octokit) {
      throw new Error('GitHub integration not initialized');
    }
    
    const response = await this.octokit.repos.get({
      owner,
      repo,
    });
    
    const data = response.data;
    
    return {
      id: data.id.toString(),
      name: data.name,
      fullName: data.full_name,
      description: data.description || '',
      url: data.html_url,
      isPrivate: data.private,
      updatedAt: data.updated_at,
      language: data.language || 'Unknown',
      owner: {
        id: data.owner.id.toString(),
        login: data.owner.login,
        avatarUrl: data.owner.avatar_url,
      },
    };
  }
  
  async getBranches(owner: string, repo: string): Promise<Branch[]> {
    if (!this.octokit) {
      throw new Error('GitHub integration not initialized');
    }
    
    const response = await this.octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    });
    
    return response.data.map(branch => ({
      name: branch.name,
      commitSha: branch.commit.sha,
      isProtected: branch.protected || false,
    }));
  }
  
  async getFileContents(
    owner: string, 
    repo: string, 
    path: string, 
    ref?: string
  ): Promise<string> {
    if (!this.octokit) {
      throw new Error('GitHub integration not initialized');
    }
    
    const response = await this.octokit.repos.getContent({
      owner,
      repo,
      path,
      ref,
    });
    
    // @ts-ignore - A tipagem da API não inclui o caso de content para arquivos
    if (response.data.type === 'file' && response.data.content) {
      // @ts-ignore
      return Buffer.from(response.data.content, 'base64').toString('utf-8');
    }
    
    throw new Error('Path does not point to a file');
  }
  
  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
    sha?: string
  ): Promise<void> {
    if (!this.octokit) {
      throw new Error('GitHub integration not initialized');
    }
    
    // Primeiro, verificar se o arquivo existe para obter o SHA
    let fileSha = sha;
    if (!fileSha) {
      try {
        const fileResponse = await this.octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });
        
        // @ts-ignore
        if (fileResponse.data.type === 'file') {
          // @ts-ignore
          fileSha = fileResponse.data.sha;
        }
      } catch (error) {
        // Arquivo provavelmente não existe, o que é normal para criação
      }
    }
    
    // Criar ou atualizar o arquivo
    await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
      ...(fileSha ? { sha: fileSha } : {}),
    });
  }
  
  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string
  ): Promise<PullRequest> {
    if (!this.octokit) {
      throw new Error('GitHub integration not initialized');
    }
    
    const response = await this.octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body,
    });
    
    const pr = response.data;
    
    return {
      id: pr.id.toString(),
      number: pr.number,
      title: pr.title,
      body: pr.body || '',
      state: pr.state,
      url: pr.html_url,
      createdAt: pr.created_at,
      updatedAt: pr.updated_at,
      author: {
        id: pr.user?.id.toString() || '',
        login: pr.user?.login || '',
        avatarUrl: pr.user?.avatar_url || '',
      },
      base: pr.base.ref,
      head: pr.head.ref,
      isDraft: pr.draft || false,
    };
  }
}

// Inicializar o serviço
export const githubIntegration = new GitHubIntegration();
```

### 2. Integração com Vercel para Deploy

```typescript
// lib/integrations/vercel.ts
import { coreService } from '@/lib/services/core';
import type { VercelConfig, Deployment, Project } from '@/types';

export class VercelIntegration {
  private token: string | null = null;
  private teamId?: string;
  
  constructor() {
    coreService.registerService('integration:vercel', this);
  }
  
  async initialize(config: VercelConfig): Promise<void> {
    this.token = config.accessToken;
    this.teamId = config.teamId;
  }
  
  private async fetchApi<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.token) {
      throw new Error('Vercel integration not initialized');
    }
    
    const url = new URL(`https://api.vercel.com${endpoint}`);
    if (this.teamId) {
      url.searchParams.append('teamId', this.teamId);
    }
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vercel API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  }
  
  async getProjects(): Promise<Project[]> {
    const data = await this.fetchApi<{ projects: any[] }>('/v9/projects');
    
    return data.projects.map(project => ({
      id: project.id,
      name: project.name,
      framework: project.framework || 'unknown',
      latestDeployment: project.latestDeployments?.[0]?.url,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));
  }
  
  async getProject(id: string): Promise<Project> {
    const project = await this.fetchApi<any>(`/v9/projects/${id}`);
    
    return {
      id: project.id,
      name: project.name,
      framework: project.framework || 'unknown',
      latestDeployment: project.latestDeployments?.[0]?.url,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
  
  async getDeployments(projectId: string): Promise<Deployment[]> {
    const data = await this.fetchApi<{ deployments: any[] }>(
      `/v6/deployments?projectId=${projectId}`
    );
    
    return data.deployments.map(deployment => ({
      id: deployment.uid,
      url: deployment.url,
      state: deployment.state,
      createdAt: deployment.createdAt,
      buildingAt: deployment.buildingAt,
      ready: deployment.ready,
      target: deployment.target || 'production',
      meta: {
        branch: deployment.meta?.githubCommitRef || '',
        commit: deployment.meta?.githubCommitSha || '',
      },
    }));
  }
  
  async createDeployment(
    projectId: string,
    githubRepo?: string,
    ref?: string
  ): Promise<Deployment> {
    let payload: Record<string, any> = { projectId };
    
    // Se temos informações do GitHub, usar para deploy
    if (githubRepo && ref) {
      payload = {
        ...payload,
        gitSource: {
          type: 'github',
          repo: githubRepo,
          ref: {
            type: ref.startsWith('pull/') ? 'pull-request' : 'branch',
            value: ref,
          },
        },
      };
    }
    
    const deployment = await this.fetchApi<any>('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    
    return {
      id: deployment.id,
      url: deployment.url,
      state: deployment.state,
      createdAt: deployment.createdAt,
      buildingAt: deployment.buildingAt,
      ready: deployment.ready,
      target: deployment.target || 'production',
      meta: {
        branch: deployment.meta?.githubCommitRef || '',
        commit: deployment.meta?.githubCommitSha || '',
      },
    };
  }
}

// Inicializar o serviço
export const vercelIntegration = new VercelIntegration();
```

## Filas e Mensageria

O Brainlink implementa um sistema de filas e mensageria para processar tarefas assíncronas e garantir comunicação confiável entre componentes:

### 1. Sistema de Filas

```typescript
// lib/queues/queue.ts
import { v4 as uuidv4 } from 'uuid';
import { coreService } from '@/lib/services/core';

export type QueueTaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface QueueTask<T = any> {
  id: string;
  type: string;
  payload: T;
  status: QueueTaskStatus;
  createdAt: string;
  updatedAt: string;
  result?: any;
  error?: string;
  retries: number;
  maxRetries: number;
}

export type TaskHandler<T = any> = (
  task: QueueTask<T>,
  helpers: {
    updateProgress: (progress: number) => void;
    setResult: (result: any) => void;
  }
) => Promise<void>;

export class Queue {
  private name: string;
  private tasks: Map<string, QueueTask>;
  private handlers: Map<string, TaskHandler>;
  private processing: boolean = false;
  private maxConcurrent: number;
  private currentlyProcessing: Set<string> = new Set();
  
  constructor(name: string, maxConcurrent: number = 3) {
    this.name = name;
    this.tasks = new Map();
    this.handlers = new Map();
    this.maxConcurrent = maxConcurrent;
    
    coreService.registerService(`queue:${name}`, this);
  }
  
  registerHandler<T>(taskType: string, handler: TaskHandler<T>): void {
    this.handlers.set(taskType, handler);
    
    coreService.emit('queue:handler:registered', {
      queue: this.name,
      taskType,
    });
  }
  
  async enqueue<T>(
    taskType: string, 
    payload: T, 
    options: { maxRetries?: number } = {}
  ): Promise<string> {
    if (!this.handlers.has(taskType)) {
      throw new Error(`No handler registered for task type: ${taskType}`);
    }
    
    const taskId = uuidv4();
    const now = new Date().toISOString();
    
    const task: QueueTask<T> = {
      id: taskId,
      type: taskType,
      payload,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      retries: 0,
      maxRetries: options.maxRetries || 3,
    };
    
    this.tasks.set(taskId, task);
    
    coreService.emit('queue:task:created', {
      queue: this.name,
      taskId,
      taskType,
    });
    
    // Iniciar processamento se não estiver em andamento
    if (!this.processing) {
      this.startProcessing();
    }
    
    return taskId;
  }
  
  getTask<T>(taskId: string): QueueTask<T> | undefined {
    return this.tasks.get(taskId) as QueueTask<T> | undefined;
  }
  
  getPendingTasks(): QueueTask[] {
    return Array.from(this.tasks.values())
      .filter(task => task.status === 'pending');
  }
  
  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    
    coreService.emit('queue:processing:started', {
      queue: this.name,
    });
    
    try {
      while (this.processing) {
        // Pegar próximas tarefas se temos espaço para processamento
        if (this.currentlyProcessing.size < this.maxConcurrent) {
          const pendingTasks = this.getPendingTasks();
          
          if (pendingTasks.length === 0) {
            // Se não temos tarefas pendentes, pausar processamento
            if (this.currentlyProcessing.size === 0) {
              this.processing = false;
              break;
            }
            
            // Esperar um pouco antes de checar novamente
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
          }
          
          // Processar até maxConcurrent tarefas
          const availableSlots = this.maxConcurrent - this.currentlyProcessing.size;
          const tasksToProcess = pendingTasks.slice(0, availableSlots);
          
          for (const task of tasksToProcess) {
            // Processar tarefa em paralelo
            this.processTask(task).catch(error => {
              console.error(`Error processing task ${task.id}:`, error);
            });
          }
        }
        
        // Pequeno delay para evitar loop intensivo
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } finally {
      this.processing = false;
      
      coreService.emit('queue:processing:stopped', {
        queue: this.name,
      });
    }
  }
  
  private async processTask(task: QueueTask): Promise<void> {
    // Atualizar status
    task.status = 'processing';
    task.updatedAt = new Date().toISOString();
    this.currentlyProcessing.add(task.id);
    
    coreService.emit('queue:task:processing', {
      queue: this.name,
      taskId: task.id,
      taskType: task.type,
    });
    
    try {
      const handler = this.handlers.get(task.type);
      if (!handler) {
        throw new Error(`No handler registered for task type: ${task.type}`);
      }
      
      // Helpers para atualização de progresso e resultado
      const helpers = {
        updateProgress: (progress: number) => {
          coreService.emit('queue:task:progress', {
                        queue: this.name,
            taskId: task.id,
            taskType: task.type,
            progress,
          });
        },
        setResult: (result: any) => {
          task.result = result;
        },
      };
      
      // Executar o handler
      await handler(task, helpers);
      
      // Se chegamos aqui, a tarefa foi concluída com sucesso
      task.status = 'completed';
      task.updatedAt = new Date().toISOString();
      
      coreService.emit('queue:task:completed', {
        queue: this.name,
        taskId: task.id,
        taskType: task.type,
        result: task.result,
      });
    } catch (error) {
      // Incrementar contagem de tentativas
      task.retries += 1;
      
      // Verificar se atingiu o número máximo de tentativas
      if (task.retries >= task.maxRetries) {
        task.status = 'failed';
        task.error = error instanceof Error ? error.message : String(error);
        
        coreService.emit('queue:task:failed', {
          queue: this.name,
          taskId: task.id,
          taskType: task.type,
          error: task.error,
        });
      } else {
        // Voltar para pendente para nova tentativa
        task.status = 'pending';
        
        coreService.emit('queue:task:retry', {
          queue: this.name,
          taskId: task.id,
          taskType: task.type,
          retries: task.retries,
          maxRetries: task.maxRetries,
        });
      }
    } finally {
      task.updatedAt = new Date().toISOString();
      this.currentlyProcessing.delete(task.id);
      
      // Se não foi concluída ou falhou definitivamente, mantê-la na fila
      if (task.status === 'completed' || task.status === 'failed') {
        // Manter na lista por um tempo para consultas, posteriormente pode ser removida
        setTimeout(() => {
          this.tasks.delete(task.id);
        }, 15 * 60 * 1000); // 15 minutos
      }
    }
  }
}

// Exemplo de criação de filas
export const taskQueue = new Queue('tasks');
export const mediaProcessingQueue = new Queue('media', 1); // Apenas 1 tarefa de mídia por vez
```

### 2. Sistema de PubSub para Eventos

```typescript
// lib/events/pubsub.ts
import { coreService } from '@/lib/services/core';

export type EventCallback<T = any> = (data: T) => void | Promise<void>;

export class EventBus {
  private subscribers: Map<string, Set<EventCallback>>;
  
  constructor() {
    this.subscribers = new Map();
    coreService.registerService('events', this);
  }
  
  /**
   * Subscrever a um evento
   * @param eventType Tipo do evento
   * @param callback Função chamada quando o evento ocorre
   * @returns Função para cancelar a subscrição
   */
  subscribe<T = any>(eventType: string, callback: EventCallback<T>): () => void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType)!.add(callback);
    
    return () => {
      this.unsubscribe(eventType, callback);
    };
  }
  
  /**
   * Cancelar subscrição a um evento
   * @param eventType Tipo do evento
   * @param callback Função a remover
   */
  unsubscribe(eventType: string, callback: EventCallback): void {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
      
      if (callbacks.size === 0) {
        this.subscribers.delete(eventType);
      }
    }
  }
  
  /**
   * Publicar um evento
   * @param eventType Tipo do evento
   * @param data Dados do evento
   */
  async publish<T = any>(eventType: string, data: T): Promise<void> {
    const callbacks = this.subscribers.get(eventType);
    if (!callbacks) return;
    
    const promises = Array.from(callbacks).map(callback => {
      try {
        const result = callback(data);
        return result instanceof Promise ? result : Promise.resolve();
      } catch (error) {
        console.error(`Error in event subscriber for ${eventType}:`, error);
        return Promise.resolve();
      }
    });
    
    await Promise.all(promises);
  }
  
  /**
   * Publicar um evento e esperar que todos os assinantes processem
   * @param eventType Tipo do evento
   * @param data Dados do evento
   */
  async publishAndWait<T = any, R = any>(
    eventType: string, 
    data: T
  ): Promise<R[]> {
    const callbacks = this.subscribers.get(eventType);
    if (!callbacks) return [];
    
    const promises = Array.from(callbacks).map(async callback => {
      try {
        const result = callback(data);
        return result instanceof Promise ? await result : result;
      } catch (error) {
        console.error(`Error in event subscriber for ${eventType}:`, error);
        throw error;
      }
    });
    
    return await Promise.all(promises);
  }
  
  /**
   * Obter quantidade de assinantes para um evento
   * @param eventType Tipo do evento
   */
  getSubscriberCount(eventType: string): number {
    const callbacks = this.subscribers.get(eventType);
    return callbacks ? callbacks.size : 0;
  }
}

// Criar instância global do barramento de eventos
export const eventBus = new EventBus();
```

## Caching

O Brainlink implementa estratégias de cache eficientes para minimizar chamadas de API e melhorar a performance:

### 1. Sistema de Cache Hierárquico

```typescript
// lib/cache/cache.ts
import { coreService } from '@/lib/services/core';

export interface CacheOptions {
  ttl?: number; // Tempo de vida em milissegundos
  staleWhileRevalidate?: boolean; // Retornar dados expirados enquanto atualiza
}

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
  staleHits: number;
}

export class Cache {
  private name: string;
  private storage: Map<string, CacheEntry<any>>;
  private stats: CacheStats;
  private defaultTTL: number;
  
  constructor(name: string, defaultTTL: number = 5 * 60 * 1000) { // 5 minutos padrão
    this.name = name;
    this.storage = new Map();
    this.defaultTTL = defaultTTL;
    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      staleHits: 0,
    };
    
    coreService.registerService(`cache:${name}`, this);
    
    // Iniciar limpeza periódica
    this.startJanitor();
  }
  
  /**
   * Obter item do cache
   * @param key Chave do item
   * @returns O item ou undefined se não existir ou estiver expirado
   */
  get<T>(key: string): T | undefined {
    const entry = this.storage.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }
    
    const now = Date.now();
    
    // Verificar se expirou
    if (now > entry.expiresAt) {
      this.stats.staleHits++;
      return undefined;
    }
    
    this.stats.hits++;
    return entry.data;
  }
  
  /**
   * Obter item do cache com suporte a stale-while-revalidate
   * @param key Chave do item
   * @param fetchFn Função para buscar valor atualizado
   * @param options Opções de cache
   */
  async getOrFetch<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    options: CacheOptions = {}
  ): Promise<T> {
    const entry = this.storage.get(key);
    const now = Date.now();
    
    // Se temos um valor válido, retornar imediatamente
    if (entry && now < entry.expiresAt) {
      this.stats.hits++;
      return entry.data;
    }
    
    // Se temos um valor expirado e staleWhileRevalidate está habilitado
    if (entry && options.staleWhileRevalidate) {
      this.stats.staleHits++;
      
      // Revalidar em background
      this.revalidateAsync(key, fetchFn, options).catch(error => {
        console.error(`Error revalidating cache for ${key}:`, error);
      });
      
      // Retornar valor expirado
      return entry.data;
    }
    
    // Se não temos valor ou não podemos usar valor expirado
    this.stats.misses++;
    
    // Buscar valor atualizado
    const freshData = await fetchFn();
    
    // Atualizar cache
    this.set(key, freshData, options);
    
    return freshData;
  }
  
  /**
   * Definir um item no cache
   * @param key Chave do item
   * @param data Dados a armazenar
   * @param options Opções de cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const ttl = options.ttl ?? this.defaultTTL;
    const now = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      expiresAt: now + ttl,
      createdAt: now,
      updatedAt: now,
    };
    
    const isNewKey = !this.storage.has(key);
    this.storage.set(key, entry);
    
    if (isNewKey) {
      this.stats.keys++;
    }
  }
  
  /**
   * Remover item do cache
   * @param key Chave do item
   */
  delete(key: string): boolean {
    const existed = this.storage.delete(key);
    
    if (existed) {
      this.stats.keys--;
    }
    
    return existed;
  }
  
  /**
   * Limpar todo o cache
   */
  clear(): void {
    this.storage.clear();
    this.stats.keys = 0;
  }
  
  /**
   * Verificar se o cache contém uma chave
   * @param key Chave a verificar
   */
  has(key: string): boolean {
    return this.storage.has(key);
  }
  
  /**
   * Obter estatísticas do cache
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  /**
   * Revalidar valor em background
   */
  private async revalidateAsync<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    options: CacheOptions
  ): Promise<void> {
    try {
      const freshData = await fetchFn();
      this.set(key, freshData, options);
    } catch (error) {
      console.error(`Failed to revalidate cache for ${key}:`, error);
      // Deixar o valor expirado no cache por enquanto
    }
  }
  
  /**
   * Iniciar limpador periódico de itens expirados
   */
  private startJanitor(): void {
    // Executar a cada minuto
    const interval = setInterval(() => {
      this.clearExpired();
    }, 60 * 1000);
    
    // Garantir que o intervalo não impede encerramento do processo
    if (typeof window === 'undefined' && interval.unref) {
      interval.unref();
    }
  }
  
  /**
   * Limpar itens expirados
   */
  private clearExpired(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.expiresAt) {
        this.storage.delete(key);
        expiredCount++;
        this.stats.keys--;
      }
    }
    
    if (expiredCount > 0) {
      coreService.emit('cache:expired', {
        cache: this.name,
        expiredCount,
      });
    }
  }
}

// Caches específicos por domínio
export const apiCache = new Cache('api', 10 * 60 * 1000); // 10 minutos
export const fileCache = new Cache('files', 30 * 60 * 1000); // 30 minutos
export const llmCache = new Cache('llm', 24 * 60 * 60 * 1000); // 24 horas
```

### 2. Implementação de Cache para Respostas de LLM

```typescript
// lib/services/llm-cache.ts
import { coreService } from '@/lib/services/core';
import { llmCache } from '@/lib/cache/cache';
import { createHash } from 'crypto';
import type { ChatMessage, ChatOptions, ChatResponse } from '@/types';

export class LLMCacheService {
  constructor() {
    coreService.registerService('llm-cache', this);
  }
  
  /**
   * Gerar chave de cache determinística para uma conversação
   */
  private generateCacheKey(
    provider: string,
    model: string,
    messages: ChatMessage[],
    options: ChatOptions
  ): string {
    // Normalizar e serializar os parâmetros para gerar chave consistente
    const key = {
      provider,
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        name: m.name,
      })),
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens,
    };
    
    // Usar hash SHA-256 da representação JSON como chave
    const hash = createHash('sha256')
      .update(JSON.stringify(key))
      .digest('hex');
      
    return `${provider}:${model}:${hash}`;
  }
  
  /**
   * Verificar se devemos usar cache para esta solicitação
   */
  private shouldCache(
    provider: string, 
    model: string, 
    temperature: number
  ): boolean {
    // Solicitações determinísticas (temperatura baixa) são boas candidatas para cache
    if (temperature < 0.1) {
      return true;
    }
    
    // Para temperaturas mais altas, depende do modelo e caso de uso
    // Por padrão, não fazemos cache para respostas não determinísticas
    return false;
  }
  
  /**
   * Obter resposta de LLM do cache ou executar chamada
   */
  async getCachedOrExecute(
    provider: string,
    model: string,
    messages: ChatMessage[],
    options: ChatOptions,
    executeFn: () => Promise<ChatResponse>
  ): Promise<ChatResponse> {
    // Verificar se devemos usar cache
    if (!this.shouldCache(provider, model, options.temperature || 0.7)) {
      // Se não, executar diretamente
      return await executeFn();
    }
    
    // Gerar chave de cache
    const cacheKey = this.generateCacheKey(provider, model, messages, options);
    
    // Tentar obter do cache
    return await llmCache.getOrFetch(
      cacheKey,
      executeFn,
      {
        ttl: 24 * 60 * 60 * 1000, // 24 horas
        staleWhileRevalidate: false, // Respostas de LLM não devem ser stale
      }
    );
  }
  
  /**
   * Invalidar cache para um provider/modelo específico
   */
  invalidateForModel(provider: string, model: string): void {
    // Não temos uma forma direta de remover apenas chaves específicas
    // sem examinar todas, então limpar todo o cache de LLM
    // Uma implementação mais sofisticada manteria um índice de chaves por modelo
    llmCache.clear();
  }
}

// Inicializar o serviço
export const llmCacheService = new LLMCacheService();
```

## Estratégia de Testes

O Brainlink implementa uma estratégia abrangente de testes para garantir qualidade de código e comportamento esperado:

### 1. Testes Unitários

```typescript
// tests/services/llm.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LLMService } from '@/lib/services/llm';
import { coreService } from '@/lib/services/core';

vi.mock('@/lib/services/core', () => ({
  coreService: {
    registerService: vi.fn(),
    emit: vi.fn(),
  },
}));

describe('LLMService', () => {
  let llmService: LLMService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    llmService = new LLMService();
  });
  
  it('should register itself with the core service', () => {
    expect(coreService.registerService).toHaveBeenCalledWith('llm', llmService);
  });
  
  it('should register a provider correctly', () => {
    const provider = {
      id: 'test',
      name: 'Test Provider',
      models: [],
      requiresApiKey: true,
      chat: vi.fn(),
      streamChat: vi.fn(),
    };
    
    llmService.registerProvider('test', provider);
    expect(coreService.emit).toHaveBeenCalledWith(
      'llm:provider:registered',
      { id: 'test', name: 'Test Provider' }
    );
    
    const providers = llmService.getProviders();
    expect(providers).toContainEqual(provider);
  });
  
  it('should get a registered provider', () => {
    const provider = {
      id: 'test',
      name: 'Test Provider',
      models: [],
      requiresApiKey: true,
      chat: vi.fn(),
      streamChat: vi.fn(),
    };
    
    llmService.registerProvider('test', provider);
    const retrievedProvider = llmService.getProvider('test');
    expect(retrievedProvider).toEqual(provider);
  });
  
  it('should throw an error when getting an unregistered provider', () => {
    expect(() => llmService.getProvider('nonexistent')).toThrow(
      'LLM provider nonexistent not found'
    );
  });
  
  it('should call provider chat method', async () => {
    const mockResponse = {
      id: 'resp-123',
      message: { role: 'assistant', content: 'Test response' },
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
    };
    
    const provider = {
      id: 'test',
      name: 'Test Provider',
      models: [],
      requiresApiKey: true,
      chat: vi.fn().mockResolvedValue(mockResponse),
      streamChat: vi.fn(),
    };
    
    llmService.registerProvider('test', provider);
    
    const messages = [{ role: 'user', content: 'Hello' }];
    const options = { model: 'test-model', temperature: 0.5 };
    
    const response = await llmService.chat('test', messages, options);
    
    expect(provider.chat).toHaveBeenCalledWith(messages, options);
    expect(response).toEqual(mockResponse);
  });
});
```

### 2. Testes de Integração com Serviços Externos

```typescript
// tests/integration/github-integration.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GitHubIntegration } from '@/lib/integrations/github';
import { Octokit } from '@octokit/rest';

// Mock da biblioteca Octokit
vi.mock('@octokit/rest', () => {
  const mockOctokit = {
    repos: {
      listForAuthenticatedUser: vi.fn(),
      get: vi.fn(),
      listBranches: vi.fn(),
      getContent: vi.fn(),
      createOrUpdateFileContents: vi.fn(),
    },
    pulls: {
      create: vi.fn(),
    },
  };
  
  return {
    Octokit: vi.fn(() => mockOctokit),
  };
});

// Mock do serviço core
vi.mock('@/lib/services/core', () => ({
  coreService: {
    registerService: vi.fn(),
    emit: vi.fn(),
  },
}));

describe('GitHubIntegration', () => {
  let githubIntegration: GitHubIntegration;
  let mockOctokit: any;
  
  beforeEach(async () => {
    vi.clearAllMocks();
    
    githubIntegration = new GitHubIntegration();
    await githubIntegration.initialize({ accessToken: 'test-token' });
    
    mockOctokit = (Octokit as unknown as jest.Mock).mock.instances[0];
  });
  
  it('should initialize correctly with token', async () => {
    expect(Octokit).toHaveBeenCalledWith({
      auth: 'test-token',
      userAgent: expect.stringContaining('Brainlink'),
    });
  });
  
  it('should get user repositories', async () => {
    const mockRepos = {
      data: [
        {
          id: 1,
          name: 'repo1',
          full_name: 'user/repo1',
          description: 'Test repo 1',
          html_url: 'https://github.com/user/repo1',
          private: false,
          updated_at: '2023-01-01T00:00:00Z',
          language: 'TypeScript',
          owner: {
            id: 100,
            login: 'user',
            avatar_url: 'https://github.com/user.png',
          },
        },
      ],
    };
    
    mockOctokit.repos.listForAuthenticatedUser.mockResolvedValue(mockRepos);
    
    const repos = await githubIntegration.getUserRepositories();
    
    expect(mockOctokit.repos.listForAuthenticatedUser).toHaveBeenCalledWith({
      sort: 'updated',
      per_page: 100,
    });
    
    expect(repos).toEqual([
      {
        id: '1',
        name: 'repo1',
        fullName: 'user/repo1',
        description: 'Test repo 1',
        url: 'https://github.com/user/repo1',
        isPrivate: false,
        updatedAt: '2023-01-01T00:00:00Z',
        language: 'TypeScript',
        owner: {
          id: '100',
          login: 'user',
          avatarUrl: 'https://github.com/user.png',
        },
      },
    ]);
  });
  
  it('should get file contents', async () => {
    const mockContent = {
      data: {
        type: 'file',
        content: Buffer.from('file content').toString('base64'),
      },
    };
    
    mockOctokit.repos.getContent.mockResolvedValue(mockContent);
    
    const content = await githubIntegration.getFileContents(
      'user',
      'repo',
      'path/to/file.txt'
    );
    
    expect(mockOctokit.repos.getContent).toHaveBeenCalledWith({
      owner: 'user',
      repo: 'repo',
      path: 'path/to/file.txt',
      ref: undefined,
    });
    
    expect(content).toBe('file content');
  });
});
```

### 3. Testes de API

```typescript
// tests/api/workspaces.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createServer } from 'http';
import { apiHandler } from '@/pages/api/workspaces/index';
import supertest from 'supertest';

// Mock do serviço de autenticação
vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
}));

// Mock do serviço de workspace
vi.mock('@/lib/services/workspace', () => ({
  createWorkspace: vi.fn(),
  getWorkspaces: vi.fn(),
}));

import { getSession } from 'next-auth/react';
import { createWorkspace, getWorkspaces } from '@/lib/services/workspace';

describe('Workspaces API', () => {
  let server: any;
  let request: any;
  
  beforeAll(() => {
    server = createServer(apiHandler);
    request = supertest(server);
  });
  
  afterAll((done) => {
    server.close(done);
  });
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('should return 401 when not authenticated', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    
    const response = await request.get('/');
    
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
  
  it('should return workspaces for authenticated user', async () => {
    const mockSession = {
      user: { id: 'user-123' },
    };
    
    const mockWorkspaces = [
      { id: 'ws-1', name: 'Workspace 1' },
      { id: 'ws-2', name: 'Workspace 2' },
    ];
    
    (getSession as jest.Mock).mockResolvedValue(mockSession);
    (getWorkspaces as jest.Mock).mockResolvedValue(mockWorkspaces);
    
    const response = await request.get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockWorkspaces);
    expect(getWorkspaces).toHaveBeenCalledWith('user-123');
  });
  
  it('should create a new workspace', async () => {
    const mockSession = {
      user: { id: 'user-123' },
    };
    
    const mockWorkspace = {
      id: 'ws-new',
      name: 'New Workspace',
      description: 'Test workspace',
    };
    
    const requestBody = {
      name: 'New Workspace',
      description: 'Test workspace',
    };
    
    (getSession as jest.Mock).mockResolvedValue(mockSession);
    (createWorkspace as jest.Mock).mockResolvedValue(mockWorkspace);
    
    const response = await request
      .post('/')
      .send(requestBody)
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockWorkspace);
    expect(createWorkspace).toHaveBeenCalledWith({
      ...requestBody,
      userId: 'user-123',
    });
  });
  
  it('should validate request data', async () => {
    const mockSession = {
      user: { id: 'user-123' },
    };
    
    (getSession as jest.Mock).mockResolvedValue(mockSession);
    
    const response = await request
      .post('/')
      .send({}) // Nome ausente
      .set('Content-Type', 'application/json');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request data');
  });
});
```

## Prompt de Implementação para Backend

Como desenvolvedor implementando o backend do Brainlink, você deve seguir estas diretrizes essenciais:

1. **Comece pela implementação dos serviços core**:

   - Implemente primeiro o `CoreService` e o sistema de eventos, pois são a base de todo o backend
   - Crie a camada de API RESTful com Next.js API Routes para fornecer endpoints consistentes
   - Implemente o barramento de eventos (`EventBus`) para comunicação desacoplada entre componentes

2. **Desenvolva conectores para serviços externos**:

   ```typescript
   // Ordem recomendada:
   // 1. LLMService - Conectores para OpenAI, Anthropic, etc.
   // 2. FileService - Acesso a arquivos locais e remotos
   // 3. Integrações (GitHub, Vercel, etc.)
   ```

3. **Implemente o sistema de filas e caching**:

   - Utilize filas para operações assíncronas pesadas como processamento de mídia e execução de código
   - Desenvolva um sistema de cache hierárquico para minimizar chamadas repetitivas a APIs externas
   - Garanta que operações possam ser canceladas graciosamente quando necessário

4. **Estabeleça mecanismos robustos para segurança**:

   - Implemente sandbox para isolamento de código executável
   - Armazene chaves de API de forma segura (criptografia em repouso)
   - Desenvolva sistema de permissões granular para operações sensíveis

5. **Projete o sistema de plugins extensível**:

   - Defina API clara e versionada para desenvolvedores de plugins
   - Implemente mecanismo de isolamento e carregamento seguro de plugins
   - Documente componentes e interfaces públicas para extensão

6. **Desenvolva estratégias para ambientes híbridos**:

   - Crie abstrações para funcionalidades que precisam adaptar-se entre web e desktop
   - Utilize padrões adapter para APIs nativas de sistema operacional
   - Implemente estratégias de fallback para recursos não disponíveis em todos os ambientes

7. **Adoite uma abordagem API-first**:

   - Defina interfaces de API claras antes da implementação
   - Valide inputs e outputs com schemas Zod rigorosos
   - Forneça respostas de erro informativas e consistentes

8. **Priorize performance e escalabilidade**:

   - Utilize streaming para respostas de LLMs e processamento de arquivos grandes
      - Minimize operações síncronas que possam bloquear o thread principal
   - Projete para escala horizontal desde o início, evitando estados compartilhados críticos
   - Implemente circuit breakers para prevenir cascata de falhas em integrações externas

9. **Teste exaustivamente cada componente**:

   - Desenvolva testes unitários para lógica de negócio crítica
   - Crie testes de integração para validar interações entre serviços
   - Implemente testes de carga para endpoints importantes e operações frequentes
   - Use mocks e stubs para isolar componentes durante testes

10. **Implemente logging e monitoramento eficazes**:

    - Adicione logs estruturados com níveis apropriados (debug, info, warning, error)
    - Implemente rastreamento distribuído para operações que atravessam múltiplos serviços
    - Crie dashboards para métricas críticas (latência, throughput, uso de recursos)
    - Configure alertas para condições anômalas que requeiram intervenção

Ao implementar o backend do Brainlink, siga rigorosamente o padrão de design orientado a serviços e eventos. Cada componente deve ter responsabilidades claramente definidas, acoplamento baixo e alta coesão, facilitando testes, manutenção e extensão futura.

Mantenha comunicação via eventos para operações assíncronas e use chamadas diretas apenas quando sincronicidade for absolutamente necessária. Documente todas as interfaces públicas e eventos do sistema para facilitar extensão e integração de novos componentes.

Por fim, lembre-se que o backend deve suportar tanto a versão web quanto a versão desktop do Brainlink, portanto abstraia funcionalidades específicas de plataforma adequadamente, permitindo implementações diferentes para cada ambiente quando necessário.
