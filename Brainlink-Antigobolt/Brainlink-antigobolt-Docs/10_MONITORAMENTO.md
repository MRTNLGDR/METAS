# Monitoramento e Observabilidade no Brainlink

**Versão:** 2.0  
**Data:** 2025-03-19  
**Autor:** Equipe de Arquitetura Brainlink

## Índice

1. [Introdução](#introdução)
2. [Arquitetura de Monitoramento](#arquitetura-de-monitoramento)
3. [Coleta de Telemetria](#coleta-de-telemetria)
4. [Métricas Principais](#métricas-principais)
5. [Logs e Rastreamento](#logs-e-rastreamento)
6. [Alertas e Notificações](#alertas-e-notificações)
7. [Dashboards e Visualizações](#dashboards-e-visualizações)
8. [Monitoramento de Experiência do Usuário](#monitoramento-de-experiência-do-usuário)
9. [Monitoramento de IA e Modelos](#monitoramento-de-ia-e-modelos)
10. [Implementação de Referência](#implementação-de-referência)

## Introdução

O monitoramento e observabilidade são fundamentais para manter a saúde, desempenho e segurança do Brainlink. Este documento descreve a estratégia e implementação do sistema de monitoramento completo, cobrindo desde a infraestrutura até a experiência do usuário.

A abordagem de monitoramento do Brainlink é construída sobre três pilares:

1. **Observabilidade Completa**: Visibilidade de todos os componentes do sistema, incluindo aplicações, serviços, infraestrutura e integrações externas.

2. **Detecção Proativa**: Identificação de problemas potenciais antes que afetem os usuários, através de análise de tendências e anomalias.

3. **Resposta Automatizada**: Respostas automáticas para problemas comuns, reduzindo a necessidade de intervenção manual e minimizando o tempo de inatividade.

## Arquitetura de Monitoramento

A arquitetura de monitoramento do Brainlink é composta por vários componentes integrados que trabalham em conjunto para fornecer uma visão completa do sistema:

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                      Fontes de Dados                            │
│                                                                 │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐  │
│  │ Aplicação │   │   APIs    │   │  Serviços │   │    DB     │  │
│  └─────┬─────┘   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘  │
│        │               │               │               │        │
└────────┼───────────────┼───────────────┼───────────────┼────────┘
         │               │               │               │         
┌────────┼───────────────┼───────────────┼───────────────┼────────┐
│        │               │               │               │        │
│  ┌─────▼─────────────────────────────────────────▼─────┐        │
│  │                 Coletores de Dados                  │        │
│  └─────▲─────────────────────────────────────────▲─────┘        │
│        │                                         │              │
│  ┌─────┴─────────┐                       ┌───────┴───────┐      │
│  │ Instrumentação│                       │  Agentes de   │      │
│  │    de Código  │                       │ Monitoramento │      │
│  └───────────────┘                       └───────────────┘      │
│                                                                 │
└─────────────────────────────┬───────────────────────────────────┘
                              │                              
┌─────────────────────────────▼───────────────────────────────────┐
│                   Processamento e Armazenamento                 │
│                                                                 │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐  │
│  │  Métricas │   │   Logs    │   │   Traces  │   │  Eventos  │  │
│  └─────┬─────┘   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘  │
│        │               │               │               │        │
└────────┼───────────────┼───────────────┼───────────────┼────────┘
         │               │               │               │         
┌────────┼───────────────┼───────────────┼───────────────┼────────┐
│        │               │               │               │        │
│  ┌─────▼───────────────▼───────────────▼───────────────▼─────┐  │
│  │                 Análise e Visualização                    │  │
│  └─────────────────────────┬───────────────────────────────────┘  │
│                            │                                   │
│  ┌────────────┐   ┌────────▼───────┐   ┌────────────┐          │
│  │ Dashboards │◄──┤ Alertas e      │──►│ Resposta   │          │
│  │            │   │ Notificações   │   │ Automática │          │
│  └────────────┘   └────────────────┘   └────────────┘          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Componentes Principais

1. **Coletores de Dados**: Componentes responsáveis pela captura de telemetria de diferentes partes do sistema.
   - Instrumentação de código para aplicações e APIs
   - Agentes para monitoramento de serviços e infraestrutura
   - Conectores para sistemas externos

2. **Processamento e Armazenamento**: Sistemas para processar, armazenar e gerenciar os dados de telemetria.
   - Armazenamento de métricas de série temporal
   - Sistema de agregação e indexação de logs
   - Armazenamento de rastreamento distribuído
   - Banco de eventos para correlação

3. **Análise e Visualização**: Ferramentas para analisar dados e apresentá-los de forma útil.
   - Dashboards configuráveis
   - Gráficos e visualizações
   - Relatórios e análises ad hoc

4. **Alertas e Notificações**: Sistema para detectar condições anômalas e notificar os responsáveis.
   - Definição e gerenciamento de regras de alerta
   - Roteamento e escalonamento de notificações
   - Redução de ruído e correlação de alertas

5. **Resposta Automática**: Mecanismos para reagir automaticamente a problemas identificados.
   - Runbooks automatizados
   - Ações corretivas programadas
   - Integração com sistemas de recuperação

## Coleta de Telemetria

O Brainlink implementa uma estratégia de coleta de telemetria abrangente para garantir visibilidade completa do sistema:

### Instrumentação de Aplicações

As aplicações são instrumentadas em vários níveis:

1. **Métricas de Aplicação**
   - Latência e throughput de requisições
   - Taxa de erros e status codes
   - Uso de recursos (CPU, memória, conexões)
   - Métricas de negócio (usuários ativos, operações concluídas)

2. **Logs de Aplicação**
   - Logs estruturados em JSON
   - Níveis de severidade padronizados
   - Contexto rico (usuário, sessão, operação)
   - Sanitização automática de dados sensíveis

3. **Rastreamento Distribuído**
   - Propagação de contexto entre serviços
   - Rastreamento de ponta a ponta
   - Anotações de spans com metadados relevantes
   - Amostragem adaptativa baseada em importância

### Implementação de Instrumentação de Código

```typescript
// lib/monitoring/instrumentation.ts
import { metrics, logs, trace } from '@/lib/monitoring/telemetry';
import { sanitizeData } from '@/lib/security/data';

// Middleware de telemetria para API routes
export function withTelemetry(handler: any) {
  return async (req: any, res: any) => {
    // Extrair informações de contexto
    const route = req.url;
    const method = req.method;
    const userId = req.session?.user?.id || 'anonymous';
    const organizationId = req.headers['x-organization-id'];
    
    // Criar span para rastreamento
    const span = trace.startSpan(`API ${method} ${route}`);
    span.setAttribute('http.method', method);
    span.setAttribute('http.route', route);
    span.setAttribute('user.id', userId);
    
    if (organizationId) {
      span.setAttribute('organization.id', organizationId);
    }
    
    // Iniciar timer para métrica de latência
    const timer = metrics.startTimer();
    
    // Interceptar resposta para capturar status code
    const originalEnd = res.end;
    res.end = function(chunk: any, encoding: any) {
      const responseTime = timer.end();
      const statusCode = res.statusCode;
      
      // Registrar métricas
      metrics.recordHttpRequest({
        route,
        method,
        statusCode,
        responseTime,
      });
      
      // Adicionar atributos à span atual
      span.setAttribute('http.status_code', statusCode);
      span.setAttribute('http.response_time_ms', responseTime);
      
      // Registrar log estruturado
      logs.http({
        message: `${method} ${route} ${statusCode}`,
        severity: statusCode >= 400 ? 'error' : 'info',
        http: {
          method,
          route,
          status_code: statusCode,
          response_time_ms: responseTime,
          user_agent: req.headers['user-agent'],
        },
        user: {
          id: userId,
        },
        organization: organizationId ? {
          id: organizationId,
        } : undefined,
      });
      
      // Finalizar span
      if (statusCode >= 400) {
        span.setStatus({
          code: trace.SpanStatusCode.ERROR,
          message: `HTTP error ${statusCode}`,
        });
      }
      span.end();
      
      // Chamar implementação original
      originalEnd.apply(res, arguments);
    };
    
    try {
      // Executar handler original
      return await handler(req, res);
    } catch (error) {
      // Capturar exceção não tratada
      const statusCode = error.statusCode || 500;
      
      // Registrar erro
      logs.error({
        message: `Unhandled exception: ${error.message}`,
        stack: error.stack,
        http: {
          method,
          route,
          status_code: statusCode,
        },
        user: {
          id: userId,
        },
        error: {
          name: error.name,
          message: error.message,
        },
      });
      
      // Atualizar span com informações do erro
      span.recordException(error);
      span.setStatus({
        code: trace.SpanStatusCode.ERROR,
        message: error.message,
      });
      span.end();
      
      // Registrar métrica de erro
      metrics.recordError({
        route,
        method,
        errorName: error.name,
      });
      
      // Retornar resposta de erro
      res.status(statusCode).json({
        error: error.message,
      });
    }
  };
}

// Decorador para funções de negócio
export function monitor(
  category: string,
  options: {
    recordArgs?: boolean;
    recordResult?: boolean;
    sanitizeLevel?: 'none' | 'partial' | 'full';
  } = {}
) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args: any[]) {
      const operationName = `${category}.${propertyKey}`;
      const startTime = Date.now();
      
      // Extrair contexto quando disponível
      const context = args[args.length - 1]?.context || {};
      const { userId, organizationId } = context;
      
      // Criar span
      const span = trace.startSpan(operationName);
      span.setAttribute('operation.name', operationName);
      
      if (userId) {
        span.setAttribute('user.id', userId);
      }
      
      if (organizationId) {
        span.setAttribute('organization.id', organizationId);
      }
      
      // Registrar argumentos se configurado
      if (options.recordArgs) {
        const sanitizedArgs = options.sanitizeLevel !== 'none'
          ? sanitizeData(args, { level: options.sanitizeLevel })
          : args;
        
        span.setAttribute('operation.args', JSON.stringify(sanitizedArgs));
      }
      
      try {
        // Executar método original
        const result = await originalMethod.apply(this, args);
        
        // Calcular tempo de execução
        const duration = Date.now() - startTime;
        
        // Registrar resultado se configurado
        if (options.recordResult) {
          const sanitizedResult = options.sanitizeLevel !== 'none'
            ? sanitizeData(result, { level: options.sanitizeLevel })
            : result;
          
          span.setAttribute('operation.result', JSON.stringify(sanitizedResult));
        }
        
        // Registrar métrica de duração
        metrics.recordOperation({
          name: operationName,
          duration,
          success: true,
        });
        
        // Registrar log de sucesso
        logs.debug({
          message: `Operation completed: ${operationName}`,
          operation: {
            name: operationName,
            duration,
          },
          user: userId ? { id: userId } : undefined,
          organization: organizationId ? { id: organizationId } : undefined,
        });
        
        // Finalizar span
        span.end();
        
        return result;
      } catch (error) {
        // Calcular tempo até erro
        const duration = Date.now() - startTime;
        
        // Registrar erro
        logs.error({
          message: `Operation failed: ${operationName} - ${error.message}`,
          operation: {
            name: operationName,
            duration,
          },
          user: userId ? { id: userId } : undefined,
          organization: organizationId ? { id: organizationId } : undefined,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        });
        
        // Atualizar span com informações do erro
        span.recordException(error);
        span.setStatus({
          code: trace.SpanStatusCode.ERROR,
          message: error.message,
        });
        span.end();
        
        // Registrar métrica de operação com erro
        metrics.recordOperation({
          name: operationName,
          duration,
          success: false,
                    error: error.name,
        });
        
        // Propagar erro
        throw error;
      }
    };
    
    return descriptor;
  };
}
```

### Monitoramento de Infraestrutura

A infraestrutura é monitorada em diferentes camadas:

1. **Recursos de Computação**
   - Uso de CPU, memória, disco e rede
   - Latência e throughput de rede
   - Taxas de erro e retentativas
   - Saúde de contêineres e pods

2. **Bancos de Dados**
   - Tempo de resposta de consultas
   - Taxa de cache hits/misses
   - Uso de conexões
   - Performance de índices
   - Bloqueios e deadlocks

3. **Sistemas de Mensageria**
   - Tamanho de filas e tópicos
   - Taxa de consumo de mensagens
   - Latência de entrega
   - Taxa de DLQ (Dead-Letter Queue)

### Exportadores de Telemetria

Para infraestrutura, o Brainlink utiliza diversos exportadores de telemetria:

```typescript
// lib/monitoring/exporters.ts
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

// Configuração de endpoints
const otlpEndpoint = process.env.OTLP_ENDPOINT || 'http://collector:4318';
const prometheusEndpoint = process.env.PROMETHEUS_ENDPOINT || 'localhost:9464';

// Exporter para métricas no formato Prometheus
export const prometheusExporter = new PrometheusExporter({
  endpoint: prometheusEndpoint,
  port: 9464,
});

// Exporter para traces usando OTLP
export const traceExporter = new OTLPTraceExporter({
  url: `${otlpEndpoint}/v1/traces`,
  headers: {
    'x-service-name': 'brainlink-app',
  },
});

// Exporter para métricas usando OTLP
export const metricExporter = new OTLPMetricExporter({
  url: `${otlpEndpoint}/v1/metrics`,
  headers: {
    'x-service-name': 'brainlink-app',
  },
});

// Exporter para logs usando OTLP
export const logExporter = new OTLPLogExporter({
  url: `${otlpEndpoint}/v1/logs`,
  headers: {
    'x-service-name': 'brainlink-app',
  },
});

// Configuração do ciclo de vida dos exporters
export function setupExporters() {
  // Registrar hook para shutdown limpo
  ['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => {
      console.log(`Received ${signal}, shutting down exporters...`);
      
      Promise.all([
        traceExporter.shutdown(),
        metricExporter.shutdown(),
        logExporter.shutdown(),
      ]).then(() => {
        console.log('Exporters shut down successfully');
        process.exit(0);
      }).catch(err => {
        console.error('Error shutting down exporters:', err);
        process.exit(1);
      });
    });
  });
}
```

## Métricas Principais

O Brainlink monitora um conjunto abrangente de métricas para manter a saúde e performance do sistema:

### Métricas de Infraestrutura

| Categoria | Métrica | Descrição | Unidade | Tipo |
|-----------|---------|-----------|---------|------|
| **Recursos** | cpu_utilization | Uso de CPU | Porcentagem | Gauge |
| | memory_utilization | Uso de memória | Porcentagem | Gauge |
| | disk_space_used | Espaço em disco usado | Bytes | Gauge |
| | network_in | Tráfego de rede recebido | Bytes/s | Counter |
| | network_out | Tráfego de rede enviado | Bytes/s | Counter |
| **Contêineres** | container_restarts | Número de restarts do contêiner | Count | Counter |
| | container_cpu_throttling | Eventos de throttling de CPU | Count | Counter |
| | container_memory_fail | Falhas de alocação de memória | Count | Counter |
| **Kubernetes** | pod_ready | Estado de prontidão dos pods | Boolean | Gauge |
| | deployment_replicas | Réplicas disponíveis/desejadas | Ratio | Gauge |
| | node_health | Estado de saúde dos nós | Score | Gauge |

### Métricas de Aplicação

| Categoria | Métrica | Descrição | Unidade | Tipo |
|-----------|---------|-----------|---------|------|
| **HTTP** | http_request_duration | Tempo de resposta | Milliseconds | Histogram |
| | http_request_rate | Taxa de requisições | Requests/s | Counter |
| | http_error_rate | Taxa de erros HTTP | Errors/s | Counter |
| | http_status_codes | Contagem por status code | Count | Counter |
| **API** | api_latency | Latência de endpoint de API | Milliseconds | Histogram |
| | api_error_rate | Taxa de erros de API | Percentage | Gauge |
| | api_saturation | Nível de saturação de API | Percentage | Gauge |
| **Banco de Dados** | db_query_duration | Tempo de execução de query | Milliseconds | Histogram |
| | db_connection_pool | Uso de pool de conexões | Count | Gauge |
| | db_transaction_rate | Taxa de transações | TPS | Counter |
| | db_error_rate | Taxa de erros de BD | Errors/s | Counter |
| **Cache** | cache_hit_rate | Taxa de acertos no cache | Percentage | Gauge |
| | cache_miss_rate | Taxa de falhas no cache | Percentage | Gauge |
| | cache_eviction_rate | Taxa de despejos de cache | Items/s | Counter |
| | cache_size | Tamanho do cache | Bytes | Gauge |
| **Autenticação** | auth_success_rate | Taxa de autenticações bem-sucedidas | Percentage | Gauge |
| | auth_failure_rate | Taxa de falhas de autenticação | Count/min | Counter |
| | auth_latency | Tempo de processamento de auth | Milliseconds | Histogram |
| | token_validation_rate | Taxa de validação de tokens | Validations/s | Counter |

### Métricas de Negócio

| Categoria | Métrica | Descrição | Unidade | Tipo |
|-----------|---------|-----------|---------|------|
| **Usuários** | active_users | Usuários ativos | Count | Gauge |
| | user_signup_rate | Taxa de novos cadastros | Users/day | Counter |
| | user_login_rate | Taxa de logins | Logins/hour | Counter |
| | user_session_duration | Duração média da sessão | Minutes | Histogram |
| **Organizações** | active_organizations | Organizações ativas | Count | Gauge |
| | avg_users_per_org | Média de usuários por organização | Count | Gauge |
| | org_resources_usage | Uso de recursos por organização | Percentage | Gauge |
| **Conteúdo** | content_creation_rate | Taxa de criação de conteúdo | Items/day | Counter |
| | content_access_rate | Taxa de acesso a conteúdo | Views/hour | Counter |
| | content_size_total | Tamanho total de conteúdo | Gigabytes | Gauge |
| **Integrações** | integration_success_rate | Taxa de sucesso de integrações | Percentage | Gauge |
| | integration_error_rate | Taxa de erro de integrações | Errors/day | Counter |
| | integration_latency | Latência de integrações | Seconds | Histogram |

### Implementação do Serviço de Métricas

```typescript
// lib/monitoring/metrics.ts
import { metrics } from '@opentelemetry/api-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';

// Configuração de prefixos para organização de métricas
const SERVICE_NAME = 'brainlink';
const APPLICATION_PREFIX = `${SERVICE_NAME}_app`;
const BUSINESS_PREFIX = `${SERVICE_NAME}_business`;
const RESOURCE_PREFIX = `${SERVICE_NAME}_resource`;

export class MetricsService {
  private static meter = metrics.getMeter(SERVICE_NAME);
  
  // Contadores HTTP
  private static httpRequestCounter = this.meter.createCounter(`${APPLICATION_PREFIX}_http_requests_total`, {
    description: 'Total count of HTTP requests',
  });
  
  private static httpErrorCounter = this.meter.createCounter(`${APPLICATION_PREFIX}_http_errors_total`, {
    description: 'Total count of HTTP errors',
  });
  
  // Histograma para latência
  private static httpLatencyHistogram = this.meter.createHistogram(`${APPLICATION_PREFIX}_http_request_duration_ms`, {
    description: 'HTTP request duration in milliseconds',
    unit: 'ms',
    boundaries: [10, 50, 100, 200, 500, 1000, 2000, 5000],
  });
  
  // Métricas para operações
  private static operationCounter = this.meter.createCounter(`${APPLICATION_PREFIX}_operations_total`, {
    description: 'Total count of operations',
  });
  
  private static operationErrorCounter = this.meter.createCounter(`${APPLICATION_PREFIX}_operation_errors_total`, {
    description: 'Total count of operation errors',
  });
  
  private static operationDurationHistogram = this.meter.createHistogram(`${APPLICATION_PREFIX}_operation_duration_ms`, {
    description: 'Operation duration in milliseconds',
    unit: 'ms',
    boundaries: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  });
  
  // Métricas de negócio
  private static activeUsersGauge = this.meter.createObservableGauge(`${BUSINESS_PREFIX}_active_users`, {
    description: 'Number of active users in the system',
  });
  
  private static contentCreationCounter = this.meter.createCounter(`${BUSINESS_PREFIX}_content_created_total`, {
    description: 'Total count of content items created',
  });
  
  // Métricas de recursos
  private static dbConnectionGauge = this.meter.createObservableGauge(`${RESOURCE_PREFIX}_db_connections`, {
    description: 'Current database connections',
  });
  
  private static cacheHitCounter = this.meter.createCounter(`${RESOURCE_PREFIX}_cache_hits_total`, {
    description: 'Total count of cache hits',
  });
  
  private static cacheMissCounter = this.meter.createCounter(`${RESOURCE_PREFIX}_cache_misses_total`, {
    description: 'Total count of cache misses',
  });
  
  /**
   * Inicializa o serviço de métricas
   */
  static init(exporter: PrometheusExporter) {
    // Criar provider de métricas com exporter configurado
    const meterProvider = new MeterProvider();
    meterProvider.addMetricReader(exporter);
    metrics.setGlobalMeterProvider(meterProvider);
    
    // Configurar métricas observáveis
    this.setupObservableMetrics();
    
    console.log('Metrics service initialized');
  }
  
  /**
   * Configura métricas que são coletadas periodicamente
   */
  private static setupObservableMetrics() {
    // Exemplo: Active users
    this.activeUsersGauge.addCallback(async observableResult => {
      try {
        // Em produção, buscar de cache ou calcular eficientemente
        const activeUsers = await this.getActiveUserCount();
        observableResult.observe(activeUsers);
      } catch (error) {
        console.error('Error collecting active users metric:', error);
      }
    });
    
    // Exemplo: DB connections
    this.dbConnectionGauge.addCallback(async observableResult => {
      try {
        const connectionStats = await this.getDbConnectionStats();
        observableResult.observe(connectionStats.active, { state: 'active' });
        observableResult.observe(connectionStats.idle, { state: 'idle' });
        observableResult.observe(connectionStats.total, { state: 'total' });
      } catch (error) {
        console.error('Error collecting DB connection metric:', error);
      }
    });
  }
  
  /**
   * Registra uma requisição HTTP
   */
  static recordHttpRequest({
    route,
    method,
    statusCode,
    responseTime,
  }: {
    route: string;
    method: string;
    statusCode: number;
    responseTime: number;
  }) {
    const labels = {
      route,
      method,
      status_code: statusCode.toString(),
    };
    
    // Incrementar contador de requisições
    this.httpRequestCounter.add(1, labels);
    
    // Registrar duração
    this.httpLatencyHistogram.record(responseTime, labels);
    
    // Se for erro, incrementar contador de erros
    if (statusCode >= 400) {
      this.httpErrorCounter.add(1, {
        ...labels,
        error_type: this.getErrorTypeFromStatus(statusCode),
      });
    }
  }
  
  /**
   * Registra um erro
   */
  static recordError({
    route,
    method,
    errorName,
  }: {
    route: string;
    method: string;
    errorName: string;
  }) {
    this.httpErrorCounter.add(1, {
      route,
      method,
      error_type: errorName,
    });
  }
  
  /**
   * Registra uma operação
   */
  static recordOperation({
    name,
    duration,
    success,
    error,
  }: {
    name: string;
    duration: number;
    success: boolean;
    error?: string;
  }) {
    const labels = { name };
    
    // Incrementar contador de operações
    this.operationCounter.add(1, labels);
    
    // Registrar duração
    this.operationDurationHistogram.record(duration, labels);
    
    // Se for erro, incrementar contador de erros
    if (!success && error) {
      this.operationErrorCounter.add(1, {
        ...labels,
        error_type: error,
      });
    }
  }
  
  /**
   * Registra operação de cache
   */
  static recordCacheOperation({
    cache,
    operation,
    hit,
  }: {
    cache: string;
    operation: string;
    hit: boolean;
  }) {
    const labels = {
      cache,
      operation,
    };
    
    if (hit) {
      this.cacheHitCounter.add(1, labels);
    } else {
      this.cacheMissCounter.add(1, labels);
    }
  }
  
  /**
   * Registra criação de conteúdo
   */
  static recordContentCreation({
        type,
    userId,
    organizationId,
    size,
  }: {
    type: string;
    userId: string;
    organizationId?: string;
    size?: number;
  }) {
    const labels = {
      content_type: type,
      organization_id: organizationId || 'none',
    };
    
    this.contentCreationCounter.add(1, labels);
  }
  
  /**
   * Cria um timer para medir duração
   */
  static startTimer() {
    const startTime = Date.now();
    
    return {
      end: () => {
        return Date.now() - startTime;
      },
    };
  }
  
  /**
   * Utilitários para métricas
   */
  private static getErrorTypeFromStatus(statusCode: number): string {
    if (statusCode >= 400 && statusCode < 500) {
      return 'client_error';
    } else if (statusCode >= 500) {
      return 'server_error';
    }
    return 'unknown_error';
  }
  
  private static async getActiveUserCount(): Promise<number> {
    // Em produção, implementar consulta a Redis ou outro cache
    // Exemplo simplificado
    return 120;
  }
  
  private static async getDbConnectionStats(): Promise<{
    active: number;
    idle: number;
    total: number;
  }> {
    // Em produção, obter estatísticas reais do pool de conexões
    // Exemplo simplificado
    return {
      active: 5,
      idle: 15,
      total: 20,
    };
  }
}
```

## Logs e Rastreamento

O Brainlink implementa uma estratégia abrangente de logging e rastreamento para facilitar a depuração e análise de problemas:

### Estrutura de Logs

Todos os logs seguem uma estrutura padronizada em formato JSON:

```json
{
  "timestamp": "2025-03-19T18:30:45.123Z",
  "service": "brainlink-api",
  "level": "info",
  "message": "User login successful",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "user": {
    "id": "user-123",
    "email": "user@example.com"
  },
  "organization": {
    "id": "org-456",
    "name": "Example Corp"
  },
  "http": {
    "method": "POST",
    "path": "/api/auth/login",
    "status_code": 200,
    "response_time_ms": 156
  },
  "context": {
    "environment": "production",
    "region": "us-east-1",
    "version": "2.5.3"
  }
}
```

### Níveis de Log

Os logs seguem uma hierarquia de severidade padronizada:

| Nível | Descrição | Casos de Uso |
|-------|-----------|--------------|
| **TRACE** | Informações extremamente detalhadas | Depuração de desenvolvimento, diagnósticos avançados |
| **DEBUG** | Informações detalhadas para diagnóstico | Depuração, análise de fluxo de execução |
| **INFO** | Eventos normais de operação | Ações de usuário, operações de sistema bem-sucedidas |
| **WARN** | Situações potencialmente problemáticas | Degradação de performance, retries, capacidade se aproximando do limite |
| **ERROR** | Erros que afetam uma operação específica | Falhas de operação, erros de integração recuperáveis |
| **FATAL** | Erros críticos que afetam o sistema | Falhas de inicialização, corrupção de dados, falhas de infraestrutura |

### Implementação do Sistema de Logs

```typescript
// lib/monitoring/logger.ts
import winston from 'winston';
import { trace } from '@opentelemetry/api';
import { sanitizeData } from '@/lib/security/data';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const SERVICE_NAME = process.env.SERVICE_NAME || 'brainlink-app';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

export class Logger {
  private static logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    defaultMeta: {
      service: SERVICE_NAME,
      environment: ENVIRONMENT,
    },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(info => {
            const { timestamp, level, message, ...meta } = info;
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta) : ''
            }`;
          })
        ),
      }),
    ],
  });
  
  /**
   * Anexa informações de trace a um objeto de log
   */
  private static addTraceInfo(logObject: any): any {
    const span = trace.getSpan(trace.getActiveSpanContext());
    
    if (span) {
      const context = span.spanContext();
      logObject.trace_id = context.traceId;
      logObject.span_id = context.spanId;
    }
    
    return logObject;
  }
  
  /**
   * Sanitiza informações sensíveis nos logs
   */
  private static sanitizeLogData(data: any): any {
    const sensitiveFields = [
      'password', 'token', 'secret', 'api_key', 'credit_card',
      'ssn', 'social_security', 'auth', 'authorization'
    ];
    
    const sanitized = { ...data };
    
    // Sanitizar campos específicos
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '******';
      }
      
      // Verificar campos aninhados
      if (typeof sanitized === 'object' && sanitized !== null) {
        for (const key in sanitized) {
          if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = this.sanitizeLogData(sanitized[key]);
          }
        }
      }
    }
    
    return sanitized;
  }
  
  /**
   * Logs um evento de nível TRACE
   */
  static trace(message: string, meta: Record<string, any> = {}): void {
    const sanitizedMeta = this.sanitizeLogData(meta);
    const logObject = this.addTraceInfo({ message, ...sanitizedMeta });
    this.logger.log('trace', message, logObject);
  }
  
  /**
   * Logs um evento de nível DEBUG
   */
  static debug(message: string, meta: Record<string, any> = {}): void {
    const sanitizedMeta = this.sanitizeLogData(meta);
    const logObject = this.addTraceInfo({ message, ...sanitizedMeta });
    this.logger.debug(message, logObject);
  }
  
  /**
   * Logs um evento de nível INFO
   */
  static info(message: string, meta: Record<string, any> = {}): void {
    const sanitizedMeta = this.sanitizeLogData(meta);
    const logObject = this.addTraceInfo({ message, ...sanitizedMeta });
    this.logger.info(message, logObject);
  }
  
  /**
   * Logs um evento de nível WARN
   */
  static warn(message: string, meta: Record<string, any> = {}): void {
    const sanitizedMeta = this.sanitizeLogData(meta);
    const logObject = this.addTraceInfo({ message, ...sanitizedMeta });
    this.logger.warn(message, logObject);
  }
  
  /**
   * Logs um evento de nível ERROR
   */
  static error(message: string, meta: Record<string, any> = {}): void {
    const sanitizedMeta = this.sanitizeLogData(meta);
    const logObject = this.addTraceInfo({ message, ...sanitizedMeta });
    this.logger.error(message, logObject);
  }
  
  /**
   * Logs um evento de nível FATAL
   */
  static fatal(message: string, meta: Record<string, any> = {}): void {
    const sanitizedMeta = this.sanitizeLogData(meta);
    const logObject = this.addTraceInfo({ message, ...sanitizedMeta });
    this.logger.log('fatal', message, logObject);
  }
  
  /**
   * Logs uma requisição HTTP
   */
  static http(meta: {
    message: string;
    severity?: string;
    http: {
      method: string;
      route: string;
      status_code: number;
      response_time_ms: number;
      user_agent?: string;
    };
    user?: {
      id: string;
      [key: string]: any;
    };
    organization?: {
      id: string;
      [key: string]: any;
    };
    [key: string]: any;
  }): void {
    const { message, severity = 'info', ...rest } = meta;
    const sanitizedMeta = this.sanitizeLogData(rest);
    const logObject = this.addTraceInfo(sanitizedMeta);
    
    this.logger.log(severity, message, logObject);
  }
  
  /**
   * Logs um erro com stack trace
   */
  static logError(error: Error, meta: Record<string, any> = {}): void {
    const logObject = {
      message: error.message,
      stack: error.stack,
      ...this.sanitizeLogData(meta),
    };
    
    this.logger.error(error.message, this.addTraceInfo(logObject));
  }
}
```

### Rastreamento Distribuído

O rastreamento distribuído permite acompanhar a jornada de uma requisição através de múltiplos serviços e componentes:

```typescript
// lib/monitoring/tracer.ts
import opentelemetry from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { PrismaInstrumentation } from '@prisma/instrumentation';

