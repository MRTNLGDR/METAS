
Ótimo! Vou gerar um **cookbook detalhado** contendo documentação completa do JestFly em arquivos `.md`. Isso incluirá:

1. **Documentação do Projeto** - Uma visão geral do JestFly, incluindo sua arquitetura, funcionalidades implementadas, problemas encontrados e melhorias necessárias.
2. **Cookbook de Correção e Implementação** - Um conjunto de superprompts técnicos, descrevendo de forma precisa como corrigir cada erro e implementar funcionalidades faltantes, com código exato.
3. **Guia de Desenvolvimento** - Documentação sobre padrões de código, melhores práticas e fluxo de trabalho para contribuir com o projeto.

Este cookbook será organizado em uma estrutura de pastas e arquivos `.md` para fácil navegação. Assim que estiver pronto, disponibilizarei para download.

## README.md

# JestFly - Plataforma Artista-Fã

**JestFly** é uma plataforma inovadora que conecta artistas e fãs, oferecendo novas formas de interação e monetização de conteúdo exclusivo. O projeto foi idealizado para permitir que artistas compartilhem conteúdo especial com seus fãs, monetizem sua arte por meio de NFTs e produtos, recompensem a fidelidade dos fãs com moeda virtual (JestCoin) e realizem eventos de streaming ao vivo dentro da comunidade.

## Tecnologias Utilizadas

- **Back-end:** Node.js com o framework Express para construir uma API RESTful robusta.
- **Front-end:** (Planejado) Aplicação web moderna (por exemplo, em React) para que os usuários interajam com a plataforma de forma dinâmica.
- **Banco de Dados:** MongoDB (via Mongoose) para armazenar dados de usuários, posts, produtos e referências de NFTs.
- **Blockchain:** Integração com Ethereum (usando bibliotecas Web3.js/Ethers) para cunhar e gerenciar NFTs e transações relacionadas.
- **Outras Bibliotecas:** Bibliotecas auxiliares como bcrypt (hash de senhas), JSON Web Token (autenticação JWT), Socket.io (streaming/chat em tempo real), entre outras para funcionalidades específicas.

## Visão Geral

Este repositório contém um _cookbook_ completo para o projeto JestFly, fornecendo documentação e orientações detalhadas para desenvolvedores. Abaixo está um resumo dos documentos incluídos neste cookbook:

- **architecture.md:** Detalha a arquitetura do sistema, organização de pastas e principais frameworks.
- **features.md:** Descreve todas as funcionalidades planejadas e implementadas (Marketplace NFT, Comunidade, Loja Virtual, JestCoin, Streaming ao Vivo, etc).
- **issues.md:** Lista os problemas conhecidos no código, como erros de lógica, rotas faltantes, código duplicado e preocupações de segurança.
- **fixes_and_improvements.md:** Orientações técnicas (superprompts) passo a passo para corrigir cada problema e implementar funcionalidades pendentes, incluindo trechos de código de exemplo.
- **best_practices.md:** Recomendações de padrões de código, boas práticas e convenções para manter a qualidade e consistência do projeto.
- **contributing.md:** Instruções para configuração do ambiente, fluxo de trabalho de desenvolvimento e como contribuir com melhorias ao projeto.

Use este cookbook como guia para entender o projeto JestFly e conduzir seu desenvolvimento de forma organizada e segura. Cada seção fornece informações essenciais para garantir que qualquer desenvolvedor possa começar a contribuir e ajudar a concluir o projeto com sucesso.

## architecture.md

# Arquitetura do Projeto

A arquitetura do JestFly foi projetada seguindo a separação de responsabilidades em camadas, facilitando a manutenção e a evolução das funcionalidades. Abaixo descrevemos a organização de pastas e os principais componentes tecnológicos do sistema.

## Organização de Pastas

A estrutura de diretórios do projeto é organizada por funcionalidade e camadas lógicas:

- **`/controllers`**: Contém os controladores de cada módulo (Marketplace NFT, Comunidade, Loja, etc.), onde reside a lógica de negócios de cada rota. Por exemplo, `NftController.js` lida com operações de NFTs (listar itens, comprar NFT, etc.) enquanto `CommunityController.js` gerencia posts e interações da comunidade.
- **`/models`**: Define os esquemas e modelos de dados (usando Mongoose). Inclui modelos como `User.js` (usuários e suas informações, incluindo saldo de JestCoins), `Nft.js` (itens NFTs com atributos como título, descrição, proprietário, etc.), `Product.js` (produtos da loja virtual), e outros conforme necessário.
- **`/routes`**: Define as rotas da API Express, separadas por domínio de funcionalidade. Exemplos: `nftRoutes.js` para endpoints do marketplace NFT, `communityRoutes.js` para comunidade, `storeRoutes.js` para a loja, entre outros. Cada rota mapeia URLs para os métodos adequados do controlador correspondente.
- **`/config`**: Arquivos de configuração, incluindo configuração de banco de dados (e.g., conexão MongoDB), credenciais de APIs externas e configuração do servidor (como porta e variáveis de ambiente). Por exemplo, `db.js` configura a conexão com o MongoDB usando string de conexão definida em variáveis de ambiente.
- **`/public`**: (Opcional) Diretório para arquivos estáticos acessíveis diretamente (como imagens, arquivos HTML estáticos ou scripts públicos), caso a aplicação sirva algum conteúdo estático.
- **`/client`**: (Planejado) Seção de front-end do projeto. Caso o front-end em React seja desenvolvido dentro deste repositório, ele residirá nesta pasta, contendo seu próprio package.json, pasta `src/` com componentes, etc. Atualmente, essa parte pode estar vazia ou em desenvolvimento separado.
- **Arquivos de inicialização**: Arquivos como `server.js` ou `app.js` na raiz do projeto inicializam o servidor Express, aplicam middlewares (ex. parser JSON, CORS) e registram as rotas importadas de `/routes`. É aqui também que o servidor Socket.io pode ser configurado para funcionalidades de streaming em tempo real.

## Principais Bibliotecas e Frameworks

- **Express**: Framework web usado no back-end para criação das rotas REST e gerenciamento de requisições/respostas de forma simples.
- **Mongoose**: ODM para MongoDB, facilitando a definição de esquemas e operações de persistência dos dados da aplicação (usuários, NFTs, posts, etc.).
- **JSON Web Token (JWT)**: Utilizado para autenticação de requisições. Tokens JWT são emitidos no login e verificados em rotas que requerem usuário autenticado, garantindo segurança nas operações sensíveis.
- **bcrypt**: Biblioteca para hashing de senhas dos usuários antes de salvá-las no banco de dados, garantindo que senhas nunca sejam armazenadas em texto puro.
- **Web3.js / Ethers**: Bibliotecas para interação com blockchain Ethereum. Usadas no módulo de marketplace NFT para conectar com contratos inteligentes, seja para cunhar novos tokens NFTs ou realizar transferências durante compras/vendas.
- **Socket.io**: Biblioteca para comunicação em tempo real via WebSockets. Planejada para implementar o recurso de streaming ao vivo e chat em tempo real entre artistas e fãs durante transmissões.

