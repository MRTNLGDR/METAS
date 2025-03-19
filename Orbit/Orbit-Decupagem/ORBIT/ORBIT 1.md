ocumentação Técnica Completa - Plataforma Orbit - (ANTIGA USAR COMO ERFERENCIA PARA AS AREAS )

1. Visão Geral do Sistema

1.1 Introdução

A Orbit é uma plataforma de aceleração digital abrangente que integra consultoria estratégica, marketing, automação, gestão de projetos e educação corporativa em um ecossistema modular e escalável. A plataforma utiliza uma arquitetura baseada em canvas com nodes, permitindo visualizações interativas que simulam um "cérebro vivo", com foco em transformação digital e crescimento sustentável de negócios.

1.2 Objetivos da Plataforma

Transformação Digital: Capacitar empresas a se modernizarem com tecnologias emergentes

Crescimento Sustentável: Acelerar o crescimento com estratégias data-driven

Desenvolvimento de Equipes: Oferecer treinamentos e certificações para aprimorar competências

Automação de Processos: Integrar ferramentas e APIs para otimizar fluxos de trabalho

Integração Tecnológica: Conectar sistemas existentes para uma visão unificada

1.3 Pilares Principais

Consultoria Estratégica: Diagnóstico empresarial, planejamento e mentoria especializada

Marketing & Growth: Gestão de campanhas, automação, SEO e growth hacking

Tecnologia & Automação: Integração de sistemas, business intelligence e processos automatizados

Educação Corporativa: Cursos, treinamentos, certificações e plataforma LMS

2. Arquitetura do Sistema

2.1 Visão Arquitetural

A Orbit implementa uma arquitetura modular, onde cada funcionalidade é representada como um node em um canvas interativo, permitindo a criação de fluxos de trabalho personalizados.

┌─────────────────────────────────────────────────────────────┐

│ Frontend (React/TS) │

├───────────┬───────────┬───────────┬───────────┬─────────────┤

│ Auth & │ Canvas │ Document │ CRM │ Analytics │

│ Profiles │ System │ Management│ Module │ Module │

└─────┬─────┴─────┬─────┴─────┬─────┴─────┬─────┴──────┬──────┘

│ │ │ │ │

┌─────▼───────────▼───────────▼───────────▼────────────▼──────┐

│ API Layer (Supabase) │

├─────────────────────────────────────────────────────────────┤

│ Database (PostgreSQL) │

└─────────────────────────────────────────────────────────────┘

2.2 Componentes Técnicos

Frontend: React, TypeScript, Tailwind CSS, Shadcn UI

Backend: Supabase (PostgreSQL, Auth, Functions, Storage)

Comunicação: APIs RESTful, WebSockets, Webhooks

Visualização: ReactFlow para canvas interativo

2.3 Modularidade

A plataforma é estruturada em módulos independentes que se comunicam via API:

Cada módulo possui suas próprias tabelas no banco de dados

Interfaces bem definidas garantem a comunicação entre módulos

Autenticação centralizada com controle de permissões

3. Autenticação e Gerenciamento de Usuários

3.1 Estrutura de Perfis

A Orbit implementa um sistema sofisticado de perfis e permissões:

| Perfil | Descrição | Permissões | |-----------------|--------------------------------------------------|----------------------------------------| | Admin | Administradores da plataforma | Acesso total | | Manager | Gerentes de conta que supervisionam clientes | Gerenciamento de clientes e recursos | | Corporate | Conta corporativa (cliente) | Acesso aos recursos contratados | | Collaborator | Colaboradores de uma conta corporativa | Acesso limitado definido pelo gerente | | Partner | Prestadores de serviço | Acesso para oferecer serviços | | Account_Manager | Gerentes de conta específicos | Gerenciamento de contas específicas | | General | Usuário básico | Acesso mínimo à plataforma |

3.2 Fluxo de Autenticação

Registro de usuário via formulário ou contas demo

Login com email/senha ou provedores OAuth

Validação do perfil e permissões

Redirecionamento para a dashboard apropriada

3.3 Implementação Técnica

// AuthContext e AuthProvider gerenciam o estado de autenticação

// Supabase Auth é utilizado para autenticação de usuários