const SERVICE_NAME = process.env.SERVICE_NAME || 'brainlink-app';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';

export class TracingService {
  /**
   * Inicializa o sistema de rastreamento
   */
  static init(exporter: OTLPTraceExporter): void {
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
        [SemanticResourceAttributes.SERVICE_VERSION]: SERVICE_VERSION,
        environment: process.env.NODE_ENV || 'development',
      }),
    });
    
    // Configurar processador de spans
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    
    // Registrar como provedor global
    provider.register({
      propagator: new W3CTraceContextPropagator(),
    });
    
    // Instrumentações automáticas
    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new PrismaInstrumentation(),
      ],
    });
    
    console.log('Tracing service initialized');
  }
  
  /**
   * Cria um span para um escopo de operação
   */
  static createSpan(name: string, options?: {
    attributes?: Record<string, any>;
    parent?: opentelemetry.SpanContext;
  }): opentelemetry.Span {
    const tracer = opentelemetry.trace.getTracer(SERVICE_NAME);
    
    const span = tracer.startSpan(name, {
      attributes: options?.attributes,
      kind: opentelemetry.SpanKind.INTERNAL,
    });
    
    return span;
  }
  
  /**
   * Executa uma função dentro do contexto de um span
   */
  static async withSpan<T>(
    name: string,
    fn: (span: opentelemetry.Span) => Promise<T>,
    options?: {
      attributes?: Record<string, any>;
      parent?: opentelemetry.SpanContext;
    }
  ): Promise<T> {
    const span = this.createSpan(name, options);
    
    try {
      return await opentelemetry.context.with(
        opentelemetry.trace.setSpan(opentelemetry.context.active(), span),
        async () => {
          try {
            const result = await fn(span);
            span.end();
            return result;
          } catch (error) {
            span.recordException(error);
            span.setStatus({
              code: opentelemetry.SpanStatusCode.ERROR,
              message: error.message,
            });
            span.end();
            throw error;
          }
        }
      );
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Adiciona atributos ao span atual
   */
  static addAttributesToCurrentSpan(attributes: Record<string, any>): void {
    const currentSpan = opentelemetry.trace.getSpan(opentelemetry.context.active());
    
    if (currentSpan) {
      Object.entries(attributes).forEach(([key, value]) => {
        currentSpan.setAttribute(key, value);
      });
    }
  }
  
  /**
   * Registra um evento no span atual
   */
  static addEventToCurrentSpan(name: string, attributes?: Record<string, any>): void {
    const currentSpan = opentelemetry.trace.getSpan(opentelemetry.context.active());
    
    if (currentSpan) {
      currentSpan.addEvent(name, attributes);
    }
  }
  
  /**
   * Obtém o contexto de rastreamento atual como cabeçalhos de propagação
   */
  static getPropagationHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const currentContext = opentelemetry.context.active();
    
    const propagator = new W3CTraceContextPropagator();
    propagator.inject(currentContext, headers);
    
    return headers;
  }
}
```

## Alertas e Notificações

O sistema de alertas do Brainlink permite a detecção proativa de problemas e notificação das equipes responsáveis:

### Configuração de Regras de Alerta

Os alertas podem ser configurados para diversos tipos de condições:

1. **Alertas baseados em limite**
   - Quando uma métrica excede um valor fixo
   - Exemplo: CPU utilization > 80%

1. **Alertas baseados em tendência**
   - Quando uma métrica aumenta/diminui a uma taxa anormal
   - Exemplo: Erro de requisição aumentando 200% em 5 minutos

3. **Alertas baseados em anomalia**
   - Quando uma métrica se desvia do padrão histórico
   - Exemplo: Padrão incomum de tráfego de API

4. **Alertas baseados em ausência**
   - Quando uma métrica esperada não é recebida
   - Exemplo: Nenhum heartbeat recebido em 5 minutos

### Sistema de Gerenciamento de Alertas

```typescript
// lib/monitoring/alerts.ts
import axios from 'axios';
import { prisma } from '@/lib/db/prisma';
import { Logger } from './logger';

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  SUPPRESSED = 'suppressed',
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  query: string;
  condition: string;
  duration: string;
  severity: AlertSeverity;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  silenced: boolean;
  notificationChannels: string[];
}

