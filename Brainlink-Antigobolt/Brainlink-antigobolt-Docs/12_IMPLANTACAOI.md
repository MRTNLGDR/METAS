

# Implantação

## Visão Geral

Este documento descreve o processo de implantação do Brainlink, cobrindo desde o ambiente de desenvolvimento até a produção. O sistema utiliza uma abordagem de CI/CD (Integração Contínua/Entrega Contínua) para garantir implantações eficientes, confiáveis e automatizadas.

A arquitetura de implantação do Brainlink foi projetada para ser:

1. **Escalável**: Capaz de crescer conforme a demanda
2. **Resiliente**: Tolerante a falhas e com recuperação automática
3. **Reproduzível**: Ambientes consistentes com configuração como código
4. **Segura**: Seguindo princípios de segurança em todos os níveis
5. **Observável**: Com monitoramento e visibilidade em todos os componentes

## Ambientes

O Brainlink opera com os seguintes ambientes:

| Ambiente | Propósito | Atualizações | Acesso | Dados |
|----------|-----------|--------------|--------|-------|
| Desenvolvimento | Desenvolvimento de novas funcionalidades | Contínuas | Desenvolvedores | Amostragem/Sintéticos |
| Testes | Testes automatizados e manuais | Após aprovação em desenvolvimento | Equipe de QA e Desenvolvedores | Sintéticos + Anonimizados |
| Pré-Produção/Staging | Validação final antes de produção | Após aprovação em testes | Stakeholders internos | Cópia anonimizada de produção |
| Produção | Ambiente para usuários finais | Programadas após aprovação | Usuários finais | Dados reais |
| DR (Disaster Recovery) | Recuperação em caso de desastre | Sincronizado com produção | Automático em caso de falha | Réplica de produção |

### Diagrama de Ambientes

```mermaid
flowchart LR
    DEV[Desenvolvimento] --> |Após testes de unidade| TEST[Testes]
    TEST --> |Após testes integrados| STAGING[Pré-Produção]
    STAGING --> |Após validação final| PROD[Produção]
    PROD <--> |Replicação contínua| DR[Disaster Recovery]
    
    subgraph "Ambientes Não-Produtivos"
        DEV
        TEST
        STAGING
    end
    
    subgraph "Ambientes Produtivos"
        PROD
        DR
    end
```

## Infraestrutura como Código (IaC)

A infraestrutura do Brainlink é gerenciada como código utilizando Terraform e Kubernetes (K8s), permitindo a criação e gerenciamento de ambientes de forma consistente e reproduzível.

### Terraform para Recursos de Nuvem

Definição de infraestrutura base na Google Cloud Platform (GCP):

