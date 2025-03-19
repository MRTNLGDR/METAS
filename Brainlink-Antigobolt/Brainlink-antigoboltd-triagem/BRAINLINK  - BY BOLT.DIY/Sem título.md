
# Relatório Completo

## Resumo do projeto e impacto esperado

**Bolt.DIY (Nova Versão)** é uma plataforma integrada que unifica edição de código, gestão de conhecimento e orquestração de fluxos de IA em um só lugar. A nova versão visa ampliar as capacidades da ferramenta, incorporando: um **vault** unificado (armazenamento local + nuvem) para arquivos estilo Obsidian, um **editor central** multifuncional (código, Markdown, timelines e **nodes**), um sistema de **orquestração visual** de fluxos de trabalho de IA (inspirado em Flowise/n8n), além de um **sistema de plugins/SDKs** modular e uma **biblioteca interna** de templates e frameworks.

O impacto esperado é **acelerar o desenvolvimento e a criatividade** dos usuários, permitindo que desenvolvedores e criadores organizem seu conhecimento e construam aplicações com IA de forma mais eficiente. Com o vault local/nuvem, os usuários terão **controle total de seus dados** (com opção de sincronização segura em nuvem). O editor unificado eliminará a necessidade de alternar entre múltiplas ferramentas — será possível escrever documentação Markdown, editar código e visualizar fluxos ou cronogramas em um só ambiente. A orquestração visual com **IA copiloto** permitirá criar agentes e fluxos condicionais facilmente, democratizando o acesso a automação inteligente (inclusive para usuários com menos experiência em código). O sistema de plugins e a biblioteca interna fomentarão uma **comunidade de extensões e compartilhamento**: usuários poderão adicionar novos recursos via plugins de copilotos e reutilizar templates e frameworks prontos, reduzindo drasticamente o tempo de bootstrap de novos projetos.

Em suma, a nova versão do Bolt.DIY pretende **combinar o melhor de ferramentas como Obsidian (notas vinculadas), VS Code (edição de código), e Flowise/n8n (fluxos visuais)** em uma plataforma coesa. Isso deve resultar em maior produtividade, centralização do conhecimento e possibilidade de inovação acelerada, já que os desenvolvedores poderão prototipar ideias de IA e aplicações completas sem sair do Bolt.DIY.

## Comparação com ferramentas existentes

### Obsidian (Vault de notas Markdown)