export interface Alert {
  id: string;
  ruleId: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  startedAt: Date;
  endedAt?: Date;
  value: number;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  notificationsSent: boolean;
}

export class AlertManager {
  /**
   * Dispara um novo alerta
   */
  static async triggerAlert({
    ruleId,
    name,
    description,
    severity,
    value,
    labels,
    annotations,
  }: {
    ruleId: string;
    name: string;
    description: string;
    severity: AlertSeverity;
    value: number;
    labels: Record<string, string>;
    annotations: Record<string, string>;
  }): Promise<Alert> {
    try {
      // Verificar se já existe um alerta ativo para essa regra
      const existingAlert = await prisma.alert.findFirst({
        where: {
          ruleId,
          status: {
            in: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED],
          },
        },
      });
      
      if (existingAlert) {
        // Atualizar alerta existente
        const updatedAlert = await prisma.alert.update({
          where: {
            id: existingAlert.id,
          },
          data: {
            value,
            updatedAt: new Date(),
          },
        });
        
        return updatedAlert as unknown as Alert;
      }
      
      // Criar novo alerta
      const alert = await prisma.alert.create({
        data: {
          ruleId,
          name,
          description,
          severity,
          status: AlertStatus.ACTIVE,
          startedAt: new Date(),
          value,
          labels,
          annotations,
          notificationsSent: false,
        },
      });
      
      // Log do novo alerta
      Logger.warn(`New alert triggered: ${name}`, {
        alert: {
          id: alert.id,
          rule_id: ruleId,
          severity,
          description,
          value,
        },
      });
      
      // Enviar notificações de forma assíncrona
      this.sendAlertNotifications(alert as unknown as Alert).catch(error => {
        Logger.error('Failed to send alert notifications', {
          error: error.message,
          alert_id: alert.id,
        });
      });
      
      return alert as unknown as Alert;
    } catch (error) {
      Logger.error('Failed to trigger alert', {
        error: error.message,
        rule_id: ruleId,
        name,
      });
      throw error;
    }
  }
  
  /**
   * Envia notificações para os canais configurados
   */
  private static async sendAlertNotifications(alert: Alert): Promise<void> {
    try {
      // Buscar regra para obter canais de notificação
      const rule = await prisma.alertRule.findUnique({
        where: {
          id: alert.ruleId,
        },
        include: {
          notificationChannels: true,
        },
      });
      
      if (!rule) {
        throw new Error(`Alert rule not found: ${alert.ruleId}`);
      }
      
      // Enviar para cada canal configurado
      const notificationPromises = rule.notificationChannels.map(async channel => {
        return this.sendNotificationToChannel(alert, channel);
      });
      
      await Promise.all(notificationPromises);
      
      // Marcar notificações como enviadas
      await prisma.alert.update({
        where: {
          id: alert.id,
        },
        data: {
          notificationsSent: true,
        },
      });
    } catch (error) {
      Logger.error('Error sending alert notifications', {
        alert_id: alert.id,
        error: error.message,
      });
      throw error;
    }
  }
  
  /**
   * Envia notificação para um canal específico
   */
  private static async sendNotificationToChannel(
    alert: Alert,
    channel: any
  ): Promise<void> {
    try {
      switch (channel.type) {
        case 'email':
          await this.sendEmailNotification(alert, channel);
          break;
        case 'slack':
          await this.sendSlackNotification(alert, channel);
          break;
        case 'webhook':
          await this.sendWebhookNotification(alert, channel);
          break;
        case 'pagerduty':
          await this.sendPagerDutyNotification(alert, channel);
          break;
        default:
          Logger.warn(`Unsupported notification channel type: ${channel.type}`, {
            alert_id: alert.id,
            channel_id: channel.id,
          });
      }
    } catch (error) {
      Logger.error(`Failed to send ${channel.type} notification`, {
        alert_id: alert.id,
        channel_id: channel.id,
        error: error.message,
      });
      throw error;
    }
  }
  
  /**
   * Envia notificação por email
   */
  private static async sendEmailNotification(
    alert: Alert,
    channel: any
  ): Promise<void> {
    // Implementação do envio de email
    Logger.info(`Sending email notification for alert ${alert.id}`);
    
    // Em uma implementação real, usar um serviço de email
    // Exemplo simplificado
    const emailService = {
      sendMail: async (options: any) => {
        console.log('Email would be sent:', options);
        return true;
      },
    };
    
    await emailService.sendMail({
      to: channel.config.recipients,
      subject: `[${alert.severity.toUpperCase()}] ${alert.name}`,
      html: `
        <h2>Alert: ${alert.name}</h2>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>Description:</strong> ${alert.description}</p>
        <p><strong>Value:</strong> ${alert.value}</p>
        <p><strong>Started at:</strong> ${alert.startedAt.toISOString()}</p>
        <hr />
        <p>View details in the <a href="${process.env.APP_URL}/alerts/${alert.id}">Brainlink Dashboard</a></p>
      `,
    });
  }
  
  /**
   * Envia notificação para Slack
   */
  private static async sendSlackNotification(
    alert: Alert,
    channel: any
  ): Promise<void> {
    Logger.info(`Sending Slack notification for alert ${alert.id}`);
    
    // Cor com base na severidade
    const colorMap = {
      [AlertSeverity.INFO]: '#3498db',
      [AlertSeverity.WARNING]: '#f39c12',
      [AlertSeverity.ERROR]: '#e74c3c',
      [AlertSeverity.CRITICAL]: '#9b59b6',
    };
    
    // Construir payload do Slack
    const payload = {
      text: `[${alert.severity.toUpperCase()}] Alert: ${alert.name}`,
      attachments: [
        {
          color: colorMap[alert.severity] || '#3498db',
          title: alert.name,
          title_link: `${process.env.APP_URL}/alerts/${alert.id}`,
          text: alert.description,
          fields: [
            {
              title: 'Severity',
              value: alert.severity,
              short: true,
            },
            {
              title: 'Status',
              value: alert.status,
              short: true,
            },
            {
              title: 'Value',
              value: alert.value.toString(),
              short: true,
            },
            {
              title: 'Started',
              value: new Date(alert.startedAt).toLocaleString(),
              short: true,
            },
          ],
          footer: 'Brainlink Monitoring',
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };
    
    // Enviar para Webhook do Slack
    await axios.post(channel.config.webhookUrl, payload);
  }
  
  /**
   * Envia notificação para webhook genérico
   */
  private static async sendWebhookNotification(
    alert: Alert,
    channel: any
  ): Promise<void> {
    Logger.info(`Sending webhook notification for alert ${alert.id}`);
    
    // Construir payload
    const payload = {
      id: alert.id,
      name: alert.name,
      description: alert.description,
      severity: alert.severity,
      status: alert.status,
      value: alert.value,
      startedAt: alert.startedAt,
      labels: alert.labels,
      annotations: alert.annotations,
    };
    
    // Enviar para URL de webhook
    await axios.post(channel.config.url, payload, {
      headers: {
        'Content-Type': 'application/json',
        ...channel.config.headers,
      },
    });
  }
  
  /**
   * Envia notificação para PagerDuty
   */
  private static async sendPagerDutyNotification(
    alert: Alert,
    channel: any
  ): Promise<void> {
    Logger.info(`Sending PagerDuty notification for alert ${alert.id}`);
    
    // Mapear severidade para o formato do PagerDuty
    const severityMap = {
      [AlertSeverity.INFO]: 'info',
      [AlertSeverity.WARNING]: 'warning',
      [AlertSeverity.ERROR]: 'error',
      [AlertSeverity.CRITICAL]: 'critical',
    };
    
    // Payload para API de eventos do PagerDuty
    const payload = {
      routing_key: channel.config.integrationKey,
      event_action: 'trigger',
      dedup_key: `brainlink-alert-${alert.id}`,
      payload: {
        summary: alert.name,
        source: 'Brainlink Monitoring',
        severity: severityMap[alert.severity] || 'warning',
        component: alert.labels.component || 'application',
        group: alert.labels.group || 'production',
        class: alert.labels.class || 'monitoring',
        custom_details: {
          description: alert.description,
          value: alert.value,
          labels: alert.labels,
          annotations: alert.annotations,
        },
      },
      links: [
        {
          href: `${process.env.APP_URL}/alerts/${alert.id}`,
          text: 'View in Brainlink',
        },
      ],
    };
    
    // Enviar para API do PagerDuty
    await axios.post('https://events.pagerduty.com/v2/enqueue', payload);
  }
  
  /**
   * Atualiza o status de um alerta
   */
  static async updateAlertStatus(
    alertId: string,
    status: AlertStatus,
    userId: string
  ): Promise<Alert> {
    try {
      const alert = await prisma.alert.findUnique({
        where: {
          id: alertId,
        },
      });
      
      if (!alert) {
        throw new Error(`Alert not found: ${alertId}`);
      }
      
      // Se estiver resolvendo, definir data de término
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };
      
      if (status === AlertStatus.RESOLVED) {
        updateData.endedAt = new Date();
      }
      
      // Atualizar o alerta
      const updatedAlert = await prisma.alert.update({
        where: {
          id: alertId,
        },
        data: updateData,
      });
      
      // Registrar histórico de atualização
      await prisma.alertHistory.create({
        data: {
          alertId,
          userId,
          action: `Status changed to ${status}`,
          timestamp: new Date(),
        },
      });
      
      // Log da atualização
      Logger.info(`Alert ${alertId} status updated to ${status}`, {
        alert_id: alertId,
        previous_status: alert.status,
        new_status: status,
        updated_by: userId,
      });
      
      return updatedAlert as unknown as Alert;
    } catch (error) {
      Logger.error('Failed to update alert status', {
        alert_id: alertId,
        status,
        error: error.message,
      });
      throw error;
    }
  }
  
  /**
   * Verifica os alertas ativos para possível auto-resolução
   */
  static async checkAlertResolution(): Promise<void> {
    try {
      // Buscar alertas ativos
      const activeAlerts = await prisma.alert.findMany({
        where: {
          status: {
            in: [AlertStatus.ACTIVE, AlertStatus.ACKNOWLEDGED],
          },
        },
        include: {
          rule: true,
        },
      });
      
      // Verificar cada alerta
      for (const alert of activeAlerts) {
        try {
          // Em uma implementação real, verificar se a condição ainda é verdadeira
          // Isso exigiria consultar as métricas e avaliar a condição da regra
          // Para este exemplo, simulamos uma resolução baseada em tempo
          
          const ruleDuration = parseDuration(alert.rule?.autoResolveAfter || '0s');
          
          if (ruleDuration > 0) {
            const alertAge = Date.now() - new Date(alert.startedAt).getTime();
            
            if (alertAge > ruleDuration) {
              // Auto-resolver o alerta
              await this.updateAlertStatus(
                alert.id,
                AlertStatus.RESOLVED,
                'system'
              );
              
              Logger.info(`Alert ${alert.id} auto-resolved after ${ruleDuration}ms`, {
                alert_id: alert.id,
                rule_id: alert.ruleId,
              });
            }
          }
                } catch (error) {
          Logger.error(`Error checking resolution for alert ${alert.id}`, {
            error: error.message,
            alert_id: alert.id,
          });
        }
      }
    } catch (error) {
      Logger.error('Error in alert resolution check', {
        error: error.message,
      });
    }
  }
}