```hcl
# terraform/main.tf

terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 4.0"
    }
  }
  backend "gcs" {
    bucket = "brainlink-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# VPC e Redes
module "vpc" {
  source  = "./modules/vpc"
  project = var.project_id
  region  = var.region
  
  vpc_name    = "${var.environment}-vpc"
  subnet_name = "${var.environment}-subnet"
  subnet_cidr = var.subnet_cidr
}

# GKE Cluster
module "gke" {
  source = "./modules/gke"
  
  project     = var.project_id
  region      = var.region
  environment = var.environment
  
  cluster_name    = "${var.environment}-gke-cluster"
  network         = module.vpc.vpc_name
  subnetwork      = module.vpc.subnet_name
  ip_range_pods   = "pod-range"
  ip_range_services = "service-range"
  
  node_pools = [
    {
      name         = "default-node-pool"
      machine_type = "e2-standard-4"
      min_count    = 2
      max_count    = 10
      auto_scaling = true
      disk_size_gb = 100
      disk_type    = "pd-standard"
      preemptible  = false
    },
    {
      name         = "high-memory-pool"
      machine_type = "e2-highmem-8"
      min_count    = 1
      max_count    = 5
      auto_scaling = true
      disk_size_gb = 200
      disk_type    = "pd-ssd"
      preemptible  = false
    }
  ]
  
  node_pools_labels = {
    all = {
      environment = var.environment
      application = "brainlink"
    }
    default-node-pool = {
      default-node-pool = true
      workload-type     = "general"
    }
    high-memory-pool = {
      workload-type = "memory-intensive"
    }
  }
  
  node_pools_taints = {
    high-memory-pool = [
      {
        key    = "workload-type"
        value  = "memory-intensive"
        effect = "NO_SCHEDULE"
      }
    ]
  }
}

# Cloud SQL
module "cloudsql" {
  source  = "./modules/cloudsql"
  
  project     = var.project_id
  region      = var.region
  environment = var.environment
  
  name             = "${var.environment}-brainlink-db"
  database_version = "POSTGRES_14"
  tier             = var.environment == "prod" ? "db-custom-8-32768" : "db-custom-2-7680"
  
  vpc_network      = module.vpc.vpc_id
  
  deletion_protection = var.environment == "prod" ? true : false
  
  backup_configuration = {
    enabled            = true
    start_time         = "02:00"
    location           = "us"
    point_in_time_recovery_enabled = true
    transaction_log_retention_days = 7
    retained_backups   = 7
    retention_unit     = "COUNT"
  }
  
  databases = [
    {
      name      = "brainlink"
      charset   = "UTF8"
      collation = "en_US.UTF8"
    }
  ]
  
  users = [
    {
      name     = "brainlink-app"
      password = var.db_password
      host     = "%"
    }
  ]
}

# Redis para Cache e Filas
module "redis" {
  source = "./modules/redis"
  
  project     = var.project_id
  region      = var.region
  environment = var.environment
  
  name          = "${var.environment}-brainlink-redis"
  tier          = var.environment == "prod" ? "STANDARD_HA" : "BASIC"
  memory_size_gb = var.environment == "prod" ? 4 : 1
  
  vpc_network   = module.vpc.vpc_id
  connect_mode  = "PRIVATE_SERVICE_ACCESS"
  
  auth_enabled  = true
  transit_encryption_mode = "SERVER_AUTHENTICATION"
}

# Bucket para Armazenamento
module "storage" {
  source = "./modules/storage"
  
  project     = var.project_id
  region      = var.region
  environment = var.environment
  
  name        = "${var.project_id}-${var.environment}-storage"
  location    = "US"
  
  lifecycle_rules = [
    {
      action = {
        type = "SetStorageClass"
        storage_class = "NEARLINE"
      }
      condition = {
        age = 90
        with_state = "LIVE"
      }
    }
  ]
  
  versioning = {
    enabled = true
  }
}

# Secrets Manager
module "secret_manager" {
  source = "./modules/secret_manager"
  
  project     = var.project_id
  
  secrets = [
    {
      name = "${var.environment}_db_password"
      secret_data = var.db_password
    },
    {
      name = "${var.environment}_jwt_secret"
      secret_data = var.jwt_secret
    },
    {
      name = "${var.environment}_api_keys"
      secret_data = var.api_keys
    }
  ]
}
```

### Kubernetes para Orquestração de Contêineres

Definição dos recursos do Kubernetes:

```yaml
# k8s/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: brainlink-api
  labels:
    app: brainlink
    component: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: brainlink
      component: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: brainlink
        component: api
    spec:
      containers:
      - name: api
        image: gcr.io/brainlink/api:latest
        imagePullPolicy: Always
        resources:
          requests:
            cpu: 200m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        ports:
        - containerPort: 8080
          name: http
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          timeoutSeconds: 5
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          timeoutSeconds: 5
          periodSeconds: 10
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: brainlink-db-credentials
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: brainlink-redis-credentials
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: brainlink-jwt
              key: secret
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
        - name: tmp-volume
          mountPath: /tmp
      volumes:
      - name: config-volume
        configMap:
          name: brainlink-config
      - name: tmp-volume
        emptyDir: {}
      securityContext:
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
      nodeSelector:
        workload-type: general
---
apiVersion: v1
kind: Service
metadata:
  name: brainlink-api
  labels:
    app: brainlink
    component: api
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: brainlink
    component: api
---
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: brainlink-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: brainlink-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Kustomize para Ambientes Específicos

```yaml
# k8s/overlays/production/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: brainlink-prod

