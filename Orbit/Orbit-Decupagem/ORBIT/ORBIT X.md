dor e eficaz.

Temas principais

Plataforma Educacional Social

Microaprendizado Interativo

Arquitetura do Sistema

Módulos e Funcionalidades

APIs e Endpoints

Documentação Técnica - Orbit X

1. Visão Geral do Projeto

Orbit X é uma plataforma de mídia social educacional focada em microaprendizado que combina funcionalidades de mensageria instantânea (similar ao WhatsApp) com recursos educacionais interativos. A plataforma visa proporcionar uma experiência única onde os usuários podem aprender, interagir e compartilhar conhecimento em um ambiente social e gamificado.

1.1 Objetivos Principais

Criar uma plataforma de comunicação em tempo real para interações educacionais

Facilitar o microaprendizado através de conteúdos curtos e interativos

Implementar um sistema de gamificação com recompensas

Proporcionar uma gestão de conhecimento personalizada

Integrar com o ecossistema existente (ASCEND, MIONIR, DRAGDROP)

1.2 Público-Alvo

Estudantes e profissionais buscando aprendizado contínuo

Educadores e criadores de conteúdo

Especialistas e mentores em diversas áreas

Comunidades de aprendizado colaborativo

2. Arquitetura do Sistema

2.1 Diagrama de Arquitetura

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE APRESENTAÇÃO │

│ │

│ ┌───────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Mobile App│ │Web Interface│ │Desktop App │ │Progressive Web │ │

│ │ (React │ │ (React) │ │(Electron) │ │ App (PWA) │ │

│ │ Native) │ │ │ │ │ │ │ │

│ └───────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ API GATEWAY / BFF │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE SERVIÇOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Messaging │ │ User/Auth │ │ Content │ │ Gamification │ │

│ │ Service │ │ Service │ │ Service │ │ Service │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Knowledge │ │ Analytics │ │ Notification│ │ Integration │ │

│ │ Service │ │ Service │ │ Service │ │ Service │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE DADOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ PostgreSQL │ │ Redis Cache│ │ Supabase │ │ Elasticsearch │ │

│ │ (Relacional)│ │(Cache/Pub-│ │ (Realtime │ │ (Busca) │ │

│ │ │ │ Sub) │ │ DB) │ │ │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ INTEGRAÇÕES EXTERNAS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ ASCEND │ │ MIONIR │ │ DRAGDROP │ │ Processadores │ │

│ │ API │ │ API │ │ API │ │ de Pagamento │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

2.2 Tecnologias Principal

Frontend: React, React Native, TypeScript, TailwindCSS, Shadcn/UI

Backend: Node.js, NestJS, WebSockets

Banco de Dados: PostgreSQL, Supabase (Realtime), Redis

Armazenamento: Supabase Storage

Mensageria em Tempo Real: WebSockets, Supabase Realtime

Autenticação: Supabase Auth

Deploy: Kubernetes, Docker

3. Módulos e Funcionalidades

3.1 Módulo de Mensageria

3.1.1 Mensagens em Tempo Real

Mensagens privadas (1:1)

Grupos de conversa

Suporte para texto, áudio, imagens e vídeos

Status de leitura e digitação

Histórico de mensagens com busca avançada

3.1.2 Chamadas

Chamadas de voz

Chamadas de vídeo

Compartilhamento de tela

Gravação de chamadas (com permissão)

3.1.3 Segurança

Criptografia de ponta a ponta

Configurações de privacidade

Bloqueio de contatos

Denúncia de conteúdo impróprio

3.2 Módulo de Conteúdo Educacional

3.2.1 Microconteúdos

Vídeos curtos (estilo reels)

Podcasts interativos

Artigos e infográficos

Quizzes e testes rápidos

3.2.2 Cursos e Mentorias

Cursos de curta duração

Sessões de mentoria ao vivo

Webinars e transmissões interativas

Calendário de eventos educacionais

3.2.3 Criação de Conteúdo

Editor de conteúdo rico

Ferramentas de gravação e edição

Templates educacionais

Colaboração em tempo real

3.3 Módulo de Gamificação

3.3.1 Sistema de Recompensas

Moeda virtual interna

Pontos de experiência (XP)

Conquistas e badges

Níveis de usuário

3.3.2 Engajamento

Desafios diários

Competições e rankings

Recompensas por consistência

Streak de aprendizado

3.4 Módulo de Gestão de Conhecimento

3.4.1 Biblioteca Pessoal

Salvamento de conteúdos

Organização por tópicos/tags

Notas e anotações

Mapas mentais

3.4.2 Compartilhamento

Compartilhamento direto nas conversas

Recomendações personalizadas

Exportação para outras plataformas

Integração com ferramentas externas

3.5 Módulo de Integração