/**
 * Converte string de duração (ex: '5m', '1h') para milissegundos
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  
  if (!match) {
    return 0;
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000; // segundos
    case 'm': return value * 60 * 1000; // minutos
    case 'h': return value * 60 * 60 * 1000; // horas
    case 'd': return value * 24 * 60 * 60 * 1000; // dias
    default: return 0;
  }
}
```

## Dashboards e Visualizações

O Brainlink oferece dashboards personalizáveis para visualizar métricas, logs e outros dados de monitoramento:

### Tipos de Dashboards

1. **Operacionais** - Visão geral do estado atual do sistema
   - Métricas de saúde e disponibilidade
   - SLIs (Service Level Indicators)
   - Incidentes ativos

2. **Analíticos** - Tendências e análises históricas
   - Utilização de recursos ao longo do tempo
   - Padrões de uso por hora, dia, semana
   - Correlação entre métricas

3. **Negócios** - Métricas centradas no usuário
   - Adoção e retenção
   - Utilização de recursos
   - Performance de funcionalidades

### Componentes de Visualização

```typescript
// lib/monitoring/dashboards.ts
export enum VisualizationType {
  LINE_CHART = 'line_chart',
  AREA_CHART = 'area_chart',
  BAR_CHART = 'bar_chart',
  GAUGE = 'gauge',
  STAT = 'stat',
  TABLE = 'table',
  HEATMAP = 'heatmap',
  LOG_STREAM = 'log_stream',
  TRACE_VIEW = 'trace_view',
  ALERT_LIST = 'alert_list',
}

export interface DashboardPanel {
  id: string;
  title: string;
  description?: string;
  type: VisualizationType;
  query: string;
  timeRange?: {
    from: string;
    to: string;
  };
  options?: Record<string, any>;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  category: 'operational' | 'analytical' | 'business' | 'custom';
  tags: string[];
  panels: DashboardPanel[];
  timeRange: {
    from: string;
    to: string;
  };
  refresh?: string;
  variables?: Record<string, any>[];
  permissions?: {
    public: boolean;
    users?: string[];
    roles?: string[];
  };
}

export class DashboardService {
  /**
   * Obtém definição de um dashboard
   */
  static async getDashboard(id: string, userId: string): Promise<Dashboard | null> {
    try {
      const dashboard = await prisma.dashboard.findUnique({
        where: {
          id,
        },
        include: {
          panels: true,
          permissions: true,
        },
      });
      
      if (!dashboard) {
        return null;
      }
      
      // Verificar permissão
      const canAccess = await this.checkDashboardAccess(dashboard, userId);
      
      if (!canAccess) {
        throw new Error('Unauthorized access to dashboard');
      }
      
      // Converter para formato da API
      return {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        category: dashboard.category as any,
        tags: dashboard.tags as string[],
        panels: dashboard.panels.map(panel => ({
          id: panel.id,
          title: panel.title,
          description: panel.description,
          type: panel.type as VisualizationType,
          query: panel.query,
          timeRange: panel.timeRange as any,
          options: panel.options as any,
          position: panel.position as any,
        })),
        timeRange: dashboard.timeRange as any,
        refresh: dashboard.refresh,
        variables: dashboard.variables as any[],
        permissions: dashboard.permissions as any,
      };
    } catch (error) {
      Logger.error('Error getting dashboard', {
        dashboard_id: id,
        error: error.message,
      });
      throw error;
    }
  }
  
  /**
   * Verifica se um usuário tem acesso ao dashboard
   */
  private static async checkDashboardAccess(
    dashboard: any,
    userId: string
  ): Promise<boolean> {
    // Dashboard público
    if (dashboard.permissions?.public) {
      return true;
    }
    
    // Acesso direto ao usuário
    if (dashboard.permissions?.users?.includes(userId)) {
      return true;
    }
    
    // Verificar papéis do usuário
    if (dashboard.permissions?.roles?.length > 0) {
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
        },
      });
      
      const roles = userRoles.map(ur => ur.role);
      
      for (const role of roles) {
        if (dashboard.permissions.roles.includes(role)) {
          return true;
        }
      }
    }
    
    // Verificar permissão de admin
    const isAdmin = await prisma.userRole.findFirst({
      where: {
        userId,
        role: 'admin',
      },
    });
    
    return !!isAdmin;
  }
  
  /**
   * Executa consulta para um painel de dashboard
   */
  static async executeQuery(
    query: string,
    range: { from: string; to: string },
    variables?: Record<string, any>
  ): Promise<any> {
    try {
      // Analisa o tipo de consulta
      if (query.startsWith('metrics:')) {
        return this.executeMetricsQuery(query.substr(8), range, variables);
      } else if (query.startsWith('logs:')) {
        return this.executeLogsQuery(query.substr(5), range, variables);
      } else if (query.startsWith('traces:')) {
        return this.executeTracesQuery(query.substr(7), range, variables);
      } else if (query.startsWith('alerts:')) {
        return this.executeAlertsQuery(query.substr(7), range, variables);
      } else if (query.startsWith('sql:')) {
        return this.executeSqlQuery(query.substr(4), variables);
      } else {
        throw new Error(`Unsupported query type: ${query}`);
      }
    } catch (error) {
      Logger.error('Error executing dashboard query', {
        query,
        error: error.message,
      });
      throw error;
    }
  }
  
  /**
   * Executa consulta de métricas
   */
  private static async executeMetricsQuery(
    query: string,
    range: { from: string; to: string },
    variables?: Record<string, any>
  ): Promise<any> {
    // Em uma implementação real, enviar para o sistema de séries temporais
    // Exemplo simplificado para ilustração
    
    // Substituir variáveis
    let processedQuery = query;
    
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        processedQuery = processedQuery.replace(`$${key}`, String(value));
      }
    }
    
    // Simular dados para demonstração
    const result = {
      query: processedQuery,
      range,
      series: [
        {
          name: 'Serie A',
          points: generateTimeSeriesData(range.from, range.to, 50),
        },
      ],
    };
    
    return result;
  }
  
  /**
   * Executa consulta de logs
   */
  private static async executeLogsQuery(
    query: string,
    range: { from: string; to: string },
    variables?: Record<string, any>
  ): Promise<any> {
    // Em uma implementação real, enviar para o sistema de logs
    // Exemplo simplificado para ilustração
    
    // Substituir variáveis
    let processedQuery = query;
    
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        processedQuery = processedQuery.replace(`$${key}`, String(value));
      }
    }
    
    // Simular dados para demonstração
    const result = {
      query: processedQuery,
      range,
      logs: generateSampleLogs(range.from, range.to, 20),
    };
    
    return result;
  }
  
  /**
   * Executa consulta de traces
   */
  private static async executeTracesQuery(
    query: string,
    range: { from: string; to: string },
    variables?: Record<string, any>
  ): Promise<any> {
    // Em uma implementação real, enviar para o sistema de traces
    // Exemplo simplificado para ilustração
    
    // Substituir variáveis
    let processedQuery = query;
    
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        processedQuery = processedQuery.replace(`$${key}`, String(value));
      }
    }
    
    // Simular dados para demonstração
    const result = {
      query: processedQuery,
      range,
      traces: generateSampleTraces(range.from, range.to, 5),
    };
    
    return result;
  }
  
  /**
   * Executa consulta de alertas
   */
  private static async executeAlertsQuery(
    query: string,
    range: { from: string; to: string },
    variables?: Record<string, any>
  ): Promise<any> {
    // Em uma implementação real, consultar o sistema de alertas
    // Exemplo simplificado para ilustração
    
    // Substituir variáveis
    let processedQuery = query;
    
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        processedQuery = processedQuery.replace(`$${key}`, String(value));
      }
    }
    
    // Buscar alertas no banco de dados
    const fromDate = new Date(range.from);
    const toDate = new Date(range.to);
    
    const alerts = await prisma.alert.findMany({
      where: {
        startedAt: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
    
    return {
      query: processedQuery,
      range,
      alerts,
    };
  }
  
  /**
   * Executa consulta SQL
   */
  private static async executeSqlQuery(
    query: string,
    variables?: Record<string, any>
  ): Promise<any> {
    // Em uma implementação real, executar consulta SQL com seguranças
    // Exemplo simplificado para ilustração
    
    // Substituir variáveis
    let processedQuery = query;
    
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        processedQuery = processedQuery.replace(`$${key}`, String(value));
      }
    }
    
    // Aqui deveria validar e sanitizar a consulta SQL
    if (!isReadOnlySqlQuery(processedQuery)) {
      throw new Error('Only SELECT queries are allowed in dashboards');
    }
    
    // Simular dados para demonstração
    const result = {
      query: processedQuery,
      columns: ['id', 'name', 'value', 'timestamp'],
      rows: [
        { id: 1, name: 'Sample A', value: 42, timestamp: new Date().toISOString() },
        { id: 2, name: 'Sample B', value: 57, timestamp: new Date().toISOString() },
        { id: 3, name: 'Sample C', value: 93, timestamp: new Date().toISOString() },
      ],
    };
    
    return result;
  }
}

