# Prompt 7: Melhorias na autenticação e segurança

## Objetivo
Melhore a autenticação e segurança com as seguintes funcionalidades:
1. Adicione login social (Google, Twitter, Discord).
2. Implemente autenticação de dois fatores.
3. Melhore verificação de email.
4. Adicione níveis avançados de permissão.
5. Implemente logs de atividade da conta.
6. Adicione sistema de detecção de atividades suspeitas.

### Detalhes de Implementação

#### 1. Login Social (Google, Twitter, Discord)
- **Descrição**: Permita que os usuários façam login usando contas de redes sociais.
- **Tecnologias**: OAuth, React, Node.js, Supabase.
- **Passos**:
  1. Configure OAuth para Google, Twitter, e Discord.
  2. Implemente botões de login social na interface do usuário.
  3. Garanta a integração com o sistema de autenticação do Supabase.

#### 2. Autenticação de Dois Fatores
- **Descrição**: Adicione uma camada extra de segurança com autenticação de dois fatores (2FA).
- **Tecnologias**: TOTP, React, Node.js, Supabase.
- **Passos**:
  1. Implemente a geração de códigos TOTP para 2FA.
  2. Adicione uma tela de configuração para 2FA nas configurações do usuário.
  3. Garanta a verificação do código 2FA durante o login.

#### 3. Verificação de Email
- **Descrição**: Melhore o sistema de verificação de email.
- **Tecnologias**: Node.js, Supabase, Email API (ex.: SendGrid).
- **Passos**:
  1. Configure um serviço de envio de emails (ex.: SendGrid).
  2. Implemente um sistema de verificação de email com links de confirmação.
  3. Garanta que os usuários só possam acessar o sistema após a verificação do email.

#### 4. Níveis Avançados de Permissão
- **Descrição**: Adicione níveis avançados de permissão para diferentes tipos de usuários.
- **Tecnologias**: React, Node.js, Supabase.
- **Passos**:
  1. Defina diferentes níveis de permissão (ex.: admin, usuário, moderador).
  2. Implemente controle de acesso baseado em permissões na interface do usuário.
  3. Garanta que as permissões sejam armazenadas e gerenciadas no Supabase.

#### 5. Logs de Atividade da Conta
- **Descrição**: Registre atividades importantes da conta para segurança e auditoria.
- **Tecnologias**: React, Node.js, Supabase.
- **Passos**:
  1. Crie um sistema para registrar atividades importantes (ex.: login, mudanças de senha).
  2. Armazene os logs de atividade no Supabase.
  3. Exiba os logs