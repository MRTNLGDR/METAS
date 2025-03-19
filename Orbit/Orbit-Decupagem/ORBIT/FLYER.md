FLYER

1. Visão Geral do Projeto

FLYER é um sistema avançado de gestão de vendas e catálogos digitais projetado para transformar a maneira como empresas apresentam, promovem e vendem seus produtos e serviços. Funcionando como uma plataforma completa, o FLYER permite a criação de catálogos interativos, gestão de campanhas de vendas, acompanhamento de métricas de engajamento e conversão, além de integração total com o restante do ecossistema para uma experiência de venda omnichannel eficiente.

1.1 Objetivos Principais

Criar e gerenciar catálogos digitais interativos e personalizados

Automatizar o processo de vendas, desde a apresentação até o fechamento

Fornecer insights avançados sobre engajamento e conversão de clientes

Implementar estratégias de preço dinâmicas e personalizadas

Integrar-se perfeitamente com os sistemas ASCEND, STOCK, MIONIR e LOGX

Disponibilizar conteúdo de vendas para múltiplos canais e dispositivos

Aumentar a taxa de conversão e eficiência da equipe de vendas

1.2 Público-Alvo

Equipes de vendas e marketing

Gerentes comerciais e de produto

Representantes e agentes de venda

Clientes finais (B2B e B2C)

Parceiros de distribuição

Gestores de marca e conteúdo

Analistas de performance comercial

2. Arquitetura do Sistema

2.1 Diagrama de Arquitetura

┌─────────────────────────────────────────────────────────────────────┐

│ INTERFACES DE USUÁRIO │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Dashboard │ │ Editor de │ │ Portal de │ │ App para │ │

│ │ Comercial │ │ Catálogos │ │ Vendas │ │ Vendedores │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE SERVIÇOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Gestão de │ │ Engine de │ │ Campanhas │ │ Analytics de │ │

│ │ Catálogos │ │ Preços │ │ & Promoções│ │ Vendas │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Gestão de │ │ Pipeline │ │ Sistema de │ │ Gerenciador │ │

│ │ Mídia │ │ de Vendas │ │ Propostas │ │ de Conteúdo │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ INTEGRAÇÕES E SERVIÇOS EXTERNOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Integração │ │ Integração │ │ Integração │ │ Integração │ │

│ │ com ASCEND │ │ com STOCK │ │ com LOGX │ │ com MIONIR │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Integração │ │ eCommerce │ │ Gateways de│ │ Serviços de │ │

│ │ com CORE │ │ Connectors │ │ Pagamento │ │ Marketing │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE DADOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Banco de │ │ Armazenam. │ │ Cache │ │ Armazenamento │ │

│ │ Dados │ │ de Mídia │ │ Distribuído│ │ Analítico │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

2.2 Tecnologias Principais

Frontend: React, React Native (mobile), Next.js para SSR

Backend: Node.js, NestJS, GraphQL

Banco de Dados: PostgreSQL, MongoDB (para conteúdo)

Armazenamento de Mídia: AWS S3, Cloudinary

Cache: Redis, Memcached

Analytics: Elasticsearch, Kibana, Google Analytics

Tempo Real: Socket.IO, WebSockets

Processamento de Mídia: ImageMagick, FFmpeg, Sharp

Serviços em Nuvem: AWS (S3, CloudFront, Lambda)

CDN: Cloudflare, AWS CloudFront

3. Módulos e Funcionalidades

3.1 Gestão de Catálogos

3.1.1 Editor de Catálogos

Interface drag-and-drop para criação de layouts

Templates pré-configurados para diferentes setores

Gerenciamento de seções e categorias

Personalização de cores, fontes e estilos

Versões responsivas para web e mobile

Suporte para múltiplos idiomas e moedas

3.1.2 Gerenciamento de Produtos

Importação automática de produtos do STOCK

Categorização hierárquica flexível

Gestão de variantes e opções de produtos

Atributos customizáveis por categoria

Relacionamento entre produtos (cross-sell, up-sell)

Controle de visibilidade e disponibilidade

3.1.3 Publicação e Distribuição

Controle de versões e rascunhos

Agendamento de publicações

Distribuição para múltiplos canais

Geração automática de PDF para impressão

QR codes para acesso a versões digitais

Compartilhamento via link, email ou redes sociais

3.2 Engine de Preços e Promoções

3.2.1 Políticas de Preço

Sincronização com preços do ASCEND

Tabelas de preço por segmento de cliente

Preços personalizados por região

Regras de arredondamento e formatação

Histórico de alterações de preço

Previsão de impacto de mudanças de preço

3.2.2 Promoções e Descontos

Motor de regras para criação de promoções

Descontos por volume, temporada ou cliente

Promoções condicionais (compre X, leve Y)

Cupons e códigos promocionais

Limitações por período ou quantidade

Compatibilidade entre promoções

3.2.3 Preços Dinâmicos

Ajustes automáticos baseados em demanda

Monitoramento de preços da concorrência

Preços personalizados baseados em comportamento

A/B testing de diferentes estratégias

Machine learning para otimização

API para integração com algoritmos externos

3.3 Gestão de Mídia e Conteúdo

3.3.1 Biblioteca de Mídia

Repositório centralizado de imagens, vídeos e arquivos

Upload em massa e organização em coleções

Tagging automático e reconhecimento de conteúdo

Conversão automática de formatos e resizing

Otimização para diferentes dispositivos e velocidades

Controle de versões e histórico de uso

3.3.2 Conteúdo Rich Media

Suporte para vídeos, animações e 3D

Tours virtuais e visualização 360°

Conteúdo interativo e realidade aumentada

Demonstrações interativas de produtos

Integração com recursos de CORP para visualização 3D

Análise de engajamento por tipo de mídia

3.3.3 Gerenciamento de Conteúdo

Blocos de conteúdo reutilizáveis

Descrições de produto enriquecidas

Especificações técnicas estruturadas

Tradução e localização de conteúdo

Workflows de aprovação e revisão

SEO automático para conteúdo digital

3.4 Pipeline de Vendas

3.4.1 Gestão de Oportunidades

Acompanhamento completo do funil de vendas

Classificação de leads e oportunidades

Histórico de interações e próximos passos

Atribuição automática baseada em regras

Previsão de vendas e probabilidade de fechamento

Integrações com CRM e LOGX

3.4.2 Ferramentas para Vendedores

Apresentações interativas e guiadas

Cálculos e simulações em tempo real

Check-in em clientes e registro de visitas

Histórico completo de interações

Recomendações inteligentes para cross-sell

Modo offline com sincronização posterior

3.4.3 Automação de Vendas

Sequências automatizadas de follow-up

Alertas para oportunidades em risco

Recomendações baseadas em comportamento

Lembretes inteligentes para ações

Escalação automática de casos especiais

Workflows configuráveis para processos de venda

3.5 Sistema de Propostas

3.5.1 Gerador de Propostas

Templates personalizáveis

Inclusão dinâmica de produtos do catálogo

Cálculo automático de preços e descontos

Campos personalizados por tipo de proposta

Versionamento e comparação de propostas

Integração com MIONIR para contratos

3.5.2 Colaboração e Aprovação

Edição colaborativa em tempo real

Workflow de aprovação configurável

Comentários e sugestões de mudanças

Histórico de revisões e alterações

Níveis de aprovação baseados em valores

Notificações por email e no app

3.5.3 Envio e Acompanhamento

Múltiplas opções de envio (email, link, PDF)

Rastreamento de visualizações e interações

Tempo gasto em cada seção da proposta

Alertas para propostas vistas e não respondidas

Analytics avançado de conversão

Feedback dos clientes (aceites, rejeições, dúvidas)

3.6 Analytics de Vendas

3.6.1 Dashboards e Relatórios

Visão consolidada de KPIs de vendas

Análise de funil de conversão

Desempenho por produto, categoria e vendedor

Tendências e sazonalidade

Comparativos com períodos anteriores

Exportação e compartilhamento de relatórios

3.6.2 Insights de Catálogo