/**
 * Verifica se uma consulta SQL é somente leitura
 */
function isReadOnlySqlQuery(query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  return normalizedQuery.startsWith('select') && !normalizedQuery.includes('insert') &&
         !normalizedQuery.includes('update') && !normalizedQuery.includes('delete') &&
         !normalizedQuery.includes('drop') && !normalizedQuery.includes('alter');
}

/**
 * Gera dados de série temporal de exemplo
 */
function generateTimeSeriesData(
  from: string,
  to: string,
  pointCount: number
): { timestamp: string; value: number }[] {
  const fromTime = new Date(from).getTime();
  const toTime = new Date(to).getTime();
  const interval = (toTime - fromTime) / pointCount;
  
  const points = [];
  let value = Math.random() * 100;
  
  for (let i = 0; i < pointCount; i++) {
    const timestamp = new Date(fromTime + i * interval).toISOString();
    
    // Simular alguma variação nos dados
    value = Math.max(0, value + (Math.random() - 0.5) * 10);
    
    points.push({
      timestamp,
      value: parseFloat(value.toFixed(2)),
    });
  }
  
  return points;
}

/**
 * Gera logs de exemplo
 */
function generateSampleLogs(
  from: string,
  to: string,
  count: number
): any[] {
  const fromTime = new Date(from).getTime();
  const toTime = new Date(to).getTime();
  const interval = (toTime - fromTime) / count;
  
  const logs = [];
  const severities = ['info', 'warn', 'error'];
  const services = ['api', 'worker', 'auth', 'db'];
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(fromTime + i * interval);
    
    logs.push({
      timestamp: timestamp.toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      service: services[Math.floor(Math.random() * services.length)],
      message: `Sample log message #${i + 1}`,
      attributes: {
        user_id: `user-${Math.floor(Math.random() * 1000)}`,
        request_id: `req-${Math.random().toString(36).substring(2, 10)}`,
      },
    });
  }
  
  return logs;
}

/**
 * Gera traces de exemplo
 */
function generateSampleTraces(
/**
 * Gera traces de exemplo
 */
function generateSampleTraces(
  from: string,
  to: string,
  count: number
): any[] {
  const fromTime = new Date(from).getTime();
  const toTime = new Date(to).getTime();
  const interval = (toTime - fromTime) / count;
  
  const traces = [];
  
  for (let i = 0; i < count; i++) {
    const startTime = new Date(fromTime + i * interval);
    const duration = Math.floor(Math.random() * 500) + 50; // 50-550ms
    
    traces.push({
      traceId: `trace-${Math.random().toString(36).substring(2, 10)}`,
      name: `Sample Trace ${i + 1}`,
      startTime: startTime.toISOString(),
      endTime: new Date(startTime.getTime() + duration).toISOString(),
      duration: duration,
      status: Math.random() > 0.8 ? 'error' : 'ok',
      spans: generateSampleSpans(startTime.getTime(), duration, 3 + Math.floor(Math.random() * 5)),
    });
  }
  
  return traces;
}

/**
 * Gera spans de exemplo para um trace
 */
function generateSampleSpans(
  rootStartTime: number,
  rootDuration: number,
  count: number
): any[] {
  const spans = [];
  const services = ['api', 'auth', 'db', 'cache', 'external-api'];
  let remainingTime = rootDuration;
  let currentTime = rootStartTime;
  
  for (let i = 0; i < count; i++) {
    const spanDuration = Math.floor((remainingTime / (count - i)) * (Math.random() * 0.5 + 0.5));
    remainingTime -= spanDuration;
    
    spans.push({
      spanId: `span-${Math.random().toString(36).substring(2, 10)}`,
      name: `Operation ${i + 1}`,
      service: services[Math.floor(Math.random() * services.length)],
      startTime: new Date(currentTime).toISOString(),
      endTime: new Date(currentTime + spanDuration).toISOString(),
      duration: spanDuration,
      status: Math.random() > 0.9 ? 'error' : 'ok',
    });
    
    currentTime += spanDuration;
  }
  
  return spans;
}
```

## Monitoramento de Experiência do Usuário

O monitoramento de experiência do usuário (RUM - Real User Monitoring) captura métricas de performance e interação diretamente dos clientes:

### Métricas Coletadas

1. **Performance Web**
   - Tempo de carregamento de página
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - First Input Delay (FID)
   - Time to Interactive (TTI)

2. **Ações do Usuário**
   - Cliques e interações
   - Navegação entre páginas
   - Conclusão de fluxos
   - Taxa de abandono

3. **Erros do Cliente**
   - Exceções JavaScript
   - Falhas de requisição
   - Erros de renderização
   - Bloqueios de interface

### SDK de Monitoramento para o Cliente

```typescript
// lib/monitoring/rum-sdk.ts
interface RumConfig {
  applicationId: string;
  sampleRate: number;
  apiEndpoint: string;
  environment: string;
}

interface PageLoadMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
}

interface ErrorEvent {
  message: string;
  stack?: string;
  type: string;
  timestamp: number;
  url: string;
}

interface UserAction {
  type: string;
  target: string;
  page: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface SessionData {
  id: string;
  userId?: string;
  userAgent: string;
  startTime: number;
  pages: string[];
  metadata?: Record<string, any>;
}

class BrainlinkRUM {
  private config: RumConfig;
  private sessionId: string;
  private pageLoadMetrics: PageLoadMetrics | null = null;
  private actions: UserAction[] = [];
  private errors: ErrorEvent[] = [];
  private sessionData: SessionData;
  private flushInterval: any;
  
  constructor(config: RumConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    
    // Dados da sessão
    this.sessionData = {
      id: this.sessionId,
      userAgent: navigator.userAgent,
      startTime: Date.now(),
      pages: [window.location.pathname],
    };
    
    // Configurar fluxo periódico para o servidor
    this.flushInterval = setInterval(() => this.flushData(), 30000);
    
    // Monitorar eventos de navegação
    this.setupNavigationObserver();
    
    // Monitorar erros
    this.setupErrorCapture();
    
    // Monitorar métricas de performance
    this.capturePerformanceMetrics();
    
    // Monitorar interações do usuário
    this.setupUserActionTracking();
    
    // Capturar informações do usuário se disponível
    this.identifyUser();
    
    // Enviar pacote inicial
    this.sendInitialPacket();
  }
  