3.5.1 Integração com ASCEND

Precificação de cursos e mentorias

Gestão de ativos educacionais

Análise de valor de conteúdo

3.5.2 Integração com MIONIR

Contratos para criadores de conteúdo

Termos de uso e privacidade

Acordos de mentoria

3.5.3 Integração com DRAGDROP

Landing pages para cursos e eventos

Perfis públicos de usuários

Portfólios de conteúdo educacional

4. Modelo de Dados

4.1 Entidades Principais

4.1.1 Usuários

CREATE TABLE users (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

username TEXT UNIQUE NOT NULL,

email TEXT UNIQUE NOT NULL,

full_name TEXT NOT NULL,

avatar_url TEXT,

bio TEXT,

expertise TEXT[],

interests TEXT[],

level INTEGER DEFAULT 1,

xp INTEGER DEFAULT 0,

orbit_coins INTEGER DEFAULT 0,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

is_verified BOOLEAN DEFAULT FALSE,

is_creator BOOLEAN DEFAULT FALSE,

is_mentor BOOLEAN DEFAULT FALSE

);

4.1.2 Conversas

CREATE TABLE conversations (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT,

is_group BOOLEAN DEFAULT FALSE,

created_by UUID REFERENCES users(id),

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

icon_url TEXT,

is_educational BOOLEAN DEFAULT FALSE,

topic TEXT,

metadata JSONB DEFAULT '{}'

);

CREATE TABLE conversation_participants (

conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,

user_id UUID REFERENCES users(id) ON DELETE CASCADE,

role TEXT DEFAULT 'member',

joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

is_muted BOOLEAN DEFAULT FALSE,

PRIMARY KEY (conversation_id, user_id)

);

4.1.3 Mensagens