// Row Level Security (RLS) no banco garante isolamento de dados

4. Canvas de Diagnóstico 360°

4.1 Conceito

O Canvas de Diagnóstico 360° é o núcleo da plataforma, permitindo uma visualização interativa das diferentes áreas de negócio e suas interconexões.

4.2 Tipos de Nodes

Customer: Gerenciamento de clientes e leads

Product: Gestão de produtos e serviços

Legal: Documentos e compliance

Growth: Estratégias de crescimento

Integration: Conexões com sistemas externos

Document: Propostas e contratos

Pricing: Calculadoras de precificação

Campaign: Campanhas de marketing

Service: Serviços oferecidos

Task: Tarefas e atividades

4.3 Diagrama de Relacionamento

┌───────────┐ ┌───────────┐

│ Customer │───────│ Product │

└─────┬─────┘ └─────┬─────┘

│ │

┌─────▼─────┐ ┌─────▼─────┐

│ Pricing │───────│ Document │

└─────┬─────┘ └─────┬─────┘

│ │

┌─────▼─────┐ ┌─────▼─────┐

│ Campaign │───────│ Legal │

└───────────┘ └───────────┘

4.4 Implementação Técnica

Frontend: ReactFlow para manipulação visual dos nodes

Backend: Armazenamento de nodes, edges e posições no PostgreSQL

Renderização: Componentes customizados para cada tipo de node

5. Banco de Dados

5.1 Modelo de Dados Principal

5.1.1 Autenticação e Perfis

-- Tabelas relacionadas a usuários e perfis