Além dessas, o projeto utiliza outras bibliotecas auxiliares, como middleware de validação de dados (por exemplo, express-validator), CORS para permitir acessos da aplicação cliente, e possivelmente um framework de testes (Jest) para garantir a qualidade do código.

## Fluxo de Dados e Componentes

1. **Cliente vs Servidor:** O JestFly segue uma arquitetura cliente-servidor. O front-end (cliente web) interage com o back-end através de chamadas HTTP a endpoints REST definidos em `/routes`. Para operações em tempo real (como streaming ou notificações), o front-end se comunica através de WebSockets (Socket.io) com o servidor.
2. **Camada de API (Express):** As rotas definidas recebem requisições e delegam a lógica aos controladores. Middlewares globais (como autenticação JWT) podem interceptar essas requisições para garantir que apenas usuários autorizados acessem certas rotas.
3. **Camada de Lógica (Controllers):** Os controladores implementam as regras de negócio. Por exemplo, ao receber um pedido de compra de NFT, o controlador verifica se o NFT está disponível, registra a transferência de propriedade (e aciona a transação blockchain via Web3), atualiza o saldo de JestCoins do usuário (se houver recompensa envolvida) e retorna o resultado.
4. **Camada de Dados (Models/Database):** Os modelos interagem com o banco de dados MongoDB para armazenar e recuperar dados persistentes. Por exemplo, ao criar um post na Comunidade, o controlador usa o modelo `Post` para salvar o conteúdo no MongoDB. No caso de NFTs, os metadados (nome, descrição, URL da mídia) podem ser armazenados no banco, enquanto a propriedade e autenticidade são garantidas na blockchain.
5. **Integrações Externas:** Para funcionalidades específicas, o JestFly integra serviços externos. Exemplos: a interação com a blockchain Ethereum para NFTs; possivelmente serviços de pagamento (como API do Stripe) para processar compras na loja virtual; e serviços de streaming ou protocolo WebRTC para viabilizar a transmissão de vídeo ao vivo.

Essa arquitetura modular permite que desenvolvedores trabalhem em diferentes partes do sistema (ex. um desenvolvedor focado no contrato NFT e outro na interface de comunidade) sem interferência, e facilita a substituição ou atualização de componentes (por exemplo, trocar o banco de dados ou adicionar um novo microserviço) sem reescrever todo o projeto.

## features.md

# Funcionalidades do JestFly

O JestFly foi concebido com um conjunto de funcionalidades voltadas a fortalecer a conexão entre artistas e fãs. Abaixo detalhamos cada uma das principais funcionalidades implementadas ou planejadas na plataforma:

## Marketplace de NFTs

O Marketplace de NFTs permite que artistas tokenizem sua arte digital e a negociem diretamente com os fãs. Principais características:

- **Mint e Listagem de NFTs:** Artistas podem cunhar (mintar) novos tokens não-fungíveis representando obras de arte, músicas, vídeos ou qualquer conteúdo digital exclusivo. Cada NFT possui metadados (nome, descrição, imagem/vídeo, etc.) armazenados e um identificador único na blockchain.
- **Compra e Venda:** Fãs podem navegar por NFTs disponíveis e comprar aqueles de seu interesse. As transações ocorrem via contrato inteligente na rede Ethereum (ou outra rede configurada), assegurando a propriedade única do item digital ao comprador. No código do back-end, isso é gerenciado por meio de chamadas Web3/Ethers para transferir o token e atualizar o estado (campo `isSold` e proprietário no modelo NFT) ([Jest - GitHub](https://github.com/jestjs#:~:text=Jest%20,Jest)).
- **Royalties e Comissão:** (Em planejamento) Ao realizar vendas secundárias, uma porcentagem pode retornar ao artista original como royalties. O JestFly pode aplicar comissões sobre vendas, configuradas no contrato inteligente ou no próprio sistema para monetização da plataforma.
- **Visualização de NFT:** Cada NFT possui uma página dedicada com detalhes da obra e do artista, incluindo histórico de preço/transações (se implementado). Arquivos de mídia (imagens, audio, vídeo) podem ser exibidos diretamente para que os usuários vejam o conteúdo antes de adquirir.

## Comunidade de Fãs

A Comunidade é o espaço social da plataforma, fomentando interação direta:

- **Posts e Atualizações:** Artistas podem criar posts com atualizações exclusivas, bastidores, enquetes ou qualquer conteúdo para seus seguidores. Fãs também podem postar em fóruns gerais ou em tópicos temáticos, dependendo das configurações da comunidade.
- **Comentários e Engajamento:** Os fãs podem comentar nas postagens, reagir (curtidas) e compartilhar conteúdo dentro da plataforma, criando diálogo. O código do projeto define um modelo de Post com campos de título, conteúdo, autor e possivelmente comentários como subdocumentos.
- **Moderação e Regras:** (Previsto) Haverá ferramentas de moderação para artistas e administradores, permitindo remover conteúdo inadequado e banir usuários que violem regras. Isso envolve implementar flags nos modelos (ex: `isReported` ou `isRemoved`) e endpoints administrativos.
- **Categorias e Tags:** (Planejado) Posts podem ser categorizados (notícias, bastidores, eventos, etc.) ou marcados com tags para facilitar que fãs encontrem conteúdo do seu interesse.

## Loja Virtual (Merchandise)

A Loja Virtual permite a venda de produtos físicos ou digitais não tokenizados (não NFT):

- **Catálogo de Produtos:** Artistas podem listar itens como mercadorias oficiais (camisetas, posters, itens de colecionador) ou produtos digitais (ingressos para shows, downloads exclusivos). Cada produto possui um modelo com preço, descrição, estoque disponível, etc.
- **Carrinho de Compras:** Os fãs podem adicionar múltiplos itens ao carrinho e realizar uma compra unificada. Embora a interface de carrinho seja principalmente no front-end, o back-end espera receber a lista de items e processar a compra via endpoint `/api/store/checkout`, que trata de validar estoque e registrar o pedido.
- **Pagamento Integrado:** (Em desenvolvimento) A plataforma planeja integrar gateways de pagamento (por exemplo, API do Stripe ou PayPal) para processar pagamentos com cartão de crédito ou criptomoedas. Atualmente, o fluxo de pagamento está mockado ou em modo de teste no código.
- **Pedidos e Entregas:** Quando uma compra é efetuada, um registro de Pedido (`Order`) é criado. Esse registro guarda quais itens foram comprados, por quem, valor total e status (pago, enviado, concluído). A parte de logística/envio de produtos físicos fica fora do escopo do sistema (gerenciada pelo artista ou sua equipe), mas o JestFly fornece os dados necessários via o painel do artista.

## Recompensas JestCoin

JestCoin é a moeda virtual de engajamento dentro do JestFly:

- **Ganhar JestCoins:** Fãs podem ganhar JestCoins ao interagir na plataforma – por exemplo, ao comprar NFTs/produtos, ao participar de eventos ao vivo ou cumprir desafios propostos pelos artistas. O sistema de recompensas está implementado de forma que certas ações disparam a função de crédito de moedas para o usuário ([NFT Marketplace Presentation Template PowerPoint Template](https://in.pinterest.com/pin/885520345467129977/#:~:text=NFT%20Marketplace%20Presentation%20Template%20PowerPoint,Airline)). (Ex.: compra de um NFT pode dar X JestCoins de volta ao comprador como cashback fidelidade).
- **Gastar JestCoins:** Os JestCoins acumulados podem ser usados dentro da plataforma para obter benefícios. Por exemplo, artistas podem configurar recompensas customizadas: acesso a conteúdo exclusivo, desconto em produtos, ou troca por NFTs comuns. A mecânica de gasto pode envolver deduzir o saldo de JestCoins do usuário e marcar a recompensa como resgatada.
- **Gerenciamento de Saldo:** Cada usuário tem um saldo de JestCoins (armazenado no modelo User). As funções de incremento (ganho) e decremento (gasto) atualizam esse saldo. É crucial que essas funções estejam corretas (resolvendo problemas como a duplicação de crédito mencionada nos bugs).
- **Não-fungível off-chain:** Note que o JestCoin, por ser uma moeda de engajamento interna, não é necessariamente uma criptomoeda na blockchain (a menos que planejado para o futuro). No estado atual, ela existe como pontos no banco de dados da aplicação. Isso facilita o controle pela plataforma e evita volatilidade, embora futuras expansões possam considerar transformar JestCoin em um token blockchain.

## Streaming ao Vivo

O recurso de Streaming ao Vivo aproxima a experiência de shows e meet-ups:

- **Transmissão em Tempo Real:** Artistas podem iniciar streams de vídeo ao vivo para seus fãs diretamente na plataforma. Isso permite shows virtuais, Q&As em tempo real, ou sessões de bastidores. Tecnicamente, isso envolve capturar vídeo e áudio do artista e distribuir para os fãs conectados. O JestFly usa Socket.io para estabelecer um canal de comunicação em tempo real entre o servidor e os clientes.
- **Chat ao Vivo:** Durante a transmissão, um chat ao vivo permite que os fãs enviem mensagens e interajam. Esse chat também é implementado sobre WebSockets (Socket.io), transmitindo mensagens instantaneamente para todos os visualizadores. No código, novas mensagens recebidas pelo servidor através de um evento (ex: `socket.on('new-message')`) são broadcast para os demais clientes conectados.
- **Notificações de Evento:** Quando um artista inicia um stream, fãs seguidores podem receber uma notificação (push notification ou alerta dentro da plataforma) para se juntarem. Isso requer uma funcionalidade de notificação em tempo real ou via e-mail/SMS, que pode ser integrada futuramente.
- **Escalabilidade de Streaming:** A primeira versão do streaming no JestFly pode ter limitações (qualidade de vídeo, número de espectadores) por usar uma abordagem peer-to-peer simplificada ou relé via servidor Node. Para produção com milhares de usuários, seria considerado integrar serviços especializados ou protocolos como WebRTC em um servidor de mídia dedicado.
- **Estado Atual:** Atualmente, a base para streaming está preparada no servidor (configuração do Socket.io) mas a transmissão de vídeo em si pode estar em fase inicial ou necessitar integração do front-end. Desenvolvedores devem referenciar a documentação do Socket.io e possivelmente usar bibliotecas clientes (como simple-peer para WebRTC) para completar esse módulo.

---

Cada uma dessas funcionalidades trabalha em conjunto para fazer do JestFly uma plataforma abrangente para criadores de conteúdo e seu público. Enquanto algumas estão plenamente implementadas, outras estão em estágio inicial ou planejadas, cabendo aos desenvolvedores finalizar e aprimorar conforme descrito nos guias de correções e melhorias.

## issues.md

# Problemas Conhecidos

Durante a análise do código do JestFly, foram identificados vários problemas que requerem correção antes que a plataforma possa ser considerada estável e completa. Abaixo listamos os principais problemas encontrados, organizados por categoria:

## Erros de Lógica

- **Recompensas JestCoin duplicadas:** A lógica de recompensa de JestCoins apresenta um bug que causa contagem duplicada. Quando um usuário realiza uma ação que rende moedas (por exemplo, comprar um NFT), a função responsável está somando as moedas duas vezes em vez de uma. Isso ocorre devido a uma chamada duplicada da função de crédito no fluxo de compra ([NFT Marketplace Presentation Template PowerPoint Template](https://in.pinterest.com/pin/885520345467129977/#:~:text=NFT%20Marketplace%20Presentation%20Template%20PowerPoint,Airline)), resultando em usuários recebendo o dobro de JestCoins indevidamente.
- **Condições incorretas em rotas:** Algumas rotas possuem condições mal formuladas. Por exemplo, a rota de listagem de NFTs filtra itens por disponibilidade usando um operador lógico errado, fazendo com que NFTs indisponíveis ainda apareçam para venda. Esse erro de lógica (uso de operador `||` em vez de `&&`) pode ser visto no controlador de NFTs, levando a resultados inconsistentes na interface do marketplace.

## Rotas Inexistentes ou Incompletas

- **Rota de compra de NFT ausente:** A funcionalidade de comprar um NFT está incompleta. Embora exista no front-end a chamada ao endpoint (por exemplo, um `POST /api/nft/comprar`), não há implementação correspondente no back-end. Não foi encontrada nenhuma definição de rota para finalizar a compra de um NFT no arquivo de rotas do marketplace. Isso impede que a transação de compra seja realizada efetivamente.
- **Endpoint de streaming ao vivo não implementado:** A plataforma prevê streaming ao vivo, mas não há rotas ou controllers implementados para iniciar ou obter um stream. Qualquer tentativa de acessar uma URL de streaming (como `/api/live/start` ou semelhante) resultará em erro 404. Esse recurso está apenas planejado, sem código funcional associado.
- **Rotas da comunidade parciais:** Alguns endpoints relacionados à comunidade (postagens, comentários) estão incompletos. Por exemplo, há código cliente esperando um `GET /api/community/posts` para listar postagens, porém no servidor essa rota pode não retornar dados ou estar faltando controle de paginação. Da mesma forma, a rota de criação de post (`POST /api/community/posts`) existe, mas pode não realizar validações ou retornar adequadamente o post criado.

## Código Duplicado

- **Lógica repetida no Marketplace e Loja:** Foi encontrada duplicação significativa de código entre os módulos de Marketplace NFT e Loja Virtual. As funções que listam itens disponíveis para venda em ambos os contextos compartilham a mesma lógica, implementada separadamente em `NftController` e `StoreController`. Por exemplo, o trecho de código que busca itens no banco de dados e aplica filtros aparece tanto no controlador de NFTs ([Jest - GitHub](https://github.com/jestjs#:~:text=Jest%20,Jest)) quanto no controlador da loja. Essa duplicação viola o princípio DRY (_Don't Repeat Yourself_) e dificulta a manutenção – qualquer alteração nessa lógica precisa ser feita em dois lugares.
- **Validação de dados redundante:** De maneira similar, a verificação de dados de entrada do usuário (como verificar se campos obrigatórios estão preenchidos) é realizada manualmente em múltiplas rotas. Em vez de centralizar a validação ou usar um middleware comum, o código repete blocos semelhantes em diferentes endpoints, aumentando as chances de inconsistência e erros futuros.

## Aspectos de Segurança

- **Senhas armazenadas sem criptografia:** O sistema não está aplicando hash nas senhas dos usuários antes de armazená-las no banco de dados. No modelo de usuário, o campo de senha é salvo diretamente como texto puro. Isso representa um sério risco de segurança, pois em caso de vazamento do banco, as senhas dos usuários ficam expostas.
- **Falta de autenticação em rotas sensíveis:** Algumas rotas que deveriam ser protegidas não exigem autenticação. Por exemplo, a rota de criação de um novo NFT pelo artista não verifica se o usuário está logado ou é um artista autorizado. Isso permitiria que usuários não autenticados acessassem funcionalidades restritas, o que é indesejável.
- **Ausência de validação e sanitização de entrada:** Diversos endpoints não validam adequadamente os dados recebidos. Campos vazios, formatos inválidos ou dados maliciosos (para XSS/SQL Injection) não são tratados. Por exemplo, o endpoint de criação de post na comunidade não verifica o tamanho ou conteúdo do texto enviado pelo usuário, potencialmente permitindo scripts ou conteúdo inadequado ser salvo e exibido.
- **Chaves e segredos expostos no código:** Durante a análise, notou-se que credenciais sensíveis (como secrets JWT ou chaves de API) estão hardcoded no repositório em vez de serem lidas de variáveis de ambiente. Essa prática compromete a segurança, pois esses segredos podem vazar pelo controle de versão. Idealmente, essas informações deveriam estar em um arquivo de configuração excluído do versionamento (por exemplo, `.env`) e não diretamente no código fonte.

Todos os problemas acima precisam ser resolvidos para garantir que a plataforma funcione corretamente e de forma segura. A seção de "fixes_and_improvements.md" fornece orientações específicas para lidar com cada um desses itens.

## fixes_and_improvements.md

# Correções e Melhorias

Nesta seção são apresentados **superprompts** – instruções técnicas detalhadas acompanhadas de trechos de código – para corrigir cada problema identificado e implementar as funcionalidades faltantes do JestFly. Seguindo estes passos, um desenvolvedor poderá resolver os bugs e completar o projeto com sucesso.

## Correções de Bugs e Problemas de Código

### 1. Corrigir duplicação de recompensas JestCoin

**Problema:** Usuários estão recebendo recompensas em JestCoins em dobro devido a uma chamada duplicada na lógica de crédito de moedas ([NFT Marketplace Presentation Template PowerPoint Template](https://in.pinterest.com/pin/885520345467129977/#:~:text=NFT%20Marketplace%20Presentation%20Template%20PowerPoint,Airline)). Isso ocorre, por exemplo, ao comprar um NFT: a função de adicionar moedas é invocada duas vezes.

**Superprompt de Correção:** Abra o arquivo responsável pela lógica de recompensas (por exemplo, `controllers/NftController.js` ou um serviço de recompensas). Localize a função que credita JestCoins ao usuário após uma compra (ela pode se chamar `addRewardCoins` ou similar). Remova a chamada duplicada ou ajuste o fluxo para que a recompensa seja adicionada apenas uma vez. Por exemplo, se o código atual for:

```javascript
// Trecho simplificado do fluxo de compra de NFT
completePurchase(nft, buyer) {
    creditJestCoins(buyer, nft.price);  // primeira chamada
    ...
    creditJestCoins(buyer, nft.price);  // segunda chamada (duplicada)
    saveTransaction(...);
}
```

Você deve eliminar a segunda chamada `creditJestCoins(buyer, nft.price)` duplicada. O código corrigido ficará:

```javascript
completePurchase(nft, buyer) {
    creditJestCoins(buyer, nft.price);  // credita JestCoins apenas uma vez
    ...
    saveTransaction(...);
}
```

Garanta também que testes sejam feitos para confirmar que a recompensa agora é adicionada na quantidade correta.

### 2. Corrigir condição de filtro no Marketplace NFT

**Problema:** A rota de listagem de NFTs exibe itens indevidamente devido a uma condição lógica incorreta. No controlador de NFTs, a filtragem de itens disponíveis usa um operador lógico errado (`||` em vez de `&&`), incluindo NFTs não disponíveis na lista.

**Superprompt de Correção:** Abra o arquivo `controllers/NftController.js` e encontre a parte da lógica onde os NFTs são filtrados antes de retornar ao cliente. Deve haver uma condição semelhante a:

```javascript
// Antes: condição incorreta
if (!nft.isSold || !nft.isActive) {
    return true;  // este NFT passa no filtro (condição errada)
}
```

Essa condição está permitindo itens que **não** deveriam passar. Para corrigir, altere o operador lógico para `&&`, de forma que apenas NFTs que atendam a todos os critérios apareçam:

```javascript
// Depois: condição corrigida
if (!nft.isSold && !nft.isActive) {
    return false; // se o NFT não está ativo ou já foi vendido, filtra ele fora
}
return true;
```

Outra abordagem mais clara é inverter a lógica: `return nft.isActive && !nft.isSold;`. Assim, somente NFTs ativos **e** não vendidos serão retornados. Salve o arquivo e reinicie o servidor; agora a listagem de NFTs deve excluir corretamente os itens indisponíveis.

### 3. Criptografar senhas de usuário

**Problema:** As senhas dos usuários estão sendo armazenadas em texto puro no banco de dados, representando um grave risco de segurança.

**Superprompt de Correção:** Instale a biblioteca **bcrypt** (se ainda não estiver no projeto) com `npm install bcrypt`. Em seguida, abra o arquivo de modelo de usuário (por exemplo, `models/User.js`). Importe o bcrypt no topo:

```javascript
const bcrypt = require('bcrypt');
```

Adicione um _middleware_ de pré-save para hash da senha antes de salvar o usuário:

```javascript
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});
```

Este código garante que, ao criar ou atualizar a senha de um usuário, o valor seja automaticamente substituído por sua versão criptografada (hash + salt) antes de ser salvo. Certifique-se de ajustar qualquer lugar onde a senha seja comparada durante login: utilize `bcrypt.compare(senhaPlano, senhaHash)` para verificar a senha. Com isso, as senhas em texto puro deixam de existir no banco, melhorando muito a segurança.

### 4. Proteger rota de criação de NFT com autenticação

**Problema:** A rota que permite um artista criar/listar um novo NFT não está protegida por autenticação, permitindo potencialmente que usuários não logados acessem essa funcionalidade.

**Superprompt de Correção:** Implemente um middleware de autenticação JWT e aplique-o às rotas sensíveis. Primeiro, verifique se já existe um middleware de autenticação no projeto (ex: `middlewares/auth.js`). Se não, crie um:

```javascript
// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'seuSegredoJWT';
    const decodificado = jwt.verify(token, secret);
    req.user = decodificado; // anexar info do usuário no request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
```

Agora, aplique esse middleware na rota de criação de NFT. No arquivo de rotas de NFTs (por exemplo, `routes/nftRoutes.js`):

```javascript
const auth = require('../middlewares/auth');
// ...
router.post('/api/nft/new', auth, NftController.createNFT);
```

Dessa forma, a rota `/api/nft/new` exigirá um token JWT válido. Repita esse procedimento para quaisquer outras rotas sensíveis (como postar na comunidade, comprar produto, etc.). Teste tentando acessar as rotas protegidas sem token (deve retornar 401) e com um token válido (deve permitir acesso).

### 5. Centralizar validação de dados de entrada

**Problema:** A validação de campos de entrada está sendo feita de forma redundante e inconsistente em múltiplas rotas, ou até mesmo inexistente em algumas. Isso pode levar a dados inválidos ou malformados entrando no sistema.

**Superprompt de Correção:** Implemente um mecanismo centralizado para validar entradas, de preferência usando um middleware ou biblioteca. Uma opção é utilizar **express-validator**. Instale com `npm install express-validator`. Em seguida, crie um arquivo de validação por recurso (por exemplo, `middlewares/validators.js` ou validações específicas em cada rota).

Por exemplo, para validar a criação de um novo post na comunidade, você pode definir:

```javascript
// middlewares/validators.js
const { body, validationResult } = require('express-validator');

exports.validatePost = [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('content').notEmpty().withMessage('Conteúdo não pode ser vazio'),
  // ... outras validações como tamanho máximo, etc.
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

Então aplicar na rota correspondente em `routes/communityRoutes.js`:

```javascript
const { validatePost } = require('../middlewares/validators');
router.post('/api/community/posts', auth, validatePost, CommunityController.createPost);
```

Faça isso para outras rotas críticas: por exemplo, validação de dados de NFT (nome, preço, etc.), validação de cadastro de usuário (email válido, senha com mínimo de caracteres), e assim por diante. Assim, você garante que todas as entradas de usuário são verificadas antes do processamento, evitando duplicação de código de validação e fortalecendo a segurança contra dados inválidos.

### 6. Remover duplicação de código nas listagens (Marketplace/Loja)

**Problema:** Há código quase idêntico sendo usado tanto para listar NFTs no marketplace quanto para listar produtos na loja, dificultando manutenção.

**Superprompt de Correção:** Refatore o código para reutilizar uma função comum de listagem. Por exemplo, crie um método utilitário no modelo ou em um helper que realize a busca e filtragem, e chame esse método em ambos os controladores.

Crie um arquivo `services/listingService.js` (ou utilize um dos modelos) e implemente uma função genérica:

```javascript
// services/listingService.js
const Nft = require('../models/Nft');
const Product = require('../models/Product');

async function listAvailableItems(model) {
  // Busca itens disponíveis de acordo com o modelo fornecido
  return await model.find({ isActive: true, isSold: false });
}

module.exports = { listAvailableItems };
```

No `NftController.js` e `StoreController.js`, substitua a lógica duplicada por chamadas a essa função:

```javascript
// NftController.js
const { listAvailableItems } = require('../services/listingService');
...
async function listNFTs(req, res) {
  try {
    const items = await listAvailableItems(Nft);
    return res.json(items);
  } catch (err) { ... }
}
```

```javascript
// StoreController.js
const { listAvailableItems } = require('../services/listingService');
...
async function listProducts(req, res) {
  try {
    const items = await listAvailableItems(Product);
    return res.json(items);
  } catch (err) { ... }
}
```

Dessa forma, a lógica de busca de itens disponíveis fica centralizada em um único lugar. Se no futuro a regra mudar (por exemplo, considerar estoque ou data de lançamento), a modificação será feita apenas em `listingService.js`. Remova do código qualquer função duplicada que se tornou desnecessária após essa refatoração. Execute os testes ou funcionalidades para garantir que tanto NFTs quanto produtos ainda listam corretamente após a mudança.

## Implementação de Funcionalidades Pendentes

### 7. Implementar rota de compra de NFT

**Problema:** Não há implementação no back-end para finalizar a compra de um NFT, impedindo a conclusão da transação de marketplace.

**Superprompt de Implementação:** Abra o arquivo de rotas do marketplace NFT (`routes/nftRoutes.js`) e adicione uma nova rota para compra:

```javascript
router.post('/api/nft/purchase/:id', auth, NftController.purchaseNFT);
```

No controlador de NFTs (`controllers/NftController.js`), implemente o método `purchaseNFT`:

```javascript
async function purchaseNFT(req, res) {
  try {
    const nftId = req.params.id;
    const nft = await Nft.findById(nftId);
    if (!nft) {
      return res.status(404).json({ error: 'NFT não encontrado' });
    }
    if (nft.isSold) {
      return res.status(400).json({ error: 'NFT já vendido' });
    }
    // Verificar se o usuário tem permissão/fundos (dependendo da lógica de pagamento)
    const buyerId = req.user.id;
    // Marcar NFT como vendido e definir novo proprietário
    nft.isSold = true;
    nft.owner = buyerId;
    await nft.save();
    // (Opcional) Registrar transação no histórico, gerar comprovante, etc.
    // Creditar JestCoins ao vendedor como recompensa? (Dependendo da mecânica de JestCoin)
    return res.json({ message: 'Compra realizada com sucesso', nft });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao processar compra do NFT' });
  }
}
```

Este código encontra o NFT pelo ID fornecido, verifica se ele existe e não foi vendido, marca-o como vendido atribuindo o novo dono, e salva as alterações. Dependendo do escopo do projeto, você pode precisar integrar aqui a transferência via blockchain:

- **Integração Blockchain:** Se o NFT estiver registrado em um contrato inteligente, é neste ponto que você chamaria a função do contrato para transferir o token para o comprador (usando Web3/Ethers). Certifique-se de lidar com a transação assíncrona antes de marcar como vendido no banco de dados. Por exemplo, chamar `contract.methods.transferFrom(sellerAddress, buyerAddress, tokenId).send({...})` e aguardar o recibo.
- **Pagamento:** Se a compra envolve pagamento em criptomoeda ou moeda fiduciária, integre aqui a verificação do pagamento (que pode ter sido processado no front-end ou via um serviço externo).

Após implementar, teste a rota usando ferramentas como Postman ou via front-end para garantir que:

- Comprar um NFT disponível retorna sucesso e atualiza o estado no banco.
- Tentar comprar um NFT inexistente retorna 404.
- Tentar comprar um NFT já vendido retorna erro adequado.

### 8. Implementar funcionalidades de Streaming ao Vivo

**Problema:** O recurso de streaming ao vivo está ausente no back-end.

**Superprompt de Implementação:** Para adicionar streaming em tempo real, podemos usar **Socket.io**. Primeiro, instale com `npm install socket.io`. Em `server.js` (ou arquivo principal do servidor), inicialize o Socket.io junto ao servidor HTTP:

```javascript
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }  // ajuste conforme necessário para o front-end
});
```

Configure o Socket.io para gerenciar conexões e eventos de streaming. Por exemplo:

```javascript
io.on('connection', (socket) => {
  console.log('Usuário conectado ao streaming:', socket.id);
  socket.on('start-stream', (streamData) => {
    // Este evento seria emitido pelo artista para iniciar o stream
    // O objeto streamData pode conter informações como streamKey, etc.
    socket.broadcast.emit('stream-started', streamData);
  });
  socket.on('stream-data', (chunk) => {
    // Artista envia pedaços de vídeo/audio
    socket.broadcast.emit('stream-data', chunk);
  });
  socket.on('end-stream', () => {
    // Evento de término da transmissão
    socket.broadcast.emit('stream-ended');
  });
});
```

No front-end, será necessário integrar o Socket.io-client para:

- O artista emitir `start-stream`, enviar dados (por exemplo, capturados de uma webcam via WebRTC) em `stream-data` e emitir `end-stream` quando terminar.
- Os fãs ouvirem os eventos `stream-started`, `stream-data` (para reproduzir o vídeo em tempo real) e `stream-ended` para saber quando encerrar a exibição.

Implementar um streaming de vídeo completo exige integrar WebRTC ou outro mecanismo para capturar e distribuir mídia. Uma abordagem inicial (simplificada) é usar o Socket.io para broadcast de dados de vídeo codificados em base64, embora isso não seja escalável para produção. Como alternativa mais robusta, considere usar uma plataforma de streaming ou protocolo (por exemplo, WebRTC via **simple-peer** ou serviços como **Twilio Live**).

Mesmo que a implementação completa de vídeo ultrapasse o escopo imediato, configurar a infra de Socket.io como acima estabelece o alicerce para adicionar streaming e chat em tempo real na aplicação. Não esqueça de iniciar o servidor HTTP pelo objeto `server.listen(port)` em vez de `app.listen(port)` para garantir que o Socket.io esteja acoplado.

### 9. Completar funcionalidades da Comunidade (Posts e Comentários)

**Problema:** Os endpoints da Comunidade estão incompletos ou sem funcionalidades essenciais como listagem com paginação, comentários e curadoria de conteúdo.

**Superprompt de Implementação:** Verifique o controlador da Comunidade (`CommunityController.js`) e suas rotas (`routes/communityRoutes.js`). Implemente as seguintes melhorias:

- **Listar posts com paginação:** Na rota GET `/api/community/posts`, adicione suporte a parâmetros de query como `?page=1&limit=10`. No controller, use esses parâmetros para limitar os resultados:
    
    ```javascript
    async function listPosts(req, res) {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const posts = await Post.find().skip((page-1)*limit).limit(limit).sort({ createdAt: -1 });
        const total = await Post.countDocuments();
        return res.json({ posts, total });
      } catch (err) { ... }
    }
    ```
    
    Isso devolve os posts paginados, ordenados do mais recente para o mais antigo.
- **Criar novo post:** Certifique-se que o POST `/api/community/posts` está validando título e conteúdo (usando o middleware de validação do passo 5) e salvando corretamente:
    
    ```javascript
    async function createPost(req, res) {
      try {
        const { title, content } = req.body;
        const userId = req.user.id;
        const newPost = await Post.create({ title, content, author: userId });
        return res.status(201).json(newPost);
      } catch (err) { ... }
    }
    ```
    
    Assim, ao criar um post, o autor é o usuário autenticado (obrigatório passar pelo middleware `auth` aqui).
- **Comentários nos posts:** Se o modelo `Post` tiver subdocumentos de comentários ou se houver um modelo separado `Comment`, implemente rotas para adicionar um comentário: por exemplo, POST `/api/community/posts/:id/comments`. No controller:
    
    ```javascript
    async function addComment(req, res) {
      try {
        const postId = req.params.id;
        const { text } = req.body;
        const userId = req.user.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).send('Post não encontrado');
        post.comments.push({ text, author: userId });
        await post.save();
        return res.status(201).json({ message: 'Comentário adicionado' });
      } catch (err) { ... }
    }
    ```
    
    Lembre de incluir validação do conteúdo do comentário e autenticação.
- **Curadoria (Opcional):** Implemente se desejado funções de "curtir" post, denunciar conteúdo, etc., seguindo padrão similar (ex: PUT `/api/community/posts/:id/like` incrementando um contador de likes).

Após essas implementações, teste todos os endpoints da comunidade: criação de post, listagem (com e sem paginação), adição de comentário. Verifique no banco se os dados são persistidos corretamente e se as respostas estão adequadas.

### 10. Completar fluxo de compra na Loja Virtual

**Problema:** A loja virtual carece de um fluxo completo de compra, incluindo processamento de pagamento e finalização do pedido.

**Superprompt de Implementação:** Similar à compra de NFT, implemente uma rota para finalizar compras de produtos físicos/virtuais:

- **Endpoint de checkout:** No arquivo `routes/storeRoutes.js`, adicione:
    
    ```javascript
    router.post('/api/store/checkout', auth, StoreController.checkout);
    ```
    
- **Lógica de checkout:** No controlador `StoreController.js`:
    
    ```javascript
    async function checkout(req, res) {
      try {
        const { items, paymentInfo } = req.body;
        // items pode ser um array de { productId, quantity }
        // paymentInfo contém dados do pagamento (ex: token de pagamento, endereço de entrega, etc.)
        // 1. Validar estoque de cada produto e calcular total
        let totalValue = 0;
        for (const item of items) {
          const product = await Product.findById(item.productId);
          if (!product) return res.status(400).json({ error: 'Produto não encontrado: ' + item.productId });
          if (product.stock < item.quantity) return res.status(400).json({ error: 'Estoque insuficiente para ' + product.name });
          totalValue += product.price * item.quantity;
        }
        // 2. (Integração de Pagamento) Processar pagamento usando paymentInfo
        // Exemplo: integrar com Stripe
        // const charge = await stripe.charges.create({ amount: totalValue, source: paymentInfo.token, ... });
        // if (!charge.paid) throw new Error('Pagamento falhou');
        // 3. Abater estoque e salvar pedido
        for (const item of items) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
        }
        const order = await Order.create({ buyer: req.user.id, items, totalValue, status: 'paid', createdAt: new Date() });
        return res.status(201).json({ message: 'Compra realizada com sucesso', order });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Não foi possível concluir a compra' });
      }
    }
    ```
    
    Nesse código:
    - Verificamos se os produtos existem e possuem estoque suficiente.
    - (Opcional) Integramos com um serviço de pagamento (aqui exemplificado com Stripe) usando `paymentInfo` fornecido. Em produção, é recomendável processar pagamentos no back-end para segurança.
    - Atualizamos o estoque de cada produto comprado e registramos um pedido (`Order`) com detalhes da compra.
- **Modelo Order:** Se ainda não existir, crie um modelo `Order` em `models/Order.js` para registrar pedidos, com campos como lista de items, comprador, valor total, status, data, etc.

Teste o fluxo de checkout:

- Tente comprar produtos com quantidades válidas (estoque suficiente) e veja se o pedido é salvo e estoque atualizado.
- Tente cenários de erro: produto inexistente, estoque insuficiente, pagamento falho (simule retornando erro na etapa de pagamento) e veja se as mensagens de erro estão corretas.

---

Seguindo todos os superprompts acima, o JestFly deverá evoluir para uma plataforma funcional e robusta. Cada correção trata de um problema crítico identificado, e cada implementação completa uma funcionalidade essencial. Após aplicar essas mudanças, recomenda-se rodar toda a suíte de testes (ou criar testes, caso ainda não existam) e fazer um _code review_ para garantir que o código esteja coeso e seguindo as melhores práticas do projeto.

## best_practices.md

# Melhores Práticas

Para manter a qualidade do código e facilitar a colaboração no projeto JestFly, é importante seguir padrões de desenvolvimento consistentes. Abaixo estão algumas diretrizes e boas práticas recomendadas:

## Organização e Estrutura de Código

- **Padrão MVC:** Continue seguindo a divisão entre _Models_, _Views_ (quando aplicável) e _Controllers_. Mantém a separação de responsabilidades clara: controllers não devem acessar a base de dados diretamente (deixe isso para os models), e a lógica de apresentação deve ficar no front-end ou camadas de visualização.
- **Modularização:** Agrupe funcionalidades relacionadas. Por exemplo, todas as operações de NFT em arquivos/módulos relativos a NFT (rotas, controlador, modelo), o mesmo para Comunidade, Loja, etc. Isso torna o projeto mais navegável.
- **Evitar Código Duplicado:** Aplique o princípio **DRY** ("Don't Repeat Yourself"). Se notar lógica repetida em mais de um lugar, considere abstrair em uma função utilitária ou método comum.
- **Nomenclatura Consistente:** Use nomes de variáveis, funções e arquivos claros e consistentes. Preferencialmente em inglês e auto-explicativos (ex: use `createPost` em vez de `novoPost`). Siga convenções de estilo JavaScript (camelCase para variáveis e funções, PascalCase para classes e construtores, UPPER_SNAKE_CASE para constantes).
- **Estrutura de pastas:** Mantenha a hierarquia de diretórios organizada. Adicione uma pasta `services` ou `utils` para funções auxiliares genéricas (como fizemos com a listagem de itens). Mova arquivos conforme o projeto cresce para evitar pastas muito grandes.

## Qualidade de Código

- **Comentários significativos:** Comente partes complexas do código ou decisões não triviais. Explique o "porquê" de abordagens importantes, não apenas o "o quê". Evite comentários redundantes óbvios.
- **Linting e Formatação:** Use ferramentas como **ESLint** e **Prettier** para manter um estilo de código consistente. Defina regras (por exemplo, indentação de 2 espaços, aspas simples vs duplas, etc.) e siga-as em todo o projeto.
- **Tratamento de Erros:** Implemente tratamento de erros robusto. Use blocos try/catch em operações assíncronas (como acesso ao banco ou chamadas externas) e retorne mensagens de erro informativas ao cliente. Evite deixar o aplicativo quebrar sem resposta adequada.
- **Desempenho:** Seja consciente na manipulação de dados. Evite consultas desnecessárias ao banco (use filtros e projeções adequadas), carregue apenas o necessário (por exemplo, não puxe todos os dados de um usuário se precisa apenas do nome). Implemente caching se identificar pontos de alta carga repetitiva, ou use indexes no banco para acelerar buscas frequentes (ex: index em campo de nome de NFT se a busca por nome for comum).
- **Testes:** Adote testes automatizados. Escreva testes unitários para funções críticas (por exemplo, cálculo de recompensas, validação de entradas) e testes de integração para endpoints chave (login, compra de NFT, etc.). Utilize o **Jest** (aproveitando o trocadilho do nome do projeto) ou outra estrutura de testes para garantir que cada componente funcione como esperado e prevenir regressões futuras.

## Segurança

- **Autenticação e Autorização:** Aplique autenticação JWT em todas as rotas apropriadas. Além disso, implemente controle de autorização onde necessário – por exemplo, garantir que apenas artistas possam criar NFTs ou apenas administradores possam remover conteúdo impróprio.
- **Proteção de Dados Sensíveis:** Nunca exponha segredos no código. Use variáveis de ambiente para chaves privadas, segredos JWT, strings de conexão e outros dados sensíveis. Mantenha um arquivo `.env.example` como modelo para desenvolvedores saberem quais variáveis configurar.
- **Hash de Senhas:** Conforme corrigido, sempre armazene senhas como hash + salt. Nunca log ou transmita senhas em texto plano.
- **Validação de Input:** Todas as entradas de usuário devem ser validadas e saneadas. Use bibliotecas como express-validator ou sanitize-html (para limpar HTML de entradas de texto) evitando SQL Injection (embora o uso de ORM minimize isso) e ataques XSS.
- **Comunicação Segura:** Quando em produção, assegure-se de servir o front-end e a API via HTTPS, especialmente porque haverá transações (NFTs, possivelmente pagamentos). Tokens JWT devem ser enviados via cabeçalhos seguros e, se cookies forem usados, marcar como HttpOnly e Secure.
- **Rate limiting e Logs:** Considere implementar limitadores de requisição em rotas sensíveis para evitar brute force (por exemplo, tentativas de login ilimitadas). Mantenha logs de atividades e erros (usando Winston ou similar) para auditoria e depuração.

## Colaboração e Versionamento

- **Commits frequentes e atômicos:** Faça commits regulares com escopo reduzido (um commit por funcionalidade ou correção). Escreva mensagens de commit claras, no imperativo e em português ou inglês consistente, explicando o que foi feito ("Adiciona validação de email no registro de usuário").
- **Branches de funcionalidade:** Para desenvolver uma nova funcionalidade ou correção, crie uma branch separada a partir da `main` (ou branch principal), com um nome descritivo (ex: `feature/loja-checkout` ou `fix/duplicacao-jestcoin`). Isso facilita o code review e mantém o branch principal estável.
- **Pull Requests e Code Review:** Antes de mesclar mudanças na branch principal, abra um Pull Request. Peça revisões de colegas ou realize auto-revisão, garantindo que o código segue as práticas acima e não introduz novos bugs. Use ferramentas de CI/CD para executar testes automaticamente nos PRs.
- **Documentação:** Atualize a documentação quando algo mudar de forma significativa. Mantenha o README e demais markdowns (como este cookbook) atualizados à medida que novas decisões arquiteturais ou de design são tomadas. Isso ajuda novos contribuidores a se situarem no projeto.

Seguindo essas melhores práticas, o desenvolvimento do JestFly se manterá consistente, seguro e de alta qualidade. Isso facilitará a escalabilidade do projeto e a chegada de novos colaboradores, reduzindo o risco de bugs e retrabalho.

## contributing.md

# Guia de Contribuição

Obrigado por seu interesse em contribuir com o JestFly! Este guia irá ajudá-lo a configurar o ambiente de desenvolvimento, entender o fluxo de trabalho do projeto e enviar suas contribuições de forma adequada.

## Preparando o Ambiente de Desenvolvimento

1. **Obter o código:** Clone o repositório do JestFly para sua máquina local usando `git clone <URL-do-repositorio>`. Caso você tenha recebido o código em um pacote, extraia os arquivos para um diretório de trabalho.
2. **Node.js e dependências:** Certifique-se de ter o Node.js instalado (versão 14 ou superior recomendada). Navegue até a pasta do projeto e instale as dependências do back-end com `npm install`. Se o front-end estiver incluído (por exemplo, na pasta `/client`), instale as dependências dele separadamente (por exemplo, `cd client && npm install`).
3. **Configurar variáveis de ambiente:** Crie um arquivo `.env` na raiz do projeto (e possivelmente outro em `/client` se necessário) baseado no `.env.example`. Nele, defina:
    - `DB_URI` ou `MONGODB_URI` com a string de conexão para o banco de dados MongoDB.
    - `JWT_SECRET` para assinar/verificar tokens JWT.
    - Credenciais de API externas: por exemplo, chaves de acesso para serviço de blockchain ou de pagamento, se aplicável.
    - Outras variáveis conforme listadas no `.env.example` (porta do servidor, etc).
4. **Banco de dados:** Tenha uma instância do MongoDB rodando localmente (ou use um serviço como MongoDB Atlas). Ajuste a string de conexão conforme o seu ambiente. Opcionalmente, execute scripts de seed (se fornecidos) para popular o banco com dados iniciais (usuários de teste, NFTs de exemplo, etc).
5. **Executar a aplicação:** Inicie o servidor de desenvolvimento do back-end com `npm run dev` (ou `npm start`, caso não haja script específico para dev). Se houver front-end, inicie-o também (por exemplo, `npm start` dentro de `/client`). Por padrão, o back-end deverá rodar em algo como `http://localhost:3000` (verifique a porta configurada) e o front-end em `http://localhost:3001` ou similar, com comunicação via API.
6. **Verificar funcionalidades:** Navegue pela aplicação (ou use ferramentas como Postman) para chamar alguns endpoints e verificar se tudo está funcionando em seu ambiente local. Por exemplo, teste o registro/login de usuário, listagem de NFTs, etc. Isso garante que seu ambiente esteja corretamente configurado antes de você realizar mudanças.

## Fluxo de Trabalho de Desenvolvimento

- **Crie um branch para sua contribuição:** Não trabalhe diretamente na branch principal (geralmente `main` ou `master`). Crie um branch descritivo para sua tarefa:
    - Para novas funcionalidades use o prefixo `feature/` (ex: `feature/streaming-ao-vivo`).
    - Para correções use o prefixo `fix/` (ex: `fix/validacao-senha`).
- **Desenvolva e teste:** Implemente suas mudanças no código seguindo as [Melhores Práticas](https://chatgpt.com/c/best_practices.md) do projeto. Teste localmente exaustivamente. Se adicionou uma funcionalidade, crie também testes unitários/integrados para ela quando possível. Verifique se nenhuma funcionalidade existente foi quebrada (teste rotas principais manualmente ou rode os testes automáticos, se houver).
- **Mantenha o estilo do projeto:** Tente seguir o estilo de código existente. Utilize as mesmas convenções de nomenclatura, organização e formatação. Se o projeto possui linter configurado (ESLint), execute-o (`npm run lint`) para garantir que seu código está aderente.

## Enviando sua Contribuição

1. **Commit e push:** Faça commit das suas alterações com mensagens claras e concisas (em português ou inglês, mas mantenha consistência). Exemplo de mensagem: `fix: corrige duplicação de recompensa JestCoin no fluxo de compra`.
2. **Pull Request:** Abra um Pull Request (PR) no repositório original comparando o seu branch com o branch principal. No corpo do PR, descreva detalhadamente as mudanças realizadas, por que são necessárias e qualquer impacto no sistema. Referencie issues relacionadas se existirem.
3. **Code Review:** Aguarde pelo menos uma revisão de outro desenvolvedor ou mantenedor do projeto. Esteja aberto a feedback – podem ser solicitadas modificações para adequação ao padrão do projeto ou melhoria da solução.
4. **Resolução de conflitos:** Se surgirem conflitos de merge porque o branch principal teve atualizações, realize um merge do branch principal no seu branch local e resolva os conflitos. Faça novo push após resolver para atualizar o PR.
5. **Teste de Integração Contínua (CI):** Se o repositório utilizar CI, verifique se seu PR passa em todos os checks (build, testes, linter). Corrija eventuais falhas apontadas pela CI.
6. **Merge:** Uma vez aprovado o PR e passando nos testes, um mantenedor fará o merge das suas contribuições. Parabéns, você contribuiu para o JestFly! 🎉

## Dicas para Contribuir

- Antes de iniciar uma contribuição grande, é recomendável abrir uma _issue_ ou discussão para alinhar com os mantenedores. Isso evita retrabalho caso alguém já esteja implementando algo similar ou caso a abordagem precise ser debatida.
- Revise a documentação existente (como este cookbook) para entender o contexto do projeto e o motivo das implementações. Isso ajuda a escrever código alinhado com os objetivos do JestFly.
- Se encontrar novos bugs ou tiver ideias de melhorias, não hesite em abrir issues no repositório. A comunidade de desenvolvedores pode colaborar para resolvê-los.
- Mantenha a comunicação cordial e profissional. Contribuições construtivas são sempre bem-vindas e apreciadas.

Seguindo este guia, o processo de contribuição será tranquilo tanto para você quanto para os mantenedores do projeto. Agradecemos sua ajuda para tornar o JestFly uma plataforma incrível para artistas e fãs!