O Obsidian é conhecido por armazenar notas localmente em arquivos Markdown organizados em _vaults_ (pastas) e oferecer sincronização opcional via serviços na nuvem ([How Obsidian stores data - Obsidian Help](https://help.obsidian.md/data-storage#:~:text=Obsidian%20stores%20your%20notes%20as,folders%20as%20individual%20vaults%2C%20for)). Similarmente, o Bolt.DIY permitirá que o usuário mantenha seus arquivos (código, markdown, etc.) em um vault local (pasta no sistema de arquivos) com atualização em tempo real e backup/sincronização com um repositório online. Diferentemente do Obsidian, que foca principalmente em notas textuais e backlinks, o Bolt.DIY integrará **conteúdo diverso** (código fonte, notas, diagramas de timeline, definições de fluxos de trabalho) no vault. Ou seja, além de texto Markdown, o vault do Bolt.DIY acomodará arquivos de código e estruturas de projeto, servindo como base tanto para documentação quanto para o código do projeto em si.

Essa abordagem unificada vai **além do Obsidian**: enquanto no Obsidian o usuário gerencia conhecimento estático (anotações), no Bolt.DIY poderá **desenvolver projetos inteiros**. A sincronização na nuvem seguirá princípios semelhantes – possivelmente usando serviços como Git ou Supabase para backup. Assim como o Obsidian suporta plugins e personalização via sua pasta de configuração `.obsidian` e comunidade de plugins, o Bolt.DIY terá um sistema de plugins próprio (ver seção de Plugins/SDKs) para estender funcionalidades do editor e do orquestrador. Em resumo, Bolt.DIY aproveita o conceito de vault do Obsidian (simplicidade de arquivos locais em Markdown, facilidade de sync) e expande para suportar ativos de desenvolvimento de software e dados de IA, tudo centralizado.

### Flowise/n8n (Orquestração visual de fluxos)

Flowise e n8n são referências para criação de fluxos de forma visual, conectando blocos de ação em sequência condicional. **Flowise**, por exemplo, é uma ferramenta _open-source_ que provê uma interface drag-and-drop para construir fluxos envolvendo modelos de linguagem (LLMs) e agentes de IA ( [The Drag-and-Drop UI for Building LLM Flows: Flowise AI - KDnuggets](https://www.kdnuggets.com/2023/07/draganddrop-ui-building-llm-flows-flowise-ai.html#:~:text=What%20is%20Flowise%20AI%3F)). Já **n8n** é uma plataforma de automação de workflows que combina flexibilidade de código com praticidade no-code, oferecendo centenas de integrações para montar fluxos complexos ([GitHub - n8n-io/n8n: Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.](https://github.com/n8n-io/n8n#:~:text=n8n%20,for%20Technical%20Teams)). O Bolt.DIY integrará um módulo de orquestração visual semelhante, visando juntar o melhor dos dois mundos: permitir que o usuário **desenhe fluxos de IA e automação** (como no Flowise/n8n) **dentro do contexto do seu projeto**.

Comparado ao Flowise, o módulo de orquestração do Bolt.DIY poderá suportar não apenas etapas relacionadas a LLMs, mas também quaisquer operações definidas pelo desenvolvedor, inclusive _scripts_ customizados, transformações de dados, chamadas API, etc., parecendo-se mais ao n8n em termos de flexibilidade. A diferença é que em vez de ser uma ferramenta separada, estará **embutido no Bolt.DIY** e integrada com os outros componentes (ex: um nó do fluxo pode referenciar um snippet de código do vault ou exibir um resultado no editor). Assim, o usuário ganha contexto unificado: o fluxo de trabalho automatizado e o código/nota correspondente ficam lado a lado.

Em termos de **IA copiloto**, o Bolt.DIY visa incorporar uma camada em que a própria plataforma sugere ou completa partes do fluxo com base em prompts, semelhante a um “Copilot de fluxos”. Ferramentas existentes já caminham nessa direção – o n8n recentemente adicionou capacidades nativas de IA para auxiliar na criação de workflows, e o Flowise é feito justamente para orquestração de agentes de IA. O Bolt.DIY aproveitará esse conceito para permitir fluxos condicionais guiados por IA de forma **interativa**: por exemplo, o usuário poderá definir que em determinado nó do fluxo, um modelo de IA decide a próxima ação com base em uma pergunta ou análise de contexto.

### Outras ferramentas e diferenciais

Além das comparações diretas, vale destacar outros diferenciais do Bolt.DIY:

- **Editores de código integrados**: Diferente de IDEs tradicionais (VS Code, etc.), o Bolt.DIY unirá edição de código com documentação viva e fluxos de automação no mesmo ambiente. Isso lembra um pouco ferramentas como Jupyter Notebooks (código + texto), mas o Bolt.DIY será mais estruturado, separando claramente arquivos de código, markdown e permitindo executar/visualizar fluxos interativos.
- **Biblioteca de templates e frameworks**: Enquanto muitos frameworks e boilerplates ficam disponíveis em sites ou repositórios externos, o Bolt.DIY trará uma biblioteca interna sincronizada com um repositório oficial. Isso pode ser comparado a gestores de pacotes ou templates (como **Yeoman** para scaffolding, ou coleções de _starters_ de frameworks), porém acessível diretamente na interface, facilitando iniciar novos projetos ou adicionar módulos com um clique.
- **Integração de serviços modernos**: Ao aproveitar serviços como Vercel (deploy/serverless), Supabase (backend as a service) e possivelmente APIs de modelos de linguagem, o Bolt.DIY se alinha a tendências modernas de desenvolvimento web/cloud. Em vez do usuário ter que manualmente configurar deploy contínuo, base de dados em nuvem, etc., a plataforma poderá oferecer integração simplificada com esses serviços.

## Riscos e desafios do desenvolvimento

Implementar a visão ambiciosa do Bolt.DIY traz alguns riscos e desafios que devem ser considerados:

- **Complexidade de Escopo**: Combinar funcionalidades de editor de código, gestão de markdown, orquestração de fluxos e plugins em um só produto aumenta muito a complexidade. Há o risco do projeto se tornar grande demais e difícil de manter ou finalizar dentro do prazo. Para mitigar, é essencial dividir o desenvolvimento em fases claras (MVP incremental) – conforme detalhado no roadmap técnico – e garantir que cada módulo funcione independentemente antes da integração total.
    
- **Desafios de Integração (Local + Nuvem)**: O vault híbrido (local + nuvem) requer sincronização confiável. Conflitos de versão, latência de rede e diferenças de ambientes (por ex., arquivo disponível localmente mas não sincronizado ainda na nuvem) são possíveis problemas. Além disso, acessar sistema de arquivos local via app web requer soluções especiais (uso da API de File System Access nos navegadores, ou adoção de um cliente desktop como Electron). Uma estratégia clara de sincronização (como a do Obsidian Sync ou uso de Git por baixo dos panos) deve ser implementada e testada extensivamente. O risco de perda de dados ou sobrescrita indevida precisa ser mitigado com backups e, possivelmente, locks ou histórico de versões.
    
- **Performance e Escalabilidade**: Carregar possivelmente centenas de arquivos do vault, renderizar editores de código e um canvas de fluxos simultaneamente pode impactar a performance, especialmente em browsers. O desafio será otimizar o carregamento (lazy load de partes não visíveis, virtualização de listas de arquivos, etc.) e talvez usar _Web Workers_ para operações pesadas (por ex., execução de IA ou análise de código) a fim de manter a UI responsiva. Na nuvem, ao integrar com Supabase e outros serviços, é preciso garantir que a arquitetura suporte múltiplos usuários simultâneos, com escalabilidade automática (especialmente se for lançado um serviço online do Bolt.DIY).
    
- **Segurança**: Introduzir um sistema de plugins que executam código traz riscos de segurança. É preciso isolar a execução de plugins (em sandbox, container ou com permissões limitadas) para evitar que plugins maliciosos afetem o sistema ou roubem dados do vault. Cuidado similar com fluxos de IA: se o usuário conectar APIs ou execuções externas, deve haver validações e avisos (ex: ao conectar uma chave de API, guardá-la de forma segura; ao executar código arbitrário via IA, alertar sobre possíveis consequências). Além disso, proteger a sincronização na nuvem (criptografia dos dados em trânsito e em repouso, autenticação robusta via Supabase ou outro serviço) para evitar acessos não autorizados.
    
- **Curva de Aprendizado e UX**: Unir conceitos distintos (edição de texto, código, fluxos visuais) pode confundir usuários se a interface não for bem planejada. Há o risco de sobrecarregar a UI com informações. O desafio será oferecer uma experiência intuitiva, talvez com painéis ou modos de uso distintos que o usuário pode alternar (modo edição vs. modo fluxo, etc.), e tutoriais embutidos para ensinar a usar cada funcionalidade. Aprender com a UX do Obsidian (que, apesar de poderoso, pode ser complexo inicialmente) e do n8n (que simplifica fluxos complexos) será importante para equilibrar poder e simplicidade.
    
- **Compatibilidade e Manutenção**: Ao integrar vários frameworks modernos, deve-se gerenciar compatibilidade de versões e atualizações. Por exemplo, se o Bolt.DIY usar um framework frontend (React/Next.js) e bibliotecas como Monaco Editor, React Flow, etc., atualizações futuras dessas libs podem quebrar funcionalidades. Um plano de manutenção e atualização contínua é necessário. Além disso, é preciso garantir que o Bolt.DIY funcione em diferentes sistemas operacionais (especialmente o componente local) ou navegadores – um desafio técnico de compatibilidade.
    
- **Comunidade e Conteúdo**: O sucesso do sistema de plugins e da biblioteca interna depende de adoção pela comunidade. Um risco é construir essas funcionalidades e não haver engajamento suficiente – poucos plugins desenvolvidos por terceiros, ou poucos templates adicionados à biblioteca. Para mitigar, seria interessante o projeto Bolt.DIY já disponibilizar alguns plugins e templates oficiais de alta qualidade no lançamento, para atrair usuários, e fornecer documentação clara de como desenvolver plugins/templates, incentivando contribuições. Também pode-se implementar um portal comunitário ou integração com GitHub para exposição desses recursos.
    

Em resumo, embora desafiador, o projeto tem um enorme potencial. Com gerenciamento cuidadoso desses riscos – focando em módulos independentes, testes rigorosos (especialmente para sincronização e segurança) e feedback de usuários desde cedo – é possível entregar uma plataforma inovadora que realmente agregue as melhores qualidades das ferramentas atuais em um único produto coeso.

---

# Roadmap Técnico Detalhado

Nesta seção apresentamos um **roadmap técnico** com o passo a passo de implementação da nova versão do Bolt.DIY, incluindo decisões de arquitetura, tecnologias a serem usadas, integrações externas e melhores práticas recomendadas. O roadmap está organizado em fases sequenciais, mas muitas dessas etapas podem ser desenvolvidas em paralelo por times diferentes, dada a modularidade proposta.

## Visão Geral da Arquitetura

**Arquitetura Proposta:** Será adotada uma arquitetura modular, separando claramente o **frontend** (interface do usuário, editores, orquestrador visual) do **backend** (serviços de sincronização, banco de dados na nuvem, execução de lógica pesada). O frontend será uma aplicação web (Single Page Application) possivelmente desenvolvida em **React** (ou Next.js para facilitar deploy na Vercel) para aproveitar o ecossistema web e componentes existentes (editores de código, diagramas, etc). O backend será construído sobre serviços gerenciados modernos: utilizaremos **Supabase** (solução open-source alternativa ao Firebase com banco Postgres, autenticação, APIs instantâneas, funções edge, realtime e storage integrados ([Supabase | The Open Source Firebase Alternative](https://supabase.com/#:~:text=Supabase%20is%20an%20open%20source,subscriptions%2C%20Storage%2C%20and%20Vector%20embeddings))) para autenticação de usuários, banco de dados (PostgreSQL) e armazenamento de arquivos na nuvem. Adicionalmente, podemos empregar _Edge Functions_ do Supabase ou funções serverless do Vercel para lógica customizada (por exemplo, processamento de sincronização ou execução de AI no servidor, se necessário).

**Vault Local vs Cloud:** Para o armazenamento local, se optarmos por um aplicativo desktop, poderíamos usar **Electron** ou **Tauri** para ter acesso nativo ao sistema de arquivos. Entretanto, visando uso totalmente web, podemos empregar a **File System Access API** (disponível em navegadores modernos) que permite a um web app ler e escrever em pastas locais mediante permissão do usuário. Assim, o Bolt.DIY rodaria no browser mas com acesso a uma pasta designada como vault local. Essa pasta seria monitorada usando APIs de mudança de arquivo ou verificações periódicas, com sincronização através do backend (Supabase ou Git). O **Git** pode ser usado nos bastidores para versionamento e merge de mudanças entre local e nuvem, ou alternativamente uma estratégia de _last write wins_ com registro de conflitos.

**Editor e Orquestrador:** O editor central será web-based, compondo vários sub-editores:

- Editor de Markdown e texto enriquecido – possivelmente usando um componente como **Markdown-it** (parser) com um editor WYSIWYG ou semi-WYSIWYG (por exemplo, **TipTap** ou **ProseMirror** para permitir edição Markdown com formatação).
- Editor de código – incorporaremos o **Monaco Editor** (motor do VS Code) para fornecer edição de código com realce de sintaxe, autocomplete básico e talvez integração com linting. Monaco permite múltiplas linguagens facilmente e poderia ser usado em modo multi-janela se precisarmos exibir mais de um arquivo lado a lado.
- Visualização de timeline – se “timelines” referir-se a cronogramas ou sequências temporais, podemos integrar bibliotecas como **vis.js Timeline** ou simplesmente usar gráficos baseados em HTML/CSS para representações simples. Alternativamente, se timeline referir-se ao histórico de versões/execuções, podemos ter uma visualização linear das ações realizadas (um log ou histórico).
- Visualização de **nodes** – para o orquestrador visual, a biblioteca **React Flow** ou **Dagre** (para grafos) será útil para desenhar o diagrama de nós conectados. O orquestrador será essencialmente um editor visual onde cada nó representa uma ação (chamada de função, execução de um prompt IA, condição lógica, etc.), e as arestas representam o fluxo de execução.

**Backend de IA & Execuções:** Para dar suporte ao "IA copiloto" e executar fluxos, a arquitetura incluirá integração com **APIs de IA** (por ex., OpenAI, HuggingFace) através de chamadas que podem ser feitas diretamente do frontend (cuidado com chaves de API expostas – possivelmente usar funções serverless como proxy) ou do backend. Alguns fluxos mais pesados ou que envolvam segredo (chaves, credenciais) devem rodar no backend seguro (por isso Supabase Edge Functions ou Vercel Functions). O orquestrador enviará uma representação serializada do fluxo para o backend executar quando necessário (ou fará execução passo-a-passo, acionando cada nó via eventos).

**Sistema de Plugins:** A arquitetura de plugins será baseada em módulos carregáveis dinamicamente. Podemos definir um padrão (por exemplo, cada plugin é um pacote npm, ou um arquivo JavaScript que exporta certas funções/classes seguindo uma interface definida). O core do Bolt.DIY exporá hooks ou APIs que os plugins podem usar para registrar novos comandos, novos tipos de nó no orquestrador, novos templates, etc. Para segurança, talvez isolar o plugin em Web Worker se for código não confiável, ou requerer assinatura/verificação para plugins instalados.

**Biblioteca Interna:** A biblioteca de templates e frameworks será hospedada centralmente (ex: repositório GitHub ou no próprio Supabase). O frontend terá um painel que consome uma lista (via API ou arquivo JSON versionado) dos itens disponíveis, exibindo nome, descrição, versão, etc., e permitindo download/instalação. Ao selecionar um template, o conteúdo (provavelmente um conjunto de arquivos) será baixado para o vault local ou mesclado ao projeto atual. A integração com Git permitirá manter esses templates atualizados; por exemplo, o Bolt.DIY pode periodicamente checar (ou via botão “Atualizar biblioteca”) se há novos templates no repositório oficial e atualizar a lista.

## Tecnologias e Ferramentas Principais

Listando as principais tecnologias, frameworks e serviços que serão utilizados e suas justificativas:

- **Vercel + Next.js**: Plataforma de deploy e framework React com SSR. Facilitará a hospedagem da interface web do Bolt.DIY, com benefícios como Edge Functions, roteamento otimizado e facilidade de integração com Git (deploy automatizado a cada commit). Next.js também permite eventualmente gerar um aplicativo estático ou híbrido, e integrar com Electron se optarmos por versão desktop.
- **Supabase**: Solução completa de backend (banco de dados Postgres, autenticação de usuários, storage de arquivos, funções serverless) gerenciada. Usaremos Supabase Auth para cadastro/login de usuários caso o Bolt.DIY tenha componentes cloud multiusuário. O banco Postgres via Supabase armazenará metadados do vault (por ex., índice de arquivos, histórico de versões ou logs do orquestrador). Supabase Storage poderá guardar backups de arquivos do vault ou arquivos binários (assets, imagens). A vantagem é ser uma _stack_ unificada e em tempo real (ex.: Supabase tem recurso de **Realtime** que poderia notificar o app de mudanças feitas por outro dispositivo).
- **React** (com libs complementares): Biblioteca base para construir a UI. Junto com React, utilizaremos **Tailwind CSS** para estilização rápida e consistente (ou outro framework CSS moderno). Os editores integrados virão de componentes de terceiros: **Monaco Editor** para código; **React Markdown** (ou TipTap) para Markdown; **React Flow** para diagramas de fluxo; possivelmente **Material UI** ou **Radix UI** para componentes de interface (menus, modais, etc.).
- **Electron/Tauri (opcional)**: Avaliaremos se é necessário criar um cliente desktop. Se muitos usuários desejarem acesso nativo a arquivos e melhor performance offline, um wrapper desktop com Electron poderá ser oferecido. Nesse caso, a maior parte do código pode ser reutilizada (a aplicação React rodaria dentro do Electron).
- **Node.js** (para scripts/CLI): Poderemos criar um utilitário CLI do Bolt.DIY para tarefas como inicializar um novo vault, executar sincronização manual ou instalar plugins via linha de comando. Node.js também estará presente caso implementemos um servidor próprio ou serviços auxiliares.
- **APIs e SDKs de IA**: Integração com APIs do OpenAI, ou uso de modelos open-source (por ex, via HuggingFace Hub) para features de AI copiloto. Poderia haver um micro-serviço que encapsula chamadas a IA (por exemplo, uma função serverless que recebe um prompt e retorna resposta usando uma chave de API armazenada de forma segura).
- **Git**: Utilizado tanto explicitamente (se o usuário habilitar controle de versão no vault, podendo conectar a um repositório GitHub/GitLab seu) quanto internamente (para sincronização, possivelmente cada alteração no vault é versionada e enviada ao servidor). A biblioteca JavaScript **isomorphic-git** pode ser usada para operações Git no browser, ou então delegar essa função ao backend (Supabase poderia armazenar diffs, mas talvez integrar Git diretamente seja mais robusto).
- **Bibliotecas utilitárias**: Para facilitar desenvolvimento, usaremos libs como **lodash** (utilidades JS), **date-fns** (manipulação de datas, se timelines envolverem datas), **yjs** ou **Automerge** (caso desejarmos colaboração em tempo real ou edição offline com posterior merge, essas libs ajudam na sincronização de estado de documentos).

## Etapas de Implementação

A seguir está o plano passo-a-passo para implementação, organizado de forma lógica. Cada etapa inclui um conjunto de tarefas que idealmente resultariam em um incremento funcional utilizável ou testável (metodologia ágil incremental):

1. **Planejamento e Setup Inicial**
    
    - **Definição do Escopo MVP:** Refinar exatamente quais recursos entram no _Minimum Viable Product_. Por exemplo, talvez no MVP o orquestrador visual seja simplificado (apenas fluxos lineares sem condições complexas) ou a biblioteca de templates venha com poucos exemplos. Definir isso orientará o desenvolvimento faseado.
    - **Setup do Repositório e Monorepo:** Iniciar um repositório (no GitHub) para Bolt.DIY nova versão. Considerar usar um monorepo (por ex., gerenciado com `pnpm` workspaces ou Nx) contendo ao menos dois pacotes: `webapp` (frontend React/Next.js) e `backend` (funções serverless ou scripts Node). Configurar integração contínua (CI) para rodar builds e testes. Já preparar o projeto para deploy na Vercel (ligar o repo à Vercel).
    - **Estrutura básica do Frontend:** Criar um projeto Next.js (TypeScript) limpo dentro do repositório. Configurar dependências principais (React, Tailwind, etc.). Confirmar que a página inicial roda na Vercel/localmente.
    - **Configuração do Supabase:** Criar um projeto no Supabase. Configurar tabelas iniciais se necessárias (por ex: tabela de usuários, tabela de metadata de arquivos). Integrar o SDK do Supabase no projeto Next.js – por ora, talvez só a autenticação (configurar fluxo de login simples, podendo usar providers OAuth sociais se for relevante). Testar conexão e talvez salvar/recuperar um dado de exemplo para garantir que comunicação está OK.
2. **Módulo Vault de Armazenamento (Local + Nuvem)**
    
    - **Implementar Vault Local:** No frontend, implementar um gerenciador de arquivos local. Começar simples: uma árvore de diretórios e arquivos visível na UI, listando conteúdo de uma pasta designada. Se estivermos no browser, usar a File System Access API: permitir o usuário selecionar uma pasta local para ser seu “Vault”. Salvar esse handle (com permissão) e ler recursivamente a estrutura (subpastas e arquivos Markdown/código). Exibir na sidebar. Se for ambiente desktop/Electron, usar módulos Node fs para listar arquivos.
    - **Operações CRUD no Vault:** Permitir criar nova nota/arquivo, editar nome, deletar, mover entre pastas. Cada operação refletirá no sistema de arquivos local imediatamente (ex.: criar um arquivo MD novo no disco). Lidar com permissões ou erros (ex: nome duplicado).
    - **Integração com Editor:** Conectar o clique em um arquivo na tree a abrir seu conteúdo no editor central apropriado. Ex: se é `.md`, abre no editor Markdown; se é `.js` ou `.py`, abre no editor de código; se for um tipo não reconhecido, talvez abre em texto bruto ou exibe aviso.
    - **Sincronização com Nuvem (Manual inicial):** Implementar uma ação de “Sync” que o usuário possa clicar para sincronizar o vault local com a nuvem. Uma estratégia simples: no backend, criar um **bucket** de storage no Supabase ou repositório Git. Ao clicar sync, o app pega todos os arquivos do vault local e envia para nuvem (faz upload no bucket ou faz commits Git). Em paralelo, baixa quaisquer novos arquivos do servidor que ainda não existem localmente. Resolver conflitos básicos (por agora, último timestamp ganha ou sempre prevalece o local, indicando se substituiu algo no servidor). Logar o que foi feito (exibir ao usuário quais arquivos subiram/desceram).
    - **Teste do Vault e Sync:** Realizar testes criando vários arquivos, editando, sincronizando, incluindo casos offline (editar sem internet e depois sincronizar). Garantir que nada é perdido. Nesse ponto, o usuário já deve conseguir usar o Bolt.DIY como um bloco de notas markdown local com backup manual na nuvem.
    - _(Opcional avançado:_ Integrar Supabase Realtime para detecção automática de mudanças na nuvem para sincronizar de volta ao local em tempo real.)
3. **Editor Central Unificado (Markdown + Código + Outros)**
    
    - **Editor Markdown:** Integrar um editor Markdown no painel central. Pode ser um _split view_ com modo edição e preview, ou um editor live preview. Por rapidez, usar um existente: ex. **React Markdown** para renderizar e um componente `textarea` aprimorado para edição, ou **TipTap** que suporta Markdown shortcuts. Implementar suporte a formatação básica (títulos, bold, italic, listas, code blocks). Confirmar salvamento automático: ao editar o arquivo, salvar no disco local imediatamente (ou em intervalo curto) – reutilizando a função de vault que escreve arquivo.
    - **Editor de Código:** Integrar Monaco Editor. Configurar para linguagens comuns (JavaScript, Python, etc., conforme necessidade). Exibir número de linhas, realce de sintaxe. Possibilitar abertura de múltiplos arquivos de código simultaneamente (talvez em abas ou splits). Implementar funcionalidade de busca global no vault (Monaco tem API para buscar texto em arquivos).
    - **Timelines e outros formatos:** Definir o que é o “timeline” no contexto do projeto. Se for uma **timeline textual** (ex: lista de eventos com datas), poderíamos suportar um formato Markdown especial ou um arquivo de configuração, então renderizar uma visualização de timeline (usando talvez biblioteca de timeline). Alternativamente, se for a timeline de atividades do projeto, apresentar um visual (linha do tempo com marcos). Nesta fase, talvez implementar somente um placeholder: por exemplo, permitir que um arquivo `.timeline` abra uma visualização simples (ex: interpretar linhas como eventos e mostrar com um componente timeline básico).
    - **Nós/Nodes (Graph View):** Implementar uma visualização de grafo para, possivelmente, mapear conexões entre notas ou entre módulos. Inspirando no **Graph view** do Obsidian que mostra notas ligadas por backlinks, podemos inicialmente mostrar um grafo das notas Markdown (baseado em links `[[...]]` entre elas). Usar D3.js ou Three.js (Obsidian 3D graph) seria complexo; em vez disso, podemos usar uma lib pronta de grafo 2D em React. O objetivo é ter pelo menos um visual indicando relações. Mais adiante, esse conceito de nodes será ampliado para o orquestrador (onde nodes são passos do fluxo).
    - **Layout e Gerenciador de Estados:** Garantir que o editor central suporte abrir/fechar múltiplos painéis. Utilizar um gerenciador de estado (ex: Redux ou Zustand) para compartilhar estado entre sidebar (vault) e editores. Ex: se um arquivo muda no disco (via sync), atualizar editor aberto se for o mesmo arquivo.
    - **Testes UI/UX:** Validar a experiência de criar notas e códigos, editar e ver que salva, abrir vários arquivos. Refinar detalhes de usabilidade (ex: atalho Ctrl+P para abrir pesquisa de arquivos estilo palette do VSCode, teclas para bold/italic no markdown, etc.). Preparar terreno para próximas integrações.
4. **Orquestração Visual de Fluxos de IA (Copiloto)**
    
    - **Base do Orquestrador:** Criar uma nova seção ou modo no aplicativo chamada "Fluxo" ou "Automação". Aqui, integrar **React Flow** para montar um canvas onde o usuário pode arrastar e soltar nós (_nodes_). Definir um conjunto inicial de tipos de nó:
        - **Início** (nó inicial do fluxo, ponto de partida).
        - **Ação de IA** (chamada a um modelo de linguagem com determinado prompt).
        - **Condicional** (verifica uma condição no contexto e desvia para ramo verdadeiro/falso).
        - **Ação de código** (executa um script ou chama uma função customizada).
        - **Fim** (indica término do fluxo e possivelmente um resultado). Cada nó terá campos configuráveis (no painel lateral talvez): ex: nó de IA tem um campo para escrever o _prompt_ e escolher modelo (GPT-4, etc.), nó de ação de código aponta para um arquivo ou snippet de código no vault, etc.
    - **Execução do Fluxo (Engine):** Desenvolver a lógica que percorre o grafo de nós executando cada passo. Isso pode ser feito no frontend para rapidez de teste (executando sequencialmente com async/await), mas preferencialmente no backend por robustez. Escolher representação JSON do fluxo: ao montar no UI, gerar um JSON (ou outro DSL) que lista nós e conexões. Implementar um interpretador desse fluxo. Exemplo: um módulo que recebe o JSON, e para cada nó:
        - Se tipo IA: faz requisição à API correspondente (OpenAI, etc.) com os parâmetros.
        - Se tipo condicional: avalia a expressão (talvez em JavaScript ou usando um pequeno parser).
        - Se tipo código: carrega e executa (com sandbox) o código referenciado.
        - Envia resultado à próxima aresta/nó. Lidar com estado compartilhado (um contexto que acumula variáveis conforme o fluxo avança). Para MVP, a execução pode ser iniciada manualmente (usuário clica "Executar fluxo") e o status de cada nó (em execução, concluído, erro) reflete visualmente no diagrama.
    - **Interface do Copiloto IA:** Incorporar a noção de “IA Copiloto” – possivelmente um chatbot ou assistente que ajuda a montar o fluxo. Por exemplo, um campo de prompt onde o usuário descreve o que quer, e a IA sugere construir os nós automaticamente ou dá dicas. Inicialmente, isso pode ser simplificado: um chatbot no canto da tela (usando alguma lib de chat UI) que responde perguntas do usuário sobre como usar o fluxo, ou até insere exemplos.
    - **Integração com Vault e Editor:** Conectar o orquestrador com o restante: permitir que um nó de ação referencie um arquivo de código do vault (p.ex., o usuário escolhe um arquivo existente para executar naquela etapa). Permitir salvar fluxos criados também no vault (como um arquivo `.flow.json`, por exemplo). Assim, fluxos podem ser versionados/sincronizados como qualquer outro conteúdo.
    - **Exemplo e Teste de Fluxo:** Construir um fluxo de exemplo (tal como: pegar uma pergunta do usuário, consultar um modelo de IA, e dependendo da resposta salvar em um arquivo). Testar esse fluxo integrando todos componentes reais (chamada de API real, etc.). Ajustar performance – talvez inserir delays artificiais ou streaming de resposta da IA para feedback em tempo real.
    - **Comparação com Flowise/n8n:** Confirmar que nosso orquestrador atinge pelo menos funcionalidades básicas comparáveis. Por exemplo, Flowise permite construir chatbots facilmente ( [The Drag-and-Drop UI for Building LLM Flows: Flowise AI - KDnuggets](https://www.kdnuggets.com/2023/07/draganddrop-ui-building-llm-flows-flowise-ai.html#:~:text=What%20is%20Flowise%20AI%3F)) – testar se conseguimos reproduzir um mini chatbot com nosso sistema. n8n integra com muitos serviços – avaliar arquitetura para futuramente adicionar nós de integração (HTTP request genérico, acesso a Google Sheets, etc. via plugins).
5. **Sistema de Plugins/SDKs Modular**  
    _(Nota: entregue também como um documento separado detalhando a arquitetura de plugins – ver seção “Sistema de Plugins/SDKs” abaixo.)_
    
    - **Design da API de Plugins:** Definir como um plugin pode estender o Bolt.DIY. Por exemplo, um plugin poderia:
        - Adicionar um novo comando ou opção de menu no editor (ex: um plugin “Formatar Código” que aparece no menu contextual).
        - Adicionar um novo tipo de nó no orquestrador (ex: integração com um serviço externo).
        - Fornecer um novo _copiloto_ (IA especializada) para ajudar em tarefas específicas. Tecnicamente, isso implica que o core do Bolt.DIY expose certos _hooks_. Decidir formato: possivelmente cada plugin é um arquivo JS que registra seus componentes. Uma opção é usar a arquitetura de **plugins baseada em módulos ES** – o plugin exporta uma função `activate(app)` que recebe uma instância da aplicação e então chama métodos para registrar extensões.
    - **Implementação do Carregador de Plugins:** Criar no app um gerenciador de plugins. Este módulo vai poder **carregar/descarregar** plugins sob demanda. Se plugins forem pacotes npm, permitir indicar um URL ou caminho e usar `import()` dinâmico para carregá-lo. Se forem arquivos no vault (ex: `plugins/meu-plugin/plugin.js`), permitir carregá-los (neste caso, cuidado de segurança – talvez apenas plugins da biblioteca interna ou de fontes confiáveis no início).
    - **UI de Gestão de Plugins:** Adicionar uma seção nas configurações ou na biblioteca para listar plugins instalados, ativar/desativar e instalar novos. Instalação de novo plugin pode ser via marketplace (similar à biblioteca de templates) ou via import de arquivo. Mostrar nome, versão, descrição de cada plugin.
    - **Plugins como Copilotos:** Para demonstrar, criar um plugin de exemplo – por exemplo, “Gerador de Testes Unitários” que, quando ativado, adiciona um botão no editor de código que ao clicar lê o código aberto e usa a IA (via OpenAI API) para gerar esqueleto de testes. Esse plugin serviria de referência de como um desenvolvedor poderia usar as APIs do Bolt.DIY (ler conteúdo do editor, chamar IA, criar novo arquivo de teste no vault, etc.).
    - **Documentação (SDK):** Redigir documentação para desenvolvedores de plugin, explicando a estrutura de um plugin, APIs disponíveis, e talvez fornecer um SDK (conjunto de tipos TypeScript e funções utilitárias) para facilitar. Essa documentação pode residir no repositório (arquivo README.md dentro da pasta `plugins-sdk` ou similar).
    - **Segurança de Plugins:** Implementar medidas de segurança simples – por exemplo, sandboxing: se possível, avaliar execução de plugins dentro de Web Worker para isolar (precisaria expor postMessage APIs para interagir com main thread). Outra medida: exigir assinatura ou marcar plugins de terceiros não verificados com aviso ao usuário.
6. **Biblioteca Interna de Templates/Frameworks**  
    _(Também complementado por documento separado conforme seção “Biblioteca Interna...”)._
    
    - **Repositório Central:** Configurar um repositório (GitHub, por exemplo) para hospedar os templates, frameworks e SDKs oficiais do Bolt.DIY. Pode ser um repositório simples com uma estrutura como: `templates/<nome>/` contendo arquivos de um template (por ex., um projeto de exemplo em Node.js, ou um conjunto de prompts pré-prontos). Incluir um manifesto (JSON) listando todos templates com metadados (nome, descrição, versão, compatibilidade).
    - **Catálogo no App:** Implementar no frontend uma página ou modal “Biblioteca” onde são listados os templates/frameworks disponíveis. Consumir a lista do manifesto via requisição. Apresentar categorias (se houver, ex: “Templates de Projeto”, “Snippets de Código”, “Fluxos Prontos”, “SDKs/Dependências”). Incluir busca/filtro.
    - **Download/Sincronização:** Quando o usuário escolhe obter um template, a aplicação faz o download dos arquivos correspondentes. Se for um repositório Git, podemos usar a API raw do GitHub para pegar arquivos individuais ou oferecer um zip. Supabase Storage também poderia armazenar zips dos templates para download otimizado. Ao baixar, colocar os arquivos no vault local (possivelmente dentro de uma subpasta específica ou direto na pasta atual aberta, dependendo do tipo – ex: um template de projeto pode ser colocado em uma nova pasta).
    - **Versões e Atualizações:** Incluir no manifesto a versão de cada item e talvez um hash. Permitir que a biblioteca avise se há atualização de um template já baixado (por exemplo, usuário baixou v1.0 e agora existe v1.1, sugerir atualização). Isso requer comparar versões e talvez armazenar em localStorage quais foram baixados.
    - **Integração com Plugins:** A biblioteca também pode listar _plugins_ disponíveis (muita similaridade técnica). Talvez unificar a ideia de “Marketplace” onde há diferentes tipos de pacotes (templates de código, plugins de funcionalidade, fluxos de exemplo, etc.). Isso pode ficar para uma fase posterior, mas deixaremos preparado.
    - **Teste de Template:** Incluir alguns templates de exemplo no repo central antes de integrar. Ex: um template de “Aplicação Next.js + Express + Supabase” e um “Exemplo de Fluxo de Chatbot”. Testar baixá-los via app e verificar se arquivos aparecem corretamente no vault, prontos para uso.
7. **Refinamento Final, Testes e Lançamento**
    
    - **Testes Integrados:** Agora com todos os módulos (vault, editores, fluxo, plugins, biblioteca) implementados em estado bruto, realizar testes integrados. Criar cenários de uso: do zero, um usuário consegue iniciar um projeto (usando template da biblioteca), editar arquivos, criar notas, montar um fluxo, instalar um plugin, e possivelmente implantar algo. Nessa fase serão descobertos diversos _bugs_ e inconsistências – priorizar correções especialmente nos pontos de integração (ex: um arquivo criado pelo fluxo aparece imediato no vault? Um plugin adicionado é persistido nas configurações? E assim por diante).
    - **Melhorias de UI/UX:** Com feedback dos testes, polir a interface. Talvez adicionar indicadores de salvamento (ícone de sincronização girando quando em progresso), implementar arrastar-e-soltar de arquivos na árvore, melhorias na visualização do fluxo (panning/zooming no canvas), etc. Garantir responsividade se for usar em diferentes tamanhos de tela.
    - **Documentação e Tutorial:** Elaborar documentação do usuário (em Markdown dentro do vault oficial ou wiki do projeto). Um tutorial onboarding dentro do app também seria útil: exibir dicas ou um tour guiado na primeira execução mostrando recursos. Como este projeto tem certa complexidade, uma boa documentação é crucial para adoção.
    - **Preparação para Deploy/Distribuição:** Configurar o build final para produção. Se for somente web, a Vercel já cuidará do deploy (garantir variáveis de ambiente para Supabase, keys de API, etc. estejam configuradas). Se houver versão desktop, empacotar com Electron builder ou similar. Criar uma página de download ou site oficial destacando os features (o marketing do projeto).
    - **Lançamento Beta e Iteração:** Liberar uma versão beta para alguns usuários ou comunidade fechada, coletar feedback, e então lançar publicamente a versão 1.0. A partir daí, planejar updates incrementais (versão 1.1, etc.) incorporando sugestões e talvez funcionalidades que ficaram de fora do MVP inicial (ex: colaboração em tempo real, mais integrações de IA, etc.).

## Dependências e Integrações Específicas

Resumindo as integrações externas e dependências tecnológicas do Bolt.DIY:

- **Vercel:** Hospedagem contínua do front-end. Usada para garantir escalabilidade e facilidade de implantação. Integração com Git (deploy automatizado a cada commit na branch main). Possibilidade de usar Vercel Functions se necessário para lógica serverless próxima ao front.
- **Supabase:** Backend principal – inclui Auth (provavelmente email/password e OAuth), Database (armazenar dados estruturados como definições de fluxo, preferências do usuário, lista de plugins instalados, etc.), Storage (arquivos do vault na nuvem e possivelmente assets de usuário), e Edge Functions (para rotina de sync ou executores do fluxo de IA se não feito no front).
- **Flowise (inspiração ou componente):** Podemos considerar usar parte do Flowise diretamente, dado que é open-source. Por exemplo, o Bolt.DIY poderia rodar uma instância do Flowise internamente para gerenciar fluxos de LLM, enquanto a UI do Bolt.DIY interage via API. Entretanto, integrar todo o Flowise pode ser complexo; mais viável é aprender com ele e possivelmente usar o **LangChain.js** (que é dependência do Flowise) para implementar alguns nós de IA internamente. De qualquer forma, manter em mente compatibilidade – ex: talvez permitir exportar um fluxo do Bolt.DIY para o formato do Flowise e vice-versa no futuro.
- **n8n (integrações de serviços):** Similarmente, não vamos incorporar n8n, mas poderíamos usar suas APIs ou ideias para integrar serviços externos. Por exemplo, n8n possui mais de 400 integrações ([GitHub - n8n-io/n8n: Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.](https://github.com/n8n-io/n8n#:~:text=n8n%20,for%20Technical%20Teams)) – poderíamos usar suas definições como referência ao criar plugins de integração no Bolt.DIY.
- **Monaco Editor:** Dependência do editor de código. Garantir carregar apenas os web workers e languages necessários para não pesar demais. Integração via `@monaco-editor/react` ou similar.
- **React Flow:** Dependência para orquestrador visual (fluxos).
- **Linguagens de Programação Suportadas:** Node.js/TypeScript para o desenvolvimento principal. Potencialmente Python se quisermos permitir execução de scripts Python no fluxo (nesse caso, talvez usar WebAssembly com Pyodide para rodar Python no navegador, ou executar Python via backend).
- **APIs de terceiros:** OpenAI API (para IA copiloto), GitHub API (se quisermos integração para importar repositórios ou enviar issues desde o Bolt.DIY), etc. Listar e obter as chaves necessárias, e integrar via SDKs ou chamadas REST.
- **Controle de Versão e Colaboração:** Integração com GitHub/GitLab para permitir que o vault seja um repositório git remoto. Isso não é obrigatório graças ao Supabase, mas muitos devs podem preferir push para Git. Poderíamos usar a API do GitHub para criar repositório e push inicial automaticamente, se quisermos uma experiência suave. Deixar isso como integração optativa do usuário.
- **Ambiente de Execução Segura:** Se o Bolt.DIY permitir executar código (JavaScript ou Python) diretamente como parte do fluxo ou plugins, considerar usar sandbox via **VM2** (uma biblioteca Node) ou Web Workers no browser. Isso é uma dependência a avaliar para segurança.

## Melhores Práticas e Considerações Adicionais

- **Desenvolvimento Incremental:** A implementação deve seguir uma metodologia ágil, liberando versões parciais para teste. Por exemplo, lançar primeiramente apenas o Vault+Editor para validar a estabilidade básica antes de acrescentar o orquestrador e plugins.
- **Testing**: Escrever testes automatizados onde fizer sentido. Testes unitários para funções críticas (sync, parser de fluxo), testes de integração simulando uso do vault e fluxos. Além disso, testes de UI (com Cypress ou Playwright) para fluxos principais do usuário.
- **Performance Monitoring:** Usar ferramentas de monitoramento (como logs no Supabase ou um serviço tipo Sentry) para capturar erros em produção, e métricas de uso para entender quais funcionalidades são mais usadas e onde otimizar.
- **Modularidade:** Manter o código modular. Por exemplo, o orquestrador deve ser um módulo separado que não dependa de detalhes do editor, para eventualmente até poder ser extraído como lib. As APIs de plugins devem interagir via interfaces, não acesso direto a estados internos, para evitar acoplamento forte.
- **Documentação interna do código:** Manter comentários e READMEs em cada subpacote (e possivelmente gerar docs do código com ferramentas como TypeDoc) para facilitar que outros contribuidores desenvolvam o projeto no futuro, especialmente se espera-se comunidade contribuindo com plugins e templates.
- **Segurança e Auth:** Desde o início, projetar o sistema de autenticação e autorização. Se o Bolt.DIY permitir multiusuários e acesso cloud, garantir que cada usuário só acesse seu vault. Usar regras do Supabase (Row Level Security) para proteger dados por usuário. Plugins e fluxos talvez tenham permissões – ex: um plugin pede acesso à internet, o usuário deve conceder. Esses detalhes de segurança devem ser revistos por especialistas antes do lançamento final.
- **Scalabilidade Financeira:** Se for um serviço público, calcular custos de Supabase (plano pago conforme uso), Vercel (builds e edge functions custam conforme uso). Implementar cache local e evitar chamadas desnecessárias para economizar. Se o número de usuários crescer muito, estar pronto para mover componentes críticos para infra própria (ex: migrar Postgres do Supabase para um gerido self-hosted, etc).
- **Feedback Loop:** Durante desenvolvimento, coletar opiniões (talvez de um pequeno grupo de usuários beta). Isso pode redefinir prioridades do roadmap – por exemplo, se constatar que a orquestração visual é muito complexa para usuários, focar em melhorar UI ou oferecer fluxos pré-prontos na biblioteca para facilitar adoção.

Este roadmap fornece um **caminho estruturado** para atingir os objetivos do Bolt.DIY. No próximo item, detalhamos a lista de prompts que podem ser usados para orientar uma IA desenvolvedora a implementar cada parte deste roadmap, seguindo as etapas listadas.

---

# Lista de Prompts da IA Desenvolvedora

A seguir apresentamos uma lista de prompts detalhados que podem ser utilizados para orientar uma Inteligência Artificial Desenvolvedora (por exemplo, usando ferramentas como GPT-4) a implementar as funcionalidades planejadas. Cada prompt foi elaborado com uma descrição precisa da tarefa, arquivos envolvidos, justificativa da implementação, código esperado (quando aplicável) e integrações ou dependências a considerar. Esses prompts podem servir como roteiro para a IA gerar os códigos correspondentes passo a passo, seguindo o roadmap técnico.

> **Nota:** Os prompts estão em português e seguem um formato consistente para facilitar o entendimento. As instruções entre colchetes `< ... >` indicam comentários ou ações esperadas, não fazendo parte do texto enviado à IA.

### Prompt 1: Configuração Inicial do Projeto

📜 **Descrição:** Configurar o projeto Bolt.DIY criando a estrutura básica de pastas e arquivos, incluindo um projeto frontend em Next.js e integração com Supabase.

📝 **Arquivos:**

- Criar um novo projeto Next.js (pasta `bolt-frontend/` com estrutura padrão, incluindo `pages/_app.tsx`, `pages/index.tsx`, etc.).
- Adicionar arquivo de configuração do Supabase (`utils/supabaseClient.ts`).
- Modificar `pages/index.tsx` para exibir uma mensagem de boas-vindas e verificar conexão com Supabase (por ex., tentar buscar dados de uma tabela de teste).
- Arquivo `package.json` com dependências iniciais (`next`, `react`, `react-dom`, `@supabase/supabase-js`, etc.).

🔧 **Motivo:** Esta configuração inicial estabelece o esqueleto do projeto, permitindo que partes posteriores (vault, editor, etc.) sejam incorporadas em cima de uma base Next.js funcional. Integrar Supabase desde o começo garante que tenhamos prontos os utilitários para autenticação e chamadas ao backend conforme necessário.

💾 **Código:** Fornecer o código de inicialização do Supabase (URL e chave pública de projeto devem ser placeholders configuráveis). Exemplo de `utils/supabaseClient.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

No `pages/index.tsx`, demonstrar uso:

```tsx
import { supabase } from '../utils/supabaseClient'
import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('Conectando ao Supabase...')
  useEffect(() => {
    supabase.from('TestTable').select('*').then(res => {
      if(res.error) {
        setMessage('Supabase conectado com sucesso!')
      } else {
        setMessage('Dados recebidos: ' + JSON.stringify(res.data))
      }
    })
  }, [])
  return <div>{message}</div>
}
```

_(O código acima é ilustrativo; assumimos que existe uma tabela `TestTable` ou tratamos o caso de erro para confirmar apenas a conexão.)_

🔗 **Integrações e dependências:** Certifique-se de definir as variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para conectar ao projeto Supabase. Inclua no `README.md` instruções de como configurar essas variáveis e rodar o projeto (`npm install` e `npm run dev`). Não esqueça de instalar as dependências listadas (`npm install next react react-dom @supabase/supabase-js`). Após esse passo, deverá ser possível rodar o front-end e ver a mensagem de conexão à base.

---

### Prompt 2: Implementar Vault Local (Leitura de Arquivos do Sistema)

📜 **Descrição:** Implementar funcionalidade de selecionar uma pasta local como **Vault** e listar seus arquivos e diretórios na interface (sidebar), usando a File System Access API.

📝 **Arquivos:**

- Criar componente `components/VaultSelector.tsx` que contém um botão "Abrir Vault" para o usuário selecionar a pasta local.
- Criar componente `components/FileTree.tsx` para mostrar a estrutura de arquivos/pastas do vault.
- Modificar `pages/_app.tsx` ou criar um contexto global para armazenar o handle da pasta selecionada e a lista de arquivos.
- Adicionar estilos básicos para a árvore de arquivos (pode ser uma simples lista aninhada ul/li por enquanto).

🔧 **Motivo:** O vault local é central para o Bolt.DIY. Esta tarefa permite o usuário apontar onde estão seus arquivos, dando à aplicação acesso para ler e gerenciar esse conteúdo. Listar a árvore de arquivos é o primeiro passo para edição e outras operações. Usando a File System Access API moderna, conseguimos isso no navegador sem componentes nativos, tornando a aplicação acessível via web.

💾 **Código:** No `VaultSelector.tsx`, usar a API `window.showDirectoryPicker()`:

```tsx
export function VaultSelector({ onVaultPicked }) {
  const openVault = async () => {
    try {
      const dirHandle = await window.showDirectoryPicker()
      onVaultPicked(dirHandle)
    } catch (e) {
      console.error("Seleção de vault cancelada ou falhou", e)
    }
  }
  return <button onClick={openVault}>📂 Abrir Vault...</button>
}
```

No `FileTree.tsx`, percorrer recursivamente o FileSystemHandle:

```tsx
import { useEffect, useState } from 'react'

export function FileTree({ directoryHandle }) {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const readDirectory = async (dirHandle) => {
      const items = []
      for await (const entry of dirHandle.values()) {
        items.push({ name: entry.name, handle: entry, kind: entry.kind })
      }
      // Ordenar: pastas primeiro, depois arquivos, ambos alfabeticamente
      items.sort((a, b) => {
        if(a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1
        return a.name.localeCompare(b.name)
      })
      setEntries(items)
    }
    if(directoryHandle) {
      readDirectory(directoryHandle)
    }
  }, [directoryHandle])

  if(!directoryHandle) return null

  return <ul>
    {entries.map(entry => (
      <li key={entry.name}>
        {entry.kind === 'directory' ? '📁' : '📄'} {entry.name}
        {entry.kind === 'directory' && 
           <FileTree directoryHandle={entry.handle} /> }
      </li>
    ))}
  </ul>
}
```

No `_app.tsx` (ou componente principal), gerenciar o estado:

```tsx
const [vaultHandle, setVaultHandle] = useState(null)
...
<VaultSelector onVaultPicked={setVaultHandle} />
{vaultHandle && <FileTree directoryHandle={vaultHandle} />}
```

_(O código acima produz uma lista hierárquica de arquivos/pastas. Melhorias como seleção ao clicar, ou carregamento sob demanda de subpastas, podem ser feitas depois.)_

🔗 **Integrações e dependências:** Esta funcionalidade é puramente front-end. Verifique compatibilidade: a File System Access API funciona em Chrome/Edge/Opera. Para Firefox/Safari, é experimental ou inexistente – possivelmente exibir um aviso nesses navegadores de que o recurso não é suportado. Se necessário, podemos planejar um fallback (por exemplo, pedir upload de um zip do vault, mas isso foge do ideal). Nenhuma dependência externa adicional é necessária aqui. Teste manual: selecionar uma pasta com alguns arquivos e subpastas e verificar se a árvore aparece corretamente.

---

### Prompt 3: Abrir e Editar Arquivos do Vault no Editor (Markdown e Código)

📜 **Descrição:** Permitir que ao clicar em um arquivo no **FileTree**, seu conteúdo seja exibido e editável no editor central. Implementar abertura de arquivos Markdown (`.md`) em um editor Markdown com visualização e arquivos de código (`.js`, `.py`, etc.) no Monaco Editor.

📝 **Arquivos:**

- Modificar `FileTree.tsx` para detectar cliques em arquivos e chamar uma função de callback `onFileOpen(fileHandle)`.
- Criar contexto ou estado global `currentFile` que guarda o handle do arquivo atualmente aberto e seu conteúdo.
- Criar componente `EditorArea.tsx` que mostra o editor adequado conforme o tipo do arquivo atual.
- Dentro de `EditorArea`, sub-componentes ou condicional: `MarkdownEditor` e `CodeEditor`. O `CodeEditor` usará Monaco (adicionar pacote `@monaco-editor/react`).
- Ajustar layout (CSS) para dividir a tela: sidebar (FileTree) e área de editor lado a lado.

🔧 **Motivo:** Essa etapa conecta o vault com o editor, para que o usuário possa visualizar e modificar seus arquivos. Suportar Markdown e código abrange a maioria dos casos de uso. Separar os editores por tipo permite otimizar a UX para cada (ex: Markdown com preview, código com syntax highlight). Essa implementação também prepara terreno para recursos como múltiplos arquivos abertos simultaneamente.

💾 **Código:** No `FileTree.tsx`, adicionar callback no item de arquivo:

```tsx
<li key={entry.name} onClick={() => entry.kind === 'file' && onFileOpen(entry.handle)}>
  📄 {entry.name}
</li>
```

No componente principal (por ex., `pages/index.tsx`), gerenciar abertura:

```tsx
const [currentFile, setCurrentFile] = useState({ handle: null, content: '', name: '' })

const openFile = async (fileHandle) => {
  const fileData = await fileHandle.getFile()
  const text = await fileData.text()
  setCurrentFile({ handle: fileHandle, content: text, name: fileHandle.name })
}
...
<FileTree directoryHandle={vaultHandle} onFileOpen={openFile} />
<EditorArea file={currentFile} onChange={(newContent) => {
    setCurrentFile(prev => ({...prev, content: newContent}))
}} />
```

Implementação do `EditorArea.tsx`:

```tsx
import dynamic from 'next/dynamic'
const MonacoEditor = dynamic(import('@monaco-editor/react'), { ssr: false })

export function EditorArea({ file, onChange }) {
  if(!file || !file.handle) return <div>Abra um arquivo para visualizar</div>

  const isMarkdown = file.name.endsWith('.md')
  const content = file.content

  const handleChange = async (newValue) => {
    onChange(newValue)
    // salvar no sistema de arquivos
    try {
      const writable = await file.handle.createWritable()
      await writable.write(newValue)
      await writable.close()
    } catch(e) {
      console.error("Erro ao salvar arquivo:", e)
    }
  }

  return (
    <div className="editor-area">
      {isMarkdown ? (
        <div className="md-editor">
          <textarea 
            value={content} 
            onChange={e => handleChange(e.target.value)} />
          <div className="md-preview" 
               dangerouslySetInnerHTML={{__html: markdownToHtml(content)}} />
        </div>
      ) : (
        <MonacoEditor 
           height="90vh"
           defaultLanguage={/* derivar da extensão */}
           value={content}
           onChange={(val) => handleChange(val ?? '')}
        />
      )}
    </div>
  )
}
```

Acima, `markdownToHtml` seria uma função utilitária simples usando uma biblioteca como **marked** ou **markdown-it** para converter Markdown em HTML para preview.

Integração do Monaco Editor:

- Instalar pacote: `npm install @monaco-editor/react`.
- O dynamic import é usado porque Monaco não funciona no SSR do Next.js.
- Possivelmente carregar configurações de linguagem baseado na extensão do arquivo (poderíamos mapear `.js`->javascript, `.py`->python, etc., ou usar `Monaco.editor.getModel...`).

🔗 **Integrações e dependências:** Instalar `@monaco-editor/react` e também uma biblioteca Markdown (por exemplo, `marked`). Lembrar de incluir no HTML global algum estilo básico para a pré-visualização Markdown (ex: estilizar `<code>`, títulos, etc.). Testar: abrir um arquivo .md (deve exibir textarea e preview lado a lado atualizando), abrir um .js (deve mostrar o Monaco com destaque). Verificar se a função de salvamento está escrevendo no arquivo real (por ex., editar e depois reabrir o arquivo deve mostrar mudança persistida). Atenção a desempenho: arquivos grandes no textarea podem ser lentos – Monaco lida melhor com esse caso.

---

### Prompt 4: Sincronização com Nuvem (Upload/Download)

📜 **Descrição:** Implementar a sincronização do vault local com a nuvem, usando Supabase Storage (ou outra abordagem simples). Criar função para fazer upload de todos os arquivos locais para o storage remoto e baixar arquivos inexistentes localmente do remoto.

📝 **Arquivos:**

- Criar utilitário `utils/syncVault.ts` com funções `uploadAll(directoryHandle)` e `downloadAll(directoryHandle)`.
- Configurar no Supabase um bucket chamado, por exemplo, "vaults" onde os arquivos serão armazenados (com regras de acesso privado, por usuário).
- Adicionar um botão "Sync" na UI (por exemplo, na barra superior) que ao clicar executa upload e download.
- Opcional: algum indicador de progresso ou conclusão (alerta ou console log).

🔧 **Motivo:** A sincronização garante backup e acesso remoto aos arquivos do usuário, permitindo transição transparente entre dispositivos ou simplesmente segurança dos dados. Nesta fase inicial, implementamos de forma simplificada (full upload/download) para garantir funcionalidade, mesmo que não seja a mais eficiente. Posteriormente pode-se otimizar para sync incremental ou integração com Git.

💾 **Código:** Exemplo de `uploadAll` usando Supabase JS:

```ts
import { supabase } from './supabaseClient'

export async function uploadAll(dirHandle, path = '') {
  for await (const entry of dirHandle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name
    if(entry.kind === 'file') {
      const file = await entry.getFile()
      const { error } = await supabase.storage
        .from('vaults')
        .upload(entryPath, file, { upsert: true })
      if(error) console.error('Erro ao enviar:', entryPath, error.message)
    } else if(entry.kind === 'directory') {
      await uploadAll(entry, entryPath)
    }
  }
}
```

E `downloadAll`:

```ts
export async function downloadAll(dirHandle, path = '') {
  const { data, error } = await supabase.storage.from('vaults').list(path || '', { limit: 1000, offset: 0 })
  if(error) {
    console.error('Erro ao listar storage:', error.message)
    return
  }
  for(const item of data) {
    if(item.name === '.'){ continue } // ignorar referência ao dir atual
    const itemPath = path ? `${path}/${item.name}` : item.name
    if(item.type === 'file') {
      const { data: fileData, error: downloadError } = await supabase.storage.from('vaults').download(itemPath)
      if(downloadError) {
        console.error('Erro ao baixar:', itemPath, downloadError.message)
      } else if(fileData) {
        // Escrever arquivo localmente
        const blob = fileData
        const fileHandle = await dirHandle.getFileHandle(item.name, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(await blob.arrayBuffer())
        await writable.close()
      }
    } else if(item.type === 'folder') {
      const newDirHandle = await dirHandle.getDirectoryHandle(item.name, { create: true })
      await downloadAll(newDirHandle, itemPath)
    }
  }
}
```

No componente UI:

```tsx
<button onClick={async () => {
  if(vaultHandle) {
    await uploadAll(vaultHandle)
    await downloadAll(vaultHandle)
    alert('Sincronização concluída!')
  }
}}>🔄 Sync</button>
```

_(O código presume que o bucket "vaults" do Supabase está configurado para que o caminho raiz corresponde ao vault do usuário. Em prática, poderia ser `userId/` como prefixo, mas aqui omitimos para simplicidade.)_

🔗 **Integrações e dependências:** Assegure-se de ter criado o bucket "vaults" no Supabase e configurado as regras de acesso (por exemplo, usando o user ID como parte do path, garantir que cada usuário só veja seus arquivos). O exemplo acima não incluiu o userId; idealmente, usaríamos `entryPath = userId + '/' + (path?...)` para isolar. Para obter userId: `const user = supabase.auth.user();`. Adapte o código para incluir isso. Teste a sincronização: criar arquivo local, fazer upload, deletar local, fazer download para ver se retorna. E vice-versa (adicionar arquivo via Supabase web interface e depois download). Lembrar de tratar quantidade de arquivos (Supabase list por padrão limita a 1000 itens, o código acima já prevê offset se necessário ou pode iterar). Em caso de muitos arquivos, considerar performance e talvez exibir progresso.

---

### Prompt 5: Implementar Orquestrador Visual Básico (Nós e Arestas)

📜 **Descrição:** Integrar um canvas de orquestração visual que permita adicionar “nós” e conectar fluxos entre eles, representando um workflow. Implementar tipos básicos de nó: **Início**, **Ação IA**, **Condição**, **Fim**. Não precisa executar lógica ainda, apenas construção visual e serialização do fluxo em JSON.

📝 **Arquivos:**

- Instalar biblioteca React Flow (`npm install react-flow-renderer`).
- Criar página ou componente `Orchestrator.tsx` contendo o `<ReactFlow />` com um estado de nós e arestas.
- Definir nodeTypes customizados: criar componentes React para cada tipo de nó (por ex: `StartNode`, `AiNode`, `IfNode`, `EndNode`).
- Estado local ou contexto para guardar os nós e conexões (edges). Fornecer funções para adicionar novos nós (ex: botões ou drag-and-drop a partir de uma paleta simples).
- Serialização: função para exportar os nós/edges atuais para JSON (contendo id, tipo, posição, e dados específicos de cada nó).

🔧 **Motivo:** Este é o alicerce da funcionalidade de fluxos condicionais e IA copiloto. Primeiro criamos a interface de construção do fluxo, similar a ferramentas low-code. Isso por si só já permite o usuário desenhar diagramas. A execução real virá depois, mas ter a estrutura e JSON pronto facilita integrar o mecanismo. Ao focar nos tipos básicos, mantemos o escopo controlado.

💾 **Código:** Montagem inicial do React Flow:

```tsx
import ReactFlow, { addEdge } from 'react-flow-renderer'
import { useCallback, useState } from 'react'

const initialNodes = [
  { id: 'start-1', type: 'startNode', position: { x: 50, y: 50 }, data: { label: 'Início' } }
]
const initialEdges = []

export default function Orchestrator() {
  const [nodes, setNodes] = useState(initialNodes)
  const [edges, setEdges] = useState(initialEdges)
  const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), [])
  const onNodesChange = useCallback((changes) => setNodes(ns => applyNodeChanges(changes, ns)), [])
  const onEdgesChange = useCallback((changes) => setEdges(es => applyEdgeChanges(changes, es)), [])

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{
          startNode: StartNode,
          aiNode: AiNode,
          ifNode: IfNode,
          endNode: EndNode
        }}
        fitView
      />
    </div>
  )
}
```

Definição simples de componentes de nó:

```tsx
function StartNode({ data }) {
  return <div style={{padding:5, background:'#D5F5E3', borderRadius:5}}>
    <strong>Início</strong>
  </div>
}
function EndNode({ data }) {
  return <div style={{padding:5, background:'#F9EBEA', borderRadius:5}}>
    <strong>Fim</strong>
  </div>
}
function AiNode({ data }) {
  return <div style={{padding:5, background:'#E8EAF6', borderRadius:5}}>
    🤖 Prompt: <input style={{ width:'90%' }} 
                     defaultValue={data.prompt || ''} 
                     onBlur={e => data.prompt = e.target.value} />
  </div>
}
function IfNode({ data }) {
  return <div style={{padding:5, background:'#FEF5E7', borderRadius:5}}>
    ❓ Condição: <input style={{ width:'80%' }} 
                        defaultValue={data.condition || ''} 
                        onBlur={e => data.condition = e.target.value} />
  </div>
}
```

Adicionar controles para inserir nós:

```tsx
<button onClick={() => {
  setNodes(ns => [...ns, {
    id: `ai-${ns.length+1}`, type: 'aiNode',
    position: {x:100, y:100}, data: { prompt: '' }
  }])
}}>+ Ação IA</button>
```

(semelhante para IfNode, EndNode).

Serialização:

```tsx
<button onClick={() => {
  const flow = { nodes: nodes.map(n => ({ ...n, position: n.position })), edges }
  console.log("JSON do fluxo:", JSON.stringify(flow))
}}>Exportar JSON</button>
```

🔗 **Integrações e dependências:** A principal dependência aqui é o `react-flow-renderer`. Certifique-se de importar também estilos padrão do React Flow (geralmente um CSS importado globalmente, ex: `import 'react-flow-renderer/dist/style.css'`). O layout atual é básico e não persistente (ex: mudanças nos inputs de node não atualizam state porque estamos escrevendo em data diretamente; para ser reativo precisaríamos usar `setNodes` dentro de onBlur – isso pode ser aprimorado). Testar a criação de nós, conectar arrastando da porta de saída de um para outra (ReactFlow padrão cria handles default nos componentes). Confirmar que edges aparecem e se movem os nós. O JSON impresso deve refletir as conexões. Por enquanto, a execução não acontece, é só construção.

---

### Prompt 6: Execução do Fluxo de Trabalho (Engine Simplificado)

📜 **Descrição:** Implementar uma função para **executar** o fluxo desenhado. Dado o JSON de nós e arestas, percorrer a partir do nó "Início" e seguir as conexões executando ações: para nó IA, chamar API OpenAI (pode simular a resposta), para nó If, avaliar condição, etc. Exibir o resultado de cada passo no console ou na UI.

📝 **Arquivos:**

- Criar módulo `utils/flowEngine.ts` com função assíncrona `runFlow(nodes, edges)`.
- Atualizar `Orchestrator.tsx` para ter um botão "Executar Fluxo" que chama essa função com o estado atual.
- Para simulação: a função OpenAI pode retornar uma resposta dummy (como `"[Resposta simulada para]" + prompt`).
- UI: Marcar visualmente o nó em execução (p.ex., alterar cor temporariamente) e após execução (verde para sucesso, vermelho para erro, se possível).

🔧 **Motivo:** Dar vida ao orquestrador visual, provendo um MVP de execução para validar que a sequência de nós funciona. Ainda que simples, isso prova o conceito de "IA Copiloto e fluxos condicionais". Mais tarde podemos substituir partes por chamadas reais e adicionar mais tipos de nó. Essa separação engine/UI também permitirá mover a execução para backend se precisar.

💾 **Código:** Implementar `runFlow`:

```ts
export async function runFlow(nodes, edges) {
  // Cria um mapa de nós por id para acesso fácil
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  // Acha nó inicial
  const startNode = nodes.find(n => n.type === 'startNode')
  if(!startNode) {
    console.error("Nenhum nó de início encontrado.")
    return
  }
  let currentId = startNode.id
  const context = {}  // armazena variáveis se necessário
  while(currentId) {
    const currentNode = nodeMap[currentId]
    if(!currentNode) break
    console.log(`Executando nó ${currentNode.id} (${currentNode.type})`)
    switch(currentNode.type) {
      case 'startNode':
        // pega próxima aresta a partir do start
        break
      case 'aiNode':
        const prompt = currentNode.data.prompt || ''
        console.log('Chamando IA com prompt:', prompt)
        // Simulação de resposta da IA
        await new Promise(res => setTimeout(res, 500))  // espera meio segundo
        const aiResponse = "[Resposta da IA simulada]" 
        context[`res_${currentId}`] = aiResponse
        console.log('Resposta IA:', aiResponse)
        break
      case 'ifNode':
        const condition = currentNode.data.condition || ''
        let condResult = false
        try {
          condResult = eval(condition)  // AVISO: usar eval apenas em simulação/controlado
        } catch(e) {
          console.error("Erro ao avaliar condição:", e)
        }
        console.log(`Condição "${condition}" resultado: ${condResult}`)
        // Escolhe a aresta com label "true" ou "false"
        const trueEdge = edges.find(e => e.source === currentId && e.label === 'true')
        const falseEdge = edges.find(e => e.source === currentId && e.label === 'false')
        currentId = condResult ? trueEdge?.target : falseEdge?.target
        continue  // pular o incremento de currentId comum
      case 'endNode':
        console.log("Fluxo concluído.")
        currentId = null
        continue
    }
    // se não mudou currentId explicitamente (caso ifNode cuidou acima)
    if(currentId) {
      const outgoingEdge = edges.find(e => e.source === currentId)
      currentId = outgoingEdge ? outgoingEdge.target : null
    }
  }
}
```

No `Orchestrator.tsx`:

```tsx
import { runFlow } from '../utils/flowEngine'
// ...
<button onClick={() => runFlow(nodes, edges)}>Executar Fluxo</button>
```

Para feedback visual, podemos adicionar no state um `activeNodeId` e antes de cada console.log de execução, chamar um callback que seta `activeNodeId`. Mas como estamos apenas logando no console, podemos deixar a marcação visual para aprimoramento posterior.

_(Observação: O uso de `eval` aqui é apenas para ilustrar a avaliação de condição; em produção, isso deve ser substituído por um interpretador seguro ou limitada a expressões simples.)_

🔗 **Integrações e dependências:** Para chamar OpenAI de verdade, precisaríamos integrar o SDK ou fetch com API key – mas aqui simulamos. Ressaltar em comentários que a simulação deve ser trocada por chamada real futuramente (e então esse código provavelmente migraria para uma function serverless com a key segura). Testar o engine: montar um fluxo simples Start -> AI -> End e ver logs; Start -> If True/False -> dois Ends. Ajustar o find de edges para múltiplos caminhos. Se possível, imprimir o contexto final (variáveis coletadas) ao fim do fluxo. Lembrar que o engine atual não trata loops ou espera múltiplas entradas – fluxos complexos podem precisar melhorias, mas para MVP linear ou if simples funciona.

---

### Prompt 7: Sistema de Plugins – Suporte a Plugin de Exemplo

📜 **Descrição:** Implementar suporte básico a **plugins** no Bolt.DIY. Criar um mecanismo para carregar um módulo externo e executar uma função de registro. Demonstrar com um plugin de exemplo que adiciona um novo comando no editor (por ex: um botão que insere um texto pré-definido no arquivo aberto).

📝 **Arquivos:**

- Criar pasta `public/plugins/` no projeto e adicionar um arquivo `samplePlugin.js` como plugin de exemplo.
- Em `samplePlugin.js`: definir um script que registra um comando "Inserir Olá Mundo" usando a API global do Bolt.DIY.
- Alterar o código principal (talvez em `_app.tsx` ou contexto global) para carregar automaticamente plugins da pasta `public/plugins` ao iniciar.
- Criar uma estrutura global `window.Bolt` com métodos que os plugins utilizarão, por exemplo `registerCommand(name, func)` e `getActiveEditor()`.

🔧 **Motivo:** Fornecer um ponto de extensão para que novos recursos possam ser adicionados sem alterar o core. Isso valida a arquitetura de plugin e serve de guia para desenvolvedores externos. O plugin de exemplo concreto permite testar o fluxo de registro e execução, provando que o sistema funciona.

💾 **Código:** No `public/plugins/samplePlugin.js` (este arquivo será servido estaticamente):

```js
(function(){
  const pluginName = "SamplePlugin"
  // Verifica se o sistema de plugin global existe
  if(!window.Bolt || !window.Bolt.registerCommand) {
    console.warn("Bolt API não encontrada. Plugin abortado.")
    return
  }
  // Registra um novo comando de inserir texto
  window.Bolt.registerCommand("Inserir Olá Mundo", () => {
    const editor = window.Bolt.getActiveEditor()
    if(editor && editor.insertText) {
      editor.insertText("Olá, Mundo!")
    } else {
      alert("Nenhum editor ativo para inserir texto.")
    }
  })
  console.log(pluginName, "carregado")
})()
```

No core, definir a API global e carregar plugin: Por exemplo, em `_app.tsx`, dentro do `useEffect` principal:

```tsx
useEffect(() => {
  // Definir objeto global Bolt
  window.Bolt = {
    commands: {},
    registerCommand: (name, func) => {
      window.Bolt.commands[name] = func
    },
    getActiveEditor: () => {
      // Supondo que temos referência do editor atual, podemos guardar em contexto
      return window.currentEditorInstance || null
    }
  }
  // Carregar plugin de exemplo
  const script = document.createElement('script')
  script.src = '/plugins/samplePlugin.js'
  document.body.appendChild(script)
}, [])
```

Crie uma forma de acionar comandos, por exemplo um menu dropdown simples:

```tsx
<select onChange={e => {
    const cmd = e.target.value
    if(cmd && window.Bolt.commands[cmd]) {
      window.Bolt.commands[cmd]()
    }
}}>
  <option value="">Comandos</option>
  {Object.keys(window.Bolt.commands).map(cmd => (
    <option key={cmd} value={cmd}>{cmd}</option>
  ))}
</select>
```

Neste caso, após carregar o plugin, deve aparecer a opção "Inserir Olá Mundo" na lista, e ao selecionar, inserir o texto no editor ativo.

Para implementar `insertText` no editor ativo: se estivermos usando Monaco, podemos expor uma função: Por exemplo, quando abrimos um arquivo no Monaco, guardamos `window.currentEditorInstance = monacoEditorInstance` e definimos

```ts
monacoEditorInstance.insertText = (text) => {
  const position = monacoEditorInstance.getPosition()
  monacoEditorInstance.executeEdits(null, [{ range: new Range(position.lineNumber, position.column, position.lineNumber, position.column), text: text }])
}
```

Assim, o plugin consegue chamar.

🔗 **Integrações e dependências:** Não há novas libs, estamos usando recurso do próprio browser. O plugin de exemplo deve ser incluído no pacote final (colocado em `/public/plugins/`). Em produção, pensar que os plugins podem vir de fontes externas ou ser instalados via UI; mas para demonstração, carregar automaticamente. Testar: abrir um arquivo, colocar o cursor, abrir o dropdown e escolher "Inserir Olá Mundo", ver se o texto aparece no editor. Lembrar que esta abordagem de `window.currentEditorInstance` é simplificada; idealmente usar contexto React/Refs para gerenciar editores abertos. Mas para MVP e plugin demo, é suficiente.

---

### Prompt 8: Biblioteca Interna – Listar e Importar Templates

📜 **Descrição:** Implementar a interface da **Biblioteca Interna** para exibir uma lista de templates/frameworks disponíveis e permitir importá-los para o vault local. Por agora, usar uma lista estática de templates de exemplo e simular importação criando arquivos de exemplo no vault.

📝 **Arquivos:**

- Criar componente `LibraryModal.tsx` que mostra uma lista de templates (nome e descrição) e um botão "Importar" para cada.
- Definir os templates estaticamente em um array dentro do componente ou em um arquivo `data/templates.js`.
- Ao clicar em Importar, criar os arquivos correspondentes no vault local (usando File System API similar ao sync).
- Integrar este modal na UI principal, com um botão "Biblioteca" para abrir/fechar.

🔧 **Motivo:** Providenciar ao usuário acesso fácil a recursos pré-prontos. Nesta tarefa focamos no front-end, dado que a integração real com repositório Git virá depois. Assim já podemos validar UX da biblioteca e o mecanismo de copiar arquivos, que é essencialmente o mesmo que será usado quando integrar com um repo remoto.

💾 **Código:** Exemplo de dados de template (em `data/templates.js`):

```js
export const templates = [
  {
    name: "Projeto Node.js Básico",
    description: "Cria estrutura básica de um projeto Node.js com index.js e package.json.",
    files: [
      { path: "meu-projeto/index.js", content: "console.log('Olá, Mundo!');" },
      { path: "meu-projeto/package.json", content: "{\n  \\"name\\": \\"meu-projeto\\",\n  \\"version\\": \\"1.0.0\\\"\n}" }
    ]
  },
  {
    name: "Documento Exemplo",
    description: "Adiciona um arquivo Markdown de exemplo no vault.",
    files: [
      { path: "Exemplo.md", content: "# Exemplo de Documento\\nEsta é uma nota de exemplo." }
    ]
  }
]
```

No `LibraryModal.tsx`:

```tsx
import { templates } from '../data/templates'

export function LibraryModal({ vaultHandle, onClose }) {

  const importTemplate = async (tpl) => {
    if(!vaultHandle) {
      alert("Nenhum vault aberto.")
      return
    }
    for(const file of tpl.files) {
      const parts = file.path.split('/')
      let dir = vaultHandle
      // Criar subpastas conforme necessário
      for(let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i]
        dir = await dir.getDirectoryHandle(folderName, { create: true })
      }
      const fileName = parts[parts.length - 1]
      const fileHandle = await dir.getFileHandle(fileName, { create: true })
      const writable = await fileHandle.createWritable()
      await writable.write(file.content)
      await writable.close()
    }
    alert(`Template "${tpl.name}" importado com sucesso!`)
    onClose()
  }

  return (
    <div className="modal">
      <h2>Biblioteca de Templates</h2>
      <ul>
        {templates.map(tpl => (
          <li key={tpl.name} style={{marginBottom:'1em'}}>
            <strong>{tpl.name}</strong><br/>
            <em>{tpl.description}</em><br/>
            <button onClick={() => importTemplate(tpl)}>Importar</button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Fechar</button>
    </div>
  )
}
```

No componente principal, estado para exibir modal:

```tsx
const [showLibrary, setShowLibrary] = useState(false)
...
<button onClick={()=> setShowLibrary(true)}>📚 Biblioteca</button>
{showLibrary && <LibraryModal vaultHandle={vaultHandle} onClose={()=>setShowLibrary(false)} />}
```

_(Estilize `.modal` com posicionamento fixo, fundo semi-transparente, etc., conforme necessidade.)_

🔗 **Integrações e dependências:** Nenhuma chamada externa; estamos simulando com dados locais. Certifique-se de lidar com o caso de não haver vault aberto ao tentar importar (no exemplo, um alerta). Após importação, talvez atualizar a exibição do FileTree para mostrar novos arquivos (pode re-ler a pasta ou chamar FileTree via key diferente). Testar importando cada template: deveria criar os arquivos/pastas no sistema local (verificar na árvore e no disco). Esse mecanismo é similar ao de sincronização, reutilizando FileSystem API. Na prática real, essa lista virá de um servidor – mas podemos implementar isso posteriormente.

---

### Prompt 9: Finalizar Detalhes de UI/UX e Testes (Polimento Final)

📜 **Descrição:** Realizar melhorias finais na interface e correção de bugs após integração de todos módulos. Isso inclui ajustes de layout, adicionar indicações visuais (loading, estados ativos), escrever casos de teste básicos e preparar documentação no próprio app (ex: um arquivo README.md no vault explicando como usar a nova versão).

📝 **Arquivos:**

- Arquivos de estilo (CSS/Tailwind) para melhorar apresentação dos componentes (sidebar, editor, nodes, etc.).
- Componentes existentes: ajustar para tratar estados de erro/loading (ex: indicar enquanto sincroniza, desabilitar botão durante operação).
- Criar arquivo `README-BoltDIY.md` e incluir no bundle (ou criar dinamicamente no primeiro uso) com instruções de uso, e colocá-lo no vault ao criar um novo vault.
- Configurar scripts de build e talvez escrever testes unitários/exploratórios (usando Jest e React Testing Library para funções e componentes principais).

🔧 **Motivo:** Deixar a aplicação pronta para uso real, entregando uma boa experiência. Após a maratona de implementação, essa etapa garante que as arestas estão limadas e que o usuário final terá orientações. Também solidifica a confiabilidade com testes.

💾 **Código:** Exemplos de micro melhorias:

- **Indicador de Sincronização:**

```tsx
const [syncing, setSyncing] = useState(false)
...
<button onClick={async ()=> {
  if(vaultHandle) {
    setSyncing(true)
    await uploadAll(vaultHandle)
    await downloadAll(vaultHandle)
    setSyncing(false)
    alert('Sync completo')
  }
}} disabled={syncing}>
  {syncing ? 'Sincronizando...' : '🔄 Sync'}
</button>
```

- **Feedback Visual no Orquestrador:** No `runFlow`, antes de executar um nó podemos marcar:

```tsx
// supondo temos setActiveNodeId disponível:
setActiveNodeId(currentNode.id)
```

E no componente do nó:

```tsx
function AiNode({ data, isActive }) {
  return <div style={{ background: isActive? '#D6EAF8' : '#E8EAF6' }}> ... </div>
}
```

Precisaríamos passar `isActive` via ReactFlow's node data; uma estratégia é manter `activeNodeId` no estado do Orchestrator e usar `nodes.map` para adicionar `data.isActive = (n.id === activeNodeId)`. Simples para poucas mudanças.

- **README interno:** Podemos entregar um `README.md` padrão no vault. Por exemplo, no primeiro uso (nenhum vault selecionado ainda), ao abrir a biblioteca ou no botão VaultSelector, criar um vault inicial com README. Ou se não, disponibilizar um botão "Gerar documentação". Como prompt final, talvez apenas mencionar que o README deve cobrir resumidamente as funcionalidades e que é criado automaticamente.
    
- **Testes Automatizados:** Configurar Jest (adicionar `jest.config.js` se não veio com Next). Escrever um teste simples:
    

```js
import { uploadAll, downloadAll } from '../utils/syncVault'
test('uploadAll and downloadAll are defined', () => {
  expect(uploadAll).toBeDefined()
  expect(downloadAll).toBeDefined()
})
```

E testes simulando a lógica do flowEngine (poderíamos mockar um nodes/edges input e verificar console outputs ou resultados de context). Deixar esses testes rodando no CI para evitar regressões.

Nenhum grande código novo para mostrar aqui, é mais ajustes e validações.

🔗 **Integrações e dependências:** Adicionar `jest` e `@testing-library/react` como devDependencies para testes. Ajustar possivelmente Babel config para Jest entender imports ESM. Verificar se tudo ainda compila e roda no build de produção (otimizar imports, remover logs excessivos). Atualizar documentação (README do repositório) para refletir como rodar/testar, e possivelmente incluir capturas de tela.

---

_(A lista acima representa prompts para cada parte fundamental do projeto. Novos prompts podem ser acrescentados conforme surjam funcionalidades extras ou subdivisões de tarefas. Cada prompt está focado em um objetivo específico e, se seguidos em ordem, guiam a implementação completa da nova versão do Bolt.DIY.)_

# Sistema de Plugins/SDKs

**Visão Geral:** O sistema de plugins do Bolt.DIY permitirá estender as funcionalidades da plataforma de forma modular, sem precisar alterar o núcleo do código. Desenvolvedores poderão criar plugins para adicionar novos comandos, painéis, tipos de nós no orquestrador ou integrações com serviços externos. A própria **IA Desenvolvedora** poderá ser instruída via prompts a desenvolver novos plugins ou modificar plugins existentes, tornando o Bolt.DIY altamente adaptável. A seguir detalhamos a arquitetura desse sistema, incluindo como os plugins serão estruturados, carregados, gerenciados e aspectos de segurança, bem como a disponibilização de um SDK para criação de plugins.

## Arquitetura e Estrutura de Plugins

Cada plugin no Bolt.DIY consistirá tipicamente de:

- **Manifesto (metadata)**: um arquivo opcional (JSON ou similar) com nome do plugin, versão, autor, descrição e as permissões/capacidades que o plugin requer (por exemplo: acesso ao vault, acesso à internet, adicionar comandos, etc.).
- **Código principal do plugin**: um script JavaScript que exporta uma função de registro (por exemplo, `register(pluginApi)` ou `activate(app)`), ou que se auto-executa registrando funcionalidades no sistema global. Esse código usará as APIs fornecidas pelo Bolt.DIY (via um objeto de contexto ou global `window.Bolt` como vimos no plugin de exemplo).
- **Recursos adicionais**: eventuais outros arquivos, como estilos CSS, imagens ou módulos auxiliares, que o plugin possa precisar. No início, focaremos em plugins simples de código único; plugins mais complexos poderiam ser distribuídos como pacote (zip ou npm) contendo vários arquivos.

**Registro e Carregamento de Plugins:** Quando um plugin é instalado no Bolt.DIY, seu código deve ser carregado e executado. Há diferentes estratégias:

- Via `<script>` injetado no DOM (adequado para plugins distribuídos como arquivo UMD/global).
- Via import dinâmico ESModule (caso suporte, precisaria de um bundler ou loader próprio, pois em ambiente Next.js as importações dinâmicas externas podem ser limitadas).
- Via Web Worker (para executar plugin isoladamente e comunicar via mensagens).

No MVP, adotaremos uma abordagem simples: carregar o plugin como um script diretamente na página (injeção de script). Assim, o plugin terá acesso ao objeto global `window.Bolt` para registrar suas funcionalidades. Futuramente, para maior segurança, podemos mover a execução para web workers ou sandbox.

**APIs fornecidas aos Plugins:** O Bolt.DIY disponibilizará um conjunto de funções e objetos que os plugins poderão usar. Exemplos:

- `Bolt.registerCommand(name: string, callback: function)`: Registra um novo comando (que pode aparecer em um menu ou paleta de comandos) e associa uma função a ser executada.
- `Bolt.registerNodeType(type: string, nodeConfig: object)`: Registra um novo tipo de nó no orquestrador visual. O `nodeConfig` poderia incluir o componente de renderização (por exemplo, uma função React ou um HTML a inserir no node) e a função de execução que o engine deve chamar para esse nó durante runFlow.
- `Bolt.on(event: string, handler: function)`: Permite ao plugin escutar eventos do sistema (ex: "fileOpened", "save", "flowExecuted") para talvez reagir ou modificar algo.
- `Bolt.getActiveEditor()` ou similar: Retorna referência ao editor/arquivo atualmente aberto, permitindo que plugins manipulem o conteúdo (como o plugin de exemplo faz inserção de texto).
- `Bolt.showPanel(component)`: Poderia permitir que um plugin abra um painel custom na interface (por exemplo, um plugin que mostra uma calculadora, ou um chat de IA).
- `Bolt.storage` ou `Bolt.fetch`: APIs utilitárias, como acesso a armazenamento local do plugin (por ex, espaço de key-value isolado para o plugin guardar configurações) ou fetch com credenciais do usuário (caso plugin precise chamar uma API externa com token do usuário, etc.).

Essas APIs serão expostas através do objeto global ou passado como argumento na função de registro do plugin. Provavelmente manteremos em `window.Bolt` conforme já iniciado.

**Instalação e Gerenciamento de Plugins:** Haverá uma interface dentro do Bolt.DIY para gerenciar plugins:

- **Instalar Plugin**: O usuário pode fornecer uma URL ou selecionar um arquivo de plugin. Alternativamente, integrar com a Biblioteca Interna (marketplace de plugins oficiais ou da comunidade).
- **Listar Plugins Instalados**: Mostrar quais plugins estão presentes/ativos, com opção de desativar ou remover.
- **Ativação/Desativação**: Quando um plugin é instalado, por padrão pode ficar ativo. O usuário deve poder desativar (o que idealmente descarrega o plugin ou pelo menos impede suas funcionalidades, possivelmente requerendo refresh para efeito completo).
- **Atualização**: Se um plugin instalado tem versão mais nova disponível (via manifesto), avisar o usuário e permitir atualizar (isso implicaria baixar o novo código e substituir).

No MVP, focaremos em conseguir carregar e registrar plugins; a interface de gerenciamento poderá ser rudimentar (por ex., uma listagem simples e um campo de URL para adicionar). Conforme o plugin exemplo, podemos pré-carregar via código. Mas estruturar para carregamento dinâmico de múltiplos plugins.

**Isolamento e Segurança:** Executar plugin no mesmo contexto da app oferece muita flexibilidade porém riscos: um plugin malicioso poderia acessar dados do usuário ou chamar APIs indevidas. Precisaremos:

- **Permissões declarativas**: O manifesto do plugin pode declarar "precisa de acesso à internet", "pode ler/escrever arquivos", etc. Ao instalar, o Bolt.DIY informaria ao usuário essas permissões e pediria confirmação.
- **Sandboxing**: Possibilidade futura de rodar plugins em Web Workers. Nesse caso, eles não acessariam diretamente o DOM ou `window`, apenas via mensagens e APIs controladas.
- **Restrições via API**: As funções em `Bolt` podem fazer checagens. Por exemplo, `Bolt.fetch(url)` poderia limitar a chamadas a determinados domínios confiáveis ou incluir token do usuário apenas para domínios autorizados.
- **Scope do Vault**: Um plugin poderia ser restrito a mexer apenas em uma subpasta do vault, ou talvez rodar com credenciais do usuário (ex: se for um plugin integrado a conta do usuário, como Google Drive, usar o token próprio do usuário).
- **Código Aberto**: Incentivar que plugins sejam open-source (assim o usuário ou comunidade pode auditar). Em um marketplace, destacar se plugin é verificado.

No MVP, implementaremos um superset mínimo: todos plugins têm acesso às APIs, e confiamos no usuário para instalar apenas de fontes confiáveis (similar ao estágio inicial de VSCode extensions ou Obsidian community plugins).

**Comunicação entre Plugins e Core:** Os plugins idealmente não devem manipular o estado interno do aplicativo diretamente, mas sim através das APIs fornecidas. Por exemplo, se um plugin quer adicionar um botão na interface, ele chamaria `Bolt.registerCommand` e o core já prevê exibir comandos em um menu. Se quer modificar uma nota ao salvar, ele usaria `Bolt.on('fileSave', ...)`. Essa inversão de controle mantém o core no comando do fluxo, e plugins apenas reagindo ou solicitando ações.

## SDK de Desenvolvimento de Plugins

Para facilitar que terceiros criem plugins, forneceremos:

- **Documentação**: um guia explicando como estruturar um plugin, exemplos de código, lista das APIs disponíveis (como mencionado acima).
- **Templates**: talvez modelos básicos de plugin (um plugin "Hello World" que adiciona um comando, um plugin de nó custom simples).
- **Tipagem TypeScript**: disponibilizar um arquivo d.ts com definições das interfaces Bolt (ex: `Bolt.registerCommand: (name: string, func: () => void) => void`, etc.), assim quem programar em TS pode ter autocompletar e verificar tipos.
- **Ferramentas de Empacotamento**: se plugins forem mais complexos, oferecer instruções para empacotar em um único arquivo JS (por ex: usando webpack/rollup para gerar um UMD bundle). Alternativamente, se permitirmos plugins multi-arquivos, definir como distribuir (um zip, ou publicar em npm a ser instalado).
- **Exemplos no repositório**: Manter alguns plugins oficiais de exemplo no repositório Bolt.DIY, que sirvam de referência e teste.

O SDK em si pode ser tão simples quanto a documentação + typings, já que as APIs residem no core. No futuro, um CLI do Bolt.DIY poderia gerar scaffold de plugin.

## Exemplos de Plugins Potenciais

Para visualizar, vejamos alguns plugins que poderíamos suportar e como se encaixam:

- **Plugin de Integração com API Externa** (p. ex. Trello): Permite criar cards no Trello a partir de tarefas no Bolt.DIY.
    - Poderia adicionar um comando "Exportar para Trello", ou um nó "Criar Card Trello" no orquestrador.
    - Requer acesso à internet (API Trello) e possivelmente credenciais do usuário (token API).
    - Usaria `Bolt.registerCommand` e/ou `Bolt.registerNodeType`.
    - Manifesto indicaria necessidade de fazer requests ao domínio api.trello.com e talvez solicitar chave API do usuário via uma UI.
- **Plugin de Formato de Visualização**: por ex., "Visualizer de JSON".
    - Detecta quando um arquivo .json é aberto e oferece visualização em árvore ou tabela.
    - Usaria `Bolt.on('fileOpen', ...)` para saber que um JSON foi aberto e então talvez abrir um painel próprio com a visualização, ou substituir o editor por um custom.
    - Menos crítico em termos de segurança (só lida com dados locais).
- **Plugin de Temas/Estilos**: muda aparência da interface.
    - Poderia injetar CSS custom (talvez `Bolt.registerTheme` ou simplesmente adicionar um ).
    - Permissões mínimas (só altera UI).
- **Plugin de AI personalizado**: Ex: integra um novo modelo ou serviço de IA.
    - Adiciona comando "Enviar para modelo X", ou nó "Modelo X completions".
    - Precisará chamar API externa (com chave do usuário).
    - Traz seu próprio logic de chamada e possivelmente parsing de resposta.

Esses exemplos mostram que plugins podem variar de puramente front-end (UI, commands) a fluxos de backend. Para aqueles que precisam backend (chamadas API com segredo), possivelmente o plugin confiará que o front possa chamá-las de forma segura. Uma alternativa a longo prazo: permitir plugins de backend (ex: rodar supabase Edge Functions custom fornecidas pelo plugin?). Isso é avançado e não tratado no MVP.

## Gerenciamento de Plugins via Biblioteca Interna

Conforme mencionado, a **Biblioteca Interna** também englobará plugins. Podemos unificar sob um "Marketplace" onde o usuário filtra por Templates, Plugins, etc. Para plugins:

- O item teria manifesto, link para código, versão.
- Ao instalar via biblioteca, o app baixaria o código do plugin (provavelmente um arquivo .js ou um zip) e colocaria em `public/plugins/` local (ou no vault `.plugins/`).
- Então carrega como se fosse local.

Manter plugins no vault do usuário permite sincronizar plugins entre dispositivos do mesmo usuário (via sync geral). No entanto, se plugin contém código malicioso e sincroniza, pode afetar outro dispositivo. É similar a sincronizar macros ou plugins em outras apps – precisa de confiança na fonte.

Talvez instalar plugin não automaticamente coloca no vault sincronizado; poderíamos armazenar separado. Mas para simplicidade, colocalo no vault ou em localStorage.

## Segurança Adicional e Revogação

Se um plugin se comportar mal ou bugado, o usuário deve poder removê-lo mesmo se a UI estiver quebrada. Procedimento de segurança: talvez o Bolt.DIY arranca em "modo seguro" sem plugins (ex: segurando uma tecla ou detectando crash, não carregar plugins). Assim o usuário pode desativar o plugin problemático.

Além disso, logs ou monitoramento: Registrar quando plugins fazem certas ações (pode ser útil para debug: ex: log "Plugin X adicionou comando Y" ou "Plugin X fez chamada a URL Z").

## Desenvolvimento Contínuo

Após implementar o básico:

- Coletar feedback de desenvolvedores sobre as APIs (talvez internamente primeiro).
- Expandir APIs conforme necessidades de primeiros plugins criados.
- Documentar casos de uso conhecidos (snippets de code).
- Testar limites: ex. instalar 10 plugins, ver performance.

No futuro, se a plataforma crescer, formalizar um processo de publicação de plugins (com validação, assinatura digital para garantir integridade).

Em resumo, o sistema de plugins do Bolt.DIY, embora simples no MVP (carregando scripts globalmente), é projetado para evoluir garantindo extensibilidade e segurança. Ele permitirá que a comunidade expanda a ferramenta de formas que os desenvolvedores originais talvez não antecipem, aumentando assim o valor e longevidade do Bolt.DIY.

# Biblioteca Interna de Templates e Frameworks

**Objetivo:** A Biblioteca Interna do Bolt.DIY funcionará como um **hub central de recursos** – modelos de projetos, snippets de código, fluxos prontos, integrações – disponível diretamente na interface. Isso visa acelerar o desenvolvimento, proporcionando bases sólidas e exemplos sem que o usuário precise procurar externamente. Além disso, garante que esses recursos sejam compatíveis com o Bolt.DIY e fáceis de incorporar (um clique para importar).

## Estrutura e Armazenamento dos Conteúdos

Os conteúdos da biblioteca serão mantidos em um repositório oficial (ou storage) sob controle da equipe Bolt.DIY. Podemos estruturar esse repositório de forma organizada, por categoria. Por exemplo, em um repositório GitHub `bolt-library`:

```
bolt-library/
├── templates/
│   ├── nodejs-basic/
│   │   ├── files/ (contém os arquivos do template)
│   │   └── manifest.json
│   ├── nextjs-supabase-blog/
│   │   ├── files/
│   │   └── manifest.json
│   └── ...
├── snippets/
│   ├── sort-function/
│   │   ├── files/
│   │   └── manifest.json
│   └── ...
├── flows/
│   ├── qa-chatbot/
│   │   ├── flow.json
│   │   └── manifest.json
│   └── ...
└── plugins/ (eventualmente, plugins também podem residir aqui com seus manifests)
```

Cada recurso tem um diretório próprio contendo seus arquivos reais (subpasta `files` ou similar) e um `manifest.json` com metadados:

```json
{
  "name": "Node.js Basic Project",
  "description": "Template de projeto Node.js com estrutura de pastas e dependências iniciais.",
  "version": "1.0.0",
  "category": "template",
  "files": [
    { "path": "index.js", "executable": false },
    { "path": "package.json", "executable": false }
  ]
}
```

No caso de fluxos, o manifest poderia referenciar um arquivo `.flow.json` e possivelmente uma descrição textual do que o fluxo faz.

Para **distribuição**, podemos usar:

- **GitHub raw**: O app pode baixar diretamente os arquivos do repositório GitHub via raw URLs. Por exemplo, para listar templates, pegar um JSON agregando todos manifestos ou ter manifestos individuais acessíveis.
- **Supabase Storage/DB**: Alternativamente, replicar esses conteúdos em um bucket ou tabelas do Supabase, para aproveitar CDN e controle de acesso. Por exemplo, uma tabela `LibraryItems` com colunas id, name, category, description, version, e um storage com os arquivos zipados.

Uma abordagem simples: manter um **arquivo de índice JSON** para cada categoria no repositório, gerado a cada atualização:

```json
{
  "templates": [
    { "id": "nodejs-basic", "name": "Projeto Node.js Básico", "description": "...", "version": "1.0.0" },
    { "id": "nextjs-supabase-blog", "name": "Blog Next.js + Supabase", "description": "...", "version": "1.0.0" }
  ]
}
```

O app baixaria esse índice para mostrar a lista, então sob demanda baixaria os arquivos do item escolhido.

## Integração no Frontend

Na interface do Bolt.DIY, a biblioteca aparece possivelmente como um modal ou página separada (como começamos a implementar no prompt 8):

- Exibe categorias (templates, snippets, flows, etc.) talvez como tabs ou dropdown.
- Lista itens com nome, descrição breve e botão de importar/ver detalhes.
- Ao clicar em um item, pode-se ter opção de **Ver detalhes** (abrir um sub-modal mostrando descrição completa, possivelmente lerme do template, lista de arquivos, talvez tamanhos, últimas atualizações) e **Importar agora**.

**Fluxo de Importação:**

1. Usuário clica Importar.
2. Aplicação faz requisição para obter os arquivos.
    - Se os arquivos estiverem enumerados (como array de file paths), o app pode iterar e baixar cada um via fetch (por exemplo, `https://raw.githubusercontent.com/bolt-diy/bolt-library/main/templates/nodejs-basic/files/index.js`).
    - Ou, se disponível, baixar um pacote zip já montado. Talvez mais eficiente: cada template poderia ter um link para um zip (gerado via GitHub Actions ou usando a funcionalidade de download de repositório parcialmente).
    - Se usar Supabase, possivelmente chamar uma function `get_template(id)` que retorna um zip base64.
3. Ao obter o(s) arquivo(s), salvar no vault local. Utilizar similar abordagem do `importTemplate` do prompt 8, mas agora os dados vêm da web ao invés de embed.
4. Confirmar sucesso ao usuário.

**Exemplo concreto:** Importar "Projeto Node.js Básico":

- O manifest diz que precisa criar `index.js` e `package.json` talvez dentro de uma nova pasta. Poderíamos perguntar ao usuário nome da pasta destino ou usar um padrão (ex: usar o id "nodejs-basic" como pasta ou permitir usuário selecionar a pasta de importação, por exemplo se quer criar no root do vault ou em subdir).
- Para MVP, podemos criar uma pasta com nome do template ou simplesmente soltar no root se os nomes são genéricos/diferentes. Melhor: criar subpasta com nome do template para evitar conflito.
- Depois de importado, o usuário verá a pasta e arquivos no FileTree e pode começar a editar/executar.

**Sincronização e Atualização:**

- Se o usuário importa um template, os arquivos agora são parte do vault e serão sincronizados normalmente via vault sync. O Bolt.DIY pode marcar internamente quais recursos foram importados e de qual versão:
    - Ex: guardar em localStorage uma lista { itemId: 'nodejs-basic', version: '1.0.0', importDate: ... }.
- Quando abrir a biblioteca, pode comparar versões: se no índice o `nodejs-basic` está em versão 1.1.0 e o usuário tem 1.0.0 importado, mostrar um indicador "Update disponível".
- Atualizar seria similar a importar novamente – mas aqui precisa cuidado para não sobrescrever customizações do usuário. Provavelmente, para templates de projeto, o usuário irá editar os arquivos, então não queremos sobrescrever. Assim, a atualização faria sentido apenas se o usuário não alterou ou quer restabelecer. Isso pode ser complexo de detectar (poderíamos calcular hash dos arquivos e comparar com originais).
- Talvez tratemos updates apenas para itens que não são destinados a modificação, como plugins ou frameworks binários. Para templates de código, talvez não oferecer update automático (o usuário pode manualmente ver diferenças e decidir).

**Biblioteca de Snippets e Fluxos:**

- **Snippets**: Ao importar, talvez queremos inserir o snippet dentro de um arquivo existente ao invés de criar um novo. Porém, para MVP, podemos simplesmente entregar como um arquivo .md ou .txt no vault contendo o snippet e instruções. Ou criar um modal de copiar/colar.
- **Fluxos**: Um fluxo poderia ser representado como um arquivo `.flow.json` e talvez um `.md` explicando. Ao importar, colocar esses no vault. O usuário então pode carregar o `.flow.json` no orquestrador (podemos implementar funcionalidade de abrir fluxos salvos).
- Ainda não implementamos abrir fluxos salvos, mas seria uma extensão lógica (um botão "Importar fluxo do vault").

**Integração com Plugins na Biblioteca:**

- Como previsto, a biblioteca poderia listar também plugins. Importar um plugin significaria baixar o seu código e instalá-lo. Isso poderia ser automatizado: depois de baixar, chamar o mecanismo de registro de plugins para ativar.
- Exemplo: plugin "GPT-3 Integration", import – app baixa `gpt3Plugin.js` e talvez um manifest, salva em `.plugins/gpt3Plugin.js` ou `public/plugins` (se Electron, análogo) e executa `Bolt.registerPlugin`.
- Segurança: possivelmente avisar "Vai instalar plugin X de Autor Y. Confirma?" e lembrar permissões.
- Esse processo se confunde um pouco com a ideia de plugin local vs global. Talvez melhor plugins não irem no vault mas sim em localStorage ou directory global. Ainda assim, deixar para decisão futura; MVP pode armazenar no vault por simplicidade.

## Backend da Biblioteca

**Usando Supabase:** Podemos ter:

- Tabela `library_items` (id, name, description, version, category).
- Tabela `library_files` (item_id, path, content or a reference if using storage).
- Ou usar Storage: bucket "library", estrutura de pastas como descrita. Supabase fornece API de listar arquivos e baixar conteúdo (similar ao que fizemos para vault).
- Poderíamos reutilizar supabase para caching: por ex, as primeiras versões do app podem embutir um JSON estático com os itens para não depender de rede externamente, e supabase function para atualizar.

**Usando GitHub:**

- Pró: já tem versionamento, fácil contribuição via PR, GitHub Actions podem validar ou auto-generate indices.
- Contra: requisições raw GitHub são não autenticadas e limitadas (pode atingir rate limit se muitos usuários).
- Poderíamos usar raw.githubusercontent via jsdeliver or Cloudflare as CDN for GitHub content.

Talvez uma mistura: manter repositório no Git, mas espelhar arquivos na Supabase Storage (via CI) for distribution. Assim aproveita supabase CDN e unified domain with user content.

## Experiência de Usuário

Ao ter a biblioteca:

- Novatos podem rapidamente iniciar projetos com exemplos, diminuindo a barreira de "tenho uma ferramenta, mas não sei por onde começar".
- Avançados podem usar fluxos de exemplo para aprender sintaxe do orquestrador ou usar snippet para evitar escrever boilerplate.
- Deve ser fácil filtrar: possivelmente uma barra de busca global para digitar "Node" e ver tanto template Node.js, quanto snippet ou plugin relacionados a Node, etc.

Adicionar icones ou indicadores de tipo (um símbolo para template, outro para snippet, etc.) seria bom.

## Manutenção da Biblioteca

A equipe Bolt.DIY:

- Curará os conteúdos, garantindo que estão atualizados conforme evolui a ferramenta. Por exemplo, se mudar algo no orquestrador que quebra fluxos antigos, atualizar os fluxos de exemplo.
- Pode incorporar conteúdos da comunidade após revisão. Talvez via GitHub PRs se for open, ou submissão via formulário.
- Deve evitar excesso de itens irrelevantes; focar nos mais úteis e de qualidade para não poluir (qualidade sobre quantidade).

Cada lançamento do Bolt.DIY possivelmente acompanha uma atualização da biblioteca (novos templates mostrando uso de novas features, etc.).

## Possível Futuro - Colaboração do Usuário na Biblioteca

Se for desejado, no futuro o usuário poderia enviar de volta coisas para biblioteca:

- Por exemplo, criou um fluxo legal e quer compartilhar, poderia haver um botão "Publicar fluxo" que abre PR no repositório ou envia para equipe.
- Plugin ou template criado no Bolt.DIY (já que a IA pode gerar), compartilhar com outros via biblioteca (com moderação).
- Isso criaria uma comunidade ativa de troca de recursos.

Entretanto, isso implica moderação para evitar conteúdo malicioso ou de baixa qualidade. Nessa fase inicial, manter controle central é mais simples.

## Implementação Faseada

- **Fase 1:** Itens estáticos (hardcoded or static JSON served) – já traz valor e valida conceito.
- **Fase 2:** Conectar a fonte externa (GitHub ou Supabase) para atualizar sem redeploy.
- **Fase 3:** Plugins included, advanced features (search, update notifications).
- **Fase 4:** Contribuições comunidade e rating, etc.

Para o MVP do Bolt.DIY, entregar a **Fase 1** ou **2** já seria suficiente para demonstrar o recurso.

---

Em suma, a Biblioteca Interna será um componente-chave para tornar o Bolt.DIY não apenas uma ferramenta, mas um ecossistema. Ao fornecer conteúdos prontos e integrados, os usuários ganham produtividade e aprendem pelas melhores práticas fornecidas. A integração transparente ao workflow (sem precisar copiar manualmente de um site ou instalar pacotes externos) diferencia o Bolt.DIY como uma solução "baterias incluídas" para desenvolvimento orientado a IA e automação.