bases:
- ../../base

resources:
- namespace.yaml
- ingress.yaml
- network-policy.yaml

patches:
- path: patches/deployment.yaml

configMapGenerator:
- name: brainlink-config
  files:
  - config.json

secretGenerator:
- name: brainlink-db-credentials
  envs:
  - .env.db
- name: brainlink-redis-credentials
  envs:
  - .env.redis
- name: brainlink-jwt
  envs:
  - .env.jwt

images:
- name: gcr.io/brainlink/api
  newTag: ${API_VERSION}
```

## Pipeline de CI/CD

O Brainlink utiliza GitHub Actions para integração contínua e entrega contínua, automatizando testes, builds e implantações.

### Pipeline de CI

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches: 
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop
      - 'feature/**'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
        
  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: brainlink_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:6
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/brainlink_test
          REDIS_URL: redis://localhost:6379
      - name: Upload test coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run npm audit
        run: npm audit --audit-level=high
           - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      - name: Run SAST scan
        run: npm run security:sast
        
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.pull_request.base.ref == 'main')
    steps:
      - uses: actions/checkout@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      - name: Cache Docker layers
        uses: actions/cache@v3
        with:
          path: /tmp/.buildx-cache
          key: ${{ runner.os }}-buildx-${{ github.sha }}
          restore-keys: |
            ${{ runner.os }}-buildx-
      - name: Login to Google Container Registry
        uses: docker/login-action@v2
        with:
          registry: gcr.io
          username: _json_key
          password: ${{ secrets.GCR_JSON_KEY }}
      - name: Build and push
        uses: docker/build-push-action@v3
        with:
          context: .
          push: true
          tags: |
            gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ github.sha }}
            ${{ github.ref == 'refs/heads/main' && format('gcr.io/{0}/api:latest', secrets.GCP_PROJECT_ID) || '' }}
          cache-from: type=local,src=/tmp/.buildx-cache
          cache-to: type=local,dest=/tmp/.buildx-cache-new
      - name: Move cache
        run: |
          rm -rf /tmp/.buildx-cache
          mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

### Pipeline de CD

```yaml
# .github/workflows/cd.yml
name: Continuous Deployment

on:
  workflow_run:
    workflows: ["Continuous Integration"]
    branches: [main, develop]
    types: [completed]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Image tag/version to deploy'
        required: false
        type: string