  /**
   * Associa um ID de usuário à sessão
   */
  setUser(userId: string, metadata?: Record<string, any>): void {
    this.sessionData.userId = userId;
    
    if (metadata) {
      this.sessionData.metadata = {
        ...this.sessionData.metadata,
        ...metadata,
      };
    }
    
    // Enviar atualização
    this.sendSessionUpdate();
  }
  
  /**
   * Registra uma ação do usuário manualmente
   */
  trackAction(
    actionType: string,
    target: string,
    metadata?: Record<string, any>
  ): void {
    this.actions.push({
      type: actionType,
      target,
      page: window.location.pathname,
      timestamp: Date.now(),
      metadata,
    });
    
    // Enviar se houver muitas ações acumuladas
    if (this.actions.length >= 10) {
      this.flushData();
    }
  }
  
  /**
   * Registra manualmente um evento de erro
   */
  trackError(error: Error, metadata?: Record<string, any>): void {
    this.errors.push({
      message: error.message,
      stack: error.stack,
      type: error.name,
      timestamp: Date.now(),
      url: window.location.href,
      ...metadata,
    });
    
    // Enviar imediatamente
    this.flushData();
  }
  
  /**
   * Finaliza o monitoramento
   */
  shutdown(): void {
    clearInterval(this.flushInterval);
    this.flushData();
  }
  
  /**
   * Configura observação de navegação entre páginas
   */
  private setupNavigationObserver(): void {
    // Escutar mudanças de história (SPA)
    window.addEventListener('popstate', () => this.handlePageChange());
    
    // Interceptar navegação de SPA
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('pushstate'));
      return result;
    };
    
    window.addEventListener('pushstate', () => this.handlePageChange());
    
    // Capturar carregamento inicial
    window.addEventListener('load', () => {
      this.capturePerformanceMetrics();
    });
    
    // Capturar antes de descarregar a página
    window.addEventListener('beforeunload', () => {
      this.flushData();
    });
  }
  
  /**
   * Trata mudança de página
   */
  private handlePageChange(): void {
    const currentPage = window.location.pathname;
    
    // Adicionar à lista de páginas visitadas se for nova
    if (!this.sessionData.pages.includes(currentPage)) {
      this.sessionData.pages.push(currentPage);
    }
    
    // Enviar dados acumulados
    this.flushData();
    
    // Resetar métricas para a nova página
    this.capturePerformanceMetrics();
  }
  
  /**
   * Configura captura de erros
   */
  private setupErrorCapture(): void {
    // Capturar erros não tratados
    window.addEventListener('error', (event) => {
      this.errors.push({
        message: event.message,
        stack: event.error?.stack,
        type: event.error?.name || 'window.error',
        timestamp: Date.now(),
        url: window.location.href,
      });
      
      // Não capturar o evento para permitir outros handlers
    });
    
    // Capturar promessas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.errors.push({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        type: 'unhandledrejection',
        timestamp: Date.now(),
        url: window.location.href,
      });
    });
    
    // Capturar erros de rede
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      try {
        const response = await originalFetch.apply(this, args);
        
        if (!response.ok) {
          // Capturar erro de resposta HTTP
          const errorEvent = {
            message: `HTTP error ${response.status} ${response.statusText}`,
            type: 'fetch.error',
            timestamp: Date.now(),
            url: args[0].toString(),
            details: {
              status: response.status,
              statusText: response.statusText,
              url: args[0].toString(),
            },
          };
          
          window.dispatchEvent(new CustomEvent('brainlink:network-error', {
            detail: errorEvent,
          }));
        }
        
        return response;
      } catch (error) {
        // Capturar erro de rede
        const errorEvent = {
          message: error.message,
          stack: error.stack,
          type: 'fetch.network',
          timestamp: Date.now(),
          url: args[0].toString(),
        };
        
        window.dispatchEvent(new CustomEvent('brainlink:network-error', {
          detail: errorEvent,
        }));
        
        throw error;
      }
    };
    
    // Escutar eventos de erro de rede
    window.addEventListener('brainlink:network-error', (event: any) => {
      this.errors.push(event.detail);
    });
  }
  
  /**
   * Configura rastreamento de ações do usuário
   */
  private setupUserActionTracking(): void {
    // Rastrear cliques
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (!target) return;
      
      // Identificar o elemento de melhor forma possível
      const identifier = this.getElementIdentifier(target);
      
      this.actions.push({
        type: 'click',
        target: identifier,
        page: window.location.pathname,
        timestamp: Date.now(),
        metadata: {
          tag: target.tagName.toLowerCase(),
          text: target.textContent?.substring(0, 50),
        },
      });
    });
    
    // Rastrear envios de formulário
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      
      if (!form) return;
      
      this.actions.push({
        type: 'form_submit',
        target: this.getElementIdentifier(form),
        page: window.location.pathname,
        timestamp: Date.now(),
        metadata: {
          formId: form.id,
          formAction: form.action,
        },
      });
    });
  }
  
  /**
   * Captura métricas de performance
   */
  private capturePerformanceMetrics(): void {
    // Verificar se API de Performance está disponível
    if (!window.performance) {
      return;
    }
    
    // Métricas básicas de navegação
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.pageLoadMetrics = {
        navigationStart: navigation.startTime,
        domContentLoaded: navigation.domContentLoadedEventEnd,
        loadComplete: navigation.loadEventEnd,
        firstPaint: 0,
        firstContentfulPaint: 0,
      };
    } else {
      // Fallback para API antiga
      const timing = performance.timing;
      
      if (timing) {
        this.pageLoadMetrics = {
          navigationStart: 0,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          loadComplete: timing.loadEventEnd - timing.navigationStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };
      }
    }
    
    // Métricas de pintura
    const paintEntries = performance.getEntriesByType('paint');
    
    for (const entry of paintEntries) {
      if (entry.name === 'first-paint') {
        this.pageLoadMetrics!.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        this.pageLoadMetrics!.firstContentfulPaint = entry.startTime;
      }
    }
    
    // Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.pageLoadMetrics!.largestContentfulPaint = lastEntry.startTime;
        });
        
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.error('LCP observation error:', e);
      }
      
      // CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              this.pageLoadMetrics!.cumulativeLayoutShift = clsValue;
            }
          }
        });
        
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.error('CLS observation error:', e);
      }
      
            // FID
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.pageLoadMetrics!.firstInputDelay = (entry as any).processingStart - (entry as any).startTime;
          }
        });
        
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        console.error('FID observation error:', e);
      }
    }
  }
  
  /**
   * Tenta identificar o usuário atual
   */
  private identifyUser(): void {
    // Verificar se há informação de usuário disponível em algum lugar
    // Implementação específica para a aplicação
    try {
      // Exemplo: buscar de store global ou localStorage
      const userStore = (window as any).__USER_STORE__;
      
      if (userStore?.currentUser?.id) {
        this.setUser(userStore.currentUser.id, {
          role: userStore.currentUser.role,
          organization: userStore.currentUser.organizationId,
        });
      }
    } catch (error) {
      // Ignorar silenciosamente
    }
  }
  
  /**
   * Obtém um identificador para o elemento
   */
  private getElementIdentifier(element: HTMLElement): string {
    // Tentar usar id se disponível
    if (element.id) {
      return `#${element.id}`;
    }
    
    // Tentar usar classes se disponíveis
    if (element.className && typeof element.className === 'string') {
      return `.${element.className.split(' ').join('.')}`;
    }
    
    // Usar atributo de dados específico para monitoramento
    if (element.dataset.testid) {
      return `[data-testid="${element.dataset.testid}"]`;
    }
    
    // Usar seletor hierárquico limitado
    let selector = element.tagName.toLowerCase();
    let current = element;
    let depth = 0;
    
    while (current.parentElement && depth < 3) {
      const parent = current.parentElement;
      const siblings = Array.from(parent.children).filter(c => c.tagName === current.tagName);
      
      if (siblings.length > 1) {
        const index = siblings.indexOf(current as Element);
        selector = `${parent.tagName.toLowerCase()} > ${selector}:nth-child(${index + 1})`;
      } else {
        selector = `${parent.tagName.toLowerCase()} > ${selector}`;
      }
      
      current = parent;
      depth++;
    }
    
    return selector;
  }
  
  /**
   * Envia dados para o servidor
   */
  private async flushData(): Promise<void> {
    if (
      this.errors.length === 0 &&
      this.actions.length === 0 &&
      !this.pageLoadMetrics
    ) {
      return;
    }
    
    // Verificar taxada de amostragem
    if (Math.random() > this.config.sampleRate) {
      // Limpar dados e não enviar
      this.errors = [];
      this.actions = [];
      this.pageLoadMetrics = null;
      return;
    }
    
    // Preparar payload
    const payload = {
      sessionId: this.sessionId,
      applicationId: this.config.applicationId,
      environment: this.config.environment,
      timestamp: Date.now(),
      url: window.location.href,
      session: this.sessionData,
      metrics: this.pageLoadMetrics,
      actions: this.actions,
      errors: this.errors,
    };
    
    // Limpar dados
    this.pageLoadMetrics = null;
    this.actions = [];
    this.errors = [];
    
    try {
      // Enviar para o servidor
      await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        // Usar keepalive para garantir que os dados sejam enviados mesmo durante o descarregamento da página
        keepalive: true,
      });
    } catch (error) {
      console.error('Error sending RUM data:', error);
    }
  }
  
  /**
   * Envia atualização da sessão
   */
  private async sendSessionUpdate(): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/session`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          applicationId: this.config.applicationId,
          timestamp: Date.now(),
          session: this.sessionData,
        }),
      });
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }
  
  /**
   * Envia pacote inicial com informações da sessão
   */
  private async sendInitialPacket(): Promise<void> {
    try {
      await fetch(`${this.config.apiEndpoint}/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          applicationId: this.config.applicationId,
          environment: this.config.environment,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          devicePixelRatio: window.devicePixelRatio,
          language: navigator.language,
        }),
      });
    } catch (error) {
      console.error('Error sending initial RUM packet:', error);
    }
  }
  
  /**
   * Gera ID de sessão único
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

// Exportar como singleton global
export const initializeRUM = (config: RumConfig): BrainlinkRUM => {
  const instance = new BrainlinkRUM(config);
  (window as any).__BRAINLINK_RUM__ = instance;
  return instance;
};

export const getRUM = (): BrainlinkRUM | null => {
  return (window as any).__BRAINLINK_RUM__ || null;
};
```

## Monitoramento de IA e Modelos

O monitoramento específico para componentes de IA rastreia métricas de performance, utilização e qualidade:

### Métricas de Modelos de IA

| Categoria | Métrica | Descrição | Unidade | Tipo |
|-----------|---------|-----------|---------|------|
| **Utilização** | ai_model_requests | Total de requisições por modelo | Count | Counter |
| | ai_model_tokens | Tokens consumidos | Count | Counter |
| | ai_model_completion_time | Tempo de completar resposta | Milliseconds | Histogram |
| | ai_model_error_rate | Taxa de erros | Percentage | Gauge |
| **Qualidade** | ai_model_feedback_positive | Taxa de feedback positivo | Percentage | Gauge |
| | ai_model_feedback_negative | Taxa de feedback negativo | Percentage | Gauge |
| | ai_model_hallucination_rate | Taxa detectada de alucinações | Percentage | Gauge |
| **Custos** | ai_model_cost | Custo de utilização por modelo | Currency | Counter |
| | ai_model_cost_per_request | Custo médio por requisição | Currency | Gauge |

### Implementação de Monitoramento de IA

```typescript
// lib/monitoring/ai-monitoring.ts
import { metrics } from '@opentelemetry/api-metrics';
import { Logger } from './logger';
import { prisma } from '@/lib/db/prisma';

const AI_METRICS_PREFIX = 'brainlink_ai';

export class AIMonitoring {
  private static meter = metrics.getMeter('brainlink-ai');
  
  // Contadores de requisições
  private static modelRequestCounter = this.meter.createCounter(`${AI_METRICS_PREFIX}_model_requests_total`, {
    description: 'Total count of AI model requests',
  });
  
  // Contador de tokens
  private static tokenCounter = this.meter.createCounter(`${AI_METRICS_PREFIX}_tokens_total`, {
    description: 'Total count of tokens consumed',
  });
  
  // Histograma para latência
  private static completionTimeHistogram = this.meter.createHistogram(`${AI_METRICS_PREFIX}_completion_time_ms`, {
    description: 'AI model completion time in milliseconds',
    unit: 'ms',
    boundaries: [50, 100, 200, 500, 1000, 2000, 5000, 10000],
  });
  
  // Contador de erros
  private static errorCounter = this.meter.createCounter(`${AI_METRICS_PREFIX}_errors_total`, {
    description: 'Total count of AI model errors',
  });
  
  // Contador de custo
  private static costCounter = this.meter.createCounter(`${AI_METRICS_PREFIX}_cost_total`, {
    description: 'Total cost of AI model usage',
    unit: 'usd',
  });
  
  // Métricas para feedback
  private static feedbackGauge = this.meter.createUpDownCounter(`${AI_METRICS_PREFIX}_feedback_count`, {
    description: 'Count of feedback received for AI responses',
  });
  
  /**
   * Registra uma solicitação de AI
   */
  static recordModelRequest({
    modelId,
    provider,
    userId,
    organizationId,
    promptTokens,
    completionTokens,
    responseTime,
    success,
    errorType,
    cost,
  }: {
    modelId: string;
    provider: string;
    userId: string;
    organizationId?: string;
    promptTokens: number;
    completionTokens: number;
    responseTime: number;
    success: boolean;
    errorType?: string;
    cost: number;
  }): void {
    // Registrar métricas
    const labels = {
      model_id: modelId,
      provider,
      success: String(success),
    };
    
    // Incrementar contador de requisições
    this.modelRequestCounter.add(1, labels);
    
    // Registrar tokens
    this.tokenCounter.add(promptTokens, {
      ...labels,
      token_type: 'prompt',
    });
    
    this.tokenCounter.add(completionTokens, {
      ...labels,
      token_type: 'completion',
    });
    
    // Registrar tempo de resposta
    this.completionTimeHistogram.record(responseTime, labels);
    
    // Registrar erros se ocorreram
    if (!success && errorType) {
      this.errorCounter.add(1, {
        ...labels,
        error_type: errorType,
      });
    }
    
    // Registrar custo
    this.costCounter.add(cost, labels);
    
    // Registrar log estruturado
    Logger.info(`AI model request: ${modelId} (${provider})`, {
      ai: {
        model_id: modelId,
        provider,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: promptTokens + completionTokens,
        response_time_ms: responseTime,
        success,
        error_type: errorType,
        cost,
      },
      user: {
        id: userId,
      },
      organization: organizationId ? {
        id: organizationId,
      } : undefined,
    });
  }
  
  /**
   * Registra feedback de uma resposta de AI
   */
  static recordFeedback({
    responseId,
    modelId,
    userId,
    type,
    rating,
    comments,
  }: {
    responseId: string;
    modelId: string;
    userId: string;
    type: 'thumbs_up' | 'thumbs_down';
    rating?: number;
    comments?: string;
  }): void {
    // Registrar em métricas
    const positive = type === 'thumbs_up' ? 1 : 0;
    
    this.feedbackGauge.add(positive ? 1 : 0, {
      model_id: modelId,
      feedback_type: 'positive',
    });
    
    this.feedbackGauge.add(positive ? 0 : 1, {
      model_id: modelId,
      feedback_type: 'negative',
    });
    
    // Registrar log
    Logger.info(`AI feedback received: ${type} for model ${modelId}`, {
      ai: {
        model_id: modelId,
        response_id: responseId,
        feedback_type: type,
        rating,
      },
      user: {
        id: userId,
      },
    });
  }
  
  /**
   * Atualiza métricas de qualidade agregadas
   */
  static async updateQualityMetrics(): Promise<void> {
    try {
      // Em um sistema real, isso seria feito em um job periódico
      // Aqui mostramos o conceito
      
      // Calcular métricas de feedback agregadas por modelo
      const modelFeedback = await prisma.$queryRaw`
        SELECT 
          model_id,
          COUNT(*) as total_feedback,
          SUM(CASE WHEN type = 'thumbs_up' THEN 1 ELSE 0 END) as positive_count,
          SUM(CASE WHEN type = 'thumbs_down' THEN 1 ELSE 0 END) as negative_count,
          (SUM(CASE WHEN type = 'thumbs_up' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as positive_rate
        FROM ai_feedback
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY model_id
      `;
      
      // Publicar métricas agregadas (em um ambiente real, isso iria para sistema de métricas)
      for (const record of modelFeedback as any[]) {
        Logger.info(`AI model quality metrics updated for ${record.model_id}`, {
          ai: {
            model_id: record.model_id,
            total_feedback: record.total_feedback,
            positive_count: record.positive_count,
            negative_count: record.negative_count,
            positive_rate: record.positive_rate,
          },
        });
      }
    } catch (error) {
      Logger.error('Error updating AI quality metrics', {
        error: error.message,
      });
    }
  }
  
  /**
   * Detecta alucinações potenciais em respostas
   */
  static detectHallucinations(
    prompt: string,
    response: string,
    facts: any[]
  ): {
    detected: boolean;
    confidence: number;
    details?: string;
  } {
    // Em um ambiente real, isso usaria outro modelo de IA ou técnicas específicas
    // para verificar a resposta contra fatos conhecidos
    // Esta é uma implementação simplificada para demonstração
    
    // Exemplo: verificar se a resposta contém afirmações não suportadas pelos fatos
    const hallucinated = Math.random() < 0.1; // 10% de chance para demonstração
    
    return {
      detected: hallucinated,
            confidence: hallucinated ? 0.75 + Math.random() * 0.2 : 0.1 + Math.random() * 0.1,
      details: hallucinated ? 'Resposta contém informações não verificáveis com os fatos fornecidos' : undefined,
    };
  }
}
```

## Implementação de Referência

A seguir, apresentamos uma implementação de referência para integrar todos os aspectos do monitoramento no Brainlink:

### Inicialização do Sistema de Monitoramento

```typescript
// lib/monitoring/index.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { TracingService } from './tracer';
import { MetricsService } from './metrics';
import { Logger } from './logger';
import { setupExporters } from './exporters';

