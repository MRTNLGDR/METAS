



**TAREFA EXTRA (VERSÃO ANTI-“ENGANAÇÃO”): Revisão Completa e Inadiável do Codebase**

1. **Leitura Minuciosa de Todo o Código (Obrigatória e Inadiável)**
    
    - **Não** omita nenhum arquivo, **não** ignore nenhuma pasta.
    - Percorra **todas** as camadas do projeto (frontend, backend, configurações e scripts).
    - Se houver qualquer componente ou biblioteca que não seja analisado, o relatório será considerado **incompleto**.
2. **Diagnóstico Implacável**
    
    - Liste **todos** os pontos potenciais de falha, sem minimizar problemas.
    - Se o código estiver confuso, **explicite a confusão**; não tente omiti-la ou edulcorá-la.
    - Qualquer trecho com lógica complexa deve ser **detalhado** e **questionado** quanto à clareza e eficiência.
3. **Segurança sem Desculpas**
    
    - Verifique **todas** as rotas e endpoints em busca de vulnerabilidades (SQL injection, XSS, CSRF, etc.).
    - Qualquer brecha identificada deve ser **descrita** com exemplos claros do problema e possíveis soluções.
    - Caso o projeto não possua testes de segurança, registre isso como **falha severa**.
4. **Consistência e Organização**
    
    - Aponte **exatamente** onde existem inconsistências de nome, estilo ou padrão de código.
    - Caso encontre duplicação de funções ou lógica, **relate** a duplicação e sugira refatoração.
    - Analise a aderência aos guias de estilo (Tailwind, React, TypeScript): **qualquer** discrepância deve ser relatada.
5. **Eficiência e Performance**
    
    - Investigue **cada** componente que possa causar gargalos (loops aninhados, queries ineficientes, etc.).
    - Se houver APIs externas ou integrações que possam impactar performance, **descreva** o impacto.
    - Apresente **sugestões de otimização** claras e imediatas.
6. **Documentação e Comentários**
    
    - Avalie se o código possui **documentação interna** suficiente (comentários, docstrings) para cada função crítica.
    - Se não houver comentários em funções complexas, **sinalize** como prioritário.
    - Caso a documentação oficial (README ou Wiki) esteja incompleta ou desatualizada, **informe** no relatório.
7. **Relatório Final sem Contorno**
    
    - Entregue um **relatório integral** com:
        1. **Lista de Problemas Encontrados** (organizados por gravidade: crítico, alto, médio, baixo).
        2. **Soluções Propostas** (com exemplos de como corrigir).
        3. **Exemplos Concretos** de trechos de código suspeitos ou mal estruturados.
        4. **Passo a Passo** de implementação de correções ou melhorias.
    - Se for necessário mais de um relatório (devido à extensão do codebase), divida em **partes**, mas não omita **nenhuma** seção.
8. **Garantia Anti-Fuga**
    
    - **Não** ignore ou mascare respostas alegando “falta de contexto” ou “limitações” genéricas.
    - Se algum arquivo ou parte do sistema não for encontrado, **relate** que não foi fornecido ou que há conteúdo faltante.
    - Em caso de dúvida, **faça perguntas** específicas ou peça arquivos adicionais, mas **nunca** encerre a tarefa sem o panorama completo.

---

**Instruções Finais**

- A revisão deve ser **exaustiva**, não deixando **nenhum** problema passar despercebido.
- **Exija** respostas claras para cada ponto crítico.
- Se algum módulo estiver indisponível, **cobre** o envio dele ou registre como “**arquivo/módulo ausente**”.
- Qualquer **tentativa** de omissão ou resposta genérica deve ser tratada como **insatisfatória**.

> **Objetivo**: Garantir que o **codebase** seja dissecado por completo, recebendo **feedback** franco e detalhado, sem espaço para respostas evasivas ou superficiais.

*



*TAREFA principal:  Prompt: 
Siga rigorosamente o **JESTFLY - Checklist de Implementação Atualizado (2023)** a seguir. Implemente todas as funcionalidades descritas de acordo com seus respectivos status de desenvolvimento e, ao final, forneça um relatório detalhando:

1. **O que foi concluído** no processo,
2. **O que ainda depende de outro módulo** ou integração futura para ser finalizado.