CREATE TABLE user_profiles (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

profile_type user_profile_type NOT NULL,

active BOOLEAN DEFAULT false,

company_id UUID REFERENCES companies(id),

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE profile_details (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

profile_id UUID REFERENCES user_profiles(id),

company_name TEXT,

business_info TEXT,

permissions TEXT[] DEFAULT ARRAY['basic_access'::text],

services JSONB,

partner_info JSONB,

contact_info JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.2 Empresas e Clientes

-- Tabelas relacionadas a empresas

CREATE TABLE companies (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

industry TEXT,

size TEXT,

website TEXT,

description TEXT,

address TEXT,

city TEXT,

state TEXT,

country TEXT,

postal_code TEXT,

email TEXT,

tax_id TEXT,

logo_url TEXT,

account_manager_id UUID REFERENCES user_profiles(id),

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.3 Canvas e Diagnóstico

-- Tabelas para o sistema de canvas

CREATE TABLE canvases (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

owner_id UUID,

company_id UUID,

is_template BOOLEAN DEFAULT false,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE nodes (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

description TEXT,

category node_category NOT NULL,

position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,

data JSONB,

created_by UUID,

company_id UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE node_edges (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

source UUID,

target UUID,

source_id UUID,

target_id UUID,

label TEXT,

data JSONB,

created_by UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.4 Propostas e Contratos

-- Tabelas para gestão de propostas e contratos

CREATE TABLE proposals (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

description TEXT,

company_id UUID,

status TEXT NOT NULL DEFAULT 'draft',

total_amount NUMERIC,

content JSONB,

valid_until TIMESTAMP WITH TIME ZONE,

version INTEGER DEFAULT 1,

created_by UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE contracts (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

proposal_id UUID,

status TEXT NOT NULL DEFAULT 'pending',

total_value NUMERIC NOT NULL,

content JSONB,

payment_terms JSONB,

start_date TIMESTAMP WITH TIME ZONE,

end_date TIMESTAMP WITH TIME ZONE,

signed_by_client BOOLEAN DEFAULT false,

signed_by_manager BOOLEAN DEFAULT false,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.5 Comissionamento e Partners

-- Tabelas para sistema de comissionamento

CREATE TABLE commissions (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

contract_id UUID,

partner_id UUID,

amount NUMERIC NOT NULL,

percentage NUMERIC,

status TEXT NOT NULL DEFAULT 'pending',

payment_date TIMESTAMP WITH TIME ZONE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE partner_services (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

partner_id UUID,

name TEXT NOT NULL,

category TEXT NOT NULL,

description TEXT,

min_price NUMERIC,

max_price NUMERIC,

active BOOLEAN DEFAULT true,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.6 Comunicação

-- Tabelas para sistema de comunicação interna

CREATE TABLE conversations (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT,

type TEXT NOT NULL DEFAULT 'direct',

created_by UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE messages (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

conversation_id UUID,

sender_id UUID,

content TEXT NOT NULL,

type TEXT DEFAULT 'text',

metadata JSONB,

read_by JSONB DEFAULT '[]'::jsonb,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.2 Tipos Enumerados

-- Tipos enumerados utilizados no banco

CREATE TYPE user_profile_type AS ENUM (

'admin',

'manager',

'corporate',

'collaborator',

'partner',

'account_manager',

'general'

);

CREATE TYPE resource_type AS ENUM (

'course',

'ebook',

'template',

'material',

'project',

'campaign',

'report',

'analytics',

'user_management',

'system_settings'

);

CREATE TYPE permission_level AS ENUM (

'read',

'write',

'manage',

'admin'

);

CREATE TYPE node_category AS ENUM (

'customer',

'product',

'legal',

'growth',

'integration',

'document',

'pricing',

'campaign',

'service',

'task'

);

5.3 Funções e Triggers

-- Funções importantes do banco

CREATE OR REPLACE FUNCTION switch_user_profile(user_id uuid, profile_type user_profile_type)

RETURNS user_profiles

LANGUAGE plpgsql

SECURITY DEFINER

AS $function$

DECLARE

profile_record user_profiles;

BEGIN

-- Desativa todos os perfis do usuário

UPDATE user_profiles

SET active = false

WHERE user_profiles.user_id = switch_user_profile.user_id;

-- Ativa o perfil especificado

UPDATE user_profiles

SET active = true

WHERE user_profiles.user_id = switch_user_profile.user_id

AND user_profiles.profile_type = switch_user_profile.profile_type

RETURNING * INTO profile_record;

RETURN profile_record;

END;

$function$;

-- Trigger para atualizar campos updated_at

CREATE OR REPLACE FUNCTION handle_updated_at()

RETURNS trigger

LANGUAGE plpgsql

AS $function$

BEGIN

NEW.updated_at = timezone('utc'::text, now());

RETURN NEW;

END;

$function$;

6. API e Integrações

6.1 REST API

A plataforma expõe APIs RESTful para comunicação entre módulos:

| Endpoint | Método | Descrição | |-------------------------|--------|--------------------------------------| | /api/auth/login | POST | Autenticação de usuário | | /api/users/profiles | GET | Obter perfis do usuário atual | | /api/canvas/{id} | GET | Obter dados de um canvas específico | | /api/nodes | POST | Criar novo node no canvas | | /api/edges | POST | Conectar nodes no canvas | | /api/proposals/{id} | GET | Obter proposta específica | | /api/contracts | POST | Criar novo contrato | | /api/commissions | GET | Listar comissões |

6.2 Integrações Externas

A Orbit se integra com várias plataformas externas:

| Plataforma | Tipo de Integração | Finalidade | |----------------|----------------------|----------------------------------| | Google Ads | API | Gestão de campanhas | | Facebook Ads | API | Marketing em redes sociais | | LinkedIn | API | Marketing B2B | | HubSpot | API bidirecional | Sincronização de CRM | | Salesforce | API bidirecional | Gestão de clientes | | OpenAI | API | Recursos de IA | | Google Analytics| API | Análise de dados |

7. Frontend e Design

7.1 Estrutura de Componentes

A interface foi desenvolvida com React e TypeScript, seguindo uma estrutura organizacional clara:

src/

├── components/ # Componentes reutilizáveis

│ ├── ui/ # Componentes base (buttons, inputs, etc)

│ ├── auth/ # Componentes de autenticação

│ ├── admin/ # Componentes da área administrativa

│ ├── members/ # Componentes para área de membros

│ └── ...

├── contexts/ # Context API para estado global

│ ├── auth/ # Contexto de autenticação

│ └── ...

├── hooks/ # Custom hooks

├── pages/ # Componentes de páginas

│ ├── auth/ # Páginas de autenticação

│ ├── admin/ # Páginas administrativas

│ ├── members/ # Páginas de área de membros

│ └── ...

├── types/ # Definições de tipos TypeScript

├── integrations/ # Código de integração com APIs externas

│ └── supabase/ # Cliente e funções Supabase

├── services/ # Serviços da aplicação

└── utils/ # Utilidades e funções auxiliares

7.2 Design System

A interface segue um design system consistente:

Cores: Dark theme com acentos em azul e gradientes multicores

Tipografia: Fontes sans-serif para legibilidade otimizada

Componentes: Biblioteca Shadcn UI personalizada

Layouts: Estruturas modulares com elementos de glassmorfismo

Animações: Transições suaves e feedback visual interativo

7.3 Visualizações e Canvas

ReactFlow: Framework para canvas interativo

Nodes customizados: Componentes específicos para cada tipo de node

Animações: Efeitos que simulam um "cérebro vivo" com conexões dinâmicas

Responsividade: Adapatação das visualizações para diferentes tamanhos de tela

8. Segurança e Privacidade

8.1 Autenticação

Autenticação baseada em tokens JWT

Opções de login com email/senha ou OAuth

Sessões com expiração e refresh tokens

Verificação de email para novos cadastros

8.2 Autorização

Sistema de permissões granular por recurso

Row Level Security (RLS) no banco de dados

Validação de permissões no frontend e backend

Funções de security definer para operações sensíveis

8.3 Proteção de Dados

Criptografia em trânsito (HTTPS)

Isolamento de dados por cliente

Políticas rigorosas de acesso a dados

Logs de auditoria para ações sensíveis

9. Módulos e Funcionalidades

9.1 Módulo de Consultoria

Diagnóstico 360°: Canvas visual interativo

Análise de Mercado: Ferramentas analíticas

Planejamento Estratégico: Templates e roadmaps

9.2 Módulo de Marketing

Gestão de Campanhas: Planejamento e execução

Analytics: Métricas e relatórios

Automação: Fluxos de trabalho automatizados

9.3 Módulo de Documentos

Editor de Propostas: Interface drag-and-drop

Contratos: Templates e versionamento

Assinaturas: Fluxo de aprovação digital

9.4 Módulo de Educação

Cursos: Biblioteca de conteúdos educacionais

Trilhas: Percursos de aprendizado personalizados

Certificações: Emissão e validação de certificados

9.5 Módulo de Precificação

Calculadoras: Templates configuráveis

Simulações: Cenários de preços e margem

Integrações: APIs de dados externos

10. Implantação e DevOps

10.1 Infraestrutura

Hospedagem: Serviços em nuvem

Banco de Dados: PostgreSQL via Supabase

CDN: Distribuição de conteúdo estático

Armazenamento: Arquivos e mídia em storage dedicado

10.2 CI/CD

Versionamento: Git com controle de versões semântico

Testes: Unitários, integração e end-to-end

Deploy: Pipeline automatizado com validações

Monitoramento: Logs, métricas e alertas

10.3 Escalabilidade

Arquitetura modular: Permite escalar componentes independentemente

Cache distribuído: Otimiza performance para grandes volumes

Filas de processamento: Para operações assíncronas

Réplicas de banco: Para leitura distribuída

11. Conclusão e Roadmap

11.1 Estado Atual

A plataforma Orbit encontra-se em desenvolvimento ativo, com diversos módulos já funcionais:

Sistema de autenticação e perfis

Canvas de diagnóstico interativo

Gestão de propostas e contratos

Comunicação interna

Integração com APIs externas

11.2 Roadmap Futuro

Curto prazo: Refinamento das funcionalidades existentes

Médio prazo: Expansão do módulo educacional e precificação

Longo prazo: Marketplace de integração com parceiros e API pública

11.3 Direção Estratégica

A Orbit continuará evoluindo como uma plataforma modular, permitindo que empresas personalizem sua jornada de transformação digital conforme suas necessidades específicas, mantendo o foco na integração perfeita entre consultoria, execução e educação.

Esta documentação abrange os principais aspectos da plataforma Orbit, desde sua arquitetura e modelo de dados até suas funcionalidades e roadmap. Para mais detalhes sobre componentes específicos ou implementações técnicas, consulte a documentação específica de cada módulo.

Vou criar uma documentação detalhada e robusta da plataforma Orbit, abrangendo todos os aspectos do sistema desde sua arquitetura até seus componentes técnicos.

Documentação Técnica Completa - Plataforma Orbit

1. Visão Geral do Sistema

1.1 Introdução

A Orbit é uma plataforma de aceleração digital abrangente que integra consultoria estratégica, marketing, automação, gestão de projetos e educação corporativa em um ecossistema modular e escalável. A plataforma utiliza uma arquitetura baseada em canvas com nodes, permitindo visualizações interativas que simulam um "cérebro vivo", com foco em transformação digital e crescimento sustentável de negócios.

1.2 Objetivos da Plataforma

Transformação Digital: Capacitar empresas a se modernizarem com tecnologias emergentes

Crescimento Sustentável: Acelerar o crescimento com estratégias data-driven

Desenvolvimento de Equipes: Oferecer treinamentos e certificações para aprimorar competências

Automação de Processos: Integrar ferramentas e APIs para otimizar fluxos de trabalho

Integração Tecnológica: Conectar sistemas existentes para uma visão unificada

1.3 Pilares Principais

Consultoria Estratégica: Diagnóstico empresarial, planejamento e mentoria especializada

Marketing & Growth: Gestão de campanhas, automação, SEO e growth hacking

Tecnologia & Automação: Integração de sistemas, business intelligence e processos automatizados

Educação Corporativa: Cursos, treinamentos, certificações e plataforma LMS

2. Arquitetura do Sistema

2.1 Visão Arquitetural

A Orbit implementa uma arquitetura modular, onde cada funcionalidade é representada como um node em um canvas interativo, permitindo a criação de fluxos de trabalho personalizados.

┌─────────────────────────────────────────────────────────────┐

│ Frontend (React/TS) │

├───────────┬───────────┬───────────┬───────────┬─────────────┤

│ Auth & │ Canvas │ Document │ CRM │ Analytics │

│ Profiles │ System │ Management│ Module │ Module │

└─────┬─────┴─────┬─────┴─────┬─────┴─────┬─────┴──────┬──────┘

│ │ │ │ │

┌─────▼───────────▼───────────▼───────────▼────────────▼──────┐

│ API Layer (Supabase) │

├─────────────────────────────────────────────────────────────┤

│ Database (PostgreSQL) │

└─────────────────────────────────────────────────────────────┘

2.2 Componentes Técnicos

Frontend: React, TypeScript, Tailwind CSS, Shadcn UI

Backend: Supabase (PostgreSQL, Auth, Functions, Storage)

Comunicação: APIs RESTful, WebSockets, Webhooks

Visualização: ReactFlow para canvas interativo

2.3 Modularidade

A plataforma é estruturada em módulos independentes que se comunicam via API:

Cada módulo possui suas próprias tabelas no banco de dados

Interfaces bem definidas garantem a comunicação entre módulos

Autenticação centralizada com controle de permissões

3. Autenticação e Gerenciamento de Usuários

3.1 Estrutura de Perfis

A Orbit implementa um sistema sofisticado de perfis e permissões:

| Perfil | Descrição | Permissões | |-----------------|--------------------------------------------------|----------------------------------------| | Admin | Administradores da plataforma | Acesso total | | Manager | Gerentes de conta que supervisionam clientes | Gerenciamento de clientes e recursos | | Corporate | Conta corporativa (cliente) | Acesso aos recursos contratados | | Collaborator | Colaboradores de uma conta corporativa | Acesso limitado definido pelo gerente | | Partner | Prestadores de serviço | Acesso para oferecer serviços | | Account_Manager | Gerentes de conta específicos | Gerenciamento de contas específicas | | General | Usuário básico | Acesso mínimo à plataforma |

3.2 Fluxo de Autenticação

Registro de usuário via formulário ou contas demo

Login com email/senha ou provedores OAuth

Validação do perfil e permissões

Redirecionamento para a dashboard apropriada

3.3 Implementação Técnica

// AuthContext e AuthProvider gerenciam o estado de autenticação

// Supabase Auth é utilizado para autenticação de usuários

// Row Level Security (RLS) no banco garante isolamento de dados

4. Canvas de Diagnóstico 360°

4.1 Conceito

O Canvas de Diagnóstico 360° é o núcleo da plataforma, permitindo uma visualização interativa das diferentes áreas de negócio e suas interconexões.

4.2 Tipos de Nodes

Customer: Gerenciamento de clientes e leads

Product: Gestão de produtos e serviços

Legal: Documentos e compliance

Growth: Estratégias de crescimento

Integration: Conexões com sistemas externos

Document: Propostas e contratos

Pricing: Calculadoras de precificação

Campaign: Campanhas de marketing

Service: Serviços oferecidos

Task: Tarefas e atividades

4.3 Diagrama de Relacionamento

┌───────────┐ ┌───────────┐

│ Customer │───────│ Product │

└─────┬─────┘ └─────┬─────┘

│ │

┌─────▼─────┐ ┌─────▼─────┐

│ Pricing │───────│ Document │

└─────┬─────┘ └─────┬─────┘

│ │

┌─────▼─────┐ ┌─────▼─────┐

│ Campaign │───────│ Legal │

└───────────┘ └───────────┘

4.4 Implementação Técnica

Frontend: ReactFlow para manipulação visual dos nodes

Backend: Armazenamento de nodes, edges e posições no PostgreSQL

Renderização: Componentes customizados para cada tipo de node

5. Banco de Dados

5.1 Modelo de Dados Principal

5.1.1 Autenticação e Perfis

-- Tabelas relacionadas a usuários e perfis

CREATE TABLE user_profiles (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

profile_type user_profile_type NOT NULL,

active BOOLEAN DEFAULT false,

company_id UUID REFERENCES companies(id),

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE profile_details (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

profile_id UUID REFERENCES user_profiles(id),

company_name TEXT,

business_info TEXT,

permissions TEXT[] DEFAULT ARRAY['basic_access'::text],

services JSONB,

partner_info JSONB,

contact_info JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.2 Empresas e Clientes

-- Tabelas relacionadas a empresas

CREATE TABLE companies (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

industry TEXT,

size TEXT,

website TEXT,

description TEXT,

address TEXT,

city TEXT,

state TEXT,

country TEXT,

postal_code TEXT,

email TEXT,

tax_id TEXT,

logo_url TEXT,

account_manager_id UUID REFERENCES user_profiles(id),

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.3 Canvas e Diagnóstico

-- Tabelas para o sistema de canvas

CREATE TABLE canvases (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

owner_id UUID,

company_id UUID,

is_template BOOLEAN DEFAULT false,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE nodes (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

description TEXT,

category node_category NOT NULL,

position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}'::jsonb,

data JSONB,

created_by UUID,

company_id UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE node_edges (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

source UUID,

target UUID,

source_id UUID,

target_id UUID,

label TEXT,

data JSONB,

created_by UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.4 Propostas e Contratos

-- Tabelas para gestão de propostas e contratos

CREATE TABLE proposals (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

description TEXT,

company_id UUID,

status TEXT NOT NULL DEFAULT 'draft',

total_amount NUMERIC,

content JSONB,

valid_until TIMESTAMP WITH TIME ZONE,

version INTEGER DEFAULT 1,

created_by UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE contracts (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

proposal_id UUID,

status TEXT NOT NULL DEFAULT 'pending',

total_value NUMERIC NOT NULL,

content JSONB,

payment_terms JSONB,

start_date TIMESTAMP WITH TIME ZONE,

end_date TIMESTAMP WITH TIME ZONE,

signed_by_client BOOLEAN DEFAULT false,

signed_by_manager BOOLEAN DEFAULT false,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.5 Comissionamento e Partners

-- Tabelas para sistema de comissionamento

CREATE TABLE commissions (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

contract_id UUID,

partner_id UUID,

amount NUMERIC NOT NULL,

percentage NUMERIC,

status TEXT NOT NULL DEFAULT 'pending',

payment_date TIMESTAMP WITH TIME ZONE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE partner_services (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

partner_id UUID,

name TEXT NOT NULL,

category TEXT NOT NULL,

description TEXT,

min_price NUMERIC,

max_price NUMERIC,

active BOOLEAN DEFAULT true,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.1.6 Comunicação

-- Tabelas para sistema de comunicação interna

CREATE TABLE conversations (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT,

type TEXT NOT NULL DEFAULT 'direct',

created_by UUID,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

CREATE TABLE messages (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

conversation_id UUID,

sender_id UUID,

content TEXT NOT NULL,

type TEXT DEFAULT 'text',

metadata JSONB,

read_by JSONB DEFAULT '[]'::jsonb,

created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())

);

5.2 Tipos Enumerados

-- Tipos enumerados utilizados no banco

CREATE TYPE user_profile_type AS ENUM (

'admin',

'manager',

'corporate',

'collaborator',

'partner',

'account_manager',

'general'

);

CREATE TYPE resource_type AS ENUM (

'course',

'ebook',

'template',

'material',

'project',

'campaign',

'report',

'analytics',

'user_management',

'system_settings'

);

CREATE TYPE permission_level AS ENUM (

'read',

'write',

'manage',

'admin'

);

CREATE TYPE node_category AS ENUM (

'customer',

'product',

'legal',

'growth',

'integration',

'document',

'pricing',

'campaign',

'service',

'task'

);

5.3 Funções e Triggers

-- Funções importantes do banco

CREATE OR REPLACE FUNCTION switch_user_profile(user_id uuid, profile_type user_profile_type)

RETURNS user_profiles

LANGUAGE plpgsql

SECURITY DEFINER

AS $function$

DECLARE

profile_record user_profiles;

BEGIN

-- Desativa todos os perfis do usuário

UPDATE user_profiles

SET active = false

WHERE user_profiles.user_id = switch_user_profile.user_id;

-- Ativa o perfil especificado

UPDATE user_profiles

SET active = true

WHERE user_profiles.user_id = switch_user_profile.user_id

AND user_profiles.profile_type = switch_user_profile.profile_type

RETURNING * INTO profile_record;

RETURN profile_record;

END;

$function$;

-- Trigger para atualizar campos updated_at

CREATE OR REPLACE FUNCTION handle_updated_at()

RETURNS trigger

LANGUAGE plpgsql

AS $function$

BEGIN

NEW.updated_at = timezone('utc'::text, now());

RETURN NEW;

END;

$function$;

6. API e Integrações

6.1 REST API

A plataforma expõe APIs RESTful para comunicação entre módulos:

| Endpoint | Método | Descrição | |-------------------------|--------|--------------------------------------| | /api/auth/login | POST | Autenticação de usuário | | /api/users/profiles | GET | Obter perfis do usuário atual | | /api/canvas/{id} | GET | Obter dados de um canvas específico | | /api/nodes | POST | Criar novo node no canvas | | /api/edges | POST | Conectar nodes no canvas | | /api/proposals/{id} | GET | Obter proposta específica | | /api/contracts | POST | Criar novo contrato | | /api/commissions | GET | Listar comissões |

6.2 Integrações Externas

A Orbit se integra com várias plataformas externas:

| Plataforma | Tipo de Integração | Finalidade | |----------------|----------------------|----------------------------------| | Google Ads | API | Gestão de campanhas | | Facebook Ads | API | Marketing em redes sociais | | LinkedIn | API | Marketing B2B | | HubSpot | API bidirecional | Sincronização de CRM | | Salesforce | API bidirecional | Gestão de clientes | | OpenAI | API | Recursos de IA | | Google Analytics| API | Análise de dados |

7. Frontend e Design

7.1 Estrutura de Componentes

A interface foi desenvolvida com React e TypeScript, seguindo uma estrutura organizacional clara:

src/

├── components/ # Componentes reutilizáveis

│ ├── ui/ # Componentes base (buttons, inputs, etc)

│ ├── auth/ # Componentes de autenticação

│ ├── admin/ # Componentes da área administrativa

│ ├── members/ # Componentes para área de membros

│ └── ...

├── contexts/ # Context API para estado global

│ ├── auth/ # Contexto de autenticação

│ └── ...

├── hooks/ # Custom hooks

├── pages/ # Componentes de páginas

│ ├── auth/ # Páginas de autenticação

│ ├── admin/ # Páginas administrativas

│ ├── members/ # Páginas de área de membros

│ └── ...

├── types/ # Definições de tipos TypeScript

├── integrations/ # Código de integração com APIs externas

│ └── supabase/ # Cliente e funções Supabase

├── services/ # Serviços da aplicação

└── utils/ # Utilidades e funções auxiliares

7.2 Design System

A interface segue um design system consistente:

Cores: Dark theme com acentos em azul e gradientes multicores

Tipografia: Fontes sans-serif para legibilidade otimizada

Componentes: Biblioteca Shadcn UI personalizada

Layouts: Estruturas modulares com elementos de glassmorfismo

Animações: Transições suaves e feedback visual interativo

7.3 Visualizações e Canvas

ReactFlow: Framework para canvas interativo

Nodes customizados: Componentes específicos para cada tipo de node

Animações: Efeitos que simulam um "cérebro vivo" com conexões dinâmicas

Responsividade: Adapatação das visualizações para diferentes tamanhos de tela

8. Segurança e Privacidade

8.1 Autenticação

Autenticação baseada em tokens JWT

Opções de login com email/senha ou OAuth

Sessões com expiração e refresh tokens

Verificação de email para novos cadastros

8.2 Autorização

Sistema de permissões granular por recurso

Row Level Security (RLS) no banco de dados

Validação de permissões no frontend e backend

Funções de security definer para operações sensíveis

8.3 Proteção de Dados

Criptografia em trânsito (HTTPS)

Isolamento de dados por cliente

Políticas rigorosas de acesso a dados

Logs de auditoria para ações sensíveis

9. Módulos e Funcionalidades

9.1 Módulo de Consultoria

Diagnóstico 360°: Canvas visual interativo

Análise de Mercado: Ferramentas analíticas

Planejamento Estratégico: Templates e roadmaps

9.2 Módulo de Marketing

Gestão de Campanhas: Planejamento e execução

Analytics: Métricas e relatórios

Automação: Fluxos de trabalho automatizados

9.3 Módulo de Documentos

Editor de Propostas: Interface drag-and-drop

Contratos: Templates e versionamento

Assinaturas: Fluxo de aprovação digital

9.4 Módulo de Educação

Cursos: Biblioteca de conteúdos educacionais

Trilhas: Percursos de aprendizado personalizados

Certificações: Emissão e validação de certificados

9.5 Módulo de Precificação

Calculadoras: Templates configuráveis

Simulações: Cenários de preços e margem

Integrações: APIs de dados externos

10. Implantação e DevOps

10.1 Infraestrutura

Hospedagem: Serviços em nuvem

Banco de Dados: PostgreSQL via Supabase

CDN: Distribuição de conteúdo estático

Armazenamento: Arquivos e mídia em storage dedicado

10.2 CI/CD

Versionamento: Git com controle de versões semântico

Testes: Unitários, integração e end-to-end

Deploy: Pipeline automatizado com validações

Monitoramento: Logs, métricas e alertas

10.3 Escalabilidade

Arquitetura modular: Permite escalar componentes independentemente

Cache distribuído: Otimiza performance para grandes volumes

Filas de processamento: Para operações assíncronas

Réplicas de banco: Para leitura distribuída

11. Conclusão e Roadmap

11.1 Estado Atual

A plataforma Orbit encontra-se em desenvolvimento ativo, com diversos módulos já funcionais:

Sistema de autenticação e perfis

Canvas de diagnóstico interativo

Gestão de propostas e contratos

Comunicação interna

Integração com APIs externas

11.2 Roadmap Futuro

Curto prazo: Refinamento das funcionalidades existentes

Médio prazo: Expansão do módulo educacional e precificação

Longo prazo: Marketplace de integração com parceiros e API pública

11.3 Direção Estratégica

A Orbit continuará evoluindo como uma plataforma modular, permitindo que empresas personalizem sua jornada de transformação digital conforme suas necessidades específicas, mantendo o foco na integração perfeita entre consultoria, execução e educação.

Esta documentação abrange os principais aspectos da plataforma Orbit, desde sua arquitetura e modelo de dados até suas funcionalidades e roadmap. Para mais detalhes sobre componentes específicos ou implementações técnicas, consulte a documentação específica de cada módulo.