Produtos mais visualizados e convertidos

Análise de engajamento por conteúdo

Tempo de permanência por página

Padrões de navegação e dropoffs

Conteúdo mais compartilhado e salvo

Correlações entre visualizações e vendas

3.6.3 Análise Preditiva

Previsão de vendas baseada em tendências

Recomendações de produtos por segmento

Detecção de oportunidades de cross-sell

Alertas antecipados para problemas de conversão

Identificação de clientes em risco

Modelos de propensão a compra

4. Modelo de Dados

4.1 Entidades Principais

4.1.1 Catálogos (Catalogs)

CREATE TABLE catalogs (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

version VARCHAR(50),

status VARCHAR(50) NOT NULL DEFAULT 'draft',

published_at TIMESTAMP WITH TIME ZONE,

expires_at TIMESTAMP WITH TIME ZONE,

template_id UUID,

thumbnail_url TEXT,

settings JSONB NOT NULL DEFAULT '{}',

is_featured BOOLEAN DEFAULT FALSE,

visibility VARCHAR(50) DEFAULT 'public',

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

organization_id UUID,

languages TEXT[] DEFAULT ARRAY['pt-BR'],

categories TEXT[],

tags TEXT[],

metadata JSONB

);

CREATE TABLE catalog_sections (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

catalog_id UUID REFERENCES catalogs(id) ON DELETE CASCADE,

name TEXT NOT NULL,

description TEXT,

layout_type VARCHAR(50) NOT NULL,

position INTEGER NOT NULL,

settings JSONB NOT NULL DEFAULT '{}',

content JSONB,

is_visible BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

CREATE TABLE catalog_products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

catalog_id UUID REFERENCES catalogs(id) ON DELETE CASCADE,

product_id UUID NOT NULL,

section_id UUID REFERENCES catalog_sections(id),

position INTEGER,

price_override NUMERIC(15,2),

custom_description TEXT,

is_featured BOOLEAN DEFAULT FALSE,

is_visible BOOLEAN DEFAULT TRUE,

custom_attributes JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.2 Produtos e Categorias (Products & Categories)

CREATE TABLE product_categories (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

parent_id UUID REFERENCES product_categories(id),

slug TEXT NOT NULL UNIQUE,

thumbnail_url TEXT,

position INTEGER,

attributes_schema JSONB,

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

metadata JSONB

);

CREATE TABLE products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

sku TEXT NOT NULL UNIQUE,

name TEXT NOT NULL,

description TEXT,

short_description TEXT,

category_id UUID REFERENCES product_categories(id),

base_price NUMERIC(15,2) NOT NULL,

cost_price NUMERIC(15,2),

currency VARCHAR(3) DEFAULT 'BRL',

stock_status VARCHAR(50),

stock_id UUID,

weight NUMERIC(10,2),

dimensions JSONB,

features JSONB,

attributes JSONB,

is_active BOOLEAN DEFAULT TRUE,

is_featured BOOLEAN DEFAULT FALSE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

tags TEXT[],

seo_metadata JSONB,

related_products UUID[],

metadata JSONB

);

