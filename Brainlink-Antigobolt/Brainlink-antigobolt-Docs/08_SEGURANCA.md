# Sistema de Segurança do Brainlink

**Versão:** 2.0  
**Data:** 2025-03-19  
**Autor:** Equipe de Arquitetura Brainlink

## Índice

1. [Introdução](#introdução)
2. [Princípios de Segurança](#princípios-de-segurança)
3. [Autenticação](#autenticação)
4. [Autorização e Controle de Acesso](#autorização-e-controle-de-acesso)
5. [Proteção de Dados](#proteção-de-dados)
6. [Segurança da API](#segurança-da-api)
7. [Segurança de Infraestrutura](#segurança-de-infraestrutura)
8. [Auditoria e Logging](#auditoria-e-logging)
9. [Gerenciamento de Incidentes](#gerenciamento-de-incidentes)
10. [Conformidade](#conformidade)
11. [Recomendações para Implementação](#recomendações-para-implementação)

## Introdução

A segurança é um aspecto crítico do Brainlink, especialmente considerando a natureza sensível dos dados processados pela plataforma e a integração com modelos de inteligência artificial. Este documento descreve a arquitetura e os componentes de segurança integrados ao Brainlink, fornecendo diretrizes para implementação e manutenção de um ambiente seguro.

O sistema de segurança do Brainlink foi projetado com uma abordagem de "defesa em profundidade", implementando múltiplas camadas de proteção para salvaguardar dados e funcionalidades contra ameaças internas e externas. A arquitetura de segurança abrange autenticação, autorização, proteção de dados, segurança da API, monitoramento, auditoria e conformidade regulatória.

## Princípios de Segurança

O design de segurança do Brainlink segue estes princípios fundamentais:

1. **Segurança por Design**: Incorporação de controles de segurança desde o início do processo de desenvolvimento.

2. **Princípio do Menor Privilégio**: Usuários e sistemas recebem apenas os privilégios mínimos necessários para realizar suas funções.

3. **Defesa em Profundidade**: Implementação de múltiplas camadas de controles de segurança.

4. **Falha Segura**: Em caso de falha, o sistema deve retornar a um estado seguro conhecido.

5. **Validação Completa de Entrada**: Todas as entradas são validadas antes do processamento.

6. **Simplicidade**: Sistemas mais simples tendem a ser mais seguros.

7. **Abertura e Revisão por Pares**: O design de segurança é aberto para revisão.

8. **Separação de Deveres**: Funções críticas são divididas entre diferentes componentes ou funções.

## Autenticação

### Métodos de Autenticação

O Brainlink suporta múltiplos métodos de autenticação para acomodar diferentes necessidades de segurança:

1. **Autenticação baseada em token JWT**
   - Tokens JWT assinados e com tempo de expiração
   - Rotação de tokens com refresh token
   - Verificação de assinatura e validação

2. **OAuth 2.0 e OpenID Connect**
   - Integração com provedores externos (Google, Microsoft, GitHub)
   - Fluxos de autorização suportados: Authorization Code, PKCE
   - Validação de tokens e estados

3. **Autenticação Multi-fator (MFA)**
   - Verificação por aplicativo (TOTP)
   - Verificação por SMS/email
   - Chaves de segurança WebAuthn/FIDO2

4. **SSO (Single Sign-On)**
   - Suporte a SAML 2.0
   - Federação de identidade
   - Provisionamento automático via SCIM

### Implementação da Autenticação

```typescript
// lib/auth/authentication.ts
import { prisma } from '@/lib/db/prisma';
import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { generateTOTP, verifyTOTP } from '@/lib/auth/totp';

export class AuthenticationService {
  /**
   * Autentica um usuário por email/senha e gera tokens JWT
   */
  static async authenticateUser(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    requiresMfa?: boolean;
    user?: { id: string; name: string; email: string; };
    error?: string;
  }> {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          mfaEnabled: true,
          mfaSecret: true,
          active: true,
        },
      });
      
      // Verificar se usuário existe e está ativo
      if (!user || !user.active) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }
      
      // Verificar senha
      const passwordMatch = await compare(password, user.password);
      if (!passwordMatch) {
        // Registrar tentativa falha
        await this.logAuthAttempt(user.id, 'password', false);
        
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }
      
      // Verificar se MFA está habilitado
      if (user.mfaEnabled) {
        // Gerar e armazenar um token temporário para a verificação MFA
        const tempToken = sign(
          { userId: user.id, requiresMfa: true },
          process.env.JWT_SECRET,
          { expiresIn: '5m' }
        );
        
        await prisma.authToken.create({
          data: {
            userId: user.id,
            token: tempToken,
            type: 'mfa_pending',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          },
        });
        
        // Registrar tentativa parcial
        await this.logAuthAttempt(user.id, 'password', true, 'MFA required');
        
        return {
          success: true,
          requiresMfa: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      }
      
      // Sem MFA, gerar tokens JWT
      const tokens = await this.generateTokens(user.id);
      
      // Registrar sucesso
      await this.logAuthAttempt(user.id, 'password', true);
      
      return {
        success: true,
        tokens,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'An error occurred during authentication',
      };
    }
  }
  
  /**
   * Verifica código MFA e completa autenticação
   */
  static async verifyMfaToken(
    userId: string,
    mfaToken: string
  ): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    error?: string;
  }> {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          mfaEnabled: true,
          mfaSecret: true,
          active: true,
        },
      });
      
      // Verificar usuário
      if (!user || !user.active || !user.mfaEnabled || !user.mfaSecret) {
        return {
          success: false,
          error: 'Invalid user or MFA not enabled',
        };
      }
      
      // Verificar código TOTP
      const isValid = verifyTOTP(user.mfaSecret, mfaToken);
      
      if (!isValid) {
        // Registrar falha
        await this.logAuthAttempt(user.id, 'mfa', false);
        
        return {
          success: false,
          error: 'Invalid MFA token',
        };
      }
      
      // Gerar tokens JWT
      const tokens = await this.generateTokens(user.id);
      
      // Registrar sucesso
      await this.logAuthAttempt(user.id, 'mfa', true);
      
      return {
        success: true,
        tokens,
      };
    } catch (error) {
      console.error('MFA verification error:', error);
      return {
        success: false,
        error: 'An error occurred during MFA verification',
      };
    }
  }
  
  /**
   * Autentica via OAuth
   */
  static async handleOAuthCallback(
    provider: string,
    code: string,
    redirectUri: string
  ): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    user?: { id: string; name: string; email: string; };
    error?: string;
  }> {
    try {
      // Trocar código por token de acesso (específico para cada provedor)
      const tokenResponse = await this.getOAuthAccessToken(provider, code, redirectUri);
      
      if (!tokenResponse.success) {
        return {
          success: false,
          error: tokenResponse.error,
        };
      }
      
      // Obter informações do usuário do provedor
      const userInfo = await this.getOAuthUserInfo(provider, tokenResponse.accessToken);
      
      if (!userInfo.success) {
        return {
          success: false,
          error: userInfo.error,
        };
      }
      
      // Verificar se usuário já existe
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: userInfo.email },
            {
              identities: {
                some: {
                  provider,
                  providerUserId: userInfo.id,
                },
              },
            },
          ],
        },
        include: {
          identities: true,
        },
      });
      
      // Criar novo usuário se não existir
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: userInfo.name,
            email: userInfo.email,
            image: userInfo.image,
            active: true,
            identities: {
              create: {
                provider,
                providerUserId: userInfo.id,
                providerUserName: userInfo.name,
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken,
                expiresAt: tokenResponse.expiresAt,
              },
            },
          },
          include: {
            identities: true,
          },
        });
      } else {
        // Atualizar ou criar identidade
        const existingIdentity = user.identities.find(
          (i) => i.provider === provider && i.providerUserId === userInfo.id
        );
        
        if (existingIdentity) {
          // Atualizar identidade existente
          await prisma.userIdentity.update({
            where: { id: existingIdentity.id },
            data: {
              accessToken: tokenResponse.accessToken,
              refreshToken: tokenResponse.refreshToken,
              expiresAt: tokenResponse.expiresAt,
            },
          });
        } else {
          // Adicionar nova identidade ao usuário existente
          await prisma.userIdentity.create({
            data: {
              userId: user.id,
              provider,
              providerUserId: userInfo.id,
              providerUserName: userInfo.name,
              accessToken: tokenResponse.accessToken,
              refreshToken: tokenResponse.refreshToken,
              expiresAt: tokenResponse.expiresAt,
            },
          });
        }
      }
      
      // Gerar tokens JWT
      const tokens = await this.generateTokens(user.id);
      
      // Registrar sucesso
      await this.logAuthAttempt(user.id, `oauth_${provider}`, true);
      
      return {
        success: true,
        tokens,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('OAuth authentication error:', error);
      return {
        success: false,
        error: 'An error occurred during OAuth authentication',
      };
    }
  }
  
  /**
   * Gera novos tokens JWT (access e refresh)
   */
  static async generateTokens(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Gerar access token
    const accessToken = sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Gerar refresh token
    const refreshToken = sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    // Armazenar refresh token no banco
    await prisma.authToken.create({
      data: {
        userId,
        token: refreshToken,
        type: 'refresh',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    
    return { accessToken, refreshToken };
  }
  
  /**
   * Atualiza tokens usando refresh token
   */
  static async refreshTokens(
    refreshToken: string
  ): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    error?: string;
  }> {
    try {
      // Verificar token
      const payload = verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      if (typeof payload !== 'object' || !payload.userId || payload.type !== 'refresh') {
        return {
          success: false,
          error: 'Invalid refresh token',
        };
      }
      
      // Verificar se token existe no banco e não foi revogado
      const tokenRecord = await prisma.authToken.findFirst({
        where: {
          userId: payload.userId,
          token: refreshToken,
          type: 'refresh',
          revokedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
      
      if (!tokenRecord) {
        return {
          success: false,
          error: 'Invalid or expired refresh token',
        };
      }
      
      // Revogar token atual
      await prisma.authToken.update({
        where: { id: tokenRecord.id },
        data: { revokedAt: new Date() },
      });
      
      // Gerar novos tokens
      const tokens = await this.generateTokens(payload.userId);
      
      return {
        success: true,
        tokens,
      };
    } catch (error) {
            console.error('Token refresh error:', error);
      return {
        success: false,
        error: 'Invalid refresh token',
      };
    }
  }
  
  /**
   * Revoga todos os tokens de um usuário (logout de todos os dispositivos)
   */
  static async revokeAllTokens(
    userId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Revogar todos os tokens
      await prisma.authToken.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
      
      return { success: true };
    } catch (error) {
      console.error('Token revocation error:', error);
      return {
        success: false,
        error: 'Failed to revoke tokens',
      };
    }
  }
  
  /**
   * Registra tentativa de autenticação
   */
  private static async logAuthAttempt(
    userId: string,
    method: string,
    success: boolean,
    details?: string
  ): Promise<void> {
    try {
      await prisma.authLog.create({
        data: {
          userId,
          method,
          success,
          details: details || '',
          ipAddress: getCurrentRequestIP(), // Função auxiliar para obter IP
          userAgent: getCurrentRequestUserAgent(), // Função auxiliar para obter User-Agent
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to log auth attempt:', error);
    }
  }
  
  // Métodos auxiliares para OAuth (implementação simplificada)
  private static async getOAuthAccessToken(provider: string, code: string, redirectUri: string): Promise<any> {
    // Implementação específica para cada provedor
    return { success: true, accessToken: 'token', refreshToken: 'refresh', expiresAt: new Date() };
  }
  
  private static async getOAuthUserInfo(provider: string, accessToken: string): Promise<any> {
    // Implementação específica para cada provedor
    return { success: true, id: '123', name: 'User', email: 'user@example.com', image: '' };
  }
}
```

### Fluxo de Autenticação WebAuthn/FIDO2

Para dispositivos e navegadores modernos, o Brainlink implementa autenticação sem senha usando WebAuthn:

```typescript
// lib/auth/webauthn.ts
import { prisma } from '@/lib/db/prisma';
import { generateChallenge, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

export class WebAuthnService {
  /**
   * Inicia o registro de uma credencial WebAuthn
   */
  static async beginRegistration(
    userId: string
  ): Promise<{
    success: boolean;
    options?: any;
    error?: string;
  }> {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          webauthnCredentials: true,
        },
      });
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }
      
      // Gerar challenge para registro
      const challenge = generateChallenge();
      
      // Gerar opções para o cliente
      const options = {
        rp: {
          name: 'Brainlink',
          id: process.env.WEBAUTHN_RP_ID,
        },
        user: {
          id: userId,
          name: user.email,
          displayName: user.name,
        },
        challenge,
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 }, // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        timeout: 60000,
        attestation: 'direct',
        excludeCredentials: user.webauthnCredentials.map(cred => ({
          id: isoBase64URL.toBuffer(cred.credentialId),
          type: 'public-key',
          transports: cred.transports || ['internal', 'usb', 'ble', 'nfc'],
        })),
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
          requireResidentKey: false,
        },
      };
      
      // Armazenar challenge para verificação posterior
      await prisma.webauthnChallenge.create({
        data: {
          userId,
          challenge,
          operation: 'registration',
          expiresAt: new Date(Date.now() + 60000),
        },
      });
      
      return {
        success: true,
        options,
      };
    } catch (error) {
      console.error('WebAuthn registration initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate WebAuthn registration',
      };
    }
  }
  
  /**
   * Finaliza o registro de uma credencial WebAuthn
   */
  static async completeRegistration(
    userId: string,
    credential: any
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Buscar challenge ativo
      const challengeRecord = await prisma.webauthnChallenge.findFirst({
        where: {
          userId,
          operation: 'registration',
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      if (!challengeRecord) {
        return {
          success: false,
          error: 'Challenge not found or expired',
        };
      }
      
      // Verificar resposta
      const verification = await verifyRegistrationResponse({
        response: credential,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: process.env.WEBAUTHN_ORIGIN,
        expectedRPID: process.env.WEBAUTHN_RP_ID,
      });
      
      if (!verification.verified || !verification.registrationInfo) {
        return {
          success: false,
          error: 'WebAuthn verification failed',
        };
      }
      
      // Armazenar credencial
      await prisma.webauthnCredential.create({
        data: {
          userId,
          credentialId: isoBase64URL.fromBuffer(verification.registrationInfo.credentialID),
          publicKey: isoBase64URL.fromBuffer(verification.registrationInfo.credentialPublicKey),
          counter: verification.registrationInfo.counter,
          transports: credential.response.transports || [],
          aaguid: verification.registrationInfo.aaguid ? isoBase64URL.fromBuffer(verification.registrationInfo.aaguid) : null,
          credentialDeviceType: verification.registrationInfo.credentialDeviceType,
          credentialBackedUp: verification.registrationInfo.credentialBackedUp,
        },
      });
      
      // Marcar challenge como utilizado
      await prisma.webauthnChallenge.update({
        where: { id: challengeRecord.id },
        data: { used: true },
      });
      
      return { success: true };
    } catch (error) {
      console.error('WebAuthn registration completion error:', error);
      return {
        success: false,
        error: 'Failed to complete WebAuthn registration',
      };
    }
  }
  
  /**
   * Inicia a autenticação com WebAuthn
   */
  static async beginAuthentication(
    email: string
  ): Promise<{
    success: boolean;
    options?: any;
    error?: string;
  }> {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          webauthnCredentials: true,
        },
      });
      
      if (!user || user.webauthnCredentials.length === 0) {
        return {
          success: false,
          error: 'No WebAuthn credentials found for this user',
        };
      }
      
      // Gerar challenge para autenticação
      const challenge = generateChallenge();
      
      // Gerar opções para o cliente
      const options = {
        challenge,
        timeout: 60000,
        rpId: process.env.WEBAUTHN_RP_ID,
        userVerification: 'preferred',
        allowCredentials: user.webauthnCredentials.map(cred => ({
          id: isoBase64URL.toBuffer(cred.credentialId),
          type: 'public-key',
          transports: cred.transports || ['internal', 'usb', 'ble', 'nfc'],
        })),
      };
      
      // Armazenar challenge para verificação posterior
      await prisma.webauthnChallenge.create({
        data: {
          userId: user.id,
          challenge,
          operation: 'authentication',
          expiresAt: new Date(Date.now() + 60000),
        },
      });
      
      return {
        success: true,
        options,
      };
    } catch (error) {
      console.error('WebAuthn authentication initiation error:', error);
      return {
        success: false,
        error: 'Failed to initiate WebAuthn authentication',
      };
    }
  }
  
  /**
   * Finaliza a autenticação com WebAuthn
   */
  static async completeAuthentication(
    email: string,
    credential: any
  ): Promise<{
    success: boolean;
    tokens?: { accessToken: string; refreshToken: string };
    error?: string;
  }> {
    try {
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          active: true,
          webauthnCredentials: true,
        },
      });
      
      if (!user || !user.active || user.webauthnCredentials.length === 0) {
        return {
          success: false,
          error: 'User not found or inactive',
        };
      }
      
      // Buscar challenge ativo
      const challengeRecord = await prisma.webauthnChallenge.findFirst({
        where: {
          userId: user.id,
          operation: 'authentication',
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      if (!challengeRecord) {
        return {
          success: false,
          error: 'Challenge not found or expired',
        };
      }
      
      // Buscar credencial específica
      const credentialIdB64 = isoBase64URL.fromBuffer(credential.id);
      const storedCredential = user.webauthnCredentials.find(
        cred => cred.credentialId === credentialIdB64
      );
      
      if (!storedCredential) {
        return {
          success: false,
          error: 'Unknown credential',
        };
      }
      
      // Verificar resposta
      const verification = await verifyAuthenticationResponse({
        response: credential,
        expectedChallenge: challengeRecord.challenge,
        expectedOrigin: process.env.WEBAUTHN_ORIGIN,
        expectedRPID: process.env.WEBAUTHN_RP_ID,
        authenticator: {
          credentialID: isoBase64URL.toBuffer(storedCredential.credentialId),
          credentialPublicKey: isoBase64URL.toBuffer(storedCredential.publicKey),
          counter: storedCredential.counter,
        },
      });
      
      if (!verification.verified) {
        // Registrar falha
        await AuthenticationService.logAuthAttempt(user.id, 'webauthn', false);
        
        return {
          success: false,
          error: 'WebAuthn verification failed',
        };
      }
      
      // Atualizar contador
      await prisma.webauthnCredential.update({
        where: { id: storedCredential.id },
        data: { counter: verification.authenticationInfo.newCounter },
      });
      
      // Marcar challenge como utilizado
      await prisma.webauthnChallenge.update({
        where: { id: challengeRecord.id },
        data: { used: true },
      });
      
      // Gerar tokens JWT
      const tokens = await AuthenticationService.generateTokens(user.id);
      
      // Registrar sucesso
      await AuthenticationService.logAuthAttempt(user.id, 'webauthn', true);
      
      return {
        success: true,
        tokens,
      };
    } catch (error) {
      console.error('WebAuthn authentication completion error:', error);
      return {
        success: false,
        error: 'Failed to complete WebAuthn authentication',
      };
    }
  }
}
```

## Autorização e Controle de Acesso

O Brainlink implementa um modelo de controle de acesso baseado em papéis (RBAC) e controle de acesso baseado em atributos (ABAC), permitindo administradores definirem permissões granulares para recursos.

### Modelo de Permissões

O sistema de autorização do Brainlink é estruturado em vários níveis:

1. **Nível Organizacional**: Define papéis e permissões no escopo da organização
2. **Nível de Workspace**: Permissões específicas para workspaces
3. **Nível de Projeto**: Controle de acesso refinado para projetos
4. **Nível de Recurso**: Permissões granulares para recursos individuais (arquivos, prompts, pipelines)

### Papéis Padrão e Permissões

| Papel | Descrição | Permissões |
|-------|-----------|------------|
| Owner | Proprietário com controle total | Todas as permissões, incluindo gerenciamento de faturamento e exclusão da organização |
| Admin | Administrador organizacional | Gerenciar usuários, workspaces, configurações, mas sem acesso a faturamento |
| Member | Membro padrão | Criar e gerenciar projetos, colaborar, mas não alterar configurações organizacionais |
| Guest | Usuário convidado | Acesso somente aos recursos específicos compartilhados |
| API | Acesso via chave API | Limitado às permissões especificadas na criação da chave |

### Implementação de Controle de Acesso

```typescript
// lib/auth/authorization.ts
import { prisma } from '@/lib/db/prisma';

// Tipos de recursos que o sistema suporta
export enum ResourceType {
  ORGANIZATION = 'organization',
  WORKSPACE = 'workspace',
  PROJECT = 'project',
  FILE = 'file',
  PROMPT = 'prompt',
  PIPELINE = 'pipeline',
  COMMENT = 'comment',
  API_KEY = 'api_key',
}

// Ações possíveis sobre recursos
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  SHARE = 'share',
  MANAGE = 'manage',
  COMMENT = 'comment',
  EXECUTE = 'execute',
}

// Interface para regras de acesso
interface AccessRule {
    resourceType: ResourceType;
  resourceId?: string;
  action: Action;
  allowed: boolean;
  conditions?: Record<string, any>;
}

export class AuthorizationService {
  /**
   * Verifica se um usuário tem permissão para realizar uma ação em um recurso
   */
  static async isAuthorized(
    userId: string,
    resourceType: ResourceType,
    resourceId: string,
    action: Action,
    context: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      // Verificar se usuário existe e está ativo
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { active: true },
      });
      
      if (!user || !user.active) {
        return false;
      }
      
      // Buscar permissões efetivas
      const rules = await this.getEffectiveRules(userId, resourceType, resourceId);
      
      // Se não há regras, não autorizado
      if (rules.length === 0) {
        return false;
      }
      
      // Verificar regras
      for (const rule of rules) {
        // Se a ação corresponde
        if (rule.action === action || rule.action === Action.MANAGE) {
          // Se é negada explicitamente
          if (!rule.allowed) {
            return false;
          }
          
          // Se tem condições, verificar
          if (rule.conditions && Object.keys(rule.conditions).length > 0) {
            if (!this.evaluateConditions(rule.conditions, context)) {
              continue; // Condições não satisfeitas, verificar próxima regra
            }
          }
          
          // Regra permite a ação
          return true;
        }
      }
      
      // Nenhuma regra explícita encontrada
      return false;
    } catch (error) {
      console.error('Authorization error:', error);
      return false; // Falha segura - negar acesso em caso de erro
    }
  }
  
  /**
   * Obtém todas as regras de acesso efetivas para um usuário e recurso
   */
  private static async getEffectiveRules(
    userId: string,
    resourceType: ResourceType,
    resourceId: string
  ): Promise<AccessRule[]> {
    const rules: AccessRule[] = [];
    
    // Verificar tipo de recurso para determinar a hierarquia
    switch (resourceType) {
      case ResourceType.ORGANIZATION:
        rules.push(...await this.getOrganizationRules(userId, resourceId));
        break;
        
      case ResourceType.WORKSPACE:
        // Regras de workspace
        rules.push(...await this.getWorkspaceRules(userId, resourceId));
        
        // Regras da organização pai
        const workspace = await prisma.workspace.findUnique({
          where: { id: resourceId },
          select: { organizationId: true },
        });
        
        if (workspace) {
          rules.push(...await this.getOrganizationRules(userId, workspace.organizationId));
        }
        break;
        
      case ResourceType.PROJECT:
        // Regras de projeto
        rules.push(...await this.getProjectRules(userId, resourceId));
        
        // Regras do workspace pai
        const project = await prisma.project.findUnique({
          where: { id: resourceId },
          select: { workspaceId: true },
        });
        
        if (project) {
          rules.push(...await this.getWorkspaceRules(userId, project.workspaceId));
          
          // Regras da organização avó
          const projectWorkspace = await prisma.workspace.findUnique({
            where: { id: project.workspaceId },
            select: { organizationId: true },
          });
          
          if (projectWorkspace) {
            rules.push(...await this.getOrganizationRules(userId, projectWorkspace.organizationId));
          }
        }
        break;
        
      case ResourceType.FILE:
      case ResourceType.PROMPT:
      case ResourceType.PIPELINE:
        // Regras do recurso específico
        rules.push(...await this.getResourceRules(userId, resourceType, resourceId));
        
        // Buscar projeto pai
        const resource = await prisma[this.getResourceTable(resourceType)].findUnique({
          where: { id: resourceId },
          select: { projectId: true },
        });
        
        if (resource) {
          // Regras do projeto pai
          rules.push(...await this.getProjectRules(userId, resource.projectId));
          
          // Buscar hierarquia completa
          const resourceProject = await prisma.project.findUnique({
            where: { id: resource.projectId },
            select: { workspaceId: true },
          });
          
          if (resourceProject) {
            // Regras do workspace avô
            rules.push(...await this.getWorkspaceRules(userId, resourceProject.workspaceId));
            
            // Regras da organização bisavó
            const resourceWorkspace = await prisma.workspace.findUnique({
              where: { id: resourceProject.workspaceId },
              select: { organizationId: true },
            });
            
            if (resourceWorkspace) {
              rules.push(...await this.getOrganizationRules(userId, resourceWorkspace.organizationId));
            }
          }
        }
        break;
        
      default:
        // Para outros tipos de recursos
        rules.push(...await this.getResourceRules(userId, resourceType, resourceId));
    }
    
    return rules;
  }
  
  /**
   * Obtém regras de acesso no nível de organização
   */
  private static async getOrganizationRules(
    userId: string,
    organizationId: string
  ): Promise<AccessRule[]> {
    const rules: AccessRule[] = [];
    
    // Verificar papel do usuário na organização
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
    
    if (!membership) {
      return rules;
    }
    
    // Definir regras baseadas no papel
    switch (membership.role) {
      case 'owner':
        // Proprietários têm permissão total
        rules.push({
          resourceType: ResourceType.ORGANIZATION,
          resourceId: organizationId,
          action: Action.MANAGE,
          allowed: true,
        });
        break;
        
      case 'admin':
        // Administradores têm quase todas as permissões
        rules.push({
          resourceType: ResourceType.ORGANIZATION,
          resourceId: organizationId,
          action: Action.READ,
          allowed: true,
        });
        rules.push({
          resourceType: ResourceType.ORGANIZATION,
          resourceId: organizationId,
          action: Action.UPDATE,
          allowed: true,
        });
        rules.push({
          resourceType: ResourceType.ORGANIZATION,
          resourceId: organizationId,
          action: Action.SHARE,
          allowed: true,
        });
        rules.push({
          resourceType: ResourceType.WORKSPACE,
          resourceId: organizationId, // Escopo da organização
          action: Action.CREATE,
          allowed: true,
        });
        break;
        
      case 'member':
        // Membros têm acesso limitado
        rules.push({
          resourceType: ResourceType.ORGANIZATION,
          resourceId: organizationId,
          action: Action.READ,
          allowed: true,
        });
        break;
    }
    
    return rules;
  }
  
  /**
   * Obtém regras de acesso no nível de workspace
   */
  private static async getWorkspaceRules(
    userId: string,
    workspaceId: string
  ): Promise<AccessRule[]> {
    const rules: AccessRule[] = [];
    
    // Verificar papel do usuário no workspace
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
    
    if (!membership) {
      return rules;
    }
    
    // Definir regras baseadas no papel
    switch (membership.role) {
      case 'owner':
      case 'admin':
        // Administradores têm controle total sobre o workspace
        rules.push({
          resourceType: ResourceType.WORKSPACE,
          resourceId: workspaceId,
          action: Action.MANAGE,
          allowed: true,
        });
        break;
        
      case 'member':
        // Membros têm acesso padrão
        rules.push({
          resourceType: ResourceType.WORKSPACE,
          resourceId: workspaceId,
          action: Action.READ,
          allowed: true,
        });
        rules.push({
          resourceType: ResourceType.PROJECT,
          resourceId: workspaceId, // Escopo do workspace
          action: Action.CREATE,
          allowed: true,
        });
        break;
        
      case 'guest':
        // Convidados têm acesso somente leitura
        rules.push({
          resourceType: ResourceType.WORKSPACE,
          resourceId: workspaceId,
          action: Action.READ,
          allowed: true,
        });
        break;
    }
    
    return rules;
  }
  
  /**
   * Obtém regras de acesso no nível de projeto
   */
  private static async getProjectRules(
    userId: string,
    projectId: string
  ): Promise<AccessRule[]> {
    const rules: AccessRule[] = [];
    
    // Verificar permissões específicas no projeto
    const permissions = await prisma.projectPermission.findMany({
      where: {
        projectId,
        OR: [
          { userId },
          {
            groupId: {
              in: await this.getUserGroups(userId),
            },
          },
        ],
      },
    });
    
    for (const permission of permissions) {
      // Mapear nível de permissão para regras específicas
      switch (permission.level) {
        case 'owner':
        case 'admin':
          rules.push({
            resourceType: ResourceType.PROJECT,
            resourceId: projectId,
            action: Action.MANAGE,
            allowed: true,
          });
          break;
          
        case 'edit':
          rules.push({
            resourceType: ResourceType.PROJECT,
            resourceId: projectId,
            action: Action.READ,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.PROJECT,
            resourceId: projectId,
            action: Action.UPDATE,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.FILE,
            resourceId: projectId, // Escopo do projeto
            action: Action.CREATE,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.PROMPT,
            resourceId: projectId, // Escopo do projeto
            action: Action.CREATE,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.PIPELINE,
            resourceId: projectId, // Escopo do projeto
            action: Action.CREATE,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.COMMENT,
            resourceId: projectId, // Escopo do projeto
            action: Action.CREATE,
            allowed: true,
          });
          break;
          
        case 'view':
          rules.push({
            resourceType: ResourceType.PROJECT,
            resourceId: projectId,
            action: Action.READ,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.COMMENT,
            resourceId: projectId, // Escopo do projeto
            action: Action.CREATE,
            allowed: true,
          });
          break;
          
        case 'comment':
          rules.push({
            resourceType: ResourceType.PROJECT,
            resourceId: projectId,
            action: Action.READ,
            allowed: true,
          });
          rules.push({
            resourceType: ResourceType.COMMENT,
            resourceId: projectId, // Escopo do projeto
            action: Action.CREATE,
            allowed: true,
          });
          break;
      }
    }
    
    return rules;
  }
  
  /**
   * Obtém regras de acesso para recursos específicos
   */
  private static async getResourceRules(
    userId: string,
    resourceType: ResourceType,
    resourceId: string
  ): Promise<AccessRule[]> {
    const rules: AccessRule[] = [];
    
    // Verificar permissões específicas no recurso
    const table = this.getResourcePermissionTable(resourceType);
    if (!table) return rules;
    
    const permissions = await prisma[table].findMany({
      where: {
        resourceId,
        OR: [
          { userId },
          {
            groupId: {
              in: await this.getUserGroups(userId),
            },
          },
        ],
      },
    });
    
    for (const permission of permissions) {
      // Mapear nível de permissão para regras específicas
      switch (permission.level) {
        case 'owner':
        case 'admin':
          rules.push({
            resourceType,
            resourceId,
            action: Action.MANAGE,
            allowed: true,
          });
          break;
          
        case 'edit':
          rules.push({
            resourceType,
            resourceId,
            action: Action.READ,
            allowed: true,
          });
          rules.push({
            resourceType,
            resourceId,
            action: Action.UPDATE,
            allowed: true,
          });
          break;
          
        case 'view':
          rules.push({
            resourceType,
            resourceId,
            action: Action.READ,
            allowed: true,
          });
          break;
          
        case 'execute':
          rules.push({
            resourceType,
            resourceId,
            action: Action.READ,
            allowed: true,
          });
          rules.push({
            resourceType,
            resourceId,
            action: Action.EXECUTE,
            allowed: true,
          });
          break;
      }
    }
    
    return rules;
  }
  
  /**
   * Obtém todos os grupos a que um usuário pertence
   */
  private static async getUserGroups(userId: string): Promise<string[]> {
    const memberships = await prisma.groupMember.findMany({
      where: { userId },
      select: { groupId: true },
    });
    
    return memberships.map(m => m.groupId);
  }
  
  /**
   * Avalia condições para uma regra
   */
  private static evaluateConditions(
    conditions: Record<string, any>,
    context: Record<string, any>
  ): boolean {
    // Implementação simplificada - na prática, usaria um mecanismo de regras mais robusto
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Obtém nome da tabela do banco para um tipo de recurso
   */
  private static getResourceTable(resourceType: ResourceType): string {
    switch (resourceType) {
      case ResourceType.FILE: return 'file';
      case ResourceType.PROMPT: return 'prompt';
      case ResourceType.PIPELINE: return 'pipeline';
      case ResourceType.COMMENT: return 'comment';
      default: return resourceType.toLowerCase();
    }
  }
  
  /**
    /**
   * Obtém nome da tabela de permissões para um tipo de recurso
   */
  private static getResourcePermissionTable(resourceType: ResourceType): string | null {
    switch (resourceType) {
      case ResourceType.FILE: return 'filePermission';
      case ResourceType.PROMPT: return 'promptPermission';
      case ResourceType.PIPELINE: return 'pipelinePermission';
      default: return null;
    }
  }
}
```

### Middleware de Autorização

Para implementar verificações de autorização consistentes em toda a API, o Brainlink utiliza um middleware de autorização:

```typescript
// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/db/prisma';
import { AuthorizationService, ResourceType, Action } from '@/lib/auth/authorization';

// Tipo para requisição com usuário autenticado
export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Middleware para autenticação JWT
 */
export const withAuth = (handler: any) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Extrair token do cabeçalho Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const token = authHeader.substring(7);
      
      // Verificar token
      const payload = verify(token, process.env.JWT_SECRET);
      
      if (typeof payload !== 'object' || !payload.userId || payload.type !== 'access') {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      // Verificar se o token não foi revogado
      const tokenExists = await prisma.authToken.findFirst({
        where: {
          token,
          type: 'access',
          revokedAt: null,
        },
      });
      
      if (!tokenExists) {
        return res.status(401).json({ error: 'Token revoked' });
      }
      
      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
        },
      });
      
      if (!user || !user.active) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }
      
      // Adicionar usuário à requisição
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      
      // Chamar o handler
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};

/**
 * Middleware para autorização específica de recursos
 */
export const withAuthorization = (
  resourceTypeGetter: (req: AuthenticatedRequest) => ResourceType,
  resourceIdGetter: (req: AuthenticatedRequest) => string,
  action: Action
) => {
  return (handler: any) => {
    return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        // Obter tipo e ID do recurso
        const resourceType = resourceTypeGetter(req);
        const resourceId = resourceIdGetter(req);
        
        // Verificar autorização
        const isAuthorized = await AuthorizationService.isAuthorized(
          req.user!.id,
          resourceType,
          resourceId,
          action,
          { method: req.method }
        );
        
        if (!isAuthorized) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        // Chamar o handler
        return handler(req, res);
      } catch (error) {
        console.error('Authorization error:', error);
        return res.status(403).json({ error: 'Forbidden' });
      }
    });
  };
};

/**
 * Middleware para autenticação com API Key
 */
export const withApiKey = (handler: any) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Extrair API key do cabeçalho
      const apiKey = req.headers['x-api-key'];
      if (!apiKey || typeof apiKey !== 'string') {
        return res.status(401).json({ error: 'API key required' });
      }
      
      // Buscar API key no banco
      const key = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        select: {
          id: true,
          name: true,
          userId: true,
          permissions: true,
          revokedAt: true,
          expiresAt: true,
        },
      });
      
      // Verificar se a chave existe e é válida
      if (!key || key.revokedAt || (key.expiresAt && key.expiresAt < new Date())) {
        return res.status(401).json({ error: 'Invalid or expired API key' });
      }
      
      // Buscar usuário associado
      const user = await prisma.user.findUnique({
        where: { id: key.userId },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
        },
      });
      
      if (!user || !user.active) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }
      
      // Adicionar usuário e informações da API key à requisição
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      
      req.apiKey = {
        id: key.id,
        name: key.name,
        permissions: key.permissions,
      };
      
      // Verificar permissão da chave para a rota atual
      // (implementação depende da estrutura de permissões armazenada)
      
      // Chamar o handler
      return handler(req, res);
    } catch (error) {
      console.error('API key authentication error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};
```

## Proteção de Dados

A proteção de dados sensíveis é fundamental no Brainlink, incluindo medidas de criptografia, mascaramento e políticas de retenção de dados.

### Estratégias de Criptografia

O Brainlink implementa as seguintes estratégias de criptografia:

1. **Criptografia em Trânsito**: Todo o tráfego de rede é protegido usando TLS 1.3.
2. **Criptografia em Repouso**: Dados sensíveis são criptografados antes de serem armazenados.
3. **Gerenciamento de Chaves**: Implementação segura de rotação e armazenamento de chaves.

### Implementação de Criptografia

```typescript
// lib/security/encryption.ts
import crypto from 'crypto';

// Algoritmos e parâmetros
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_LENGTH = 32; // 256 bits
const KEY_ITERATIONS = 100000;
const KEY_DIGEST = 'sha512';

export class EncryptionService {
  /**
   * Criptografa dados com uma chave derivada da chave mestra
   */
  static async encrypt(
    data: string,
    context: string = ''
  ): Promise<string> {
    try {
      // Gerar IV aleatório
      const iv = crypto.randomBytes(IV_LENGTH);
      
      // Gerar salt aleatório para derivação de chave
      const salt = crypto.randomBytes(SALT_LENGTH);
      
      // Derivar chave específica do contexto
      const key = await this.deriveKey(process.env.ENCRYPTION_MASTER_KEY!, salt, context);
      
      // Criar cipher
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      
      // Criptografar dados
      let encryptedData = cipher.update(data, 'utf8', 'base64');
      encryptedData += cipher.final('base64');
      
      // Obter tag de autenticação
      const authTag = cipher.getAuthTag();
      
      // Combinar todos os componentes em um único string
      const result = Buffer.concat([
        salt,
        iv,
        authTag,
        Buffer.from(encryptedData, 'base64')
      ]).toString('base64');
      
      return result;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }
  
  /**
   * Descriptografa dados com uma chave derivada da chave mestra
   */
  static async decrypt(
    encryptedData: string,
    context: string = ''
  ): Promise<string> {
    try {
      // Decodificar string completo
      const buffer = Buffer.from(encryptedData, 'base64');
      
      // Extrair componentes
      const salt = buffer.subarray(0, SALT_LENGTH);
      const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
      const ciphertext = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
      
      // Derivar chave específica do contexto
      const key = await this.deriveKey(process.env.ENCRYPTION_MASTER_KEY!, salt, context);
      
      // Criar decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      
      // Definir tag de autenticação
      decipher.setAuthTag(authTag);
      
      // Descriptografar dados
      let decrypted = decipher.update(ciphertext.toString('base64'), 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data. Data may be corrupted or tampered with.');
    }
  }
  
  /**
   * Deriva uma chave específica do contexto a partir da chave mestra
   */
  private static async deriveKey(
    masterKey: string,
    salt: Buffer,
    context: string
  ): Promise<Buffer> {
    // Combinar contexto com salt para derivação única
    const combinedSalt = Buffer.concat([
      salt,
      Buffer.from(context, 'utf8')
    ]);
    
    // Derivar chave usando PBKDF2
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        masterKey,
        combinedSalt,
        KEY_ITERATIONS,
        KEY_LENGTH,
        KEY_DIGEST,
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        }
      );
    });
  }
  
  /**
   * Gera um hash seguro para um valor
   */
  static generateHash(
    value: string,
    salt?: string
  ): Promise<{ hash: string; salt: string }> {
    return new Promise((resolve, reject) => {
      // Gerar salt se não fornecido
      const useSalt = salt || crypto.randomBytes(16).toString('hex');
      
      // Gerar hash com salt
      crypto.pbkdf2(
        value,
        useSalt,
        10000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve({
            hash: derivedKey.toString('hex'),
            salt: useSalt,
          });
        }
      );
    });
  }
  
  /**
   * Verifica se um valor corresponde a um hash
   */
  static verifyHash(
    value: string,
    hash: string,
    salt: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Gerar hash com o mesmo salt
      crypto.pbkdf2(
        value,
        salt,
        10000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey.toString('hex') === hash);
        }
      );
    });
  }
}
```

### Função de Hash Genérico para Valores Sensíveis

```typescript
// lib/security/hashing.ts

/**
 * Gera um hash não reversível para valores sensíveis
 * Útil para pesquisa de dados sem armazenar os valores originais
 */
export function generateSearchHash(value: string, salt: string): string {
  return crypto
    .createHash('sha256')
    .update(`${salt}:${value}`)
    .digest('hex');
}

/**
 * Máscara valores sensíveis para exibição
 */
export function maskSensitiveData(value: string, visibleChars = 4): string {
  if (!value) return '';
  
  const visibleStart = value.slice(0, visibleChars);
  const masked = '*'.repeat(Math.max(0, value.length - visibleChars * 2));
  const visibleEnd = value.slice(-visibleChars);
  
  return `${visibleStart}${masked}${visibleEnd}`;
}
```

### Compartimento de Dados Sensíveis

Para armazenar dados sensíveis de forma segura, o Brainlink utiliza um serviço de compartimento que abstrai a criptografia:

```typescript
// lib/security/vault.ts
import { EncryptionService } from './encryption';
import { prisma } from '@/lib/db/prisma';
import { v4 as uuidv4 } from 'uuid';

/**
 * Serviço de compartimento seguro para dados sensíveis
 */
export class VaultService {
  /**
   * Armazena dados sensíveis de forma segura
   */
  static async storeSecret(
    ownerId: string,
    keyName: string,
    value: string,
    metadata: Record<string, any> = {}
  ): Promise<{
    success: boolean;
    id?: string;
    error?: string;
  }> {
    try {
      // Criptografar valor
      const encryptedValue = await EncryptionService.encrypt(value, `secret:${keyName}`);
      
      // Armazenar no banco
      const secret = await prisma.secret.create({
        data: {
          id: uuidv4(),
          ownerId,
          keyName,
          value: encryptedValue,
          metadata,
          createdAt: new Date(),
        },
      });
      
      return {
        success: true,
        id: secret.id,
      };
    } catch (error) {
      console.error('Error storing secret:', error);
      return {
        success: false,
                error: 'Failed to store secret',
      };
    }
  }
  
  /**
   * Recupera dados sensíveis
   */
  static async getSecret(
    id: string,
    ownerId: string
  ): Promise<{
    success: boolean;
    keyName?: string;
    value?: string;
    metadata?: Record<string, any>;
    error?: string;
  }> {
    try {
      // Buscar segredo
      const secret = await prisma.secret.findUnique({
        where: { id },
      });
      
      // Verificar se existe e pertence ao owner
      if (!secret || secret.ownerId !== ownerId) {
        return {
          success: false,
          error: 'Secret not found',
        };
      }
      
      // Descriptografar valor
      const decryptedValue = await EncryptionService.decrypt(
        secret.value,
        `secret:${secret.keyName}`
      );
      
      return {
        success: true,
        keyName: secret.keyName,
        value: decryptedValue,
        metadata: secret.metadata,
      };
    } catch (error) {
      console.error('Error retrieving secret:', error);
      return {
        success: false,
        error: 'Failed to retrieve secret',
      };
    }
  }
  
  /**
   * Atualiza um segredo existente
   */
  static async updateSecret(
    id: string,
    ownerId: string,
    value: string,
    metadata?: Record<string, any>
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Buscar segredo
      const secret = await prisma.secret.findUnique({
        where: { id },
      });
      
      // Verificar se existe e pertence ao owner
      if (!secret || secret.ownerId !== ownerId) {
        return {
          success: false,
          error: 'Secret not found',
        };
      }
      
      // Criptografar novo valor
      const encryptedValue = await EncryptionService.encrypt(
        value,
        `secret:${secret.keyName}`
      );
      
      // Preparar dados para atualização
      const updateData: any = {
        value: encryptedValue,
        updatedAt: new Date(),
      };
      
      // Adicionar metadata se fornecida
      if (metadata) {
        updateData.metadata = metadata;
      }
      
      // Atualizar no banco
      await prisma.secret.update({
        where: { id },
        data: updateData,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating secret:', error);
      return {
        success: false,
        error: 'Failed to update secret',
      };
    }
  }
  
  /**
   * Remove um segredo
   */
  static async deleteSecret(
    id: string,
    ownerId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Buscar segredo
      const secret = await prisma.secret.findUnique({
        where: { id },
      });
      
      // Verificar se existe e pertence ao owner
      if (!secret || secret.ownerId !== ownerId) {
        return {
          success: false,
          error: 'Secret not found',
        };
      }
      
      // Remover do banco
      await prisma.secret.delete({
        where: { id },
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting secret:', error);
      return {
        success: false,
        error: 'Failed to delete secret',
      };
    }
  }
}
```

### Mascaramento de Dados Pessoais

O Brainlink implementa mecanismos de mascaramento para exibição segura de dados pessoais:

```typescript
// lib/security/dataMasking.ts

/**
 * Classe para mascaramento de dados pessoais
 */
export class DataMaskingService {
  /**
   * Mascara um endereço de e-mail
   * Exemplo: j***@e***.com
   */
  static maskEmail(email: string): string {
    if (!email) return '';
    
    const [username, domain] = email.split('@');
    
    if (!domain) return this.maskString(email);
    
    const maskedUsername = username.charAt(0) + '*'.repeat(Math.max(1, username.length - 1));
    
    const domainParts = domain.split('.');
    const tld = domainParts.pop();
    const maskedDomain = domainParts.map(part => part.charAt(0) + '*'.repeat(Math.max(1, part.length - 1))).join('.');
    
    return `${maskedUsername}@${maskedDomain}.${tld}`;
  }
  
  /**
   * Mascara um número de telefone
   * Exemplo: (***) ***-1234
   */
  static maskPhone(phone: string): string {
    if (!phone) return '';
    
    // Remover caracteres não-numéricos
    const digits = phone.replace(/\D/g, '');
    
    // Manter apenas os últimos 4 dígitos visíveis
    const visiblePart = digits.slice(-4);
    const maskedPart = '*'.repeat(Math.max(0, digits.length - 4));
    
    // Formatar de acordo com o comprimento
    if (digits.length === 10) {
      // Formato: (***) ***-1234
      return `(${maskedPart.slice(0, 3)}) ${maskedPart.slice(3)}-${visiblePart}`;
    } else if (digits.length === 11) {
      // Formato: +*-***-***-1234
      return `+${maskedPart.slice(0, 1)}-${maskedPart.slice(1, 4)}-${maskedPart.slice(4)}-${visiblePart}`;
    } else {
      // Formato simples
      return `${maskedPart}${visiblePart}`;
    }
  }
  
  /**
   * Mascara um nome completo
   * Exemplo: J*** D**
   */
  static maskName(name: string): string {
    if (!name) return '';
    
    const parts = name.split(' ');
    
    return parts.map(part => {
      if (part.length <= 1) return part;
      return part.charAt(0) + '*'.repeat(part.length - 1);
    }).join(' ');
  }
  
  /**
   * Mascara um endereço
   */
  static maskAddress(address: string): string {
    if (!address) return '';
    
    // Dividir por linhas
    const lines = address.split('\n');
    
    // Mascarar cada linha
    return lines.map(line => {
      // Preservar números de casa/apartamento quando possível
      const match = line.match(/^(\d+\s)/);
      
      if (match) {
        const prefix = match[0];
        const rest = line.substring(prefix.length);
        return prefix + this.maskString(rest);
      }
      
      return this.maskString(line);
    }).join('\n');
  }
  
  /**
   * Mascara uma string genérica
   */
  static maskString(text: string, visibleStart = 1, visibleEnd = 0): string {
    if (!text) return '';
    
    if (text.length <= visibleStart + visibleEnd) {
      return '*'.repeat(text.length);
    }
    
    const start = text.substring(0, visibleStart);
    const end = visibleEnd > 0 ? text.substring(text.length - visibleEnd) : '';
    const masked = '*'.repeat(text.length - visibleStart - visibleEnd);
    
    return `${start}${masked}${end}`;
  }
  
  /**
   * Mascara um número de cartão de crédito
   */
  static maskCreditCard(cardNumber: string): string {
    if (!cardNumber) return '';
    
    // Remover espaços e traços
    const digits = cardNumber.replace(/[\s-]/g, '');
    
    // Manter apenas os últimos 4 dígitos visíveis
    const lastFour = digits.slice(-4);
    const masked = '*'.repeat(Math.max(0, digits.length - 4));
    
    // Formatar como cartão de crédito
    const formatted = [];
    for (let i = 0; i < masked.length; i += 4) {
      formatted.push(masked.slice(i, i + 4));
    }
    
    if (lastFour) {
      formatted.push(lastFour);
    }
    
    return formatted.join(' ');
  }
}
```

## Segurança da API

A segurança da API do Brainlink é implementada por meio de várias camadas de proteção.

### Geração e Gerenciamento de Chaves de API

```typescript
// lib/security/apiKeys.ts
import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export class ApiKeyService {
  /**
   * Gera uma nova chave de API
   */
  static async generateApiKey(
    userId: string,
    name: string,
    permissions: string[],
    expiresIn?: number // em dias, null para nunca expirar
  ): Promise<{
    success: boolean;
    apiKey?: {
      id: string;
      key: string;
      name: string;
      expiresAt?: Date;
    };
    error?: string;
  }> {
    try {
      // Verificar se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, active: true },
      });
      
      if (!user || !user.active) {
        return {
          success: false,
          error: 'User not found or inactive',
        };
      }
      
      // Gerar chave aleatória
      const key = `blnk_${crypto.randomBytes(24).toString('hex')}`;
      
      // Calcular data de expiração, se houver
      let expiresAt = null;
      if (expiresIn) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresIn);
      }
      
      // Criar registro no banco
      const apiKey = await prisma.apiKey.create({
        data: {
          id: uuidv4(),
          key,
          name,
          userId,
          permissions,
          expiresAt,
          createdAt: new Date(),
        },
      });
      
      return {
        success: true,
        apiKey: {
          id: apiKey.id,
          key: apiKey.key,
          name: apiKey.name,
          expiresAt: apiKey.expiresAt,
        },
      };
    } catch (error) {
      console.error('Error generating API key:', error);
      return {
        success: false,
        error: 'Failed to generate API key',
      };
    }
  }
  
  /**
   * Lista chaves de API de um usuário
   */
  static async listApiKeys(
    userId: string
  ): Promise<{
    success: boolean;
    apiKeys?: Array<{
      id: string;
      name: string;
      permissions: string[];
      lastUsed?: Date;
      expiresAt?: Date;
      createdAt: Date;
    }>;
    error?: string;
  }> {
    try {
      // Buscar chaves do usuário
      const apiKeys = await prisma.apiKey.findMany({
        where: {
          userId,
          revokedAt: null,
        },
        select: {
          id: true,
          name: true,
          permissions: true,
          lastUsed: true,
          expiresAt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      return {
        success: true,
        apiKeys,
      };
    } catch (error) {
      console.error('Error listing API keys:', error);
      return {
        success: false,
        error: 'Failed to list API keys',
      };
    }
  }
  
  /**
   * Revoga uma chave de API
   */
  static async revokeApiKey(
    id: string,
    userId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Buscar chave
      const apiKey = await prisma.apiKey.findUnique({
        where: { id },
        select: { userId: true },
      });
      
      // Verificar se existe e pertence ao usuário
      if (!apiKey || apiKey.userId !== userId) {
        return {
          success: false,
          error: 'API key not found',
        };
      }
      
      // Revogar chave
      await prisma.apiKey.update({
        where: { id },
        data: {
          revokedAt: new Date(),
        },
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error revoking API key:', error);
      return {
        success: false,
        error: 'Failed to revoke API key',
      };
    }
  }
  
  /**
   * Atualiza últimma utilização de uma chave API
   */
  static async updateApiKeyLastUsed(
    key: string
  ): Promise<void> {
    try {
      await prisma.apiKey.updateMany({
        where: { key },
        data: {
          lastUsed: new Date(),
        },
      });
    } catch (error) {
      console.error('Error updating API key last used:', error);
    }
  }
}
```

### Proteção Contra Ataques

O Brainlink implementa várias medidas para proteger a API contra ataques comuns:

```typescript
// middleware/security.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { prisma } from '@/lib/db/prisma';

// Limitador de taxa por IP
const ipRateLimiter = new RateLimiterMemory({
  points: 100, // Número máximo de requisições
  duration: 60, // por 1 minuto
});

// Limitador de taxa por usuário
const userRateLimiter = new RateLimiterMemory({
  points: 300, // Número máximo de requisições
  duration: 60, // por 1 minuto
});

// Limitador de taxa para rotas de autenticação
const authRateLimiter = new RateLimiterMemory({
  points: 10, // Número máximo de tentativas
  duration: 60 * 15, // por 15 minutos
});

/**
 * Middleware para limitar taxa de requisições
 */
export const withRateLimit = (handler: any, options: {
  type?: 'ip' | 'user' | 'auth';
  points?: number;
  duration?: number;
} = {}) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Determinar qual limitador usar
        let limiter = ipRateLimiter;
    let key = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
    
    if (options.type === 'user' && req.user) {
      limiter = userRateLimiter;
      key = req.user.id;
    } else if (options.type === 'auth') {
      limiter = authRateLimiter;
    }
    
    // Usar limitador personalizado se fornecido
    if (options.points && options.duration) {
      limiter = new RateLimiterMemory({
        points: options.points,
        duration: options.duration,
      });
    }
    
    try {
      // Consumir pontos
      await limiter.consume(key);
      
      // Chamar handler se não excedeu limite
      return handler(req, res);
    } catch (error) {
      // Rate limit excedido
      res.setHeader('Retry-After', '60');
      return res.status(429).json({
        error: 'Too many requests, please try again later.',
      });
    }
  };
};

/**
 * Middleware para proteção contra CSRF
 */
export const withCsrfProtection = (handler: any) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    // Verificar CSRF token para métodos não idempotentes
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method || '')) {
      const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
      
      if (!csrfToken) {
        return res.status(403).json({
          error: 'CSRF token missing',
        });
      }
      
      // Verificar token contra sessão
      // Implementação depende do sistema de sessão utilizado
      
      // Exemplo com Next.js Iron Session
      if (req.session && req.session.csrfToken !== csrfToken) {
        return res.status(403).json({
          error: 'Invalid CSRF token',
        });
      }
    }
    
    return handler(req, res);
  };
};

/**
 * Validação de entrada para prevenção de injeção
 */
export const validateInput = (schema: any) => {
  return (handler: any) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        // Validar corpo da requisição contra schema
        if (req.body) {
          await schema.validate(req.body);
        }
        
        return handler(req, res);
      } catch (error) {
        return res.status(400).json({
          error: error.message || 'Invalid input',
        });
      }
    };
  };
};

/**
 * Middleware para adição de headers de segurança
 */
export const withSecurityHeaders = (handler: any) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    // Definir headers de segurança
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Content-Security-Policy', `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob:;
      font-src 'self';
      connect-src 'self' ${process.env.API_URL};
      frame-ancestors 'none';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim());
    
    // Continuar para o handler
    return handler(req, res);
  };
};

/**
 * Middleware para detecção de ataques e comportamento suspeito
 */
export const withThreatDetection = (handler: any) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Verificar se IP está na lista negra
    const blockedIp = await prisma.securityBlock.findFirst({
      where: {
        type: 'ip',
        value: ip,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    
    if (blockedIp) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }
    
    // Verificar parâmetros suspeitos que podem indicar injeção
    const reqBody = JSON.stringify(req.body).toLowerCase();
    const reqQuery = JSON.stringify(req.query).toLowerCase();
    
    const suspiciousPatterns = [
      'script', 'exec(', 'select ', 'union ', 'insert ', 'drop ', 
      'eval(', 'function(', '<iframe', '<script'
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (reqBody.includes(pattern) || reqQuery.includes(pattern)) {
        // Registrar tentativa suspeita
        await prisma.securityAlert.create({
          data: {
            type: 'POTENTIAL_INJECTION',
            ipAddress: ip,
            userAgent,
            details: {
              method: req.method,
              url: req.url,
              pattern,
            },
            timestamp: new Date(),
          },
        });
        
        return res.status(400).json({
          error: 'Invalid input',
        });
      }
    }
    
    // Se passou pelas verificações, continuar
    return handler(req, res);
  };
};
```

## Segurança de Infraestrutura

### Gestão Segura de Segredos

Para gerenciar segredos da infraestrutura, o Brainlink utiliza uma abordagem por camadas, separando os ambientes e utilizando cofres de segredos:

```typescript
// config/secretManager.ts
import * as AWS from 'aws-sdk';
import * as Azure from '@azure/keyvault-secrets';
import * as GCP from '@google-cloud/secret-manager';
import { EncryptionService } from '@/lib/security/encryption';

// Factory para criar gerenciador de segredos apropriado
export function createSecretManager(): SecretManager {
  const provider = process.env.SECRET_MANAGER_PROVIDER || 'local';
  
  switch (provider) {
    case 'aws':
      return new AwsSecretManager();
    case 'azure':
      return new AzureSecretManager();
    case 'gcp':
      return new GcpSecretManager();
    case 'local':
    default:
      return new LocalSecretManager();
  }
}

// Interface base para gerenciadores de segredos
export interface SecretManager {
  getSecret(name: string): Promise<string>;
  setSecret(name: string, value: string): Promise<void>;
  deleteSecret(name: string): Promise<void>;
  rotateSecret(name: string, newValue: string): Promise<void>;
}

// Implementação para AWS Secrets Manager
class AwsSecretManager implements SecretManager {
  private client: AWS.SecretsManager;
  
  constructor() {
    this.client = new AWS.SecretsManager({
      region: process.env.AWS_REGION,
    });
  }
  
  async getSecret(name: string): Promise<string> {
    const params = {
      SecretId: `${process.env.ENVIRONMENT}/${name}`,
    };
    
    const response = await this.client.getSecretValue(params).promise();
    
    if (response.SecretString) {
      return response.SecretString;
    }
    
    throw new Error('Secret not found');
  }
  
  async setSecret(name: string, value: string): Promise<void> {
    const params = {
      Name: `${process.env.ENVIRONMENT}/${name}`,
      SecretString: value,
    };
    
    await this.client.createSecret(params).promise();
  }
  
  async deleteSecret(name: string): Promise<void> {
    const params = {
      SecretId: `${process.env.ENVIRONMENT}/${name}`,
      ForceDeleteWithoutRecovery: false,
    };
    
    await this.client.deleteSecret(params).promise();
  }
  
  async rotateSecret(name: string, newValue: string): Promise<void> {
    const params = {
      SecretId: `${process.env.ENVIRONMENT}/${name}`,
      SecretString: newValue,
    };
    
    await this.client.updateSecret(params).promise();
  }
}

// Implementação para Azure Key Vault (simplificada)
class AzureSecretManager implements SecretManager {
  private client: any;
  
  constructor() {
    // Configurar cliente Azure Key Vault
    this.client = {}; // Simplificado
  }
  
  async getSecret(name: string): Promise<string> {
    // Implementação específica para Azure
    return 'secret-value';
  }
  
  async setSecret(name: string, value: string): Promise<void> {
    // Implementação específica para Azure
  }
  
  async deleteSecret(name: string): Promise<void> {
    // Implementação específica para Azure
  }
  
  async rotateSecret(name: string, newValue: string): Promise<void> {
    // Implementação específica para Azure
  }
}

// Implementação para GCP Secret Manager (simplificada)
class GcpSecretManager implements SecretManager {
  private client: any;
  
  constructor() {
    // Configurar cliente GCP Secret Manager
    this.client = {}; // Simplificado
  }
  
  async getSecret(name: string): Promise<string> {
    // Implementação específica para GCP
    return 'secret-value';
  }
  
  async setSecret(name: string, value: string): Promise<void> {
    // Implementação específica para GCP
  }
  
  async deleteSecret(name: string): Promise<void> {
    // Implementação específica para GCP
  }
  
  async rotateSecret(name: string, newValue: string): Promise<void> {
    // Implementação específica para GCP
  }
}

// Implementação local para desenvolvimento (NÃO USAR EM PRODUÇÃO)
class LocalSecretManager implements SecretManager {
  private cache: Map<string, string> = new Map();
  
  async getSecret(name: string): Promise<string> {
    // Tentar buscar do cache
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }
    
    // Buscar de variáveis de ambiente
    const envKey = `SECRET_${name.toUpperCase().replace(/-/g, '_')}`;
    if (process.env[envKey]) {
      return process.env[envKey]!;
    }
    
    // Buscar de arquivo local criptografado (se existir)
    try {
      const fs = require('fs');
      const path = require('path');
      
      const secretsPath = path.join(process.cwd(), '.secrets');
      
      if (fs.existsSync(secretsPath)) {
        const encryptedData = fs.readFileSync(path.join(secretsPath, `${name}.enc`), 'utf8');
        const decrypted = await EncryptionService.decrypt(encryptedData, `local:${name}`);
        
        // Armazenar em cache
        this.cache.set(name, decrypted);
        
        return decrypted;
      }
    } catch (error) {
      console.error(`Error reading local secret: ${name}`, error);
    }
    
    throw new Error(`Secret not found: ${name}`);
  }
  
  async setSecret(name: string, value: string): Promise<void> {
    // Armazenar em arquivo local criptografado
    try {
      const fs = require('fs');
      const path = require('path');
      
      const secretsPath = path.join(process.cwd(), '.secrets');
      
      // Criar diretório se não existir
      if (!fs.existsSync(secretsPath)) {
        fs.mkdirSync(secretsPath, { recursive: true });
      }
      
      // Criptografar e armazenar
      const encrypted = await EncryptionService.encrypt(value, `local:${name}`);
      fs.writeFileSync(path.join(secretsPath, `${name}.enc`), encrypted);
      
      // Atualizar cache
      this.cache.set(name, value);
    } catch (error) {
      console.error(`Error storing local secret: ${name}`, error);
      throw error;
    }
  }
  
  async deleteSecret(name: string): Promise<void> {
    // Remover do cache
    this.cache.delete(name);
    
    // Remover arquivo local
    try {
      const fs = require('fs');
      const path = require('path');
      
      const secretPath = path.join(process.cwd(), '.secrets', `${name}.enc`);
      
      if (fs.existsSync(secretPath)) {
        fs.unlinkSync(secretPath);
      }
    } catch (error) {
      console.error(`Error deleting local secret: ${name}`, error);
      throw error;
    }
  }
  
  async rotateSecret(name: string, newValue: string): Promise<void> {
    await this.setSecret(name, newValue);
  }
}
```

## Auditoria e Logging

O Brainlink implementa um sistema abrangente de logs de auditoria para rastrear ações sensíveis:

```typescript
// lib/security/auditLog.ts
import { prisma } from '@/lib/db/prisma';
import { v4 as uuidv4 } from 'uuid';

export enum AuditAction {
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  RESOURCE_ACCESSED = 'RESOURCE_ACCESSED',
  RESOURCE_CREATED = 'RESOURCE_CREATED',
  RESOURCE_UPDATED = 'RESOURCE_UPDATED',
  RESOURCE_DELETED = 'RESOURCE_DELETED',
  SETTINGS_CHANGED = 'SETTINGS_CHANGED',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export interface AuditContext {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  organizationId?: string;
  workspaceId?: string;
  projectId?: string;
  resourceType?: string;
  resourceId?: string;
}

export class AuditLogService {
    /**
   * Registra uma entrada no log de auditoria
   */
  static async log(
    action: AuditAction,
    userId: string,
    details: any,
    context: AuditContext = {}
  ): Promise<void> {
    try {
      // Criar entrada de log
      await prisma.auditLog.create({
        data: {
          id: uuidv4(),
          action,
          userId,
          ipAddress: context.ipAddress || '',
          userAgent: context.userAgent || '',
          requestId: context.requestId || uuidv4(),
          details,
          organizationId: context.organizationId,
          workspaceId: context.workspaceId,
          projectId: context.projectId,
          resourceType: context.resourceType,
          resourceId: context.resourceId,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      
      // Em caso de falha na gravação do log, registrar em fallback
      this.fallbackLog(action, userId, details, context, error);
    }
  }
  
  /**
   * Registra log em um mecanismo de fallback
   * Usado quando o registro no banco falha
   */
  private static fallbackLog(
    action: AuditAction,
    userId: string,
    details: any,
    context: AuditContext,
    error: any
  ): void {
    try {
      // Criar objeto de log
      const logEntry = {
        id: uuidv4(),
        action,
        userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        requestId: context.requestId || uuidv4(),
        details,
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        projectId: context.projectId,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
      
      // Registrar em arquivo local
      const fs = require('fs');
      const path = require('path');
      const logsDir = path.join(process.cwd(), 'logs', 'audit');
      
      // Criar diretório se não existir
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      // Nome do arquivo baseado na data
      const date = new Date();
      const filename = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;
      
      // Anexar ao arquivo de log
      fs.appendFileSync(
        path.join(logsDir, filename),
        JSON.stringify(logEntry) + '\n'
      );
    } catch (fallbackError) {
      console.error('Critical: Audit log fallback failed:', fallbackError);
      // Neste ponto, pode-se considerar notificar administrador via alertas
    }
  }
  
  /**
   * Busca logs de auditoria com filtragem
   */
  static async searchLogs(
    filters: {
      userId?: string;
      actions?: AuditAction[];
      organizationId?: string;
      workspaceId?: string;
      projectId?: string;
      resourceType?: string;
      resourceId?: string;
      startDate?: Date;
      endDate?: Date;
      ipAddress?: string;
    },
    pagination: {
      page: number;
      pageSize: number;
    }
  ): Promise<{
    logs: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      // Construir filtro
      const where: any = {};
      
      if (filters.userId) where.userId = filters.userId;
      if (filters.actions?.length) where.action = { in: filters.actions };
      if (filters.organizationId) where.organizationId = filters.organizationId;
      if (filters.workspaceId) where.workspaceId = filters.workspaceId;
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.resourceType) where.resourceType = filters.resourceType;
      if (filters.resourceId) where.resourceId = filters.resourceId;
      if (filters.ipAddress) where.ipAddress = filters.ipAddress;
      
      // Filtro de data
      if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        
        if (filters.startDate) {
          where.timestamp.gte = filters.startDate;
        }
        
        if (filters.endDate) {
          where.timestamp.lte = filters.endDate;
        }
      }
      
      // Calcular paginação
      const skip = (pagination.page - 1) * pagination.pageSize;
      const take = pagination.pageSize;
      
      // Buscar logs
      const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          skip,
          take,
          orderBy: {
            timestamp: 'desc',
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.auditLog.count({ where }),
      ]);
      
      // Calcular total de páginas
      const totalPages = Math.ceil(total / pagination.pageSize);
      
      return {
        logs,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error searching audit logs:', error);
      throw new Error('Failed to search audit logs');
    }
  }
  
  /**
   * Exporta logs de auditoria para formato CSV
   */
  static async exportLogsAsCsv(
    filters: {
      userId?: string;
      actions?: AuditAction[];
      organizationId?: string;
      workspaceId?: string;
      projectId?: string;
      resourceType?: string;
      resourceId?: string;
      startDate?: Date;
      endDate?: Date;
      ipAddress?: string;
    }
  ): Promise<string> {
    try {
      // Construir filtro
      const where: any = {};
      
      if (filters.userId) where.userId = filters.userId;
      if (filters.actions?.length) where.action = { in: filters.actions };
      if (filters.organizationId) where.organizationId = filters.organizationId;
      if (filters.workspaceId) where.workspaceId = filters.workspaceId;
      if (filters.projectId) where.projectId = filters.projectId;
      if (filters.resourceType) where.resourceType = filters.resourceType;
      if (filters.resourceId) where.resourceId = filters.resourceId;
      if (filters.ipAddress) where.ipAddress = filters.ipAddress;
      
      // Filtro de data
      if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        
        if (filters.startDate) {
          where.timestamp.gte = filters.startDate;
        }
        
        if (filters.endDate) {
          where.timestamp.lte = filters.endDate;
        }
      }
      
      // Buscar logs (limitado a 10.000 para performance)
      const logs = await prisma.auditLog.findMany({
        where,
        take: 10000,
        orderBy: {
          timestamp: 'desc',
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      
      // Transformar em CSV
      const csv = [
        // Cabeçalhos
        ['Timestamp', 'Action', 'User', 'IP Address', 'Resource Type', 'Resource ID', 'Details'].join(','),
        
        // Dados
        ...logs.map(log => [
          new Date(log.timestamp).toISOString(),
          log.action,
          log.user ? `${log.user.name} (${log.user.email})` : log.userId,
          log.ipAddress,
          log.resourceType || '',
          log.resourceId || '',
          JSON.stringify(log.details).replace(/,/g, ';').replace(/"/g, '""'),
        ].map(field => `"${field}"`).join(','))
      ].join('\n');
      
      return csv;
    } catch (error) {
      console.error('Error exporting audit logs to CSV:', error);
      throw new Error('Failed to export audit logs');
    }
  }
}
```

## Gerenciamento de Incidentes

O Brainlink implementa um sistema de detecção e resposta a incidentes de segurança:

```typescript
// lib/security/incidentManagement.ts
import { prisma } from '@/lib/db/prisma';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogService, AuditAction } from './auditLog';

export enum IncidentType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  BRUTE_FORCE = 'BRUTE_FORCE',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  DATA_LEAK = 'DATA_LEAK',
  API_ABUSE = 'API_ABUSE',
  UNUSUAL_BEHAVIOR = 'UNUSUAL_BEHAVIOR',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  DETECTED = 'DETECTED',
  INVESTIGATING = 'INVESTIGATING',
  CONTAINED = 'CONTAINED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class IncidentManagementService {
  /**
   * Registra um novo incidente de segurança
   */
  static async reportIncident(
    type: IncidentType,
    severity: IncidentSeverity,
    details: any,
    context: {
      userId?: string;
      ipAddress?: string;
      userAgent?: string;
      resourceType?: string;
      resourceId?: string;
      organizationId?: string;
    }
  ): Promise<{
    success: boolean;
    incidentId?: string;
    error?: string;
  }> {
    try {
      // Criar incidente
      const incident = await prisma.securityIncident.create({
        data: {
          id: uuidv4(),
          type,
          severity,
          status: IncidentStatus.DETECTED,
          details,
          userId: context.userId,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          resourceType: context.resourceType,
          resourceId: context.resourceId,
          organizationId: context.organizationId,
          detectedAt: new Date(),
        },
      });
      
      // Registrar no log de auditoria
      await AuditLogService.log(
        AuditAction.SECURITY_ALERT,
        context.userId || 'system',
        {
          incidentId: incident.id,
          type,
          severity,
          details,
        },
        {
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          resourceType: context.resourceType,
          resourceId: context.resourceId,
          organizationId: context.organizationId,
        }
      );
      
      // Executar respostas automáticas baseadas no tipo e severidade
      await this.executeAutomaticResponses(incident);
      
      return {
        success: true,
        incidentId: incident.id,
      };
    } catch (error) {
      console.error('Error reporting security incident:', error);
      return {
        success: false,
        error: 'Failed to report security incident',
      };
    }
  }
  
  /**
   * Executa respostas automáticas a incidentes
   */
  private static async executeAutomaticResponses(incident: any): Promise<void> {
    try {
      // Ações baseadas no tipo e severidade do incidente
      switch (incident.type) {
        case IncidentType.BRUTE_FORCE:
          // Bloqueio temporário de IP
          if (incident.ipAddress) {
            await this.blockIpAddress(
              incident.ipAddress,
              incident.severity === IncidentSeverity.CRITICAL ? 24 : 1 // horas
            );
          }
          
          // Bloqueio temporário de conta se identificada
          if (incident.userId) {
            await this.lockUserAccount(
              incident.userId,
              incident.severity === IncidentSeverity.CRITICAL ? 24 : 1 // horas
            );
          }
          break;
          
        case IncidentType.API_ABUSE:
          // Reduzir limites de taxa para o IP
          if (incident.ipAddress) {
            await this.reduceRateLimits(incident.ipAddress);
          }
          break;
          
        case IncidentType.UNAUTHORIZED_ACCESS:
          // Invalidar sessões e tokens
          if (incident.userId) {
            await this.invalidateUserSessions(incident.userId);
          }
          break;
      }
      
      // Notificar administradores para incidentes críticos ou altos
      if ([IncidentSeverity.CRITICAL, IncidentSeverity.HIGH].includes(incident.severity)) {
        await this.notifyAdministrators(incident);
      }
    } catch (error) {
      console.error('Error executing automatic responses:', error);
    }
  }
  
  /**
   * Bloqueia um endereço IP temporariamente
   */
  private static async blockIpAddress(ipAddress: string, hours: number): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    
    await prisma.securityBlock.create({
      data: {
        type: 'ip',
        value: ipAddress,
        reason: 'Automatic block due to security incident',
        createdAt: new Date(),
        expiresAt,
      },
    });
  }
  
  /**
   * Bloqueia temporariamente uma conta de usuário
   */
  private static async lockUserAccount(userId: string, hours: number): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);
    
    // Marcar conta como bloqueada
    await prisma.user.update({
      where: { id: userId },
      data: {
        lockedUntil: expiresAt,
      },
    });
    
    // Revogar todos os tokens
    await prisma.authToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  
  /**
   * Reduz limites de taxa para um IP
   */
  private static async reduceRateLimits(ipAddress: string): Promise<void> {
    // Implementação depende do sistema de rate limiting
    // Aqui, apenas registramos a intenção
    await prisma.securityBlock.create({
      data: {        type: 'rate_limit',
        value: ipAddress,
        reason: 'Reduced rate limits due to API abuse',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      },
    });
  }
  
  /**
   * Invalida todas as sessões e tokens de um usuário
   */
  private static async invalidateUserSessions(userId: string): Promise<void> {
    // Revogar todos os tokens
    await prisma.authToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
  
  /**
   * Notifica administradores sobre um incidente
   */
  private static async notifyAdministrators(incident: any): Promise<void> {
    try {
      // Buscar administradores da organização, se disponível
      let adminEmails: string[] = [];
      
      if (incident.organizationId) {
        const admins = await prisma.organizationMember.findMany({
          where: {
            organizationId: incident.organizationId,
            role: { in: ['admin', 'owner'] },
          },
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        });
        
        adminEmails = admins.map(admin => admin.user.email);
      }
      
      // Se não houver administradores específicos, notificar administradores globais
      if (adminEmails.length === 0) {
        const globalAdmins = await prisma.user.findMany({
          where: {
            role: 'admin',
          },
          select: {
            email: true,
          },
        });
        
        adminEmails = globalAdmins.map(admin => admin.email);
      }
      
      // Enviar notificações
      if (adminEmails.length > 0) {
        // Implementação do envio de notificações
        console.log(`Would notify admins: ${adminEmails.join(', ')} about incident ${incident.id}`);
      }
    } catch (error) {
      console.error('Error notifying administrators:', error);
    }
  }
  
  /**
   * Atualiza o status de um incidente
   */
  static async updateIncidentStatus(
    incidentId: string,
    status: IncidentStatus,
    notes: string,
    userId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Verificar se incidente existe
      const incident = await prisma.securityIncident.findUnique({
        where: { id: incidentId },
      });
      
      if (!incident) {
        return {
          success: false,
          error: 'Incident not found',
        };
      }
      
      // Atualizar status
      await prisma.securityIncident.update({
        where: { id: incidentId },
        data: {
          status,
          notes,
          updatedAt: new Date(),
          updatedBy: userId,
        },
      });
      
      // Registrar no log de auditoria
      await AuditLogService.log(
        AuditAction.SECURITY_ALERT,
        userId,
        {
          incidentId,
          action: 'update_status',
          previousStatus: incident.status,
          newStatus: status,
          notes,
        },
        {}
      );
      
      // Se resolvido, executar ações adicionais
      if (status === IncidentStatus.RESOLVED) {
        await this.handleResolvedIncident(incidentId);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating incident status:', error);
      return {
        success: false,
        error: 'Failed to update incident status',
      };
    }
  }
  
  /**
   * Executa ações necessárias quando um incidente é resolvido
   */
  private static async handleResolvedIncident(incidentId: string): Promise<void> {
    try {
      const incident = await prisma.securityIncident.findUnique({
        where: { id: incidentId },
      });
      
      if (!incident) return;
      
      // Remover bloqueios automáticos associados
      if (incident.ipAddress) {
        await prisma.securityBlock.deleteMany({
          where: {
            type: 'ip',
            value: incident.ipAddress,
            reason: { contains: 'Automatic block due to security incident' },
          },
        });
      }
      
      // Desbloquear conta de usuário, se aplicável
      if (incident.userId) {
        await prisma.user.updateMany({
          where: {
            id: incident.userId,
            lockedUntil: { gt: new Date() },
          },
          data: {
            lockedUntil: null,
          },
        });
      }
    } catch (error) {
      console.error('Error handling resolved incident:', error);
    }
  }
  
  /**
   * Lista incidentes com filtros
   */
  static async listIncidents(
    filters: {
      organizationId?: string;
      userId?: string;
      types?: IncidentType[];
      severities?: IncidentSeverity[];
      statuses?: IncidentStatus[];
      startDate?: Date;
      endDate?: Date;
    },
    pagination: {
      page: number;
      pageSize: number;
    }
  ): Promise<{
    incidents: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      // Construir filtro
      const where: any = {};
      
      if (filters.organizationId) where.organizationId = filters.organizationId;
      if (filters.userId) where.userId = filters.userId;
      if (filters.types?.length) where.type = { in: filters.types };
      if (filters.severities?.length) where.severity = { in: filters.severities };
      if (filters.statuses?.length) where.status = { in: filters.statuses };
      
      // Filtro de data
      if (filters.startDate || filters.endDate) {
        where.detectedAt = {};
        
        if (filters.startDate) {
          where.detectedAt.gte = filters.startDate;
        }
        
        if (filters.endDate) {
          where.detectedAt.lte = filters.endDate;
        }
      }
      
      // Calcular paginação
      const skip = (pagination.page - 1) * pagination.pageSize;
      const take = pagination.pageSize;
      
      // Buscar incidentes
      const [incidents, total] = await Promise.all([
        prisma.securityIncident.findMany({
          where,
          skip,
          take,
          orderBy: {
            detectedAt: 'desc',
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.securityIncident.count({ where }),
      ]);
      
      // Calcular total de páginas
      const totalPages = Math.ceil(total / pagination.pageSize);
      
      return {
        incidents,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error listing security incidents:', error);
      throw new Error('Failed to list security incidents');
    }
  }
}
```

## Conformidade

O Brainlink foi projetado para atender aos requisitos regulatórios e de conformidade mais importantes, incluindo GDPR, LGPD, CCPA e outros.

### Gerenciamento de Consentimento

```typescript
// lib/compliance/consent.ts
import { prisma } from '@/lib/db/prisma';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogService, AuditAction } from '@/lib/security/auditLog';

export enum ConsentType {
  TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  MARKETING = 'MARKETING',
  COOKIES = 'COOKIES',
  DATA_PROCESSING = 'DATA_PROCESSING',
  THIRD_PARTY_SHARING = 'THIRD_PARTY_SHARING',
}

export class ConsentManager {
  /**
   * Registra consentimento do usuário
   */
  static async recordConsent(
    userId: string,
    type: ConsentType,
    version: string,
    granted: boolean,
    ipAddress: string,
    userAgent: string
  ): Promise<{
    success: boolean;
    consentId?: string;
    error?: string;
  }> {
    try {
      // Registrar consentimento
      const consent = await prisma.userConsent.create({
        data: {
          id: uuidv4(),
          userId,
          type,
          version,
          granted,
          ipAddress,
          userAgent,
          timestamp: new Date(),
        },
      });
      
      // Registrar no log de auditoria
      await AuditLogService.log(
        AuditAction.USER_UPDATED,
        userId,
        {
          action: 'consent_update',
          consentType: type,
          version,
          granted,
        },
        {
          ipAddress,
          userAgent,
        }
      );
      
      return {
        success: true,
        consentId: consent.id,
      };
    } catch (error) {
      console.error('Error recording consent:', error);
      return {
        success: false,
        error: 'Failed to record consent',
      };
    }
  }
  
  /**
   * Verifica se o usuário concedeu consentimento
   */
  static async hasConsent(
    userId: string,
    type: ConsentType,
    requiredVersion?: string
  ): Promise<boolean> {
    try {
      // Buscar consentimento mais recente
      const consent = await prisma.userConsent.findFirst({
        where: {
          userId,
          type,
          ...(requiredVersion ? { version: requiredVersion } : {}),
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
      
      return !!consent && consent.granted;
    } catch (error) {
      console.error('Error checking consent:', error);
      return false;
    }
  }
  
  /**
   * Obtém o histórico de consentimento de um usuário
   */
  static async getConsentHistory(
    userId: string,
    type?: ConsentType
  ): Promise<any[]> {
    try {
      return await prisma.userConsent.findMany({
        where: {
          userId,
          ...(type ? { type } : {}),
        },
        orderBy: {
          timestamp: 'desc',
        },
      });
    } catch (error) {
      console.error('Error getting consent history:', error);
      return [];
    }
  }
  
  /**
   * Obtém o estado atual de todos os consentimentos de um usuário
   */
  static async getUserConsentStatus(
    userId: string
  ): Promise<Record<ConsentType, { granted: boolean; version: string; timestamp: Date }>> {
    try {
      // Buscar todos os tipos de consentimento
      const consentTypes = Object.values(ConsentType);
      
      // Para cada tipo, buscar o mais recente
      const consents = await Promise.all(
        consentTypes.map(async type => {
          const consent = await prisma.userConsent.findFirst({
            where: {
              userId,
              type: type as ConsentType,
            },
            orderBy: {
              timestamp: 'desc',
            },
          });
          
          return {
            type: type as ConsentType,
            status: consent
              ? { granted: consent.granted, version: consent.version, timestamp: consent.timestamp }
              : { granted: false, version: '', timestamp: new Date(0) },
          };
        })
      );
      
      // Converter para objeto
      const result: Record<ConsentType, any> = {} as any;
      
      for (const consent of consents) {
        result[consent.type] = consent.status;
      }
      
      return result;
    } catch (error) {
      console.error('Error getting user consent status:', error);
      return {} as any;
    }
  }
}
```

### Implementação de Direitos do Titular

```typescript
// lib/compliance/dataSubjectRights.ts
import { prisma } from '@/lib/db/prisma';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogService, AuditAction } from '@/lib/security/auditLog';

export enum RequestType {
  ACCESS = 'ACCESS',
  RECTIFICATION = 'RECTIFICATION',
  ERASURE = 'ERASURE',
  RESTRICTION = 'RESTRICTION',
  PORTABILITY = 'PORTABILITY',
  OBJECTION = 'OBJECTION',
}

export enum RequestStatus {
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class DataSubjectRightsService {
  /**
   * Registra uma solicitação de direitos do titular
   */
  static async submitRequest(
    userId: string,
    type: RequestType,
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<{
    success: boolean;
    requestId?: string;
    error?: string;
  }> {
    try {
      // Criar solicitação
      const request = await prisma.dataSubjectRequest.create({
        data: {
          id: uuidv4(),
          userId,
          type,
          status: RequestStatus.SUBMITTED,
          details,
          ipAddress,
          userAgent,
          submittedAt: new Date(),
        },
      });
      
      // Registrar no log de auditoria
      await AuditLogService.log(
        AuditAction.USER_UPDATED,
        userId,
        {
          action: 'dsr_submit',
          requestType: type,
          requestId: request.id,
        },
        {
          ipAddress,
          userAgent,
        }
      );
      
      return {
        success: true,
        requestId: request.id,
      };
    } catch (error) {
      console.error('Error submitting data subject request:', error);
      return {
        success: false,
        error: 'Failed to submit request',
      };
    }
  }
  
  /**
   * Atualiza o status de uma solicitação
   */
  static async updateRequestStatus(
    requestId: string,
    status: RequestStatus,
    notes: string,
    adminId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Verificar se solicitação existe
      const request = await prisma.dataSubjectRequest.findUnique({
        where: { id: requestId },
      });
      
      if (!request) {
        return {
          success: false,
          error: 'Request not found',
        };
      }
      
      // Atualizar status
      await prisma.dataSubjectRequest.update({
        where: { id: requestId },
        data: {
          status,
          notes,
                    processedBy: adminId,
          processedAt: new Date(),
        },
      });
      
      // Registrar no log de auditoria
      await AuditLogService.log(
        AuditAction.USER_UPDATED,
        adminId,
        {
          action: 'dsr_status_update',
          requestId,
          userId: request.userId,
          previousStatus: request.status,
          newStatus: status,
        },
        {}
      );
      
      // Executar ações específicas de acordo com o tipo e status
      if (status === RequestStatus.PROCESSING) {
        await this.startProcessingRequest(request);
      } else if (status === RequestStatus.COMPLETED) {
        await this.completeRequest(request, notes);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating request status:', error);
      return {
        success: false,
        error: 'Failed to update request status',
      };
    }
  }
  
  /**
   * Inicia o processamento de uma solicitação
   */
  private static async startProcessingRequest(request: any): Promise<void> {
    // Lógica específica para cada tipo de solicitação
    switch (request.type) {
      case RequestType.ACCESS:
        // Iniciar coleta de dados
        await this.startDataCollection(request.userId);
        break;
        
      case RequestType.PORTABILITY:
        // Iniciar exportação de dados
        await this.startDataExport(request.userId);
        break;
        
      // Outros tipos...
    }
  }
  
  /**
   * Finaliza o processamento de uma solicitação
   */
  private static async completeRequest(request: any, notes: string): Promise<void> {
    // Lógica específica para cada tipo de solicitação
    switch (request.type) {
      case RequestType.ERASURE:
        // Executar exclusão de dados
        await this.executeDataErasure(request.userId);
        break;
        
      case RequestType.RESTRICTION:
        // Implementar restrição de processamento
        await this.implementProcessingRestriction(request.userId, request.details);
        break;
        
      // Outros tipos...
    }
  }
  
  /**
   * Implementações das ações específicas (simplificadas)
   */
  private static async startDataCollection(userId: string): Promise<void> {
    // Implementação da coleta de dados pessoais
    console.log(`Starting data collection for user ${userId}`);
  }
  
  private static async startDataExport(userId: string): Promise<void> {
    // Implementação da exportação de dados
    console.log(`Starting data export for user ${userId}`);
  }
  
  private static async executeDataErasure(userId: string): Promise<void> {
    // Implementação da exclusão de dados
    console.log(`Executing data erasure for user ${userId}`);
    
    // Exemplo: Anonimizar dados do usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `anonymous_${Date.now()}@deleted.example.com`,
        name: 'Deleted User',
        active: false,
        deletedAt: new Date(),
        // Limpar outros campos pessoais
        phone: null,
        address: null,
        birthDate: null,
      },
    });
    
    // Revogar consentimentos
    await prisma.userConsent.updateMany({
      where: { userId },
      data: {
        granted: false,
      },
    });
    
    // Revogar tokens
    await prisma.authToken.updateMany({
      where: { userId },
      data: {
        revokedAt: new Date(),
      },
    });
    
    // Pseudonimizar dados em outros registros
    // ... implementação específica
  }
  
  private static async implementProcessingRestriction(userId: string, details: any): Promise<void> {
    // Implementação da restrição de processamento
    console.log(`Implementing processing restriction for user ${userId}`);
    
    // Exemplo: Marcar usuário como restrito
    await prisma.user.update({
      where: { id: userId },
      data: {
        processingRestricted: true,
        processingRestrictions: details,
      },
    });
  }
  
  /**
   * Lista as solicitações de um usuário
   */
  static async listUserRequests(
    userId: string
  ): Promise<any[]> {
    try {
      return await prisma.dataSubjectRequest.findMany({
        where: { userId },
        orderBy: {
          submittedAt: 'desc',
        },
      });
    } catch (error) {
      console.error('Error listing user requests:', error);
      return [];
    }
  }
  
  /**
   * Lista todas as solicitações com filtros (para administradores)
   */
  static async listAllRequests(
    filters: {
      userId?: string;
      types?: RequestType[];
      statuses?: RequestStatus[];
      startDate?: Date;
      endDate?: Date;
    },
    pagination: {
      page: number;
      pageSize: number;
    }
  ): Promise<{
    requests: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    try {
      // Construir filtro
      const where: any = {};
      
      if (filters.userId) where.userId = filters.userId;
      if (filters.types?.length) where.type = { in: filters.types };
      if (filters.statuses?.length) where.status = { in: filters.statuses };
      
      // Filtro de data
      if (filters.startDate || filters.endDate) {
        where.submittedAt = {};
        
        if (filters.startDate) {
          where.submittedAt.gte = filters.startDate;
        }
        
        if (filters.endDate) {
          where.submittedAt.lte = filters.endDate;
        }
      }
      
      // Calcular paginação
      const skip = (pagination.page - 1) * pagination.pageSize;
      const take = pagination.pageSize;
      
      // Buscar solicitações
      const [requests, total] = await Promise.all([
        prisma.dataSubjectRequest.findMany({
          where,
          skip,
          take,
          orderBy: {
            submittedAt: 'desc',
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.dataSubjectRequest.count({ where }),
      ]);
      
      // Calcular total de páginas
      const totalPages = Math.ceil(total / pagination.pageSize);
      
      return {
        requests,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages,
      };
    } catch (error) {
      console.error('Error listing data subject requests:', error);
      throw new Error('Failed to list data subject requests');
    }
  }
}
```

## Recomendações para Implementação

Para garantir um alto nível de segurança na implementação do Brainlink, recomendamos as seguintes práticas:

### Desenvolvimento Seguro

1. **Ciclo de Vida de Desenvolvimento Seguro (SDLC)**
   - Adotar um SDLC que incorpore segurança em todas as fases
   - Implementar revisões de código focadas em segurança
   - Realizar testes de segurança contínuos (SAST, DAST, SCA)

2. **Gerenciamento de Dependências**
   - Manter dependências atualizadas
   - Utilizar ferramentas de análise de vulnerabilidades (ex: Snyk, Dependabot)
   - Estabelecer processo para avaliação de novas dependências

3. **Configuração Segura**
   - Evitar senhas e chaves no código-fonte
   - Utilizar o gerenciador de segredos para armazenar valores sensíveis
   - Implementar rotação periódica de segredos

### Operação Segura

1. **Monitoramento e Detecção**
   - Implementar monitoramento proativo de segurança
   - Configurar alertas para comportamentos anômalos
   - Realizar revisões periódicas dos logs de auditoria

2. **Gestão de Patches**
   - Estabelecer processo para aplicação regular de patches
   - Priorizar vulnerabilidades de acordo com o impacto
   - Definir procedimentos para atualizações emergenciais

3. **Backups e Recuperação**
   - Implementar backups automáticos e regulares
   - Testar procedimentos de recuperação
   - Armazenar backups de forma segura e criptografada

4. **Treinamento e Conscientização**
   - Treinar equipes em melhores práticas de segurança
   - Realizar exercícios de resposta a incidentes
   - Manter documentação atualizada sobre procedimentos de segurança

## Conclusão

O modelo de segurança do Brainlink foi projetado com múltiplas camadas de proteção para garantir a confidencialidade, integridade e disponibilidade dos dados. A implementação deste modelo requer atenção contínua e adaptação às novas ameaças e tecnologias.

A segurança é um processo contínuo, não um produto final. O Brainlink deve evoluir constantemente sua postura de segurança através de monitoramento, avaliações periódicas e melhorias incrementais.

Os elementos descritos neste documento fornecem uma base robusta para a criação de uma plataforma segura, mas devem ser complementados com práticas específicas ao ambiente de implementação e requisitos regulatórios aplicáveis.
        