jobs:
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    if: (github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.head_branch == 'develop') || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'staging')
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.25.0' # ou a versão desejada
      - name: Setup gcloud CLI
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GKE_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      - name: Get GKE credentials
        run: |
          gcloud container clusters get-credentials ${{ secrets.GKE_CLUSTER_NAME }} --region ${{ secrets.GKE_CLUSTER_REGION }}
      - name: Set up Kustomize
        run: |
          curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
          chmod +x kustomize
          mv kustomize /usr/local/bin/
      - name: Determine version
        id: version
        run: |
          if [[ "${{ github.event_name }}" == "workflow_dispatch" && -n "${{ github.event.inputs.version }}" ]]; then
            echo "VERSION=${{ github.event.inputs.version }}" >> $GITHUB_ENV
          else
            echo "VERSION=${{ github.sha }}" >> $GITHUB_ENV
          fi
      - name: Deploy to GKE
        run: |
          cd k8s/overlays/staging
          kustomize edit set image gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ env.VERSION }}
          kustomize build | kubectl apply -f -
          kubectl rollout status deployment/brainlink-api -n brainlink-staging
      - name: Run smoke tests
        run: |
          sleep 30  # Dar tempo para os pods estarem prontos
          ./scripts/smoke-tests.sh https://staging-api.brainlink.com
          
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: (github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.head_branch == 'main') || (github.event_name == 'workflow_dispatch' && github.event.inputs.environment == 'production')
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Set up kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'v1.25.0'
      - name: Setup gcloud CLI
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GKE_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      - name: Get GKE credentials
        run: |
          gcloud container clusters get-credentials ${{ secrets.GKE_CLUSTER_NAME }} --region ${{ secrets.GKE_CLUSTER_REGION }}
      - name: Set up Kustomize
        run: |
          curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
          chmod +x kustomize
          mv kustomize /usr/local/bin/
      - name: Determine version
        id: version
        run: |
          if [[ "${{ github.event_name }}" == "workflow_dispatch" && -n "${{ github.event.inputs.version }}" ]]; then
            echo "VERSION=${{ github.event.inputs.version }}" >> $GITHUB_ENV
          else
            echo "VERSION=${{ github.sha }}" >> $GITHUB_ENV
          fi
      - name: Deploy to GKE
        run: |
          cd k8s/overlays/production
          kustomize edit set image gcr.io/${{ secrets.GCP_PROJECT_ID }}/api:${{ env.VERSION }}
          kustomize build | kubectl apply -f -
          kubectl rollout status deployment/brainlink-api -n brainlink-prod
      - name: Run smoke tests
        run: |
          sleep 30  # Dar tempo para os pods estarem prontos
          ./scripts/smoke-tests.sh https://api.brainlink.com
```

## Gerenciamento de Configuração

O Brainlink adota uma abordagem de configuração hierárquica baseada em ambiente.

### Estrutura de Configuração

```typescript
// lib/config/index.ts
import fs from 'fs';
import path from 'path';
import { parseEnv } from './env-parser';

// Configuração padrão
const defaultConfig = {
  server: {
    port: 8080,
    host: '0.0.0.0',
    corsOrigins: ['http://localhost:3000'],
  },
  database: {
    maxConnections: 20,
    idleTimeoutMs: 10000,
    connectionTimeoutMs: 3000,
  },
  cache: {
    defaultTTLSeconds: 300,
    maxSize: 1000,
  },
  api: {
    rateLimit: {
      window: 60000,
      max: 100,
    },
    timeout: 30000,
  },
  auth: {
    jwtExpirySeconds: 3600,
    sessionDurationMinutes: 60,
  },
  features: {
    aiAssistant: true,
    collaboration: true,
    analytics: true,
  },
  logging: {
    level: 'info',
    pretty: false,
  },
};

// Carregar configurações específicas do ambiente
const loadEnvironmentConfig = (): Record<string, any> => {
  const env = process.env.NODE_ENV || 'development';
  let envConfig = {};
  
  // Tentar carregar configuração do arquivo
  const configPath = path.join(process.cwd(), 'config', `${env}.json`);
  
  if (fs.existsSync(configPath)) {
    try {
      const configFile = fs.readFileSync(configPath, 'utf8');
      envConfig = JSON.parse(configFile);
    } catch (error) {
      console.error(`Error loading config file for ${env}:`, error);
    }
  }
  
  return envConfig;
};

// Sobrescrever com variáveis de ambiente
const loadEnvVarConfig = (): Record<string, any> => {
  return parseEnv(process.env);
};

// Combinar configurações com precedência:
// 1. Variáveis de ambiente
// 2. Arquivo de configuração do ambiente
// 3. Configuração padrão
const config = {
  ...defaultConfig,
  ...loadEnvironmentConfig(),
  ...loadEnvVarConfig(),
};