CREATE TABLE product_variants (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

sku TEXT NOT NULL UNIQUE,

name TEXT NOT NULL,

attributes JSONB NOT NULL,

price_adjustment NUMERIC(15,2) DEFAULT 0,

stock_status VARCHAR(50),

stock_id UUID,

thumbnail_url TEXT,

is_default BOOLEAN DEFAULT FALSE,

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.3 Mídia (Media)

CREATE TABLE media_items (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

media_type VARCHAR(50) NOT NULL,

file_url TEXT NOT NULL,

file_size INTEGER,

content_type VARCHAR(255),

dimensions JSONB,

duration INTEGER,

alt_text TEXT,

tags TEXT[],

is_public BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

organization_id UUID,

metadata JSONB

);

CREATE TABLE product_media (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

media_id UUID REFERENCES media_items(id) ON DELETE CASCADE,

position INTEGER,

media_type VARCHAR(50) DEFAULT 'image',

is_primary BOOLEAN DEFAULT FALSE,

metadata JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.4 Preços e Promoções (Prices & Promotions)

CREATE TABLE price_lists (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

currency VARCHAR(3) DEFAULT 'BRL',

is_default BOOLEAN DEFAULT FALSE,

is_active BOOLEAN DEFAULT TRUE,

valid_from TIMESTAMP WITH TIME ZONE,

valid_to TIMESTAMP WITH TIME ZONE,

customer_segments TEXT[],

regions TEXT[],

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

metadata JSONB

);

CREATE TABLE product_prices (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,

price_list_id UUID REFERENCES price_lists(id) ON DELETE CASCADE,

price NUMERIC(15,2) NOT NULL,

compare_at_price NUMERIC(15,2),

min_quantity INTEGER DEFAULT 1,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

UNIQUE (product_id, variant_id, price_list_id, min_quantity)

);

CREATE TABLE promotions (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

promotion_type VARCHAR(50) NOT NULL,

value NUMERIC(15,2),

value_type VARCHAR(20) NOT NULL,

code TEXT,

usage_limit INTEGER,

usage_count INTEGER DEFAULT 0,

min_order_value NUMERIC(15,2),

stackable BOOLEAN DEFAULT FALSE,

valid_from TIMESTAMP WITH TIME ZONE NOT NULL,

valid_to TIMESTAMP WITH TIME ZONE,

is_active BOOLEAN DEFAULT TRUE,

conditions JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

metadata JSONB

);

CREATE TABLE promotion_products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.5 Propostas e Vendas (Proposals & Sales)

CREATE TABLE sales_opportunities (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

customer_id UUID NOT NULL,

estimated_value NUMERIC(15,2),

currency VARCHAR(3) DEFAULT 'BRL',

stage VARCHAR(50) NOT NULL,

probability INTEGER,

expected_close_date DATE,

source VARCHAR(50),

owner_id UUID,

notes TEXT,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

closed_at TIMESTAMP WITH TIME ZONE,

status VARCHAR(50) NOT NULL DEFAULT 'open',

reason TEXT,

tags TEXT[],

metadata JSONB

);

CREATE TABLE proposals (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

opportunity_id UUID REFERENCES sales_opportunities(id),

customer_id UUID NOT NULL,

template_id UUID,

status VARCHAR(50) NOT NULL DEFAULT 'draft',

total_value NUMERIC(15,2),

currency VARCHAR(3) DEFAULT 'BRL',

valid_until DATE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

sent_at TIMESTAMP WITH TIME ZONE,

viewed_at TIMESTAMP WITH TIME ZONE,

responded_at TIMESTAMP WITH TIME ZONE,

response TEXT,

created_by UUID,

approved_by UUID,

approval_date TIMESTAMP WITH TIME ZONE,

version INTEGER DEFAULT 1,

custom_fields JSONB,

metadata JSONB

);

CREATE TABLE proposal_items (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,

product_id UUID,

variant_id UUID,

name TEXT NOT NULL,

description TEXT,

quantity INTEGER NOT NULL DEFAULT 1,

unit_price NUMERIC(15,2) NOT NULL,

discount_amount NUMERIC(15,2) DEFAULT 0,

discount_percentage NUMERIC(5,2) DEFAULT 0,

tax_percentage NUMERIC(5,2) DEFAULT 0,

total_price NUMERIC(15,2) NOT NULL,

position INTEGER,

options JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.2 Índices e Otimizações

-- Índices para catálogos

CREATE INDEX idx_catalogs_status ON catalogs(status);

CREATE INDEX idx_catalogs_published_at ON catalogs(published_at);

CREATE INDEX idx_catalogs_created_by ON catalogs(created_by);

CREATE INDEX idx_catalogs_organization ON catalogs(organization_id);

CREATE INDEX idx_catalog_sections_catalog ON catalog_sections(catalog_id);

CREATE INDEX idx_catalog_products_catalog ON catalog_products(catalog_id);

CREATE INDEX idx_catalog_products_product ON catalog_products(product_id);

-- Índices para produtos e categorias

CREATE INDEX idx_products_category ON products(category_id);

CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_products_active ON products(is_active);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);

CREATE INDEX idx_product_variants_sku ON product_variants(sku);

CREATE INDEX idx_product_categories_parent ON product_categories(parent_id);

CREATE INDEX idx_product_categories_slug ON product_categories(slug);

-- Índices para mídia

CREATE INDEX idx_media_items_type ON media_items(media_type);

CREATE INDEX idx_media_items_created_by ON media_items(created_by);

CREATE INDEX idx_media_items_organization ON media_items(organization_id);

CREATE INDEX idx_product_media_product ON product_media(product_id);

CREATE INDEX idx_product_media_media ON product_media(media_id);

CREATE INDEX idx_product_media_primary ON product_media(product_id, is_primary);

-- Índices para preços e promoções

CREATE INDEX idx_price_lists_active ON price_lists(is_active);

CREATE INDEX idx_price_lists_valid ON price_lists(valid_from, valid_to);

CREATE INDEX idx_product_prices_product ON product_prices(product_id);

CREATE INDEX idx_product_prices_price_list ON product_prices(price_list_id);

CREATE INDEX idx_promotions_active ON promotions(is_active);

CREATE INDEX idx_promotions_valid ON promotions(valid_from, valid_to);

CREATE INDEX idx_promotions_code ON promotions(code);

CREATE INDEX idx_promotion_products_promotion ON promotion_products(promotion_id);

CREATE INDEX idx_promotion_products_product ON promotion_products(product_id);

-- Índices para propostas e vendas

CREATE INDEX idx_sales_opportunities_customer ON sales_opportunities(customer_id);

CREATE INDEX idx_sales_opportunities_owner ON sales_opportunities(owner_id);

CREATE INDEX idx_sales_opportunities_stage ON sales_opportunities(stage);

CREATE INDEX idx_sales_opportunities_status ON sales_opportunities(status);

CREATE INDEX idx_proposals_opportunity ON proposals(opportunity_id);

CREATE INDEX idx_proposals_customer ON proposals(customer_id);

CREATE INDEX idx_proposals_status ON proposals(status);

CREATE INDEX idx_proposals_created_by ON proposals(created_by);

CREATE INDEX idx_proposal_items_proposal ON proposal_items(proposal_id);

CREATE INDEX idx_proposal_items_product ON proposal_items(product_id);

5. APIs e Endpoints

5.1 API de Catálogos

| Endpoint | Método | Descrição | |----------|--------|-----------| | /catalogs | GET | Listar catálogos com filtros | | /catalogs | POST | Criar novo catálogo | | /catalogs/:id | GET | Obter detalhes do catálogo | | /catalogs/:id | PUT | Atualizar catálogo | | /catalogs/:id/publish | POST | Publicar catálogo | | /catalogs/:id/unpublish | POST | Despublicar catálogo | | /catalogs/:id/duplicate | POST | Duplicar catálogo existente | | /catalogs/:id/sections | GET | Listar seções do catálogo | | /catalogs/:id/sections | POST | Adicionar seção ao catálogo | | /catalogs/:id/sections/:sectionId | PUT | Atualizar seção | | /catalogs/:id/products | GET | Listar produtos do catálogo | | /catalogs/:id/products | POST | Adicionar produto ao catálogo | | /catalogs/:id/export | GET | Exportar catálogo (PDF, HTML) | | /catalogs/:id/analytics | GET | Métricas de engajamento do catálogo |

5.2 API de Produtos

| Endpoint | Método | Descrição | |----------|--------|-----------| | /products | GET | Listar produtos com filtros | | /products | POST | Criar novo produto | | /products/:id | GET | Obter detalhes do produto | | /products/:id | PUT | Atualizar produto | | /products/:id/variants | GET | Listar variantes do produto | | /products/:id/variants | POST | Adicionar variante ao produto | | /products/:id/variants/:variantId | PUT | Atualizar variante | | /products/:id/media | GET | Listar mídia do produto | | /products/:id/media | POST | Adicionar mídia ao produto | | /products/:id/related | GET | Produtos relacionados | | /products/:id/prices | GET | Preços em diferentes listas | | /products/:id/prices | POST | Definir preço em lista específica | | /products/categories | GET | Listar categorias de produtos | | /products/categories | POST | Criar nova categoria | | /products/import | POST | Importar produtos em massa |

5.3 API de Mídia

| Endpoint | Método | Descrição | |----------|--------|-----------| | /media | GET | Listar itens de mídia com filtros | | /media | POST | Fazer upload de novo item de mídia | | /media/:id | GET | Obter detalhes do item de mídia | | /media/:id | PUT | Atualizar metadados do item | | /media/:id | DELETE | Remover item de mídia | | /media/batch | POST | Upload em massa de itens | | /media/transform/:id | POST | Transformar item de mídia | | /media/search | GET | Buscar itens por tags, metadata | | /media/usage/:id | GET | Ver onde o item é usado | | /media/collections | GET | Listar coleções de mídia | | /media/collections | POST | Criar nova coleção | | /media/collections/:id/items | GET | Itens na coleção | | /media/collections/:id/items | POST | Adicionar itens à coleção |

5.4 API de Preços e Promoções

| Endpoint | Método | Descrição | |----------|--------|-----------| | /price-lists | GET | Listar tabelas de preço | | /price-lists | POST | Criar nova tabela de preço | | /price-lists/:id | GET | Obter detalhes da tabela | | /price-lists/:id | PUT | Atualizar tabela de preço | | /price-lists/:id/prices | GET | Listar preços na tabela | | /price-lists/:id/prices | POST | Adicionar preço à tabela | | /price-lists/:id/prices/bulk | POST | Atualizar preços em massa | | /price-lists/:id/import | POST | Importar preços de arquivo | | /price-lists/:id/export | GET | Exportar tabela de preços | | /promotions | GET | Listar promoções ativas | | /promotions | POST | Criar nova promoção | | /promotions/:id | GET | Obter detalhes da promoção | | /promotions/:id | PUT | Atualizar promoção | | /promotions/:id/products | GET | Produtos na promoção | | /promotions/:id/products | POST | Adicionar produtos à promoção | | /promotions/validate | POST | Validar código promocional |

5.5 API de Vendas e Propostas

| Endpoint | Método | Descrição | |----------|--------|-----------| | /opportunities | GET | Listar oportunidades de venda | | /opportunities | POST | Criar nova oportunidade | | /opportunities/:id | GET | Obter detalhes da oportunidade | | /opportunities/:id | PUT | Atualizar oportunidade | | /opportunities/:id/stage | PATCH | Atualizar estágio da oportunidade | | /opportunities/:id/close | POST | Fechar oportunidade (ganho/perda) | | /opportunities/:id/reopen | POST | Reabrir oportunidade fechada | | /opportunities/:id/activities | GET | Histórico de atividades | | /opportunities/:id/activities | POST | Registrar nova atividade | | /proposals | GET | Listar propostas | | /proposals | POST | Criar nova proposta | | /proposals/:id | GET | Obter detalhes da proposta | | /proposals/:id | PUT | Atualizar proposta | | /proposals/:id/items | GET | Listar itens da proposta | | /proposals/:id/items | POST | Adicionar item à proposta | | /proposals/:id/send | POST | Enviar proposta ao cliente | | /proposals/:id/approve | POST | Aprovar proposta internamente | | /proposals/:id/convert | POST | Converter em contrato (MIONIR) | | /proposals/:id/export | GET | Exportar proposta (PDF) | | /templates/proposals | GET | Listar templates de proposta | | /templates/proposals | POST | Criar novo template |

5.6 API de Analytics

| Endpoint | Método | Descrição | |----------|--------|-----------| | /analytics/products/views | GET | Produtos mais visualizados | | /analytics/products/conversion | GET | Taxa de conversão por produto | | /analytics/catalogs/engagement | GET | Engajamento por catálogo | | /analytics/sales/funnel | GET | Funil de vendas | | /analytics/sales/performance | GET | Performance por vendedor/região | | /analytics/sales/forecast | GET | Previsão de vendas | | /analytics/promotions/impact | GET | Impacto de promoções | | /analytics/proposals/conversion | GET | Taxa de conversão de propostas | | /analytics/heatmaps/:catalogId | GET | Heatmaps de interação | | /analytics/reports/:type | GET | Relatórios pré-configurados | | /analytics/dashboards | GET | Dashboards disponíveis | | /analytics/dashboards/:id | GET | Dados do dashboard |

6. Comunicação em Tempo Real

6.1 Canais de Evento

| Canal | Descrição | |-------|-----------| | catalog.published | Catálogo publicado ou atualizado | | product.updated | Produto atualizado no catálogo | | price.changed | Alteração de preços | | promotion.started | Nova promoção iniciada | | promotion.ended | Promoção finalizada | | proposal.viewed | Proposta visualizada pelo cliente | | proposal.commented | Comentário adicionado à proposta | | opportunity.stage_changed | Mudança de estágio da oportunidade | | catalog.viewed | Catálogo visualizado por cliente | | product.viewed | Produto visualizado por cliente |

6.2 Padrões de Evento

| Evento | Descrição | Dados | |--------|-----------|-------| | catalog.status.changed | Mudança de status do catálogo | { catalog_id, previous_status, new_status, user_id, timestamp } | | product.visited | Produto visitado no catálogo | { product_id, catalog_id, session_id, customer_id, timestamp, referrer, time_spent } | | proposal.status.changed | Mudança de status da proposta | { proposal_id, previous_status, new_status, user_id, timestamp, comments } | | price.updated | Atualização de preço | { product_id, price_list_id, previous_price, new_price, updated_by, timestamp } | | media.added | Mídia adicionada a produto/catálogo | { media_id, entity_type, entity_id, user_id, timestamp } | | opportunity.created | Nova oportunidade criada | { opportunity_id, customer_id, estimated_value, stage, created_by, timestamp } |

7. Integração com o Ecossistema

7.1 Integração com ASCEND

Sincronização de preços e políticas de precificação

Importação automática de valores calculados na calculadora

Uso de templates de precificação por segmento

Aplicação de margens e multiplicadores personalizados

Inteligência de preços para estratégias competitivas

7.2 Integração com STOCK

Importação automática de produtos e categorias

Verificação de disponibilidade em tempo real

Atualização automática de estoque após vendas

Alerta para produtos em baixa quantidade

Sincronização de informações e especificações

7.3 Integração com LOGX

Compartilhamento de perfis e interesses de clientes

Histórico unificado de interações e pedidos

Segmentação de clientes para catálogos personalizados

Alertas para oportunidades de up-sell e cross-sell

Feedback e satisfação de clientes

7.4 Integração com MIONIR

Conversão automática de propostas em contratos

Inclusão de termos contratuais e legais nas propostas

Validação de conformidade das propostas com contratos padrão

Histórico de contratos para referência em novas propostas

Monitoramento de SLAs e obrigações contratuais

7.5 Integração com CORE

Autenticação e autorização centralizada

Notificações e alertas cross-platform

Armazenamento e busca de dados

Analytics consolidado e relatórios

Compartilhamento de eventos entre sistemas

8. Interface do Usuário

8.1 Dashboard Comercial

KPIs de vendas e conversão

Pipeline visual de oportunidades

Alertas e notificações

Ranking de produtos e vendedores

Previsões e metas

8.2 Editor de Catálogos

Interface drag-and-drop

Visualização em tempo real

Templates pré-configurados

Controles de layout responsivo

Ferramentas de design e estilo

8.3 Portal de Vendas

Apresentação personalizada para clientes

Ferramentas de configuração de produtos

Simulação de preços e orçamentos

Compartilhamento e colaboração

Tracking de interações

8.4 App para Vendedores

Catálogos e materiais offline

Ferramentas de apresentação

Registro de visitas e atividades

Geração rápida de propostas

Analytics de desempenho pessoal

9. Segurança

9.1 Autenticação e Autorização

Autenticação via SSO integrada ao CORE

RBAC (Role Based Access Control)

Controle de acesso por cliente/segmento

Proteção de preços e condições especiais

Auditoria de acessos e ações

9.2 Segurança de Dados

Criptografia de dados sensíveis

Proteção de propriedade intelectual

Marcas d'água digitais em conteúdo sensível

Controle de versões e histórico de alterações

Backup automático de catálogos e propostas

9.3 Privacidade

Conformidade com LGPD

Gerenciamento de consentimentos

Anonimização de dados para analytics

Políticas de retenção de dados

Exportação e exclusão de dados pessoais

10. Plano de Implementação

10.1 Fase 1: Fundação (3 meses)

Sistema básico de catálogos e produtos

Editor de catálogos com templates básicos

Integração inicial com STOCK para produtos

Visualização de catálogos em dispositivos

Gestão básica de mídia e conteúdo

10.2 Fase 2: Preços e Vendas (3 meses)

Engine completo de preços e promoções

Sistema de propostas e oportunidades

Integração com ASCEND para precificação

App básico para vendedores

Analytics inicial de engajamento

10.3 Fase 3: Integração Avançada (3 meses)

Integrações completas com o ecossistema

Pipeline de vendas avançado

Recursos colaborativos para propostas

Preços dinâmicos e personalizados

Analytics avançado e dashboards

10.4 Fase 4: Experiência Aprimorada (3 meses)

Conteúdo interativo e rich media

Machine learning para recomendações

App avançado para vendedores com IA

Personalização avançada por cliente

Automação de processos de venda

11. Métricas e KPIs

11.1 Métricas de Catálogo

Visualizações por catálogo e produto

Tempo médio de engajamento

Taxa de compartilhamento

Conversão de visualização para interesse

Efetividade de diferentes tipos de mídia

11.2 Métricas de Vendas

Taxa de conversão de propostas

Ciclo de vendas (tempo até fechamento)

Valor médio de proposta

Margem média por venda

Eficiência por vendedor/região

11.3 Métricas de Engajamento

Taxa de abertura de catálogos

Tempo gasto por seção

Retorno a produtos/seções

Interação com elementos interativos

Feedback e respostas de clientes

12. Considerações Futuras

12.1 Expansão de Funcionalidades

Configuradores 3D de produtos complexos

Realidade aumentada para visualização

Chatbots e assistentes de vendas com IA

Personalização dinâmica baseada em comportamento

Integração com marketplaces e e-commerce

12.2 Evolução Tecnológica

Machine learning para previsão de vendas

Computer vision para análise de engajamento

Processamento de linguagem natural para feedback

Algoritmos avançados de precificação dinâmica

Blockchain para verificação de autenticidade

Conclusão

O FLYER representa uma solução completa para a transformação digital dos processos de vendas e marketing, permitindo que as empresas criem, distribuam e monetizem catálogos digitais interativos de forma eficiente. Ao integrar perfeitamente com os outros sistemas do ecossistema, o FLYER cria uma experiência de venda omnichannel coesa, onde dados e processos fluem naturalmente entre os diferentes estágios do relacionamento com o cliente.

Esta documentação técnica estabelece as bases para a implementação e operação do FLYER, delineando sua arquitetura, componentes e funcionalidades. Seguindo esta especificação, as equipes de desenvolvimento poderão construir uma plataforma robusta que atenderá às necessidades crescentes de vendas e marketing digital, proporcionando uma experiência de engajamento superior para clientes e uma ferramenta poderosa para equipes comerciais.

A abordagem modular e escalável do FLYER garante que a plataforma possa evoluir para atender às mudanças do mercado e às necessidades emergentes dos usuários, mantendo-se na vanguarda das soluções de venda e catálogos digitais.

Vou continuar com a documentação do próximo sistema da lista: FLYER (Sistema de Gestão de Vendas e Catálogos).

Documentação Técnica - FLYER

1. Visão Geral do Projeto

FLYER é um sistema avançado de gestão de vendas e catálogos digitais projetado para transformar a maneira como empresas apresentam, promovem e vendem seus produtos e serviços. Funcionando como uma plataforma completa, o FLYER permite a criação de catálogos interativos, gestão de campanhas de vendas, acompanhamento de métricas de engajamento e conversão, além de integração total com o restante do ecossistema para uma experiência de venda omnichannel eficiente.

1.1 Objetivos Principais

Criar e gerenciar catálogos digitais interativos e personalizados

Automatizar o processo de vendas, desde a apresentação até o fechamento

Fornecer insights avançados sobre engajamento e conversão de clientes

Implementar estratégias de preço dinâmicas e personalizadas

Integrar-se perfeitamente com os sistemas ASCEND, STOCK, MIONIR e LOGX

Disponibilizar conteúdo de vendas para múltiplos canais e dispositivos

Aumentar a taxa de conversão e eficiência da equipe de vendas

1.2 Público-Alvo

Equipes de vendas e marketing

Gerentes comerciais e de produto

Representantes e agentes de venda

Clientes finais (B2B e B2C)

Parceiros de distribuição

Gestores de marca e conteúdo

Analistas de performance comercial

2. Arquitetura do Sistema

2.1 Diagrama de Arquitetura

┌─────────────────────────────────────────────────────────────────────┐

│ INTERFACES DE USUÁRIO │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Dashboard │ │ Editor de │ │ Portal de │ │ App para │ │

│ │ Comercial │ │ Catálogos │ │ Vendas │ │ Vendedores │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE SERVIÇOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Gestão de │ │ Engine de │ │ Campanhas │ │ Analytics de │ │

│ │ Catálogos │ │ Preços │ │ & Promoções│ │ Vendas │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Gestão de │ │ Pipeline │ │ Sistema de │ │ Gerenciador │ │

│ │ Mídia │ │ de Vendas │ │ Propostas │ │ de Conteúdo │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ INTEGRAÇÕES E SERVIÇOS EXTERNOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Integração │ │ Integração │ │ Integração │ │ Integração │ │

│ │ com ASCEND │ │ com STOCK │ │ com LOGX │ │ com MIONIR │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Integração │ │ eCommerce │ │ Gateways de│ │ Serviços de │ │

│ │ com CORE │ │ Connectors │ │ Pagamento │ │ Marketing │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

│

┌─────────────────────────────────────────────────────────────────────┐

│ CAMADA DE DADOS │

│ │

│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐ │

│ │ Banco de │ │ Armazenam. │ │ Cache │ │ Armazenamento │ │

│ │ Dados │ │ de Mídia │ │ Distribuído│ │ Analítico │ │

│ └────────────┘ └────────────┘ └────────────┘ └────────────────┘ │

└─────────────────────────────────────────────────────────────────────┘

2.2 Tecnologias Principais

Frontend: React, React Native (mobile), Next.js para SSR

Backend: Node.js, NestJS, GraphQL

Banco de Dados: PostgreSQL, MongoDB (para conteúdo)

Armazenamento de Mídia: AWS S3, Cloudinary

Cache: Redis, Memcached

Analytics: Elasticsearch, Kibana, Google Analytics

Tempo Real: Socket.IO, WebSockets

Processamento de Mídia: ImageMagick, FFmpeg, Sharp

Serviços em Nuvem: AWS (S3, CloudFront, Lambda)

CDN: Cloudflare, AWS CloudFront

3. Módulos e Funcionalidades

3.1 Gestão de Catálogos

3.1.1 Editor de Catálogos

Interface drag-and-drop para criação de layouts

Templates pré-configurados para diferentes setores

Gerenciamento de seções e categorias

Personalização de cores, fontes e estilos

Versões responsivas para web e mobile

Suporte para múltiplos idiomas e moedas

3.1.2 Gerenciamento de Produtos

Importação automática de produtos do STOCK

Categorização hierárquica flexível

Gestão de variantes e opções de produtos

Atributos customizáveis por categoria

Relacionamento entre produtos (cross-sell, up-sell)

Controle de visibilidade e disponibilidade

3.1.3 Publicação e Distribuição

Controle de versões e rascunhos

Agendamento de publicações

Distribuição para múltiplos canais

Geração automática de PDF para impressão

QR codes para acesso a versões digitais

Compartilhamento via link, email ou redes sociais

3.2 Engine de Preços e Promoções

3.2.1 Políticas de Preço

Sincronização com preços do ASCEND

Tabelas de preço por segmento de cliente

Preços personalizados por região

Regras de arredondamento e formatação

Histórico de alterações de preço

Previsão de impacto de mudanças de preço

3.2.2 Promoções e Descontos

Motor de regras para criação de promoções

Descontos por volume, temporada ou cliente

Promoções condicionais (compre X, leve Y)

Cupons e códigos promocionais

Limitações por período ou quantidade

Compatibilidade entre promoções

3.2.3 Preços Dinâmicos

Ajustes automáticos baseados em demanda

Monitoramento de preços da concorrência

Preços personalizados baseados em comportamento

A/B testing de diferentes estratégias

Machine learning para otimização

API para integração com algoritmos externos

3.3 Gestão de Mídia e Conteúdo

3.3.1 Biblioteca de Mídia

Repositório centralizado de imagens, vídeos e arquivos

Upload em massa e organização em coleções

Tagging automático e reconhecimento de conteúdo

Conversão automática de formatos e resizing

Otimização para diferentes dispositivos e velocidades

Controle de versões e histórico de uso

3.3.2 Conteúdo Rich Media

Suporte para vídeos, animações e 3D

Tours virtuais e visualização 360°

Conteúdo interativo e realidade aumentada

Demonstrações interativas de produtos

Integração com recursos de CORP para visualização 3D

Análise de engajamento por tipo de mídia

3.3.3 Gerenciamento de Conteúdo

Blocos de conteúdo reutilizáveis

Descrições de produto enriquecidas

Especificações técnicas estruturadas

Tradução e localização de conteúdo

Workflows de aprovação e revisão

SEO automático para conteúdo digital

3.4 Pipeline de Vendas

3.4.1 Gestão de Oportunidades

Acompanhamento completo do funil de vendas

Classificação de leads e oportunidades

Histórico de interações e próximos passos

Atribuição automática baseada em regras

Previsão de vendas e probabilidade de fechamento

Integrações com CRM e LOGX

3.4.2 Ferramentas para Vendedores

Apresentações interativas e guiadas

Cálculos e simulações em tempo real

Check-in em clientes e registro de visitas

Histórico completo de interações

Recomendações inteligentes para cross-sell

Modo offline com sincronização posterior

3.4.3 Automação de Vendas

Sequências automatizadas de follow-up

Alertas para oportunidades em risco

Recomendações baseadas em comportamento

Lembretes inteligentes para ações

Escalação automática de casos especiais

Workflows configuráveis para processos de venda

3.5 Sistema de Propostas

3.5.1 Gerador de Propostas

Templates personalizáveis

Inclusão dinâmica de produtos do catálogo

Cálculo automático de preços e descontos

Campos personalizados por tipo de proposta

Versionamento e comparação de propostas

Integração com MIONIR para contratos

3.5.2 Colaboração e Aprovação

Edição colaborativa em tempo real

Workflow de aprovação configurável

Comentários e sugestões de mudanças

Histórico de revisões e alterações

Níveis de aprovação baseados em valores

Notificações por email e no app

3.5.3 Envio e Acompanhamento

Múltiplas opções de envio (email, link, PDF)

Rastreamento de visualizações e interações

Tempo gasto em cada seção da proposta

Alertas para propostas vistas e não respondidas

Analytics avançado de conversão

Feedback dos clientes (aceites, rejeições, dúvidas)

3.6 Analytics de Vendas

3.6.1 Dashboards e Relatórios

Visão consolidada de KPIs de vendas

Análise de funil de conversão

Desempenho por produto, categoria e vendedor

Tendências e sazonalidade

Comparativos com períodos anteriores

Exportação e compartilhamento de relatórios

3.6.2 Insights de Catálogo

Produtos mais visualizados e convertidos

Análise de engajamento por conteúdo

Tempo de permanência por página

Padrões de navegação e dropoffs

Conteúdo mais compartilhado e salvo

Correlações entre visualizações e vendas

3.6.3 Análise Preditiva

Previsão de vendas baseada em tendências

Recomendações de produtos por segmento

Detecção de oportunidades de cross-sell

Alertas antecipados para problemas de conversão

Identificação de clientes em risco

Modelos de propensão a compra

4. Modelo de Dados

4.1 Entidades Principais

4.1.1 Catálogos (Catalogs)

CREATE TABLE catalogs (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

version VARCHAR(50),

status VARCHAR(50) NOT NULL DEFAULT 'draft',

published_at TIMESTAMP WITH TIME ZONE,

expires_at TIMESTAMP WITH TIME ZONE,

template_id UUID,

thumbnail_url TEXT,

settings JSONB NOT NULL DEFAULT '{}',

is_featured BOOLEAN DEFAULT FALSE,

visibility VARCHAR(50) DEFAULT 'public',

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

organization_id UUID,

languages TEXT[] DEFAULT ARRAY['pt-BR'],

categories TEXT[],

tags TEXT[],

metadata JSONB

);

CREATE TABLE catalog_sections (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

catalog_id UUID REFERENCES catalogs(id) ON DELETE CASCADE,

name TEXT NOT NULL,

description TEXT,

layout_type VARCHAR(50) NOT NULL,

position INTEGER NOT NULL,

settings JSONB NOT NULL DEFAULT '{}',

content JSONB,

is_visible BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

CREATE TABLE catalog_products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

catalog_id UUID REFERENCES catalogs(id) ON DELETE CASCADE,

product_id UUID NOT NULL,

section_id UUID REFERENCES catalog_sections(id),

position INTEGER,

price_override NUMERIC(15,2),

custom_description TEXT,

is_featured BOOLEAN DEFAULT FALSE,

is_visible BOOLEAN DEFAULT TRUE,

custom_attributes JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.2 Produtos e Categorias (Products & Categories)

CREATE TABLE product_categories (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

parent_id UUID REFERENCES product_categories(id),

slug TEXT NOT NULL UNIQUE,

thumbnail_url TEXT,

position INTEGER,

attributes_schema JSONB,

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

metadata JSONB

);

CREATE TABLE products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

sku TEXT NOT NULL UNIQUE,

name TEXT NOT NULL,

description TEXT,

short_description TEXT,

category_id UUID REFERENCES product_categories(id),

base_price NUMERIC(15,2) NOT NULL,

cost_price NUMERIC(15,2),

currency VARCHAR(3) DEFAULT 'BRL',

stock_status VARCHAR(50),

stock_id UUID,

weight NUMERIC(10,2),

dimensions JSONB,

features JSONB,

attributes JSONB,

is_active BOOLEAN DEFAULT TRUE,

is_featured BOOLEAN DEFAULT FALSE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

tags TEXT[],

seo_metadata JSONB,

related_products UUID[],

metadata JSONB

);

CREATE TABLE product_variants (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

sku TEXT NOT NULL UNIQUE,

name TEXT NOT NULL,

attributes JSONB NOT NULL,

price_adjustment NUMERIC(15,2) DEFAULT 0,

stock_status VARCHAR(50),

stock_id UUID,

thumbnail_url TEXT,

is_default BOOLEAN DEFAULT FALSE,

is_active BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.3 Mídia (Media)

CREATE TABLE media_items (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

media_type VARCHAR(50) NOT NULL,

file_url TEXT NOT NULL,

file_size INTEGER,

content_type VARCHAR(255),

dimensions JSONB,

duration INTEGER,

alt_text TEXT,

tags TEXT[],

is_public BOOLEAN DEFAULT TRUE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

organization_id UUID,

metadata JSONB

);

CREATE TABLE product_media (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

media_id UUID REFERENCES media_items(id) ON DELETE CASCADE,

position INTEGER,

media_type VARCHAR(50) DEFAULT 'image',

is_primary BOOLEAN DEFAULT FALSE,

metadata JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.4 Preços e Promoções (Prices & Promotions)

CREATE TABLE price_lists (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

currency VARCHAR(3) DEFAULT 'BRL',

is_default BOOLEAN DEFAULT FALSE,

is_active BOOLEAN DEFAULT TRUE,

valid_from TIMESTAMP WITH TIME ZONE,

valid_to TIMESTAMP WITH TIME ZONE,

customer_segments TEXT[],

regions TEXT[],

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

metadata JSONB

);

CREATE TABLE product_prices (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,

price_list_id UUID REFERENCES price_lists(id) ON DELETE CASCADE,

price NUMERIC(15,2) NOT NULL,

compare_at_price NUMERIC(15,2),

min_quantity INTEGER DEFAULT 1,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

UNIQUE (product_id, variant_id, price_list_id, min_quantity)

);

CREATE TABLE promotions (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

description TEXT,

promotion_type VARCHAR(50) NOT NULL,

value NUMERIC(15,2),

value_type VARCHAR(20) NOT NULL,

code TEXT,

usage_limit INTEGER,

usage_count INTEGER DEFAULT 0,

min_order_value NUMERIC(15,2),

stackable BOOLEAN DEFAULT FALSE,

valid_from TIMESTAMP WITH TIME ZONE NOT NULL,

valid_to TIMESTAMP WITH TIME ZONE,

is_active BOOLEAN DEFAULT TRUE,

conditions JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

created_by UUID,

metadata JSONB

);

CREATE TABLE promotion_products (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,

product_id UUID REFERENCES products(id) ON DELETE CASCADE,

variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.1.5 Propostas e Vendas (Proposals & Sales)

CREATE TABLE sales_opportunities (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

name TEXT NOT NULL,

customer_id UUID NOT NULL,

estimated_value NUMERIC(15,2),

currency VARCHAR(3) DEFAULT 'BRL',

stage VARCHAR(50) NOT NULL,

probability INTEGER,

expected_close_date DATE,

source VARCHAR(50),

owner_id UUID,

notes TEXT,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

closed_at TIMESTAMP WITH TIME ZONE,

status VARCHAR(50) NOT NULL DEFAULT 'open',

reason TEXT,

tags TEXT[],

metadata JSONB

);

CREATE TABLE proposals (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

title TEXT NOT NULL,

opportunity_id UUID REFERENCES sales_opportunities(id),

customer_id UUID NOT NULL,

template_id UUID,

status VARCHAR(50) NOT NULL DEFAULT 'draft',

total_value NUMERIC(15,2),

currency VARCHAR(3) DEFAULT 'BRL',

valid_until DATE,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

sent_at TIMESTAMP WITH TIME ZONE,

viewed_at TIMESTAMP WITH TIME ZONE,

responded_at TIMESTAMP WITH TIME ZONE,

response TEXT,

created_by UUID,

approved_by UUID,

approval_date TIMESTAMP WITH TIME ZONE,

version INTEGER DEFAULT 1,

custom_fields JSONB,

metadata JSONB

);

CREATE TABLE proposal_items (

id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,

product_id UUID,

variant_id UUID,

name TEXT NOT NULL,

description TEXT,

quantity INTEGER NOT NULL DEFAULT 1,

unit_price NUMERIC(15,2) NOT NULL,

discount_amount NUMERIC(15,2) DEFAULT 0,

discount_percentage NUMERIC(5,2) DEFAULT 0,

tax_percentage NUMERIC(5,2) DEFAULT 0,

total_price NUMERIC(15,2) NOT NULL,

position INTEGER,

options JSONB,

created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

4.2 Índices e Otimizações

-- Índices para catálogos

CREATE INDEX idx_catalogs_status ON catalogs(status);

CREATE INDEX idx_catalogs_published_at ON catalogs(published_at);

CREATE INDEX idx_catalogs_created_by ON catalogs(created_by);

CREATE INDEX idx_catalogs_organization ON catalogs(organization_id);

CREATE INDEX idx_catalog_sections_catalog ON catalog_sections(catalog_id);

CREATE INDEX idx_catalog_products_catalog ON catalog_products(catalog_id);

CREATE INDEX idx_catalog_products_product ON catalog_products(product_id);

-- Índices para produtos e categorias

CREATE INDEX idx_products_category ON products(category_id);

CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_products_active ON products(is_active);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);

CREATE INDEX idx_product_variants_sku ON product_variants(sku);

CREATE INDEX idx_product_categories_parent ON product_categories(parent_id);

CREATE INDEX idx_product_categories_slug ON product_categories(slug);

-- Índices para mídia

CREATE INDEX idx_media_items_type ON media_items(media_type);

CREATE INDEX idx_media_items_created_by ON media_items(created_by);

CREATE INDEX idx_media_items_organization ON media_items(organization_id);

CREATE INDEX idx_product_media_product ON product_media(product_id);

CREATE INDEX idx_product_media_media ON product_media(media_id);

CREATE INDEX idx_product_media_primary ON product_media(product_id, is_primary);

-- Índices para preços e promoções

CREATE INDEX idx_price_lists_active ON price_lists(is_active);

CREATE INDEX idx_price_lists_valid ON price_lists(valid_from, valid_to);

CREATE INDEX idx_product_prices_product ON product_prices(product_id);

CREATE INDEX idx_product_prices_price_list ON product_prices(price_list_id);

CREATE INDEX idx_promotions_active ON promotions(is_active);

CREATE INDEX idx_promotions_valid ON promotions(valid_from, valid_to);

CREATE INDEX idx_promotions_code ON promotions(code);

CREATE INDEX idx_promotion_products_promotion ON promotion_products(promotion_id);

CREATE INDEX idx_promotion_products_product ON promotion_products(product_id);

-- Índices para propostas e vendas

CREATE INDEX idx_sales_opportunities_customer ON sales_opportunities(customer_id);

CREATE INDEX idx_sales_opportunities_owner ON sales_opportunities(owner_id);

CREATE INDEX idx_sales_opportunities_stage ON sales_opportunities(stage);

CREATE INDEX idx_sales_opportunities_status ON sales_opportunities(status);

CREATE INDEX idx_proposals_opportunity ON proposals(opportunity_id);

CREATE INDEX idx_proposals_customer ON proposals(customer_id);

CREATE INDEX idx_proposals_status ON proposals(status);

CREATE INDEX idx_proposals_created_by ON proposals(created_by);

CREATE INDEX idx_proposal_items_proposal ON proposal_items(proposal_id);

CREATE INDEX idx_proposal_items_product ON proposal_items(product_id);

5. APIs e Endpoints

5.1 API de Catálogos

| Endpoint | Método | Descrição | |----------|--------|-----------| | /catalogs | GET | Listar catálogos com filtros | | /catalogs | POST | Criar novo catálogo | | /catalogs/:id | GET | Obter detalhes do catálogo | | /catalogs/:id | PUT | Atualizar catálogo | | /catalogs/:id/publish | POST | Publicar catálogo | | /catalogs/:id/unpublish | POST | Despublicar catálogo | | /catalogs/:id/duplicate | POST | Duplicar catálogo existente | | /catalogs/:id/sections | GET | Listar seções do catálogo | | /catalogs/:id/sections | POST | Adicionar seção ao catálogo | | /catalogs/:id/sections/:sectionId | PUT | Atualizar seção | | /catalogs/:id/products | GET | Listar produtos do catálogo | | /catalogs/:id/products | POST | Adicionar produto ao catálogo | | /catalogs/:id/export | GET | Exportar catálogo (PDF, HTML) | | /catalogs/:id/analytics | GET | Métricas de engajamento do catálogo |

5.2 API de Produtos

| Endpoint | Método | Descrição | |----------|--------|-----------| | /products | GET | Listar produtos com filtros | | /products | POST | Criar novo produto | | /products/:id | GET | Obter detalhes do produto | | /products/:id | PUT | Atualizar produto | | /products/:id/variants | GET | Listar variantes do produto | | /products/:id/variants | POST | Adicionar variante ao produto | | /products/:id/variants/:variantId | PUT | Atualizar variante | | /products/:id/media | GET | Listar mídia do produto | | /products/:id/media | POST | Adicionar mídia ao produto | | /products/:id/related | GET | Produtos relacionados | | /products/:id/prices | GET | Preços em diferentes listas | | /products/:id/prices | POST | Definir preço em lista específica | | /products/categories | GET | Listar categorias de produtos | | /products/categories | POST | Criar nova categoria | | /products/import | POST | Importar produtos em massa |

5.3 API de Mídia

| Endpoint | Método | Descrição | |----------|--------|-----------| | /media | GET | Listar itens de mídia com filtros | | /media | POST | Fazer upload de novo item de mídia | | /media/:id | GET | Obter detalhes do item de mídia | | /media/:id | PUT | Atualizar metadados do item | | /media/:id | DELETE | Remover item de mídia | | /media/batch | POST | Upload em massa de itens | | /media/transform/:id | POST | Transformar item de mídia | | /media/search | GET | Buscar itens por tags, metadata | | /media/usage/:id | GET | Ver onde o item é usado | | /media/collections | GET | Listar coleções de mídia | | /media/collections | POST | Criar nova coleção | | /media/collections/:id/items | GET | Itens na coleção | | /media/collections/:id/items | POST | Adicionar itens à coleção |

5.4 API de Preços e Promoções

| Endpoint | Método | Descrição | |----------|--------|-----------| | /price-lists | GET | Listar tabelas de preço | | /price-lists | POST | Criar nova tabela de preço | | /price-lists/:id | GET | Obter detalhes da tabela | | /price-lists/:id | PUT | Atualizar tabela de preço | | /price-lists/:id/prices | GET | Listar preços na tabela | | /price-lists/:id/prices | POST | Adicionar preço à tabela | | /price-lists/:id/prices/bulk | POST | Atualizar preços em massa | | /price-lists/:id/import | POST | Importar preços de arquivo | | /price-lists/:id/export | GET | Exportar tabela de preços | | /promotions | GET | Listar promoções ativas | | /promotions | POST | Criar nova promoção | | /promotions/:id | GET | Obter detalhes da promoção | | /promotions/:id | PUT | Atualizar promoção | | /promotions/:id/products | GET | Produtos na promoção | | /promotions/:id/products | POST | Adicionar produtos à promoção | | /promotions/validate | POST | Validar código promocional |

5.5 API de Vendas e Propostas

| Endpoint | Método | Descrição | |----------|--------|-----------| | /opportunities | GET | Listar oportunidades de venda | | /opportunities | POST | Criar nova oportunidade | | /opportunities/:id | GET | Obter detalhes da oportunidade | | /opportunities/:id | PUT | Atualizar oportunidade | | /opportunities/:id/stage | PATCH | Atualizar estágio da oportunidade | | /opportunities/:id/close | POST | Fechar oportunidade (ganho/perda) | | /opportunities/:id/reopen | POST | Reabrir oportunidade fechada | | /opportunities/:id/activities | GET | Histórico de atividades | | /opportunities/:id/activities | POST | Registrar nova atividade | | /proposals | GET | Listar propostas | | /proposals | POST | Criar nova proposta | | /proposals/:id | GET | Obter detalhes da proposta | | /proposals/:id | PUT | Atualizar proposta | | /proposals/:id/items | GET | Listar itens da proposta | | /proposals/:id/items | POST | Adicionar item à proposta | | /proposals/:id/send | POST | Enviar proposta ao cliente | | /proposals/:id/approve | POST | Aprovar proposta internamente | | /proposals/:id/convert | POST | Converter em contrato (MIONIR) | | /proposals/:id/export | GET | Exportar proposta (PDF) | | /templates/proposals | GET | Listar templates de proposta | | /templates/proposals | POST | Criar novo template |

5.6 API de Analytics

| Endpoint | Método | Descrição | |----------|--------|-----------| | /analytics/products/views | GET | Produtos mais visualizados | | /analytics/products/conversion | GET | Taxa de conversão por produto | | /analytics/catalogs/engagement | GET | Engajamento por catálogo | | /analytics/sales/funnel | GET | Funil de vendas | | /analytics/sales/performance | GET | Performance por vendedor/região | | /analytics/sales/forecast | GET | Previsão de vendas | | /analytics/promotions/impact | GET | Impacto de promoções | | /analytics/proposals/conversion | GET | Taxa de conversão de propostas | | /analytics/heatmaps/:catalogId | GET | Heatmaps de interação | | /analytics/reports/:type | GET | Relatórios pré-configurados | | /analytics/dashboards | GET | Dashboards disponíveis | | /analytics/dashboards/:id | GET | Dados do dashboard |

6. Comunicação em Tempo Real

6.1 Canais de Evento

| Canal | Descrição | |-------|-----------| | catalog.published | Catálogo publicado ou atualizado | | product.updated | Produto atualizado no catálogo | | price.changed | Alteração de preços | | promotion.started | Nova promoção iniciada | | promotion.ended | Promoção finalizada | | proposal.viewed | Proposta visualizada pelo cliente | | proposal.commented | Comentário adicionado à proposta | | opportunity.stage_changed | Mudança de estágio da oportunidade | | catalog.viewed | Catálogo visualizado por cliente | | product.viewed | Produto visualizado por cliente |

6.2 Padrões de Evento

| Evento | Descrição | Dados | |--------|-----------|-------| | catalog.status.changed | Mudança de status do catálogo | { catalog_id, previous_status, new_status, user_id, timestamp } | | product.visited | Produto visitado no catálogo | { product_id, catalog_id, session_id, customer_id, timestamp, referrer, time_spent } | | proposal.status.changed | Mudança de status da proposta | { proposal_id, previous_status, new_status, user_id, timestamp, comments } | | price.updated | Atualização de preço | { product_id, price_list_id, previous_price, new_price, updated_by, timestamp } | | media.added | Mídia adicionada a produto/catálogo | { media_id, entity_type, entity_id, user_id, timestamp } | | opportunity.created | Nova oportunidade criada | { opportunity_id, customer_id, estimated_value, stage, created_by, timestamp } |

7. Integração com o Ecossistema

7.1 Integração com ASCEND

Sincronização de preços e políticas de precificação

Importação automática de valores calculados na calculadora

Uso de templates de precificação por segmento

Aplicação de margens e multiplicadores personalizados

Inteligência de preços para estratégias competitivas

7.2 Integração com STOCK

Importação automática de produtos e categorias

Verificação de disponibilidade em tempo real

Atualização automática de estoque após vendas

Alerta para produtos em baixa quantidade

Sincronização de informações e especificações

7.3 Integração com LOGX

Compartilhamento de perfis e interesses de clientes

Histórico unificado de interações e pedidos

Segmentação de clientes para catálogos personalizados

Alertas para oportunidades de up-sell e cross-sell

Feedback e satisfação de clientes

7.4 Integração com MIONIR

Conversão automática de propostas em contratos

Inclusão de termos contratuais e legais nas propostas

Validação de conformidade das propostas com contratos padrão

Histórico de contratos para referência em novas propostas

Monitoramento de SLAs e obrigações contratuais

7.5 Integração com CORE

Autenticação e autorização centralizada

Notificações e alertas cross-platform

Armazenamento e busca de dados

Analytics consolidado e relatórios

Compartilhamento de eventos entre sistemas

8. Interface do Usuário

8.1 Dashboard Comercial

KPIs de vendas e conversão

Pipeline visual de oportunidades

Alertas e notificações

Ranking de produtos e vendedores

Previsões e metas

8.2 Editor de Catálogos

Interface drag-and-drop

Visualização em tempo real

Templates pré-configurados

Controles de layout responsivo

Ferramentas de design e estilo

8.3 Portal de Vendas

Apresentação personalizada para clientes

Ferramentas de configuração de produtos

Simulação de preços e orçamentos

Compartilhamento e colaboração

Tracking de interações

8.4 App para Vendedores

Catálogos e materiais offline

Ferramentas de apresentação

Registro de visitas e atividades

Geração rápida de propostas

Analytics de desempenho pessoal

9. Segurança

9.1 Autenticação e Autorização

Autenticação via SSO integrada ao CORE

RBAC (Role Based Access Control)

Controle de acesso por cliente/segmento

Proteção de preços e condições especiais

Auditoria de acessos e ações

9.2 Segurança de Dados

Criptografia de dados sensíveis

Proteção de propriedade intelectual

Marcas d'água digitais em conteúdo sensível

Controle de versões e histórico de alterações

Backup automático de catálogos e propostas

9.3 Privacidade

Conformidade com LGPD

Gerenciamento de consentimentos

Anonimização de dados para analytics

Políticas de retenção de dados

Exportação e exclusão de dados pessoais

10. Plano de Implementação

10.1 Fase 1: Fundação (3 meses)

Sistema básico de catálogos e produtos

Editor de catálogos com templates básicos

Integração inicial com STOCK para produtos

Visualização de catálogos em dispositivos

Gestão básica de mídia e conteúdo

10.2 Fase 2: Preços e Vendas (3 meses)

Engine completo de preços e promoções

Sistema de propostas e oportunidades

Integração com ASCEND para precificação

App básico para vendedores

Analytics inicial de engajamento

10.3 Fase 3: Integração Avançada (3 meses)

Integrações completas com o ecossistema

Pipeline de vendas avançado

Recursos colaborativos para propostas

Preços dinâmicos e personalizados

Analytics avançado e dashboards

10.4 Fase 4: Experiência Aprimorada (3 meses)

Conteúdo interativo e rich media

Machine learning para recomendações

App avançado para vendedores com IA

Personalização avançada por cliente

Automação de processos de venda

11. Métricas e KPIs

11.1 Métricas de Catálogo

Visualizações por catálogo e produto

Tempo médio de engajamento

Taxa de compartilhamento

Conversão de visualização para interesse

Efetividade de diferentes tipos de mídia

11.2 Métricas de Vendas

Taxa de conversão de propostas

Ciclo de vendas (tempo até fechamento)

Valor médio de proposta

Margem média por venda

Eficiência por vendedor/região

11.3 Métricas de Engajamento

Taxa de abertura de catálogos

Tempo gasto por seção

Retorno a produtos/seções

Interação com elementos interativos

Feedback e respostas de clientes

12. Considerações Futuras

12.1 Expansão de Funcionalidades

Configuradores 3D de produtos complexos

Realidade aumentada para visualização

Chatbots e assistentes de vendas com IA

Personalização dinâmica baseada em comportamento

Integração com marketplaces e e-commerce

12.2 Evolução Tecnológica

Machine learning para previsão de vendas

Computer vision para análise de engajamento

Processamento de linguagem natural para feedback

Algoritmos avançados de precificação dinâmica

Blockchain para verificação de autenticidade

Conclusão

O FLYER representa uma solução completa para a transformação digital dos processos de vendas e marketing, permitindo que as empresas criem, distribuam e monetizem catálogos digitais interativos de forma eficiente. Ao integrar perfeitamente com os outros sistemas do ecossistema, o FLYER cria uma experiência de venda omnichannel coesa, onde dados e processos fluem naturalmente entre os diferentes estágios do relacionamento com o cliente.

Esta documentação técnica estabelece as bases para a implementação e operação do FLYER, delineando sua arquitetura, componentes e funcionalidades. Seguindo esta especificação, as equipes de desenvolvimento poderão construir uma plataforma robusta que atenderá às necessidades crescentes de vendas e marketing digital, proporcionando uma experiência de engajamento superior para clientes e uma ferramenta poderosa para equipes comerciais.

A abordagem modular e escalável do FLYER garante que a plataforma possa evoluir para atender às mudanças do mercado e às necessidades emergentes dos usuários, mantendo-se na vanguarda das soluções de venda e catálogos digitais.