---

## JESTFLY - Checklist de Implementação Atualizado (2023)




### 🟢 Funcionalidades Completamente Implementadas

#### Autenticação e Usuários

- ✅ **Sistema de login/registro com Supabase**
- ✅ **Recuperação de senha**
- ✅ **Perfis de usuário básicos**
- ✅ **Rotas protegidas**
- ✅ **Contexto de autenticação**

#### Layout e Navegação

- ✅ **Layout responsivo principal**
- ✅ **Cabeçalho com navegação**
- ✅ **Menu mobile**
- ✅ **Tratamento de 404 (NotFound)**
- ✅ **Estrutura de rotas**

#### Comunidade

- ✅ **Feed de posts**
- ✅ **Criação de post**
- ✅ **Categorias de posts**
- ✅ **Visualização detalhada de post**
- ✅ **Comentários em posts**
- ✅ **Perfis de usuário**
- ✅ **Sistema de curtidas**

#### Demo Submission

- ✅ **Formulário de envio de demos**
- ✅ **Upload de arquivos de áudio**
- ✅ **Listagem de demos enviadas**
- ✅ **Player de áudio integrado**
- ✅ **Interface para feedback**

#### Analytics

- ✅ **Rastreamento de visualizações de página**
- ✅ **Rastreamento de eventos (submissões, login)**
- ✅ **Visualização de dados básicos em gráficos**
- ✅ **Componentes para exibição de métricas**
- ✅ **Gráficos interativos com múltiplas visualizações**
- ✅ **Exportação de dados de gráficos**

#### JestCoin (Wallet)

- ✅ **Exibição de saldo**
- ✅ **Histórico de transações**
- ✅ **Capacidade de transferência**
- ✅ **Modal de transferência com busca de usuários**

#### Loja

- ✅ **Listagem de produtos**
- ✅ **Detalhes do produto**
- ✅ **Carrinho de compras**
- ✅ **Histórico de pedidos**

#### NFT Gallery

- ✅ **Visualização de NFTs**
- ✅ **Interface básica da galeria**

#### UI/UX

- ✅ **Componentes shadcn/ui**
- ✅ **Toasts para notificações**
- ✅ **Modais**
- ✅ **Formulários com validação**
- ✅ **Gráficos interativos e animados**

#### Backend (Supabase)

- ✅ **Autenticação completa**
- ✅ **Tabelas para comunidade, transações, wallet**
- ✅ **Tabelas para demos e feedback**
- ✅ **Tabelas para analytics**
- ✅ **Políticas RLS para segurança de dados**
- ✅ **Funções para transações de JestCoin**

---

### 🟠 Funcionalidades Parcialmente Implementadas (Melhorias Necessárias)

#### Comunidade

- 🔶 **Editor de texto rico para posts**
- 🔶 **Melhorar interface de comentários**
- 🔶 **Aprimorar sistema de notificações**
- 🔶 **Implementar busca avançada de posts**

#### Demo Submission

- 🔶 **Melhorar feedback visual durante upload**
- 🔶 **Adicionar indicador de progresso**
- 🔶 **Suporte para múltiplos arquivos**

#### Analytics

- 🔶 **Implementar filtros por período**
- 🔶 **Criar dashboards personalizados**
- 🔶 **Analytics em tempo real**

#### JestCoin

- 🔶 **Adicionar histórico detalhado de transações**
- 🔶 **Sistema de recompensas automatizado**
- 🔶 **Interface administrativa para JestCoin**

#### Loja

- 🔶 **Finalização de compra com pagamentos reais**
- 🔶 **Exibição de status do pedido em tempo real**
- 🔶 **Melhorar filtros de produtos**
- 🔶 **Sistema de avaliações de produtos**

#### NFT Gallery

- 🔶 **Melhorar visualizador de NFT**
- 🔶 **Implementar interface de compra/venda**
- 🔶 **Adicionar detalhes de metadados**

---

### 🔴 Funcionalidades Não Implementadas

#### Autenticação e Usuários

- ❌ **Login social (Google, Twitter, Discord)**
- ❌ **Autenticação em dois fatores (2FA)**
- ❌ **Verificação de email**
- ❌ **Níveis de permissão granulares**