export default config;
```

### Secrets Management

O Brainlink utiliza o Secret Manager do GCP para armazenar segredos. O processo de carregamento de segredos ocorre durante a inicialização:

```typescript
// lib/config/secrets.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(name: string): Promise<string> {
  try {
    const projectId = process.env.GCP_PROJECT_ID;
    const environment = process.env.NODE_ENV || 'development';
    const secretName = `projects/${projectId}/secrets/${environment}_${name}/versions/latest`;
    
    const [version] = await client.accessSecretVersion({
      name: secretName,
    });
    
    const payload = version.payload?.data?.toString();
    
    if (!payload) {
      throw new Error(`Secret ${name} is empty`);
    }
    
    return payload;
  } catch (error) {
    console.error(`Failed to load secret ${name}:`, error);
    throw error;
  }
}

export async function loadSecrets(): Promise<Record<string, string>> {
  const requiredSecrets = [
    'db_password',
    'jwt_secret',
    'api_keys',
  ];
  
  const secrets: Record<string, string> = {};
  
  await Promise.all(
    requiredSecrets.map(async (secret) => {
      try {
        secrets[secret] = await getSecret(secret);
      } catch (error) {
        if (process.env.NODE_ENV === 'production') {
          throw error;
        } else {
          console.warn(`Using fallback for secret ${secret} in non-production environment`);
          secrets[secret] = `dev-${secret}-value`;
        }
      }
    })
  );
  
  return secrets;
}
```

## Estratégia de Implantação

O Brainlink utiliza diferentes estratégias de implantação dependendo do ambiente e tipo de atualização.

### Blue-Green Deployment

Para atualizações importantes com potencial impacto significativo, é utilizada a estratégia Blue-Green:

```yaml
# k8s/blue-green/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: brainlink-prod

resources:
- service-blue.yaml
- service-green.yaml
- service-main.yaml
- deployment-blue.yaml
- deployment-green.yaml

configMapGenerator:
- name: brainlink-config
  files:
  - config.json
```

Exemplo de configuração dos serviços:

```yaml
# k8s/blue-green/service-main.yaml
apiVersion: v1
kind: Service
metadata:
  name: brainlink-api
  labels:
    app: brainlink
    component: api
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    app: brainlink
    component: api
    # O deployment ativo (blue ou green) terá esta label
    deployment: active
```

### Canary Releases

Para features experimentais ou progressivas:

```yaml
# k8s/canary/deployment-canary.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: brainlink-api-canary
  labels:
    app: brainlink
    component: api
    track: canary
spec:
  replicas: 1  # Uma pequena porcentagem do tráfego
  selector:
    matchLabels:
      app: brainlink
      component: api
      track: canary
  template:
    metadata:
      labels:
        app: brainlink
        component: api
        track: canary
    spec:
      containers:
      - name: api
        image: gcr.io/brainlink/api:canary
        # ...resto da configuração
```

### Rolling Updates

Para atualizações regulares com baixo impacto, o Brainlink utiliza Rolling Updates, que é a estratégia padrão no Kubernetes:

```yaml
# Estratégia de Rolling Update
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

## Configuração de Banco de Dados

### Migrações

O Brainlink utiliza Prisma Migrate para gerenciar migrações de banco de dados:

```typescript
// scripts/migrate.ts
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const environment = process.env.NODE_ENV || 'development';
  
  try {
    console.log(`Running migrations for ${environment} environment...`);
    
    // Verificar conexão com o banco de dados
    await prisma.$connect();
    console.log('Database connection successful');
    
    // Executar migrações
    const command = environment === 'production' 
      ? 'npx prisma migrate deploy' 
      : 'npx prisma migrate dev';
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('Migrations completed successfully');
    
    // Verificar se há migrações de seed
    if (environment !== 'production') {
      console.log('Running seed data...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('Seed completed successfully');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

### Lógica de Rollback

Para casos onde migrações falham:

```typescript
// scripts/rollback.ts
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const migrationId = process.argv[2];
  
  if (!migration