CREATE TABLE messages (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,

sender_id UUID REFERENCES users(id),

content TEXT,

content_type TEXT DEFAULT 'text',

is_deleted BOOLEAN DEFAULT FALSE,

replied_to_id UUID REFERENCES messages(id),

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

CREATE TABLE message_attachments (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

message_id UUID REFERENCES messages(id) ON DELETE CASCADE,

file_url TEXT NOT NULL,

file_type TEXT NOT NULL,

file_name TEXT,

file_size INTEGER,

thumbnail_url TEXT,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.4 Conteúdos Educacionais

CREATE TYPE content_type AS ENUM ('video', 'article', 'podcast', 'quiz', 'course', 'infographic');

CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'featured');

CREATE TABLE educational_contents (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

creator_id UUID REFERENCES users(id),

title TEXT NOT NULL,

description TEXT,

content_type content_type NOT NULL,

content_url TEXT,

thumbnail_url TEXT,

duration INTEGER, -- em segundos

tags TEXT[],

topics TEXT[],

difficulty_level TEXT,

status content_status DEFAULT 'draft',

price INTEGER DEFAULT 0, -- em orbit_coins

is_premium BOOLEAN DEFAULT FALSE,

views_count INTEGER DEFAULT 0,

likes_count INTEGER DEFAULT 0,

shares_count INTEGER DEFAULT 0,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

published_at TIMESTAMP WITH TIME ZONE,

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.5 Atividades de Gamificação

CREATE TABLE achievements (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT NOT NULL,

icon_url TEXT,

xp_reward INTEGER NOT NULL,

coin_reward INTEGER DEFAULT 0,

required_action TEXT,

required_count INTEGER DEFAULT 1,

is_limited_time BOOLEAN DEFAULT FALSE,

starts_at TIMESTAMP WITH TIME ZONE,

ends_at TIMESTAMP WITH TIME ZONE

);

CREATE TABLE user_achievements (

user_id UUID REFERENCES users(id) ON DELETE CASCADE,

achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,

achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

progress INTEGER DEFAULT 0,

PRIMARY KEY (user_id, achievement_id)

);

4.2 Índices e Otimizações

-- Índices para conversas e mensagens

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_conversations_participants ON conversation_participants(user_id);

-- Índices para conteúdo educacional

CREATE INDEX idx_content_creator ON educational_contents(creator_id);

CREATE INDEX idx_content_status ON educational_contents(status);

CREATE INDEX idx_content_type ON educational_contents(content_type);

-- Busca em texto completo para conteúdos

ALTER TABLE educational_contents ADD COLUMN search_vector tsvector;

CREATE INDEX content_search_idx ON educational_contents USING GIN(search_vector);

-- Trigger para atualizar o vetor de busca

CREATE FUNCTION content_search_update() RETURNS trigger AS $$

BEGIN

NEW.search_vector :=

setweight(to_tsvector('portuguese', NEW.title), 'A') ||

setweight(to_tsvector('portuguese', NEW.description), 'B') ||

setweight(to_tsvector('portuguese', array_to_string(NEW.tags, ' ')), 'C');

RETURN NEW;

END

$$ LANGUAGE plpgsql;

CREATE TRIGGER content_search_update_trigger

BEFORE INSERT OR UPDATE ON educational_contents

FOR EACH ROW EXECUTE FUNCTION content_search_update();

5. APIs e Endpoints

5.1 API de Autenticação

| Endpoint | Método | Descrição | |----------|--------|-----------| | /auth/register | POST | Registro de novo usuário | | /auth/login | POST | Login de usuário | | /auth/refresh-token | POST | Atualização de token | | /auth/logout | POST | Logout de usuário | | /auth/me | GET | Obter informações do usuário atual | | /auth/update-profile | PUT | Atualizar perfil do usuário |

5.2 API de Mensagens

| Endpoint | Método | Descrição | |----------|--------|-----------| | /conversations | GET | Listar conversas do usuário | | /conversations | POST | Criar nova conversa | | /conversations/:id | GET | Obter detalhes da conversa | | /conversations/:id/messages | GET | Listar mensagens da conversa | | /conversations/:id/messages | POST | Enviar mensagem | | /conversations/:id/participants | GET | Listar participantes | | /conversations/:id/participants | POST | Adicionar participante | | /calls/initiate | POST | Iniciar chamada de voz/vídeo | | /calls/:id/join | POST | Entrar em chamada | | /calls/:id/end | POST | Encerrar chamada |

5.3 API de Conteúdo Educacional

| Endpoint | Método | Descrição | |----------|--------|-----------| | /contents | GET | Listar conteúdos educacionais | | /contents | POST | Criar novo conteúdo | | /contents/:id | GET | Obter detalhes do conteúdo | | /contents/discover | GET | Descobrir conteúdos recomendados | | /contents/search | GET | Buscar conteúdos | | /contents/:id/like | POST | Curtir conteúdo | | /contents/:id/bookmark | POST | Salvar conteúdo na biblioteca | | /contents/trending | GET | Obter conteúdos em alta |

5.4 API de Gamificação

| Endpoint | Método | Descrição | |----------|--------|-----------| | /gamification/achievements | GET | Listar conquistas disponíveis | | /gamification/leaderboard | GET | Obter ranking de usuários | | /gamification/user/progress | GET | Obter progresso do usuário | | /gamification/rewards/claim | POST | Resgatar recompensa | | /gamification/daily-challenges | GET | Obter desafios diários |

5.5 API de Integração

| Endpoint | Método | Descrição | |----------|--------|-----------| | /integrate/ascend/price-content | POST | Precificar conteúdo via ASCEND | | /integrate/mionir/generate-contract | POST | Gerar contrato via MIONIR | | /integrate/dragdrop/create-landing | POST | Criar landing page via DRAGDROP |

6. Comunicação em Tempo Real

6.1 Canais WebSocket

| Canal | Descrição | |-------|-----------| | presence:user:{userId} | Canal de presença do usuário | | conversation:{conversationId} | Canal da conversa | | typing:{conversationId} | Canal de status de digitação | | call:{callId} | Canal de chamada | | notification:{userId} | Canal de notificações |

6.2 Eventos

| Evento | Descrição | Dados | |--------|-----------|-------| | message.new | Nova mensagem | { message, conversation_id, sender } | | message.update | Mensagem atualizada | { message_id, updates } | | conversation.new | Nova conversa | { conversation, participants } | | call.incoming | Chamada recebida | { call_id, caller, type } | | user.status | Mudança de status | { user_id, status, last_seen } | | notification | Nova notificação | { type, content, resource_id } |

7. Segurança

7.1 Autenticação e Autorização

JWT para autenticação de API

Autorização baseada em roles e permissões

Tokens de curta duração com refresh

Controle de acesso granular a recursos

7.2 Proteção de Dados

Criptografia de ponta a ponta para mensagens

Criptografia em trânsito (TLS/SSL)

Criptografia de dados sensíveis no banco

Políticas de retenção de dados

7.3 Privacidade

Configurações de visibilidade do perfil

Controles de compartilhamento de conteúdo

Opções de bloqueio e denúncia

Conformidade com LGPD

8. Integrações com o Ecossistema

8.1 Integração com ASCEND

Precificação de Conteúdo: Utilizar a calculadora de precificação do ASCEND para determinar valores de cursos, mentorias e conteúdos premium.

Gestão de Ativos Educacionais: Catalogar e gerenciar o valor dos conteúdos criados como ativos.

Métricas de Valor: Analisar o desempenho financeiro dos conteúdos educacionais.

8.2 Integração com MIONIR

Contratos para Criadores: Gerar contratos para criadores de conteúdo, mentores e parceiros.

Termos de Uso e Privacidade: Gerenciar termos de uso personalizados para diferentes tipos de conteúdo.

Gestão de Direitos Autorais: Proteger a propriedade intelectual dos criadores.

8.3 Integração com DRAGDROP

Perfis Públicos: Criar landing pages para perfis de criadores e mentores.

Páginas de Cursos: Desenvolver landing pages para cursos e eventos educacionais.

Promoção de Conteúdo: Gerar páginas promocionais para lançamentos de conteúdo premium.

9. Interface do Usuário

9.1 Telas Principais

9.1.1 Tela de Conversas

Lista de conversas recentes

Indicadores de não lido

Barra de pesquisa

Botão para nova conversa/grupo

9.1.2 Tela de Chat

Histórico de mensagens

Campo de entrada com anexos

Informações do contato/grupo

Botões para chamada

9.1.3 Feed de Conteúdo

Conteúdos recomendados

Seções por categoria

Conteúdos em alta

Filtros personalizados

9.1.4 Biblioteca de Conhecimento

Conteúdos salvos

Organização por pastas/tags

Notas e anotações

Progresso de aprendizado

9.1.5 Perfil e Conquistas

Estatísticas do usuário

Badges e conquistas

Nível e pontos

Histórico de atividades

9.2 Design System

Esquema de cores educacional e social

Tipografia clara e acessível

Iconografia consistente

Componentes reutilizáveis para diferentes contextos

10. Plano de Implementação

10.1 Fase 1: MVP (3 meses)

Sistema de mensagens básico (texto e imagens)

Feed de conteúdos educacionais

Perfis de usuário

Autenticação e segurança básica

Integração inicial com ASCEND para precificação

10.2 Fase 2: Expansão de Funcionalidades (3 meses)

Chamadas de voz e vídeo

Grupos e comunidades

Biblioteca pessoal

Sistema de gamificação básico

Integração com MIONIR para contratos

10.3 Fase 3: Funcionalidades Avançadas (3 meses)

Criação de conteúdo na plataforma

Mentorias e cursos ao vivo

Sistema de recompensas completo

Recursos avançados de privacidade

Integração completa com DRAGDROP

10.4 Fase 4: Otimização e Escala (3 meses)

Melhorias de performance

Análise avançada de dados

Algoritmos de recomendação refinados

Marketplace de conteúdo educacional

Expansão de integrações externas

11. Infraestrutura e Escalabilidade

11.1 Hospedagem e Deployment

Containers Docker para todos os serviços

Orquestração com Kubernetes

CI/CD automatizado com GitHub Actions

Ambientes de desenvolvimento, staging e produção

11.2 Escalabilidade

Escalabilidade horizontal para serviços de mensagens

Sharding de banco de dados para alta demanda

Caching com Redis para conteúdos frequentes

CDN para entrega de mídia

11.3 Monitoramento

Logging centralizado com ELK Stack

Métricas de performance com Prometheus

Alertas automatizados para incidentes

Dashboards operacionais com Grafana

12. Considerações Legais e Compliance

12.1 LGPD

Termos de uso claros

Política de privacidade detalhada

Opções de exportação de dados

Processos para exclusão de conta

12.2 Direitos Autorais

Sistema de detecção de plágio

Atribuição clara de autorias

Licenciamento de conteúdo flexível

Processo de denúncia de violações

13. Métricas e KPIs

13.1 Engajamento

DAU/MAU (usuários ativos diários/mensais)

Tempo médio na plataforma

Taxa de retenção

Mensagens enviadas por usuário

13.2 Educacional

Conteúdos consumidos por usuário

Taxa de conclusão de cursos

Tempo dedicado ao aprendizado

Diversidade de tópicos explorados

13.3 Monetização

Receita por usuário

Transações de moeda interna

Vendas de conteúdo premium

Conversão de usuários gratuitos para pagantes

Conclusão

O Orbit X representa uma inovação no campo da educação social, combinando o melhor das plataformas de mensageria com ferramentas educacionais interativas. Ao integrar-se ao ecossistema existente (ASCEND, MIONIR, DRAGDROP), o Orbit X se beneficiará de recursos já estabelecidos enquanto oferece uma nova dimensão de interatividade e aprendizado social.

Esta documentação técnica fornece um roteiro completo para o desenvolvimento e implementação do Orbit X, desde sua arquitetura até o modelo de dados, APIs e plano de implementação. Com este guia, as equipes de desenvolvimento poderão criar uma plataforma robusta que atenda às necessidades do público-alvo e realize a visão de um ambiente de microaprendizado social e interativo.

O sucesso do Orbit X dependerá da execução cuidadosa deste plano, com foco na experiência do usuário, performance técnica e integração perfeita com o ecossistema existente.