#### Administração

- ❌ **Dashboard de administrador completo**
- ❌ **Gerenciamento de usuários**
- ❌ **Moderação de conteúdo**
- ❌ **Ferramentas de análise avançada**
- ❌ **Gestão de produtos e estoque**
- ❌ **Gerenciamento de demos e aprovações**

#### Live Streaming

- ❌ **Player de stream**
- ❌ **Interface de chat**
- ❌ **Sistema de doações**
- ❌ **Agendamento de eventos**

#### Marketplace NFT Completo

- ❌ **Integração com blockchain real**
- ❌ **Sistema de leilão**
- ❌ **Mintagem de NFTs**
- ❌ **Royalties para criadores**

#### Monetização

- ❌ **Sistema de assinaturas**
- ❌ **Produtos digitais com entrega automática**
- ❌ **Integração com gateways de pagamento**
- ❌ **Sistema de afiliados**

#### Performance e Escalabilidade

- ❌ **Otimização de imagens e mídia**
- ❌ **Implementação de CDN**
- ❌ **Lazy loading e code splitting avançado**
- ❌ **Cache otimizado**

#### Mobile e Cross-platform

- ❌ **Aplicativo móvel**
- ❌ **Experiência offline**
- ❌ **Push notifications**

#### Segurança

- ❌ **Auditoria de segurança completa**
- ❌ **Rate limiting**
- ❌ **Proteção contra ataques avançados**
- ❌ **Logs de atividade completos**

---

### 📋 Integrações Necessárias Para Produção

#### Pagamentos

- 🔄 **Stripe** ou **PayPal** para transações reais
- 🔄 **Integração com criptomoedas**

#### Blockchain

- 🔄 **Integração com Ethereum, Solana ou similar para NFTs**
- 🔄 **Smart contracts para JestCoin**

#### Mídia e Armazenamento

- 🔄 **Integração com CDN para mídia**
- 🔄 **Melhorias no armazenamento do Supabase para arquivos maiores**

#### Comunicação

- 🔄 **SendGrid ou similar para emails transacionais**
- 🔄 **Serviço de SMS para verificação**
- 🔄 **WebSockets para chat e notificações em tempo real**

#### Streaming

- 🔄 **Serviço de streaming (Agora.io, Twilio ou similar)**

---

### 🛠️ Stack Tecnológica Atual e Futura

#### Frontend (Implementado)

- ✅ **React e TypeScript**
- ✅ **Tailwind CSS**
- ✅ **shadcn/ui** para componentes de UI
- ✅ **React Router** para navegação
- ✅ **Recharts** para visualização de dados
- ✅ **Lucide** para ícones
- ✅ **React Hook Form** para validação de formulários

#### Backend (Implementado)

- ✅ **Supabase** para autenticação
- ✅ **Supabase PostgreSQL** para banco de dados
- ✅ **Supabase Storage** para armazenamento
- ✅ **RLS (Row Level Security)** para segurança de dados
- ✅ **Funções SQL** personalizadas para operações complexas

---

### Prioridades de Desenvolvimento Técnico

1. **Finalizar integrações de pagamento**
2. **Desenvolver sistema de administração completo**
3. **Implementar funcionalidades de streaming ao vivo**
4. **Melhorar dashboards e analytics**
5. **Implementar blockchain para NFTs e JestCoin**
6. **Otimizar performance e experiência do usuário**

---

**Instruções Finais:**

1. Prossiga com a implementação de cada item conforme as prioridades definidas.
2. Ao concluir, gere um **relatório** destacando:
    - Funcionalidades **concluídas** ou **aperfeiçoadas** neste ciclo de desenvolvimento.
    - Funcionalidades que **dependem de outro módulo** ou integração específica para serem finalizadas.

Use este checklist como guia para todo o processo de desenvolvimento, garantindo que cada ponto receba a devida atenção até a entrega final.

# Estrutura de Módulos do Projeto JestFly

## Módulo 1: Público
- **Diretório:** `/public`
- **Descrição:** Contém arquivos estáticos públicos, como texturas, imagens e favicon.

## Módulo 2: Componentes Reutilizáveis
- **Diretório:** `/src/components`
- **Descrição:** Contém componentes React reutilizáveis divididos em submódulos conforme sua funcionalidade.