const SERVICE_NAME = process.env.SERVICE_NAME || 'brainlink-app';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

export const initializeMonitoring = () => {
  try {
    console.log('Initializing monitoring system...');
    
    // Criar recurso compartilhado
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
      [SemanticResourceAttributes.SERVICE_VERSION]: SERVICE_VERSION,
      'environment': NODE_ENV,
    });
    
    // Configurar exportadores
    const traceExporter = new OTLPTraceExporter({
      url: process.env.OTLP_ENDPOINT || 'http://collector:4318/v1/traces',
      headers: {
        'x-service-name': SERVICE_NAME,
      },
    });
    
    const metricExporter = new OTLPMetricExporter({
      url: process.env.OTLP_ENDPOINT || 'http://collector:4318/v1/metrics',
      headers: {
        'x-service-name': SERVICE_NAME,
      },
    });
    
    const prometheusExporter = new PrometheusExporter({
      port: parseInt(process.env.PROMETHEUS_PORT || '9464', 10),
      startServer: true,
    });
    
    // Inicializar rastreamento
    TracingService.init(traceExporter);
    
    // Inicializar métricas
    MetricsService.init(prometheusExporter);
    
    // Configurar gerenciamento de ciclo de vida
    setupExporters();
    
    Logger.info('Monitoring system initialized successfully', {
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
      environment: NODE_ENV,
    });
  } catch (error) {
    console.error('Failed to initialize monitoring:', error);
    
    // Não interromper a inicialização do aplicativo, apenas log do erro
    Logger.error('Failed to initialize monitoring', {
      error: error.message,
      stack: error.stack,
    });
  }
};

// Exportar componentes
export * from './tracer';
export * from './metrics';
export * from './logger';
export * from './instrumentation';
export * from './alerts';
export * from './dashboards';
export * from './ai-monitoring';
export * from './rum-sdk';
```

### Exemplo de API para Métricas

```typescript
// pages/api/monitoring/metrics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/middleware/rateLimit';
import { withErrorHandler } from '@/lib/middleware/errorHandler';
import { MetricsService } from '@/lib/monitoring';
import { prisma } from '@/lib/db/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Verificar método
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Verificar autenticação
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verificar papel de admin
  const isAdmin = await prisma.userRole.findFirst({
    where: {
      userId: session.user.id,
      role: 'admin',
    },
  });
  
  if (!isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  try {
    // Extrair parâmetros
    const { 
      metric, 
      from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      to = new Date().toISOString(),
      resolution = '5m',
      filters = '{}',
    } = req.query;
    
    if (!metric || typeof metric !== 'string') {
      return res.status(400).json({ error: 'Metric name is required' });
    }
    
    // Validar filtros
    let parsedFilters;
    try {
      parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
    } catch (error) {
      return res.status(400).json({ error: 'Invalid filters format' });
    }
    
    // Buscar dados de métricas (em um sistema real, isto consultaria o backend de métricas)
    // Aqui usamos dados simulados para demonstração
    const data = {
      metric,
      from,
      to,
      resolution,
      filters: parsedFilters,
      datapoints: generateMetricData(metric as string, from, to, resolution as string),
    };
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return res.status(500).json({
      error: 'Failed to fetch metrics',
    });
  }
};

/**
 * Gera dados de métricas de exemplo
 */
function generateMetricData(
  metric: string,
  from: string,
  to: string,
  resolution: string
): Array<{ timestamp: string; value: number }> {
  const fromTime = new Date(from).getTime();
  const toTime = new Date(to).getTime();
  
  // Determinar intervalo baseado na resolução
  let interval: number;
  switch (resolution) {
    case '1m':
      interval = 60 * 1000;
      break;
    case '5m':
      interval = 5 * 60 * 1000;
      break;
    case '1h':
      interval = 60 * 60 * 1000;
      break;
    case '1d':
      interval = 24 * 60 * 60 * 1000;
      break;
    default:
      interval = 5 * 60 * 1000; // 5 minutos por padrão
  }
  
  const datapoints = [];
  const points = Math.ceil((toTime - fromTime) / interval);
  
  // Gerar valores de acordo com o tipo de métrica
  let base = 0;
  let trend = 0;
  
  switch (metric) {
    case 'cpu_utilization':
      base = 25;
      trend = 10;
      break;
    case 'memory_utilization':
      base = 40;
      trend = 5;
      break;
    case 'http_request_rate':
      base = 100;
      trend = 30;
      break;
    case 'api_latency':
      base = 150;
      trend = 50;
      break;
    default:
      base = 50;
      trend = 20;
  }
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(fromTime + i * interval).toISOString();
    
    // Gerar valor com tendência e ruído
    const trendComponent = (i / points) * trend;
    const noiseComponent = (Math.random() - 0.5) * (trend / 2);
    const value = Math.max(0, base + trendComponent + noiseComponent);
    
    datapoints.push({
      timestamp,
      value: parseFloat(value.toFixed(2)),
    });
  }
  
  return datapoints;
}

// Aplicar middlewares
export default withErrorHandler(
  withRateLimit({
    type: 'admin',
    points: 100,
    duration: 60,
  })(handler)
);
```

### Exemplo de API para Rastreamento

```typescript
// pages/api/monitoring/traces/[traceId].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { withRateLimit } from '@/lib/middleware/rateLimit';
import { withErrorHandler } from '@/lib/middleware/errorHandler';
import { Logger } from '@/lib/monitoring';
import { prisma } from '@/lib/db/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Verificar método
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Verificar autenticação
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verificar papel de admin ou acesso a monitoramento
  const hasAccess = await prisma.userRole.findFirst({
    where: {
      userId: session.user.id,
      role: {
        in: ['admin', 'monitoring'],
      },
    },
  });
  
  if (!hasAccess) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  try {
    // Extrair trace ID
    const { traceId } = req.query;
    
    if (!traceId || typeof traceId !== 'string') {
      return res.status(400).json({ error: 'Trace ID is required' });
    }
    
    // Em um sistema real, isto consultaria o backend de rastreamento
    // Aqui usamos dados simulados para demonstração
    const trace = generateTraceData(traceId);
    
    if (!trace) {
      return res.status(404).json({ error: 'Trace not found' });
    }
    
    return res.status(200).json(trace);
  } catch (error) {
    Logger.error('Error fetching trace data', {
      error: error.message,
      trace_id: req.query.traceId,
    });
    
    return res.status(500).json({
      error: 'Failed to fetch trace data',
    });
  }
};

/**
 * Gera dados de trace de exemplo
 */