### Submódulos:
- **Admin:** Componentes do painel administrativo.
- **Airdrop:** Componentes do sistema de Airdrop.
- **Auth:** Componentes de autenticação.
- **Bookings:** Componentes do sistema de reservas.
- **Community:** Componentes da comunidade.
- **CreativeFlow:** Sistema CreativeFlow Board.
- **Demos:** Submissão de demos musicais.
- **FileUploader:** Sistema de upload de arquivos.
- **JestCoin:** Sistema de moeda interna JestCoin.
- **Livestream:** Sistema de transmissão ao vivo.
- **NFT:** Sistema de NFTs.
- **PressKit:** Sistema de Press Kit.
- **Profile:** Componentes de perfil.
- **Store:** Componentes da loja.
- **UI:** Componentes de UI genéricos.

## Módulo 3: Páginas
- **Diretório:** `/src/pages`
- **Descrição:** Contém as páginas principais da aplicação, cada uma representando uma rota distinta.

## Módulo 4: Contextos
- **Diretório:** `/src/contexts`
- **Descrição:** Contém contextos React para gerenciar estados globais.

## Módulo 5: Hooks
- **Diretório:** `/src/hooks`
- **Descrição:** Contém hooks customizados divididos em submódulos conforme sua funcionalidade.

### Submódulos:
- **Admin:** Hooks do painel administrativo.
- **Airdrop:** Hooks para sistema de airdrop.
- **Auth:** Hooks de autenticação.
- **Bookings:** Hooks de reservas.
- **Community:** Hooks da comunidade.
- **CreativeFlow:** Hooks para o CreativeFlow Board.
- **Demos:** Hooks para submissão de demos.
- **JestCoin:** Hooks para JestCoin.
- **Livestream:** Hooks para transmissão ao vivo.
- **NFT:** Hooks para NFTs.
- **Profile:** Hooks para perfil.
- **Store:** Hooks para loja.
- **Outros:** Hooks genéricos e utilitários.

## Módulo 6: Integrações
- **Diretório:** `/src/integrations`
- **Descrição:** Contém integrações com serviços e APIs externas.

### Submódulos:
- **Payment:** Integração com pagamentos (Stripe, PayPal).
- **Blockchain:** Integração com blockchain (Ethers.js, NFTs, Carteira).
- **Social:** Integração com redes sociais (Instagram, Twitter, Discord).
- **Google:** Integração com serviços Google (Calendar, Drive, Sheets).
- **Streaming:** Integração com plataformas de streaming (Spotify, Apple Music, SoundCloud).
- **Communication:** Integração com comunicação (Email, SMS, Push).
- **Supabase:** Integração com Supabase.

## Módulo 7: Serviços
- **Diretório:** `/src/services`
- **Descrição:** Contém serviços para comunicação com APIs.

### Submódulos:
- **Admin:** Serviços administrativos.
- **Airdrop:** Serviços de airdrop.
- **Auth:** Serviços de autenticação.
- **Bookings:** Serviços de reservas.
- **Community:** Serviços da comunidade.
- **CreativeFlow:** Serviços do CreativeFlow Board.
- **Demo:** Serviços de demos.
- **JestCoin:** Serviços da JestCoin.
- **Livestream:** Serviços de transmissão ao vivo.
- **NFT:** Serviços de NFT.
- **PressKit:** Serviços de press kit.
- **Profile:** Serviços de perfil.
- **Store:** Serviços da loja.

## Módulo 8: Estilos
- **Diretório:** `/src/styles`
- **Descrição:** Contém estilos e temas da aplicação.

## Módulo 9: Tipos
- **Diretório:** `/src/types`
- **Descrição:** Definições de tipos TypeScript.

## Módulo 10: Utilitários
- **Diretório:** `/src/utils`
- **Descrição:** Funções utilitárias.

## Módulo 11: Configurações Supabase
- **Diretório:** `/supabase`
- **Descrição:** Configurações do Supabase, incluindo Edge Functions e migrações SQL.

## Módulo 12: Raiz do Projeto
- **Diretório:** `/`
- **Descrição:** Arquivos de configuração e documentação do projeto.