function generateTraceData(traceId: string): any {
  // Simulação para demonstração
  const startTime = new Date(Date.now() - Math.random() * 3600000);
  const duration = Math.floor(Math.random() * 2000) + 100;
  
  const status = Math.random() > 0.8 ? 'error' : 'ok';
  
  return {
    traceId,
    name: 'HTTP POST /api/projects',
    status,
    startTime: startTime.toISOString(),
    endTime: new Date(startTime.getTime() + duration).toISOString(),
    duration,
    serviceCount: 4,
    spanCount: 12,
    errorCount: status === 'error' ? 1 : 0,
    spans: generateSpans(traceId, startTime.getTime(), duration, status === 'error'),
  };
}

/**
 * Gera spans de exemplo para um trace
 */
function generateSpans(
  traceId: string,
  rootStartTime: number,
  rootDuration: number,
  hasError: boolean
): any[] {
  const spans = [];
  const services = ['api', 'auth', 'db', 'cache', 'storage'];
  
  // Root span
  spans.push({
    spanId: `span-${Math.random().toString(36).substring(2, 10)}`,
    traceId,
    parentSpanId: null,
    name: 'HTTP POST /api/projects',
    service: 'api',
    kind: 'server',
    startTime: new Date(rootStartTime).toISOString(),
    endTime: new Date(rootStartTime + rootDuration).toISOString(),
    duration: rootDuration,
    status: hasError ? 'error' : 'ok',
    attributes: {
      'http.method': 'POST',
      'http.route': '/api/projects',
      'http.status_code': hasError ? 500 : 201,
    },
  });
  
  // Child spans - aproximadamente 70% do tempo total
  let remainingTime = rootDuration * 0.7;
  let currentTime = rootStartTime + rootDuration * 0.1; // Deixar 10% no início
  const childSpanCount = 3 + Math.floor(Math.random() * 8); // 3-10 spans
  
  for (let i = 0; i < childSpanCount; i++) {
    // Última span tem erro se hasError for true
    const spanHasError = hasError && i === childSpanCount - 1;
    
    const spanDuration = Math.floor((remainingTime / (childSpanCount - i)) * (Math.random() * 0.5 + 0.5));
    remainingTime -= spanDuration;
    
    const service = services[Math.floor(Math.random() * services.length)];
    const spanName = getSpanNameForService(service);
    
    spans.push({
      spanId: `span-${Math.random().toString(36).substring(2, 10)}`,
      traceId,
      parentSpanId: spans[0].spanId,
      name: spanName,
      service,
      kind: service === 'db' ? 'client' : 'internal',
      startTime: new Date(currentTime).toISOString(),
      endTime: new Date(currentTime + spanDuration).toISOString(),
      duration: spanDuration,
      status: spanHasError ? 'error' : 'ok',
      attributes: getAttributesForService(service, spanHasError),
      events: spanHasError ? [
        {
          name: 'exception',
          timestamp: new Date(currentTime + spanDuration - 5).toISOString(),
          attributes: {
            'exception.type': 'DatabaseError',
            'exception.message': 'Connection timeout',
          },
        },
      ] : [],
    });
    
    currentTime += spanDuration;
  }
  
  return spans;
}

/**
 * Obtém nome de span apropriado para o serviço
 */
function getSpanNameForService(service: string): string {
  switch (service) {
    case 'api':
      return function getSpanNameForService(service: string): string {
  switch (service) {
    case 'api':
      return 'Process project creation';
    case 'auth':
      return 'Validate user permissions';
    case 'db':
      return 'Database query';
    case 'cache':
      return 'Cache lookup';
    case 'storage':
      return 'Store project files';
    default:
      return `${service} operation`;
  }
}

/**
 * Obtém atributos apropriados para o tipo de serviço
 */
function getAttributesForService(service: string, hasError: boolean): Record<string, any> {
  switch (service) {
    case 'api':
      return {
        'operation.name': 'createProject',
        'user.id': `user-${Math.floor(Math.random() * 1000)}`,
      };
    case 'auth':
      return {
        'permission.type': 'project.create',
        'auth.method': 'jwt',
      };
    case 'db':
      return {
        'db.system': 'postgresql',
        'db.operation': 'INSERT',
        'db.table': 'projects',
        'db.statement': 'INSERT INTO projects (name, owner_id, ...) VALUES (...)',
        'error.type': hasError ? 'connection_timeout' : undefined,
      };
    case 'cache':
      return {
        'cache.operation': Math.random() > 0.5 ? 'set' : 'get',
        'cache.key': 'project:settings:default',
      };
    case 'storage':
      return {
        'storage.operation': 'upload',
        'storage.bucket': 'project-files',
        'storage.object': `template-${Math.floor(Math.random() * 100)}.json`,
      };
    default:
      return {};
  }
}

// Aplicar middlewares
export default withErrorHandler(
  withRateLimit({
    type: 'user',
    points: 50,
    duration: 60,
  })(handler)
);
```

### Exemplo de API para RUM (Real User Monitoring)

```typescript
// pages/api/monitoring/rum.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { withRateLimit } from '@/lib/middleware/rateLimit';
import { withErrorHandler } from '@/lib/middleware/errorHandler';
import { Logger } from '@/lib/monitoring';
import { prisma } from '@/lib/db/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Verificar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Validar API key
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || typeof apiKey !== 'string') {
      return res.status(401).json({ error: 'API key required' });
    }
    
    const validApiKey = await prisma.apiKey.findFirst({
      where: {
        key: apiKey,
        type: 'rum',
        active: true,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    
    if (!validApiKey) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
    
    // Extrair dados do corpo
    const {
      sessionId,
      applicationId,
      timestamp,
      url,
      session,
      metrics,
      actions,
      errors,
    } = req.body;
    
    // Validar dados mínimos necessários
    if (!sessionId || !applicationId || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Em um sistema real, processar e armazenar os dados RUM
    // Aqui vamos apenas mostrar como seria
    
    // 1. Armazenar métricas de performance se fornecidas
    if (metrics) {
      Logger.info('Received RUM performance metrics', {
        session_id: sessionId,
        application_id: applicationId,
        url,
        metrics,
      });
      
      await storePerformanceMetrics(sessionId, applicationId, url, metrics);
    }
    
    // 2. Processar ações de usuário se fornecidas
    if (actions && actions.length > 0) {
      Logger.info(`Received ${actions.length} user actions`, {
        session_id: sessionId,
        application_id: applicationId,
      });
      
      await storeUserActions(sessionId, applicationId, actions);
    }
    
    // 3. Processar erros do cliente se fornecidos
    if (errors && errors.length > 0) {
      Logger.warn(`Received ${errors.length} client errors`, {
        session_id: sessionId,
        application_id: applicationId,
      });
      
      await storeClientErrors(sessionId, applicationId, errors);
    }
    
    // 4. Atualizar informações da sessão se fornecidas
    if (session) {
      await updateSessionInfo(sessionId, applicationId, session);
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    Logger.error('Error processing RUM data', {
      error: error.message,
    });
    
    return res.status(500).json({
      error: 'Failed to process RUM data',
    });
  }
};

/**
 * Armazena métricas de performance
 */
async function storePerformanceMetrics(
  sessionId: string,
  applicationId: string,
  url: string,
  metrics: any
): Promise<void> {
  // Em um sistema real, armazenar em uma série temporal
  await prisma.rumMetric.create({
    data: {
      sessionId,
      applicationId,
      url,
      type: 'performance',
      timestamp: new Date(),
      data: metrics,
    },
  });
}

/**
 * Armazena ações de usuário
 */
async function storeUserActions(
  sessionId: string,
  applicationId: string,
  actions: any[]
): Promise<void> {
  // Em um sistema real, possível armazenar em batch
  for (const action of actions) {
    await prisma.rumAction.create({
      data: {
        sessionId,
        applicationId,
        type: action.type,
        target: action.target,
        page: action.page,
        timestamp: new Date(action.timestamp),
        data: action.metadata || {},
      },
    });
  }
}

/**
 * Armazena erros do cliente
 */
async function storeClientErrors(
  sessionId: string,
  applicationId: string,
  errors: any[]
): Promise<void> {
  for (const error of errors) {
    await prisma.rumError.create({
      data: {
        sessionId,
        applicationId,
        message: error.message,
        stack: error.stack,
        type: error.type,
        url: error.url,
        timestamp: new Date(error.timestamp),
        data: {},
      },
    });
  }
}

/**
 * Atualiza informações da sessão
 */
async function updateSessionInfo(
  sessionId: string,
  applicationId: string,
  session: any
): Promise<void> {
  // Verificar se sessão já existe
  const existingSession = await prisma.rumSession.findUnique({
    where: {
      id: sessionId,
    },
  });
  
  if (existingSession) {
    // Atualizar sessão existente
    await prisma.rumSession.update({
      where: {
        id: sessionId,
      },
      data: {
        lastActive: new Date(),
        pages: session.pages,
        duration: Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000),
        metadata: session.metadata,
      },
    });
  } else {
    // Criar nova sessão
    await prisma.rumSession.create({
      data: {
        id: sessionId,
        applicationId,
        userId: session.userId,
        userAgent: session.userAgent,
        startTime: new Date(session.startTime),
        lastActive: new Date(),
        pages: session.pages,
        duration: 0,
        metadata: session.metadata || {},
      },
    });
  }
}

// Aplicar middlewares com limite de taxa mais alto para RUM
export default withErrorHandler(
  withRateLimit({
    type: 'ip',
    points: 500,
    duration: 60,
  })(handler)
);
```

### Configuração do sistema com Kubernetes

```yaml
# kubernetes/monitoring/prometheus.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: prometheus
  namespace: monitoring
  labels:
    app: prometheus
spec:
  serviceName: prometheus
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
        - name: prometheus
          image: prom/prometheus:v2.42.0
          args:
            - "--config.file=/etc/prometheus/prometheus.yml"
            - "--storage.tsdb.path=/prometheus"
            - "--storage.tsdb.retention.time=15d"
            - "--web.console.libraries=/usr/share/prometheus/console_libraries"
            - "--web.console.templates=/usr/share/prometheus/consoles"
          ports:
            - containerPort: 9090
          volumeMounts:
            - name: prometheus-config
              mountPath: /etc/prometheus
            - name: prometheus-data
              mountPath: /prometheus
      volumes:
        - name: prometheus-config
          configMap:
            name: prometheus-config
  volumeClaimTemplates:
    - metadata:
        name: prometheus-data
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 50Gi

---
# kubernetes/monitoring/otel-collector.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: otel-collector
  namespace: monitoring
  labels:
    app: otel-collector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: otel-collector
  template:
    metadata:
      labels:
        app: otel-collector
    spec:
      containers:
        - name: otel-collector
          image: otel/opentelemetry-collector-contrib:0.71.0
          args:
            - "--config=/etc/otel/config.yaml"
          ports:
            - containerPort: 4317 # OTLP gRPC
            - containerPort: 4318 # OTLP HTTP
            - containerPort: 8888 # Metrics
          volumeMounts:
            - name: otel-config
              mountPath: /etc/otel
      volumes:
        - name: otel-config
          configMap:
            name: otel-collector-config

---
# kubernetes/monitoring/loki.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: loki
  namespace: monitoring
  labels:
    app: loki
spec:
  serviceName: loki
  replicas: 1
  selector:
    matchLabels:
      app: loki
  template:
    metadata:
      labels:
        app: loki
    spec:
      containers:
        - name: loki
          image: grafana/loki:2.8.0
          args:
            - "-config.file=/etc/loki/config.yaml"
          ports:
            - containerPort: 3100
          volumeMounts:
            - name: loki-config
              mountPath: /etc/loki
            - name: loki-data
              mountPath: /data
      volumes:
        - name: loki-config
          configMap:
            name: loki-config
  volumeClaimTemplates:
    - metadata:
        name: loki-data
      spec:
        accessModes: [ "ReadWriteOnce" ]
        resources:
          requests:
            storage: 50Gi

---
# kubernetes/monitoring/grafana.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
  labels:
    app: grafana
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
        - name: grafana
          image: grafana/grafana:9.5.0
          ports:
            - containerPort: 3000
          volumeMounts:
            - name: grafana-storage
              mountPath: /var/lib/grafana
            - name: grafana-provisioning
              mountPath: /etc/grafana/provisioning
      volumes:
        - name: grafana-storage
          persistentVolumeClaim:
            claimName: grafana-pvc
        - name: grafana-provisioning
          configMap:
            name: grafana-provisioning
```

Essa implementação de referência estabelece um sistema de monitoramento robusto e escalável para o Brainlink, abrangendo desde a infraestrutura até a experiência do usuário e os componentes de IA, garantindo visibilidade completa e capacidade de resposta rápida a problemas.