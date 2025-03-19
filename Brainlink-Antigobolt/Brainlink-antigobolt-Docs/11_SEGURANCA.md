
# Segurança

## Visão Geral de Segurança

A segurança é um aspecto fundamental do Brainlink, sendo implementada em múltiplas camadas e abordando todos os aspectos do sistema, desde a infraestrutura até o código da aplicação. A estratégia de segurança segue o princípio de defesa em profundidade, onde múltiplas camadas de controles de segurança são implementadas para proteger os dados e funcionalidades do sistema.

### Princípios de Segurança

O Brainlink foi projetado seguindo estes princípios fundamentais de segurança:

1. **Defesa em Profundidade**: Múltiplas camadas de segurança protegem cada aspecto do sistema
2. **Privilégio Mínimo**: Usuários e componentes recebem somente os acessos necessários para suas funções
3. **Segurança por Design**: Considerações de segurança são incorporadas desde o início do desenvolvimento
4. **Compartimentalização**: Isolamento de componentes para limitar o impacto de possíveis comprometimentos
5. **Transparência**: Processos de segurança documentados e auditáveis
6. **Resiliência**: Capacidade de detectar, responder e recuperar-se de incidentes
7. **Conformidade**: Adesão a padrões e regulamentações relevantes

## Autenticação e Autorização

### Sistema de Identidade

O Brainlink implementa um sistema de identidade robusto que gerencia usuários, organizações e seus respectivos níveis de acesso:

```typescript
// lib/auth/identity.ts
import { prisma } from '@/lib/db/prisma';
import { hash, compare } from 'bcrypt';
import { createId } from '@paralleldrive/cuid2';
import { randomBytes } from 'crypto';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Nunca retornado nas APIs
  role: UserRole;
  organizationId?: string;
  lastLogin?: Date;
  failedLoginAttempts: number;
  locked: boolean;
  mfaEnabled: boolean;
  mfaMethods?: MFAMethod[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  GUEST = 'guest',
}

export enum MFAType {
  TOTP = 'totp',      // Autenticação baseada em tempo (Google Authenticator, etc.)
  SMS = 'sms',        // Código enviado via SMS
  EMAIL = 'email',    // Código enviado via e-mail
  SECURITY_KEY = 'security_key', // FIDO2/WebAuthn (chaves de segurança)
}

export interface MFAMethod {
  id: string;
  type: MFAType;
  identifier: string; // Número de telefone, e-mail, etc.
  secret?: string;    // Segredo TOTP ou outra informação relacionada
  lastUsed?: Date;
  verified: boolean;
}

export class IdentityService {
  /**
   * Cria um novo usuário com informações básicas
   * @returns O usuário criado
   * @throws Se o e-mail já estiver em uso
   */
  static async createUser({
    email,
    name,
    password,
    role = UserRole.USER,
    organizationId,
  }: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
    organizationId?: string;
  }): Promise<User> {
    // Verificar se o e-mail já está em uso
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new Error('Email already in use');
    }

    // Criar hash da senha
    const hashedPassword = await hash(password, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        id: createId(),
        email,
        name,
        password: hashedPassword,
        role,
        organizationId,
        failedLoginAttempts: 0,
        locked: false,
        mfaEnabled: false,
      },
    });

    // Sanitizar dados antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Autentica um usuário com e-mail e senha
   * @returns O usuário autenticado
   * @throws Se as credenciais forem inválidas
   */
  static async authenticateWithPassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ user: User; requiresMFA: boolean }> {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        mfaMethods: true,
      },
    });

    // Verificar se o usuário existe
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar se a conta está bloqueada
    if (user.locked) {
      throw new Error('Account is locked due to multiple failed attempts');
    }

    // Verificar senha
    const passwordValid = await compare(password, user.password);

    if (!passwordValid) {
      // Incrementar contador de falhas
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: {
            increment: 1,
          },
          // Bloquear conta após muitas tentativas
          locked: user.failedLoginAttempts >= 4, // Bloqueia na 5ª tentativa
        },
      });

      throw new Error('Invalid credentials');
    }

    // Resetar contador de falhas em caso de sucesso
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lastLogin: new Date(),
      },
    });

    // Verificar se MFA é necessária
    const requiresMFA = user.mfaEnabled;

    // Sanitizar dados antes de retornar
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      requiresMFA,
    };
  }

  /**
   * Valida um código MFA para usuário
   * @returns Se o código é válido
   */
  static async validateMFACode({
    userId,
    methodId,
    code,
  }: {
    userId: string;
    methodId: string;
    code: string;
  }): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        mfaMethods: {
          where: { id: methodId },
        },
      },
    });

    if (!user || !user.mfaMethods.length) {
      return false;
    }

    const method = user.mfaMethods[0];

    // Implementar validação baseada no tipo de MFA
    switch (method.type) {
      case MFAType.TOTP:
        return this.validateTOTP(method.secret!, code);
      case MFAType.SMS:
      case MFAType.EMAIL:
        return this.validateCode(userId, methodId, code);
      case MFAType.SECURITY_KEY:
        // Implementação específica para WebAuthn
        return false;
      default:
        return false;
    }
  }

  /**
   * Valida um código TOTP
   */
  private static validateTOTP(secret: string, code: string): boolean {
    // Implementação real usaria uma biblioteca como 'otplib'
    // Aqui usamos uma versão simplificada para o exemplo
    return code === '123456'; // Exemplo, não use em produção!
  }

  /**
   * Valida um código enviado por SMS ou e-mail
   */
  private static async validateCode(
    userId: string,
    methodId: string,
    code: string
  ): Promise<boolean> {
    const storedCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        methodId,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!storedCode) {
      return false;
    }

    // Marcar código como usado
    await prisma.verificationCode.delete({
      where: { id: storedCode.id },
    });

    // Atualizar data de último uso do método
    await prisma.mfaMethod.update({
      where: { id: methodId },
      data: { lastUsed: new Date() },
    });

    return true;
  }

  /**
   * Configura um método MFA para o usuário
   */
  static async setupMFAMethod({
    userId,
    type,
    identifier,
  }: {
    userId: string;
    type: MFAType;
    identifier: string;
  }): Promise<MFAMethod> {
    let secret: string | undefined;

    // Gerar segredo para TOTP
    if (type === MFAType.TOTP) {
      secret = randomBytes(20).toString('hex');
    }

    // Criar método MFA
    const method = await prisma.mfaMethod.create({
      data: {
        id: createId(),
        userId,
        type,
        identifier,
        secret,
        verified: false,
      },
    });

    // Para SMS e e-mail, enviar código de verificação
    if (type === MFAType.SMS || type === MFAType.EMAIL) {
      await this.sendVerificationCode(userId, method.id, type, identifier);
    }

    return method;
  }

  /**
   * Envia um código de verificação para o usuário
   */
  private static async sendVerificationCode(
    userId: string,
    methodId: string,
    type: MFAType,
    destination: string
  ): Promise<void> {
    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Salvar código no banco de dados
    await prisma.verificationCode.create({
      data: {
        id: createId(),
        userId,
        methodId,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
      },
    });

    // Enviar código
    if (type === MFAType.SMS) {
      await this.sendSMS(destination, `Seu código de verificação: ${code}`);
    } else if (type === MFAType.EMAIL) {
      await this.sendEmail(
        destination,
        'Código de Verificação',
        `Seu código de verificação: ${code}`
      );
    }
  }

  /**
   * Enviar SMS (implementação simulada)
   */
  private static async sendSMS(phoneNumber: string, message: string): Promise<void> {
    console.log(`[SMS] Para ${phoneNumber}: ${message}`);
    // Em produção, integrar com serviço de SMS
  }

  /**
   * Enviar e-mail (implementação simulada)
   */
  private static async sendEmail(
    email: string,
    subject: string,
    message: string
  ): Promise<void> {
    console.log(`[Email] Para ${email}, Assunto: ${subject}, Mensagem: ${message}`);
    // Em produção, integrar com serviço de e-mail
  }
}
```

### Sistema de Autorização

O controle de acesso é implementado usando um sistema baseado em papéis (RBAC) junto com controle de acesso baseado em atributos (ABAC) para casos mais complexos.

```typescript
// lib/auth/authorization.ts
import { prisma } from '@/lib/db/prisma';

export enum Permission {
  // Permissões de usuário
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  
  // Permissões de organização
  ORG_VIEW = 'org:view',
  ORG_CREATE = 'org:create',
  ORG_UPDATE = 'org:update',
  ORG_DELETE = 'org:delete',
  
  // Permissões de projeto
  PROJECT_VIEW = 'project:view',
  PROJECT_CREATE = 'project:create',
  PROJECT_UPDATE = 'project:update',
  PROJECT_DELETE = 'project:delete',
  
  // Permissões de conteúdo
  CONTENT_VIEW = 'content:view',
  CONTENT_CREATE = 'content:create',
  CONTENT_UPDATE = 'content:update',
  CONTENT_DELETE = 'content:delete',
  
  // Permissões de API
  API_ACCESS = 'api:access',
  
  // Permissões de sistema
  SYSTEM_ADMIN = 'system:admin',
}

export interface RoleDefinition {
  name: string;
  description: string;
  permissions: Permission[];
}

// Definições de papéis padrão
export const DEFAULT_ROLES: Record<string, RoleDefinition> = {
  admin: {
    name: 'Administrator',
    description: 'Full system access',
    permissions: Object.values(Permission),
  },
  manager: {
    name: 'Manager',
    description: 'Organization management',
    permissions: [
      Permission.USER_VIEW,
      Permission.USER_CREATE,
      Permission.USER_UPDATE,
      Permission.ORG_VIEW,
      Permission.ORG_UPDATE,
      Permission.PROJECT_VIEW,
      Permission.PROJECT_CREATE,
      Permission.PROJECT_UPDATE,
      Permission.PROJECT_DELETE,
      Permission.CONTENT_VIEW,
      Permission.CONTENT_CREATE,
      Permission.CONTENT_UPDATE,
      Permission.CONTENT_DELETE,
      Permission.API_ACCESS,
    ],
  },
  user: {
    name: 'User',
    description: 'Regular user access',
    permissions: [
      Permission.USER_VIEW,
      Permission.ORG_VIEW,
      Permission.PROJECT_VIEW,
      Permission.PROJECT_CREATE,
      Permission.PROJECT_UPDATE,
      Permission.CONTENT_VIEW,
      Permission.CONTENT_CREATE,
      Permission.CONTENT_UPDATE,
    ],
  },
  guest: {
    name: 'Guest',
    description: 'Limited read-only access',
    permissions: [
      Permission.USER_VIEW,
      Permission.ORG_VIEW,
      Permission.PROJECT_VIEW,
      Permission.CONTENT_VIEW,
    ],
  },
};

export class AuthorizationService {
  /**
   * Verifica se um usuário tem uma permissão específica
   */
  static async hasPermission(
    userId: string,
    permission: Permission,
    resourceId?: string
  ): Promise<boolean> {
    // Buscar papel do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, organizationId: true },
    });

    if (!user) {
      return false;
    }

    // Admin tem todas as permissões
    if (user.role === 'admin') {
      return true;
    }

        // Buscar definição do papel
    const roleDefinition = DEFAULT_ROLES[user.role];

    if (!roleDefinition) {
      return false;
    }

    // Verificar se o papel tem a permissão básica
    if (!roleDefinition.permissions.includes(permission)) {
      return false;
    }

    // Se não há recurso específico, a permissão básica é suficiente
    if (!resourceId) {
      return true;
    }

    // Verificar permissões específicas para o recurso
    // Por exemplo, verificar se o usuário tem acesso a um projeto específico
    if (permission.startsWith('project:')) {
      return this.checkProjectAccess(userId, resourceId, permission);
    }

    // Verificar permissões específicas para conteúdo
    if (permission.startsWith('content:')) {
      return this.checkContentAccess(userId, resourceId, permission);
    }

    // Verificar permissões específicas para organização
    if (permission.startsWith('org:')) {
      return user.organizationId === resourceId || 
             await this.isOrganizationAdmin(userId, resourceId);
    }

    // Para outros recursos, verificar permissões personalizadas
    const customPermission = await prisma.customPermission.findFirst({
      where: {
        userId,
        resourceType: permission.split(':')[0],
        resourceId,
        permission: permission.split(':')[1],
      },
    });

    return !!customPermission;
  }

  /**
   * Verifica acesso a um projeto específico
   */
  private static async checkProjectAccess(
    userId: string,
    projectId: string,
    permission: Permission
  ): Promise<boolean> {
    // Verificar se o usuário tem acesso direto ao projeto
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (projectMember) {
      // Verificar permissão específica do membro
      if (permission === Permission.PROJECT_VIEW) {
        return true; // Todos os membros podem visualizar
      }
      
      if (permission === Permission.PROJECT_UPDATE) {
        return ['owner', 'editor', 'contributor'].includes(projectMember.role);
      }
      
      if (permission === Permission.PROJECT_DELETE) {
        return ['owner'].includes(projectMember.role);
      }
    }

    // Verificar acesso via organização
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { organizationId: true },
    });

    if (project?.organizationId) {
      return this.isOrganizationAdmin(userId, project.organizationId);
    }

    return false;
  }

  /**
   * Verifica acesso a conteúdo específico
   */
  private static async checkContentAccess(
    userId: string,
    contentId: string,
    permission: Permission
  ): Promise<boolean> {
    // Buscar conteúdo para determinar projeto
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      select: { projectId: true, createdById: true },
    });

    if (!content) {
      return false;
    }

    // Criador do conteúdo tem permissões completas sobre ele
    if (content.createdById === userId) {
      return true;
    }

    // Verificar acesso via projeto
    if (content.projectId) {
      // Para visualização, basta ter acesso ao projeto
      if (permission === Permission.CONTENT_VIEW) {
        return this.checkProjectAccess(userId, content.projectId, Permission.PROJECT_VIEW);
      }
      
      // Para modificação, verificar papel no projeto
      return this.checkProjectAccess(userId, content.projectId, Permission.PROJECT_UPDATE);
    }

    return false;
  }

  /**
   * Verifica se um usuário é administrador de uma organização
   */
  private static async isOrganizationAdmin(
    userId: string,
    organizationId: string
  ): Promise<boolean> {
    const orgMember = await prisma.organizationMember.findFirst({
      where: {
        userId,
        organizationId,
        role: 'admin',
      },
    });

    return !!orgMember;
  }

  /**
   * Concede uma permissão personalizada a um usuário
   */
  static async grantPermission({
    userId,
    resourceType,
    resourceId,
    permission,
    granterId,
  }: {
    userId: string;
    resourceType: string;
    resourceId: string;
    permission: string;
    granterId: string;
  }): Promise<void> {
    // Verificar se o concedente tem permissão para isso
    const canGrant = await this.hasPermission(
      granterId,
      `${resourceType}:update` as Permission,
      resourceId
    );

    if (!canGrant) {
      throw new Error('Not authorized to grant permissions');
    }

    // Criar ou atualizar permissão personalizada
    await prisma.customPermission.upsert({
      where: {
        userId_resourceType_resourceId_permission: {
          userId,
          resourceType,
          resourceId,
          permission,
        },
      },
      update: {
        grantedById: granterId,
        grantedAt: new Date(),
      },
      create: {
        userId,
        resourceType,
        resourceId,
        permission,
        grantedById: granterId,
        grantedAt: new Date(),
      },
    });
  }

  /**
   * Revoga uma permissão personalizada de um usuário
   */
  static async revokePermission({
    userId,
    resourceType,
    resourceId,
    permission,
    revokerId,
  }: {
    userId: string;
    resourceType: string;
    resourceId: string;
    permission: string;
    revokerId: string;
  }): Promise<void> {
    // Verificar se o revogador tem permissão para isso
    const canRevoke = await this.hasPermission(
      revokerId,
      `${resourceType}:update` as Permission,
      resourceId
    );

    if (!canRevoke) {
      throw new Error('Not authorized to revoke permissions');
    }

    // Remover permissão personalizada
    await prisma.customPermission.deleteMany({
      where: {
        userId,
        resourceType,
        resourceId,
        permission,
      },
    });
  }
}
```

### Implementação do Middleware de Autorização

```typescript
// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AuthorizationService, Permission } from '@/lib/auth/authorization';

export function withAuth(
  handler: Function,
  options?: {
    permission?: Permission;
    resourceIdField?: string;
  }
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Verificar sessão
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Se não há requisito de permissão, apenas verificar autenticação
    if (!options?.permission) {
      return handler(req, res);
    }

    // Extrair ID do recurso se aplicável
    let resourceId: string | undefined;

    if (options.resourceIdField) {
      // Buscar no body
      if (req.body && req.body[options.resourceIdField]) {
        resourceId = req.body[options.resourceIdField];
      }
      // Buscar nos query params
      else if (req.query && req.query[options.resourceIdField]) {
        resourceId = req.query[options.resourceIdField] as string;
      }
      // Buscar nos path params
      else if (req.query.id) {
        resourceId = req.query.id as string;
      }
    }

    // Verificar permissão
    const hasPermission = await AuthorizationService.hasPermission(
      session.user.id,
      options.permission,
      resourceId
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Anexar informações de usuário e permissão à requisição
    req.user = session.user;
    req.permission = options.permission;

    // Continuar para o handler
    return handler(req, res);
  };
}
```

### Autenticação JWT

```typescript
// lib/auth/jwt.ts
import jwt from 'jsonwebtoken';
import { createId } from '@paralleldrive/cuid2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

interface TokenPayload {
  sub: string;      // Subject (ID do usuário)
  name?: string;    // Nome do usuário
  email?: string;   // E-mail do usuário
  role?: string;    // Papel/função do usuário
  org?: string;     // Organização do usuário
  jti: string;      // ID único do token (para revogação)
  iat: number;      // Issued at (quando foi emitido)
  exp: number;      // Expiration (quando expira)
}

export class JWTService {
  /**
   * Gera um token JWT para o usuário
   */
  static generateToken(
    userId: string,
    options?: {
      name?: string;
      email?: string;
      role?: string;
      organizationId?: string;
      expiresIn?: string;
    }
  ): string {
    const expiresIn = options?.expiresIn || JWT_EXPIRY;
    
    const payload: Partial<TokenPayload> = {
      sub: userId,
      name: options?.name,
      email: options?.email,
      role: options?.role,
      org: options?.organizationId,
      jti: createId(),
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  /**
   * Verifica e decodifica um token JWT
   * @returns O payload decodificado
   * @throws Se o token for inválido
   */
  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      
      throw error;
    }
  }

  /**
   * Verifica se um token está na lista de revogação
   */
  static async isTokenRevoked(tokenId: string): Promise<boolean> {
    // Em produção, verificar em Redis ou outro armazenamento rápido
    // Exemplo simplificado
    const revokedToken = await prisma.revokedToken.findUnique({
      where: { id: tokenId },
    });

    return !!revokedToken;
  }

  /**
   * Revoga um token específico
   */
  static async revokeToken(
    token: string,
    reason: string = 'user_logout'
  ): Promise<void> {
    try {
      const decoded = this.verifyToken(token);
      
      await prisma.revokedToken.create({
        data: {
          id: decoded.jti,
          userId: decoded.sub,
          expiresAt: new Date(decoded.exp * 1000),
          reason,
          revokedAt: new Date(),
        },
      });
    } catch (error) {
      // Se o token já estiver expirado, não precisa revogar
      if (error.message === 'Token expired') {
        return;
      }
      
      throw error;
    }
  }

  /**
   * Revoga todos os tokens para um usuário
   */
  static async revokeAllUserTokens(
    userId: string,
    reason: string = 'security_concern'
  ): Promise<void> {
    // Em um sistema real, definiria uma entrada na lista de revogação
    // que verifica todos os tokens emitidos antes de um determinado momento
    
    // Exemplo simplificado
    await prisma.revocationEvent.create({
      data: {
        userId,
        timestamp: new Date(),
        reason,
      },
    });
  }
}
```

## Proteção de Dados

### Criptografia em Repouso

O Brainlink implementa criptografia em repouso para proteger dados sensíveis armazenados no banco de dados:

```typescript
// lib/security/encryption.ts
import crypto from 'crypto';

// Chave e IV (Vetor de Inicialização) devem ser armazenados com segurança
// Em produção, usar gerenciamento de chaves (KMS)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-encryption-key'.padEnd(32, '0');
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || 'your-iv-16-chars'.padEnd(16, '0');

export class Encryption {
  /**
   * Criptografa uma string
   */
  static encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      Buffer.from(ENCRYPTION_IV)
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  }

  /**
   * Descriptografa uma string
   */
  static decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY),
      Buffer.from(ENCRYPTION_IV)
    );
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * Gera um hash de uma string (sem possibilidade de reverter)
   */
  static hash(text: string): string {
    return crypto
      .createHash('sha256')
      .update(text)
      .digest('hex');
  }

  /**
   * Gera um hash com salt para maior segurança
   */
  static hashWithSalt(text: string, salt?: string): { hash: string; salt: string } {
    // Gerar salt se não fornecido
    const useSalt = salt || crypto.randomBytes(16).toString('hex');
    
    // Criar hash usando HMAC
    const hmac = crypto.createHmac('sha256', useSalt);
    const hash = hmac.update(text).digest('hex');
    
    return { hash, salt: useSalt };
  }

  /**
   * Verifica se um texto corresponde a um hash com salt
   */
  static verifyHashWithSalt(
    text: string,
    storedHash: string,
    salt: string
  ): boolean {
    const { hash } = this.hashWithSalt(text, salt);
    return hash === storedHash;
  }
}

/**
 /**
 * Transformador Prisma para criptografia automática de campos
 */
export const encryptedField = {
  // Criptografa ao salvar no banco
  toDatabase(value: string): string {
    if (!value) return value;
    return Encryption.encrypt(value);
  },
  
  // Descriptografa ao ler do banco
  fromDatabase(value: string): string {
    if (!value) return value;
    return Encryption.decrypt(value);
  },
};
```

### Segregação de Dados de Múltiplos Inquilinos (Multi-tenancy)

O Brainlink implementa uma abordagem de segregação de dados para garantir que dados de diferentes organizações ou inquilinos permaneçam isolados:

```typescript
// lib/db/tenant.ts
import { PrismaClient } from '@prisma/client';
import { createClient } from '@vercel/kv';

// Cliente Redis/KV para cache
const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

interface TenantContext {
  tenantId: string;
  userId?: string;
  role?: string;
}

export class TenantPrisma extends PrismaClient {
  private tenantContext?: TenantContext;

  /**
   * Define o contexto de inquilino atual
   */
  setTenantContext(context: TenantContext) {
    this.tenantContext = context;
  }

  /**
   * Limpa o contexto de inquilino
   */
  clearTenantContext() {
    this.tenantContext = undefined;
  }

  /**
   * Cria uma nova instância com um contexto específico
   */
  withTenant(context: TenantContext): TenantPrisma {
    const prisma = new TenantPrisma();
    prisma.setTenantContext(context);
    return prisma;
  }

  /**
   * Middleware Prisma para aplicar filtros automáticos de inquilino
   */
  constructor() {
    super({
      // Configurações normais do Prisma
      log: ['error', 'warn'],
    });

    // Adicionar middleware para filtrar dados por inquilino
    this.$use(async (params, next) => {
      // Se não há contexto de inquilino, passar direto
      if (!this.tenantContext) {
        return next(params);
      }

      const { tenantId, userId, role } = this.tenantContext;

      // Aplicar filtros baseados no modelo
      if (params.model) {
        // Tabelas/modelos que têm campo de inquilino (organizationId)
        const modelsWithTenantField = [
          'User',
          'Project',
          'Content',
          'Document',
          'ApiKey',
          'Workflow',
          'Dataset',
        ];

        // Tabelas/modelos que têm filtros de segurança específicos
        const specialFilterModels = {
          'User': (params: any) => this.applyUserFilters(params, tenantId, role),
          'ApiKey': (params: any) => this.applyApiKeyFilters(params, tenantId, userId),
          'AuditLog': (params: any) => this.applyAuditLogFilters(params, tenantId, role),
        };

        // Aplicar filtro especial se existir
        if (specialFilterModels[params.model]) {
          params = specialFilterModels[params.model](params);
        }
        // Aplicar filtro padrão de inquilino
        else if (modelsWithTenantField.includes(params.model)) {
          params = this.applyTenantFilter(params, tenantId);
        }
      }

      // Executar a operação original com os filtros aplicados
      return next(params);
    });
  }

  /**
   * Aplica filtro de inquilino padrão
   */
  private applyTenantFilter(params: any, tenantId: string): any {
    // Operações de leitura
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      // Adicionar filtro de inquilino
      params.args.where = {
        ...params.args.where,
        organizationId: tenantId,
      };
    }
    else if (params.action === 'findMany') {
      // Se não houver where, criar um
      if (!params.args.where) {
        params.args.where = { organizationId: tenantId };
      } else {
        params.args.where = {
          ...params.args.where,
          organizationId: tenantId,
        };
      }
    }
    // Operações de escrita
    else if (params.action === 'create') {
      // Garantir que o registro seja criado com o inquilino correto
      params.args.data = {
        ...params.args.data,
        organizationId: tenantId,
      };
    }
    else if (params.action === 'createMany') {
      // Garantir que todos os registros tenham o inquilino correto
      params.args.data = params.args.data.map((item: any) => ({
        ...item,
        organizationId: tenantId,
      }));
    }
    else if (
      params.action === 'update' ||
      params.action === 'updateMany' ||
      params.action === 'upsert' ||
      params.action === 'delete' ||
      params.action === 'deleteMany'
    ) {
      // Adicionar filtro de inquilino para garantir que só afete dados do inquilino correto
      if (!params.args.where) {
        params.args.where = { organizationId: tenantId };
      } else {
        params.args.where = {
          ...params.args.where,
          organizationId: tenantId,
        };
      }
    }

    return params;
  }

  /**
   * Aplica filtros específicos para usuários
   */
  private applyUserFilters(params: any, tenantId: string, role?: string): any {
    // Administradores podem ver todos os usuários da organização
    if (role === 'admin') {
      return this.applyTenantFilter(params, tenantId);
    }

    // Não-administradores têm restrições adicionais
    if (params.action === 'findMany') {
      if (!params.args.where) {
        params.args.where = {};
      }

      params.args.where = {
        ...params.args.where,
        organizationId: tenantId,
        // Adicionar outros filtros conforme necessário
        // Por exemplo, restringir a certos departamentos ou grupos
      };
    }

    return params;
  }

  /**
   * Aplica filtros específicos para chaves de API
   */
  private applyApiKeyFilters(params: any, tenantId: string, userId?: string): any {
    // Filtro por inquilino
    params = this.applyTenantFilter(params, tenantId);

    // Usuários regulares só podem ver suas próprias chaves de API
    if (userId && params.action === 'findMany') {
      params.args.where = {
        ...params.args.where,
        createdById: userId,
      };
    }

    return params;
  }

  /**
   * Aplica filtros específicos para logs de auditoria
   */
  private applyAuditLogFilters(params: any, tenantId: string, role?: string): any {
    // Administradores podem ver todos os logs da organização
    if (role === 'admin') {
      if (!params.args.where) {
        params.args.where = { organizationId: tenantId };
      } else {
        params.args.where = {
          ...params.args.where,
          organizationId: tenantId,
        };
      }
    } else {
      // Usuários regulares só podem ver logs públicos ou seus próprios
      if (!params.args.where) {
        params.args.where = { 
          organizationId: tenantId,
          OR: [
            { isPublic: true },
            { userId: this.tenantContext?.userId },
          ],
        };
      } else {
        params.args.where = {
          ...params.args.where,
          organizationId: tenantId,
          OR: [
            { isPublic: true },
            { userId: this.tenantContext?.userId },
          ],
        };
      }
    }

    return params;
  }
}

// Exportar instância singleton
export const tenantPrisma = new TenantPrisma();

/**
 * Hook para usar o cliente Prisma com contexto de inquilino
 */
export function useTenantPrisma(context: TenantContext): TenantPrisma {
  return tenantPrisma.withTenant(context);
}
```

### Mascaramento de Dados Sensíveis

```typescript
// lib/security/data-masking.ts
import { Encryption } from './encryption';

// Tipos de dados sensíveis
export enum SensitiveDataType {
  EMAIL = 'email',
  PHONE = 'phone',
  NAME = 'name',
  ADDRESS = 'address',
  CREDIT_CARD = 'credit_card',
  SSN = 'ssn',
  IP_ADDRESS = 'ip_address',
  DOB = 'dob',
}

// Configurações de mascaramento por tipo
const MASKING_RULES: Record<SensitiveDataType, {
  pattern: RegExp;
  maskFn: (match: string) => string;
}> = {
  [SensitiveDataType.EMAIL]: {
    pattern: /([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})/i,
    maskFn: (email) => {
      const [local, domain] = email.split('@');
      return `${local.charAt(0)}${'*'.repeat(local.length - 2)}${local.charAt(local.length - 1)}@${domain}`;
    },
  },
  [SensitiveDataType.PHONE]: {
    pattern: /(\d{3})[\s.-]?(\d{3})[\s.-]?(\d{4})/,
    maskFn: (phone) => {
      return phone.replace(/\d(?=\d{4})/g, '*');
    },
  },
  [SensitiveDataType.NAME]: {
    pattern: /([A-Z][a-z]+)(\s+[A-Z][a-z]+)+/,
    maskFn: (name) => {
      const parts = name.split(' ');
      return parts.map(part => 
        `${part.charAt(0)}${'*'.repeat(part.length - 1)}`
      ).join(' ');
    },
  },
  [SensitiveDataType.ADDRESS]: {
    pattern: /\d+\s+[\w\s,]+/,
    maskFn: (address) => {
      return address.replace(/\d+/, (num) => '*'.repeat(num.length));
    },
  },
  [SensitiveDataType.CREDIT_CARD]: {
    pattern: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/,
    maskFn: (cc) => {
      return cc.replace(/\d(?=\d{4})/g, '*');
    },
  },
  [SensitiveDataType.SSN]: {
    pattern: /\d{3}[\s-]?\d{2}[\s-]?\d{4}/,
    maskFn: (ssn) => {
      return ssn.replace(/\d(?=\d{4})/g, '*');
    },
  },
  [SensitiveDataType.IP_ADDRESS]: {
    pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,
    maskFn: (ip) => {
      const parts = ip.split('.');
      return `${parts[0]}.${parts[1]}.*.*`;
    },
  },
  [SensitiveDataType.DOB]: {
    pattern: /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/,
    maskFn: (dob) => {
      return dob.replace(/\d{1,2}([\/\-])\d{1,2}([\/\-])\d{2,4}/, 
        (_, sep1, sep2) => `**${sep1}**${sep2}****`);
    },
  },
};

export class DataMasking {
  /**
   * Mascara um valor específico com base no tipo
   */
  static maskValue(value: string, type: SensitiveDataType): string {
    if (!value) return value;
    
    const rule = MASKING_RULES[type];
    
    if (!rule) {
      return value;
    }
    
    return value.replace(rule.pattern, (match) => rule.maskFn(match));
  }

  /**
   * Detecção automática e mascaramento de dados sensíveis
   */
  static autoMask(text: string): string {
    if (!text) return text;
    
    let result = text;
    
    // Aplicar cada regra de mascaramento
    Object.entries(MASKING_RULES).forEach(([_, rule]) => {
      result = result.replace(rule.pattern, (match) => rule.maskFn(match));
    });
    
    return result;
  }

  /**
   * Mascara um objeto recursivamente
   */
  static maskObject<T extends object>(
    obj: T,
    fieldsConfig: Record<string, SensitiveDataType>
  ): T {
    if (!obj) return obj;
    
    const result = { ...obj };
    
    // Processar cada campo configurado
    Object.entries(fieldsConfig).forEach(([field, type]) => {
      // Tratar campos aninhados usando notação de ponto (e.g., 'user.contact.email')
      const fieldPath = field.split('.');
      
      if (fieldPath.length === 1) {
        const simpleField = fieldPath[0];
        if (simpleField in result && typeof result[simpleField] === 'string') {
          result[simpleField] = this.maskValue(result[simpleField], type);
        }
      } else {
        this.setNestedField(result, fieldPath, type);
      }
    });
    
    return result;
  }

  /**
   * Auxiliar para mascarat campos aninhados
   */
  private static setNestedField(
    obj: any,
    path: string[],
    type: SensitiveDataType
  ): void {
    let current = obj;
    
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!(key in current)) return;
      current = current[key];
    }
    
    const lastKey = path[path.length - 1];
    
    if (lastKey in current && typeof current[lastKey] === 'string') {
      current[lastKey] = this.maskValue(current[lastKey], type);
    }
  }

  /**
   * Mascara dados em logs
   */
  static maskSensitiveDataInLogs(logData: any): any {
    if (!logData) return logData;
    
    // Configuração padrão para mascarar em logs
      static maskSensitiveDataInLogs(logData: any): any {
    if (!logData) return logData;
    
    // Configuração padrão para mascarar em logs
    const sensitiveFields = {
      'email': SensitiveDataType.EMAIL,
      'phone': SensitiveDataType.PHONE,
      'phoneNumber': SensitiveDataType.PHONE,
      'name': SensitiveDataType.NAME,
      'address': SensitiveDataType.ADDRESS,
      'creditCard': SensitiveDataType.CREDIT_CARD,
      'ssn': SensitiveDataType.SSN,
      'socialSecurityNumber': SensitiveDataType.SSN,
      'ipAddress': SensitiveDataType.IP_ADDRESS,
      'ip': SensitiveDataType.IP_ADDRESS,
      'dateOfBirth': SensitiveDataType.DOB,
      'dob': SensitiveDataType.DOB,
      'password': SensitiveDataType.NAME, // Tratar senhas como nomes para mascarar
      'token': SensitiveDataType.NAME, // Tratar tokens como nomes para mascarar
      'secret': SensitiveDataType.NAME, // Tratar segredos como nomes para mascarar
      'apiKey': SensitiveDataType.NAME, // Tratar chaves de API como nomes para mascarar
    };
    
    if (typeof logData === 'string') {
      return this.autoMask(logData);
    }
    
    if (Array.isArray(logData)) {
      return logData.map(item => this.maskSensitiveDataInLogs(item));
    }
    
    if (typeof logData === 'object' && logData !== null) {
      const result = { ...logData };
      
      for (const [key, value] of Object.entries(result)) {
        // Checar se é um campo sensível conhecido
        const lowercaseKey = key.toLowerCase();
        const sensitiveType = Object.keys(sensitiveFields).find(
          field => lowercaseKey.includes(field.toLowerCase())
        );
        
        if (sensitiveType && typeof value === 'string') {
          result[key] = this.maskValue(value, sensitiveFields[sensitiveType]);
        } else if (typeof value === 'object' && value !== null) {
          result[key] = this.maskSensitiveDataInLogs(value);
        }
      }
      
      return result;
    }
    
    return logData;
  }
}
```

## Proteção contra Ameaças Web

### Proteção CSRF

O Brainlink implementa proteção contra Cross-Site Request Forgery (CSRF) usando tokens e verificação de origem:

```typescript
// lib/security/csrf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import cookie from 'cookie';

// Tempo de vida do token em segundos (1 hora)
const CSRF_TOKEN_TTL = 3600;

// Nome do cookie
const CSRF_COOKIE_NAME = 'brainlink_csrf';

export class CSRFProtection {
  /**
   * Gera um token CSRF para o usuário
   */
  static generateToken(userId: string): string {
    // Gerar um token aleatório
    const randomToken = crypto.randomBytes(32).toString('hex');
    
    // Timestamp de expiração
    const expires = Math.floor(Date.now() / 1000) + CSRF_TOKEN_TTL;
    
    // Dados para assinar
    const data = `${randomToken}|${userId}|${expires}`;
    
    // Assinar o token
    const signature = crypto
      .createHmac('sha256', process.env.CSRF_SECRET || 'csrf-secret-key')
      .update(data)
      .digest('hex');
    
    // Formato final: token|userId|expires|signature
    return `${randomToken}|${userId}|${expires}|${signature}`;
  }

  /**
   * Verifica se um token CSRF é válido
   */
  static verifyToken(token: string, userId: string): boolean {
    // Verificar formato do token
    const parts = token.split('|');
    
    if (parts.length !== 4) {
      return false;
    }
    
    const [randomToken, tokenUserId, expiresStr, signature] = parts;
    
    // Verificar ID do usuário
    if (tokenUserId !== userId) {
      return false;
    }
    
    // Verificar expiração
    const expires = parseInt(expiresStr, 10);
    const now = Math.floor(Date.now() / 1000);
    
    if (now > expires) {
      return false;
    }
    
    // Verificar assinatura
    const data = `${randomToken}|${userId}|${expires}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CSRF_SECRET || 'csrf-secret-key')
      .update(data)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Define o cookie CSRF na resposta
   */
  static setCookie(res: NextApiResponse, token: string): void {
    res.setHeader(
      'Set-Cookie',
      cookie.serialize(CSRF_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: CSRF_TOKEN_TTL,
      })
    );
  }

  /**
   * Obtém o token CSRF do request
   */
  static getTokenFromRequest(req: NextApiRequest): string | null {
    // Verificar em cookies
    if (req.cookies && req.cookies[CSRF_COOKIE_NAME]) {
      return req.cookies[CSRF_COOKIE_NAME];
    }
    
    // Verificar no cabeçalho
    if (req.headers['x-csrf-token']) {
      return req.headers['x-csrf-token'] as string;
    }
    
    // Verificar no corpo da requisição
    if (req.body && req.body._csrf) {
      return req.body._csrf;
    }
    
    return null;
  }
}

/**
 * Middleware para proteção CSRF
 */
export function withCSRF(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Ignorar métodos GET, HEAD e OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method || '')) {
      return handler(req, res);
    }
    
    // Verificar origem
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    
    // Em produção, verificar origens permitidas
    if (process.env.NODE_ENV === 'production') {
      const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
      
      if (origin && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: 'Invalid origin' });
      }
      
      if (referer) {
        const refererUrl = new URL(referer);
        if (!allowedOrigins.includes(refererUrl.origin)) {
          return res.status(403).json({ error: 'Invalid referer' });
        }
      }
    }
    
    // Verificar token CSRF
    // Obs: Aqui assumimos que o usuário já foi autenticado
    // e o ID do usuário está disponível em req.user.id
    if (req.user?.id) {
      const token = CSRFProtection.getTokenFromRequest(req);
      
      if (!token) {
        return res.status(403).json({ error: 'CSRF token missing' });
      }
      
      const isValid = CSRFProtection.verifyToken(token, req.user.id);
      
      if (!isValid) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
      }
    }
    
    return handler(req, res);
  };
}
```

### Proteção Rate Limiting

O sistema implementa limite de taxa para prevenir ataques de força bruta e DoS:

```typescript
// lib/security/rate-limit.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@vercel/kv';
import { getClientIp } from 'request-ip';

// Cliente Redis para armazenar contadores
const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

interface RateLimitOptions {
  // Número de requisições permitidas no período
  limit: number;
  
  // Período em segundos
  windowMs: number;
  
  // Identificador da rota/recurso
  identifier: string;
  
  // Tipo de identificador (ip, user, etc)
  keyType?: 'ip' | 'user' | 'custom';
  
  // Função para extrair a chave de um request customizado
  keyGenerator?: (req: NextApiRequest) => string;
  
  // Mensagem de erro
  message?: string;
}

export class RateLimit {
  /**
   * Verifica se uma requisição excede o limite de taxa
   */
  static async check(
    req: NextApiRequest,
    options: RateLimitOptions
  ): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    // Gerar chave para o contador
    const key = await this.generateKey(req, options);
    
    // Obter timestamp atual
    const now = Math.floor(Date.now() / 1000);
    
    // Calcular janela de tempo
    const windowStart = now - (now % Math.floor(options.windowMs / 1000));
    const windowEnd = windowStart + Math.floor(options.windowMs / 1000);
    
    // Chave completa para Redis
    const redisKey = `ratelimit:${options.identifier}:${key}:${windowStart}`;
    
    try {
      // Incrementar contador
      const count = await kv.incr(redisKey);
      
      // Definir expiração (se ainda não existir)
      if (count === 1) {
        await kv.expire(redisKey, Math.floor(options.windowMs / 1000) * 2);
      }
      
      // Verificar se excede o limite
      const remaining = Math.max(0, options.limit - count);
      
      return {
        success: count <= options.limit,
        limit: options.limit,
        remaining,
        reset: windowEnd,
      };
    } catch (error) {
      console.error('Rate limit error:', error);
      
      // Erro ao verificar limite, permitir para evitar falsos positivos
      return {
        success: true,
        limit: options.limit,
        remaining: 1,
        reset: windowEnd,
      };
    }
  }

  /**
   * Gera uma chave para o rate limit baseada no tipo
   */
  private static async generateKey(
    req: NextApiRequest,
    options: RateLimitOptions
  ): Promise<string> {
    const { keyType = 'ip', keyGenerator } = options;
    
    // Usar gerador customizado se fornecido
    if (keyGenerator) {
      return keyGenerator(req);
    }
    
    // Gerar baseado no tipo
    switch (keyType) {
      case 'user':
        // Usar ID do usuário se autenticado
        return req.user?.id || 'anonymous';
      
      case 'ip':
      default:
        // Usar IP do cliente
        const clientIp = getClientIp(req) || '127.0.0.1';
        return clientIp;
    }
  }
}

/**
 * Middleware para aplicar rate limit
 */
export function withRateLimit(options: Partial<RateLimitOptions>) {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    // Configurações padrão
    const defaultOptions: RateLimitOptions = {
      limit: 100,
      windowMs: 60 * 1000, // 1 minuto
      identifier: req.url || 'default',
      keyType: 'ip',
      message: 'Too many requests, please try again later.',
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    // Verificar limite
    const result = await RateLimit.check(req, finalOptions);
    
    // Definir cabeçalhos de rate limit
    res.setHeader('X-RateLimit-Limit', String(result.limit));
    res.setHeader('X-RateLimit-Remaining', String(result.remaining));
    res.setHeader('X-RateLimit-Reset', String(result.reset));
    
    // Se exceder o limite, retornar erro
    if (!result.success) {
      return res
        .status(429)
        .json({ error: finalOptions.message || 'Rate limit exceeded' });
    }
    
    // Continuar para o próximo middleware/handler
    if (next) {
      return next();
    }
    
    return;
  };
}
```

### Validação de Entrada

O sistema implementa validação rigorosa de entrada para prevenir injeções e outros ataques:

```typescript
// lib/security/input-validation.ts
import { z } from 'zod';
import { NextApiRequest, NextApiResponse } from 'next';
import sanitizeHtml from 'sanitize-html';
import { createId } from '@paralleldrive/cuid2';

/**
 * Middleware para validação com Zod
 */
export function validateRequest<T>(schema: z.Schema<T>) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: (validatedData?: T) => Promise<void>
  ) => {
    try {
      // Validar corpo da requisição
      const data = await schema.parseAsync(req.body);
      
      // Continuar para o próximo middleware com dados validados
      return next(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.format();
        return res.status(400).json({
          error: 'Validation failed',
          validationErrors: formattedErrors,
        });
      }
      
      return res.status(400).json({ error: 'Invalid input data' });
    }
  };
}

/**
 * Sanitiza um texto HTML para prevenir XSS
 */
export function sanitizeHTML(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li',
      'strong', 'em', 'b', 'i', 'a', 'br', 'span', 'div', 'code',
      'pre', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel', 'title'],
      'img': ['src', 'alt', 'title', 'width', 'height
            'a': ['href', 'target', 'rel', 'title'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'div': ['class', 'id'],
      'span': ['class', 'id'],
      'code': ['class'],
      'pre': ['class'],
      'th': ['scope', 'colspan', 'rowspan'],
      'td': ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    selfClosing: ['img', 'br'],
    // Transformar URLs com scheme não permitido
    transformTags: {
      'a': (tagName, attribs) => {
        if (attribs.href && !attribs.href.startsWith('http') && 
            !attribs.href.startsWith('https') && 
            !attribs.href.startsWith('mailto')) {
          return {
            tagName,
            attribs: {
              ...attribs,
              href: '#',
              'data-original-href': attribs.href,
              rel: 'nofollow noopener',
            },
          };
        }
        return { tagName, attribs: { ...attribs, rel: 'nofollow noopener' } };
      },
    },
  });
}

/**
 * Gera um ID seguro para uso em URLs e identificadores
 */
export function generateSecureId(prefix?: string): string {
  return `${prefix ? prefix + '_' : ''}${createId()}`;
}

/**
 * Validador para URLs seguras
 */
export function validateUrl(
  url: string,
  options?: {
    allowedDomains?: string[];
    allowRelative?: boolean;
  }
): boolean {
  try {
    // Verificar se é URL relativa
    if (url.startsWith('/') && options?.allowRelative) {
      return true;
    }
    
    // Parse da URL
    const parsedUrl = new URL(url);
    
    // Verificar protocolo
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return false;
    }
    
    // Verificar domínios permitidos
    if (options?.allowedDomains && options.allowedDomains.length > 0) {
      return options.allowedDomains.some(domain => 
        parsedUrl.hostname === domain || 
        parsedUrl.hostname.endsWith(`.${domain}`)
      );
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Previne SQLi sanitizando strings para uso em queries diretas
 * (Obs: Prisma já protege contra SQLi, isso é uma camada extra)
 */
export function escapeSQL(value: string): string {
  if (!value) return value;
  
  // Escapar caracteres especiais
  return value
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\')
    .replace(/\x00/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x1a/g, '\\Z');
}
```

### Headers de Segurança

O sistema configura diversos headers HTTP para elevar a segurança:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Obter resposta existente ou criar nova
  const response = NextResponse.next();
  
  // Definir cabeçalhos de segurança
  
  // Content-Security-Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      // Fontes de scripts permitidas
      "script-src 'self' https://cdn.brainlink.app https://apis.google.com 'unsafe-inline'",
      // Fontes de estilos permitidas
      "style-src 'self' https://cdn.brainlink.app https://fonts.googleapis.com 'unsafe-inline'",
      // Fontes de imagens permitidas
      "img-src 'self' https://cdn.brainlink.app https://storage.googleapis.com data: blob:",
      // Fontes de conectividade permitidas
      "connect-src 'self' https://api.brainlink.app https://www.googleapis.com wss://realtime.brainlink.app",
      // Fontes permitidas
      "font-src 'self' https://cdn.brainlink.app https://fonts.gstatic.com",
      // Media
      "media-src 'self' https://cdn.brainlink.app",
      // Object
      "object-src 'none'",
      // Default
      "default-src 'self'",
      // Frame
      "frame-ancestors 'self'",
      // Base URI
      "base-uri 'self'",
      // Form action
      "form-action 'self'",
      // Manifest
      "manifest-src 'self'",
    ].join('; ')
  );
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  
  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy (antigo Feature-Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), accelerometer=(), autoplay=(), payment=()'
  );
  
  // Strict-Transport-Security
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Configuração de rotas para aplicar o middleware
     * Matcher para todas as rotas exceto:
     * - Arquivos estáticos (/_next/, /images/, etc)
     * - Rotas de API (_next/data, etc)
     */
    '/((?!_next/|_vercel|api/health|images/|favicon.ico).*)',
  ],
};
```

## Arquivos de Configuração de Segurança

Abaixo estão os arquivos de configuração para guardrails de segurança:

### Configuração de CSP (Content Security Policy)

```json
// public/.well-known/security.txt
Contact: mailto:security@brainlink.com
Expires: 2025-12-31T23:59:59+00:00
Encryption: https://brainlink.com/pgp-key.txt
Acknowledgements: https://brainlink.com/security/hall-of-fame
Preferred-Languages: en, pt-BR
Canonical: https://brainlink.com/.well-known/security.txt
Policy: https://brainlink.com/security/policy
Hiring: https://brainlink.com/careers/security
```

### Configuração de Política de Segurança

```typescript
// lib/security/config.ts
export const securityConfig = {
  // Configurações de senhas
  passwords: {
    minLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
    maxRepeatingChars: 3,
    passwordHistory: 5,
    expiryDays: 90,
    notifyExpiryDays: 14,
  },
  
  // Configurações de sessão
  session: {
    expiryMinutes: 60,
    extendOnActivity: true,
    idleTimeoutMinutes: 30,
    maxSessionsPerUser: 5,
    enforceSingleSession: false,
  },
  
  // Configurações MFA
  mfa: {
    requiredForAdmin: true,
    requiredForSensitiveOps: true,
    allowedMethods: ['totp', 'sms', 'email', 'security_key'],
    gracePeriodDays: 7,
  },
  
  // Configurações para limitação de taxa
  rateLimit: {
    login: {
      points: 5,
      duration: 10 * 60, // 10 minutos
    },
    api: {
      authenticated: {
        points: 1000,
        duration: 60 * 60, // 1 hora
      },
      public: {
        points: 100,
        duration: 60 * 60, // 1 hora
      },
    },
    registration: {
      points: 3,
      duration: 60 * 60, // 1 hora
    },
  },
  
  // Domínios permitidos para CORS
  allowedOrigins: [
    'https://brainlink.com',
    'https://app.brainlink.com',
    'https://api.brainlink.com',
  ],
  
  // Domínios permitidos para redirecionamento
  allowedRedirectDomains: [
    'brainlink.com',
    'app.brainlink.com',
    'docs.brainlink.com',
  ],
  
  // Regras para uploads de arquivos
  fileUploads: {
    maxSizeMB: 50,
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/json',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    scanForMalware: true,
    rejectExecutables: true,
  },
  
  // Configurações para prevenção de força bruta
  bruteForceProtection: {
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 30,
    resetFailedAttemptsAfterHours: 24,
    notifyUserAfterAttempts: 3,
  },
};
```

## Verificações de Segurança Automatizadas

### Testes de Segurança Automatizados

```typescript
// tests/security/auth.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/db/prisma';
import { IdentityService } from '@/lib/auth/identity';
import { JWTService } from '@/lib/auth/jwt';

describe('Autenticação e Segurança', () => {
  let userId: string;
  let userEmail: string;
  
  beforeAll(async () => {
    // Criar usuário de teste
    userId = createId();
    userEmail = `test-${Math.random().toString(36).substring(2)}@example.com`;
    
    await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        name: 'Test User',
        password: await hash('Test@Password123', 12),
        role: 'user',
        failedLoginAttempts: 0,
        locked: false,
        mfaEnabled: false,
      },
    });
  });
  
  afterAll(async () => {
    // Limpar usuário de teste
    await prisma.user.delete({
      where: { id: userId },
    });
  });
  
  test('Não permite login com credenciais inválidas', async () => {
    await expect(
      IdentityService.authenticateWithPassword({
        email: userEmail,
        password: 'wrong-password',
      })
    ).rejects.toThrow('Invalid credentials');
  });
  
  test('Incrementa contador de falhas em login inválido', async () => {
    // Tentar login com senha errada
    try {
      await IdentityService.authenticateWithPassword({
        email: userEmail,
        password: 'wrong-password',
      });
    } catch (e) {
      // Ignorar erro esperado
    }
    
    // Verificar contador de falhas
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    expect(user?.failedLoginAttempts).toBeGreaterThan(0);
  });
  
  test('Bloqueia conta após múltiplas tentativas', async () => {
    // Definir contador alto
    await prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 4 },
    });
    
    // Tentar login com senha errada
    try {
      await IdentityService.authenticateWithPassword({
        email: userEmail,
        password: 'wrong-password',
      });
    } catch (e) {
      // Ignorar erro esperado
    }
    
    // Verificar se conta foi bloqueada
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    expect(user?.locked).toBe(true);
  });
  
  test('Não permite login com conta bloqueada', async () => {
    // Bloquear conta
    await prisma.user.update({
      where: { id: userId },
      data: { locked: true },
    });
    
    // Tentar login
    await expect(
      IdentityService.authenticateWithPassword({
        email: userEmail,
        password: 'Test@Password123',
      })
    ).rejects.toThrow('Account is locked');
    
    // Desbloquear para outros testes
    await prisma.user.update({
      where: { id: userId },
      data: { locked: false, failedLoginAttempts: 0 },
    });
  });
  
  test('Reseta contador após login bem-sucedido', async () => {
    // Definir contador
    await prisma.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 2 },
    });
    
    // Login válido
    await IdentityService.authenticateWithPassword({
      email: userEmail,
      password: 'Test@Password123',
    });
    
    // Verificar contador
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    expect(user?.failedLoginAttempts).toBe(0);
  });
  
  test('JWT tokens podem ser verificados', async () => {
    // Gerar token
    const token = JWTService.generateToken(userId, {
      name: 'Test User',
      email: userEmail,
      role: 'user',
    });
    
    // Verificar token
    const payload = JWTService.verifyToken(token);
    
    expect(payload.sub).toBe(userId);
    expect(payload.email).toBe(userEmail);
  });
  
  test('JWT tokens expirados são rejeitados', async () => {
        // Gerar token com expiração curta
    const token = JWTService.generateToken(userId, {
      expiresIn: '1ms', // Expira imediatamente
    });
    
    // Esperar um pouco para garantir que expirou
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Verificar token
    await expect(() => JWTService.verifyToken(token)).toThrow('Token expired');
  });
});
```

### Configuração do SAST (Static Application Security Testing)

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * 0'  # Todo domingo à meia-noite

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
      
      - name: Run npm audit
        run: npm audit --audit-level=high
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
      - name: Run ESLint Security Plugin
        run: npx eslint . --ext .ts,.tsx --config .eslintrc.security.js
        
      - name: Run SonarQube Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Configuração do ESLint para Segurança

```javascript
// .eslintrc.security.js
module.exports = {
  extends: [
    'plugin:security/recommended',
    'plugin:react-security/recommended',
  ],
  plugins: [
    'security',
    'react-security',
    'no-secrets',
    'no-unsanitized',
    'xss',
  ],
  rules: {
    'no-secrets/no-secrets': ['error', { additionalRegexes: {
      'AWS key': 'AKIA[0-9A-Z]{16}',
      'API key': '([A-Za-z0-9]{32})',
      'Private key': '-----BEGIN PRIVATE KEY-----',
    }}],
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-object-injection': 'warn',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-unsafe-regex': 'error',
    'xss/no-location-href-assign': 'error',
    'xss/no-mixed-html': 'error',
    'no-unsanitized/method': 'error',
    'no-unsanitized/property': 'error',
    'react-security/no-dangerously-set-innerhtml': 'error',
    'react-security/no-find-dom-node': 'error',
    'react-security/no-javascript-urls': 'error',
    'react-security/no-refs': 'error',
  },
};
```

## Auditoria e Logging de Segurança

O Brainlink implementa um sistema abrangente de auditoria e logging para garantir a rastreabilidade de ações e detectar possíveis problemas de segurança:

```typescript
// lib/security/audit.ts
import { prisma } from '@/lib/db/prisma';
import { createId } from '@paralleldrive/cuid2';
import { getClientIp } from 'request-ip';
import { NextApiRequest } from 'next';
import { DataMasking } from './data-masking';

export enum AuditAction {
  // Ações de autenticação
  LOGIN_SUCCESS = 'auth.login.success',
  LOGIN_FAILURE = 'auth.login.failure',
  LOGOUT = 'auth.logout',
  PASSWORD_CHANGE = 'auth.password.change',
  PASSWORD_RESET_REQUEST = 'auth.password.reset.request',
  PASSWORD_RESET_COMPLETE = 'auth.password.reset.complete',
  MFA_ENABLED = 'auth.mfa.enabled',
  MFA_DISABLED = 'auth.mfa.disabled',
  MFA_CHALLENGE = 'auth.mfa.challenge',
  
  // Ações de gerenciamento de usuários
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_PERMISSION_GRANT = 'user.permission.grant',
  USER_PERMISSION_REVOKE = 'user.permission.revoke',
  
  // Ações de gerenciamento de organizações
  ORG_CREATE = 'org.create',
  ORG_UPDATE = 'org.update',
  ORG_DELETE = 'org.delete',
  ORG_USER_ADD = 'org.user.add',
  ORG_USER_REMOVE = 'org.user.remove',
  ORG_USER_ROLE_CHANGE = 'org.user.role.change',
  
  // Ações de gerenciamento de projetos
  PROJECT_CREATE = 'project.create',
  PROJECT_UPDATE = 'project.update',
  PROJECT_DELETE = 'project.delete',
  PROJECT_SHARE = 'project.share',
  PROJECT_UNSHARE = 'project.unshare',
  
  // Ações de dados sensíveis
  SENSITIVE_DATA_ACCESS = 'data.sensitive.access',
  SENSITIVE_DATA_EXPORT = 'data.sensitive.export',
  
  // Ações de integração com IA
  AI_MODEL_USE = 'ai.model.use',
  AI_PROMPT_CREATE = 'ai.prompt.create',
  AI_PROMPT_MODIFY = 'ai.prompt.modify',
  
  // Ações administrativas
  ADMIN_CONFIG_CHANGE = 'admin.config.change',
  ADMIN_USER_IMPERSONATION = 'admin.user.impersonation',
  ADMIN_SUPPORT_ACCESS = 'admin.support.access',
  
  // Ações de segurança
  SECURITY_ALERT_TRIGGERED = 'security.alert.triggered',
  SECURITY_SETTING_CHANGE = 'security.setting.change',
  API_KEY_CREATE = 'security.apikey.create',
  API_KEY_REVOKE = 'security.apikey.revoke',
  
  // Ações de sistema
  SYSTEM_ERROR = 'system.error',
  DATA_BACKUP = 'system.data.backup',
  DATA_RESTORE = 'system.data.restore',
}

export class AuditService {
  /**
   * Registra uma atividade no log de auditoria
   */
  static async logActivity({
    action,
    userId,
    organizationId,
    resourceType,
    resourceId,
    details,
    ipAddress,
    userAgent,
    success = true,
    severity = 'info',
    isPublic = false,
    request,
  }: {
    action: AuditAction;
    userId?: string;
    organizationId?: string;
    resourceType?: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    isPublic?: boolean;
    request?: NextApiRequest;
  }): Promise<void> {
    try {
      // Extrair informações do request se fornecido
      if (request) {
        if (!ipAddress) {
          ipAddress = getClientIp(request) || undefined;
        }
        if (!userAgent) {
          userAgent = request.headers['user-agent'] || undefined;
        }
        if (!userId && request.user?.id) {
          userId = request.user.id;
        }
      }
      
      // Mascarar dados sensíveis
      const maskedDetails = details ? 
        DataMasking.maskSensitiveDataInLogs(details) : 
        undefined;
      
      // Determinar nível de severidade baseado na ação
      // se não foi explicitamente fornecido
      if (!severity) {
        severity = this.determineSeverity(action);
      }
      
      // Salvar no banco de dados
      await prisma.auditLog.create({
        data: {
          id: createId(),
          timestamp: new Date(),
          action,
          userId,
          organizationId,
          resourceType,
          resourceId,
          details: maskedDetails,
          ipAddress,
          userAgent,
          success,
          severity,
          isPublic,
        },
      });
      
      // Se for uma ação crítica, também notificar
      if (severity === 'critical' || 
         (severity === 'error' && !success)) {
        await this.notifyCriticalEvent({
          action,
          userId,
          organizationId,
          details: maskedDetails,
          success,
        });
      }
    } catch (error) {
      // Não deixar falhas de auditoria interromperem a operação
      console.error('Failed to log audit event:', error);
    }
  }

  /**
   * Determina severidade baseada no tipo de ação
   */
  private static determineSeverity(action: AuditAction): 'info' | 'warning' | 'error' | 'critical' {
    // Ações críticas (alto impacto de segurança)
    const criticalActions = [
      AuditAction.ADMIN_USER_IMPERSONATION,
      AuditAction.ADMIN_SUPPORT_ACCESS,
      AuditAction.SECURITY_ALERT_TRIGGERED,
      AuditAction.DATA_RESTORE,
    ];
    
    // Ações de erro (potencial impacto negativo)
    const errorActions = [
      AuditAction.LOGIN_FAILURE,
      AuditAction.SYSTEM_ERROR,
      AuditAction.SENSITIVE_DATA_EXPORT,
    ];
    
    // Ações de alerta (mudanças significativas)
    const warningActions = [
      AuditAction.USER_DELETE,
      AuditAction.ORG_DELETE,
      AuditAction.PROJECT_DELETE,
      AuditAction.PASSWORD_CHANGE,
      AuditAction.PASSWORD_RESET_REQUEST,
      AuditAction.API_KEY_CREATE,
      AuditAction.SECURITY_SETTING_CHANGE,
    ];
    
    if (criticalActions.includes(action)) {
      return 'critical';
    }
    
    if (errorActions.includes(action)) {
      return 'error';
    }
    
    if (warningActions.includes(action)) {
      return 'warning';
    }
    
    return 'info';
  }

  /**
   * Notifica sobre eventos críticos
   */
  private static async notifyCriticalEvent({
    action,
    userId,
    organizationId,
    details,
    success,
  }: {
    action: AuditAction;
    userId?: string;
    organizationId?: string;
    details?: any;
    success: boolean;
  }): Promise<void> {
    // Buscar emails dos administradores
    const adminEmails = await this.getAdminEmails(organizationId);
    
    // Em um sistema real, enviar email, SMS ou notificação
    console.log(`[CRITICAL EVENT] Action: ${action}, Success: ${success}`);
    console.log(`Details:`, details);
    console.log(`Would notify: ${adminEmails.join(', ')}`);
  }

  /**
   * Obtém emails dos administradores
   */
  private static async getAdminEmails(
    organizationId?: string
  ): Promise<string[]> {
    // Se tiver ID da organização, buscar admins da organização
    if (organizationId) {
      const orgAdmins = await prisma.user.findMany({
        where: {
          organizationId,
          role: 'admin',
        },
        select: {
          email: true,
        },
      });
      
      return orgAdmins.map(admin => admin.email);
    }
    
    // Caso contrário, buscar admins do sistema
    const sysAdmins = await prisma.user.findMany({
      where: {
        role: 'admin',
      },
      select: {
        email: true,
      },
    });
    
    return sysAdmins.map(admin => admin.email);
  }

  /**
   * Busca logs de auditoria
   */
  static async getAuditLogs({
    userId,
    organizationId,
    action,
    resourceType,
    resourceId,
    startDate,
    endDate,
    severity,
    limit = 100,
    offset = 0,
    requesterUserId,
  }: {
    userId?: string;
    organizationId?: string;
    action?: AuditAction;
    resourceType?: string;
    resourceId?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: 'info' | 'warning' | 'error' | 'critical';
    limit?: number;
    offset?: number;
    requesterUserId: string; // ID do usuário fazendo a requisição
  }): Promise<{
    logs: any[];
    total: number;
  }> {
    // Verificar permissões
    const requester = await prisma.user.findUnique({
      where: { id: requesterUserId },
      select: { role: true, organizationId: true },
    });
    
    if (!requester) {
      throw new Error('User not found');
    }
    
    // Construir filtros
    const filters: any = {};
    
    // Aplicar filtros de tempo
    if (startDate) {
      filters.timestamp = { gte: startDate };
    }
    
    if (endDate) {
      filters.timestamp = { 
        ...filters.timestamp,
        lte: endDate,
      };
    }
    
    // Filtros específicos
    if (action) {
      filters.action = action;
    }
    
    if (resourceType) {
      filters.resourceType = resourceType;
    }
    
    if (resourceId) {
      filters.resourceId = resourceId;
    }
    
    if (severity) {
      filters.severity = severity;
    }
    
    // Filtrar por visibilidade
    if (requester.role !== 'admin') {
      // Não-administradores só veem logs públicos ou seus próprios
      filters.OR = [
        { isPublic: true },
        { userId: requesterUserId },
      ];
      
           // E apenas da sua organização
      if (requester.organizationId) {
        filters.organizationId = requester.organizationId;
      }
    } else if (organizationId) {
      // Administradores podem filtrar por organização
      filters.organizationId = organizationId;
    }
    
    // Se for usuário normal e especificar userId diferente do seu,
    // verificar se tem permissão
    if (requester.role !== 'admin' && userId && userId !== requesterUserId) {
      filters.userId = requesterUserId; // Sobrescrever para mostrar apenas os próprios
    } else if (userId) {
      filters.userId = userId;
    }
    
    // Consultar logs
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: filters,
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({
        where: filters,
      }),
    ]);
    
    return {
      logs,
      total,
    };
  }
}

/**
 * Middleware para adicionar auditoria automaticamente
 */
export function withAudit(
  handler: Function,
  options: {
    action: AuditAction;
    resourceType?: string;
    getResourceId?: (req: NextApiRequest) => string | undefined;
    getDetails?: (req: NextApiRequest, result: any) => any;
    isPublic?: boolean;
    severity?: 'info' | 'warning' | 'error' | 'critical';
  }
) {
  return async (req: NextApiRequest, res: any) => {
    // Capturar resposta original
    const originalJson = res.json;
    let result: any;
    let success = true;
    
    // Sobrescrever método json para capturar resultado
    res.json = function(body: any) {
      result = body;
      originalJson.call(this, body);
      return this;
    };
    
    try {
      // Executar handler
      await handler(req, res);
      
      // Determinar sucesso baseado no status code
      success = res.statusCode >= 200 && res.statusCode < 400;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      // Sempre registrar auditoria
      const resourceId = options.getResourceId ? 
        options.getResourceId(req) : 
        req.query.id as string;
      
      const details = options.getDetails ? 
        options.getDetails(req, result) : 
        undefined;
      
      await AuditService.logActivity({
        action: options.action,
        resourceType: options.resourceType,
        resourceId,
        details,
        success,
        severity: options.severity,
        isPublic: options.isPublic,
        request: req,
      });
    }
  };
}
```

## Modelo de Ameaças

O Brainlink utilizou a metodologia STRIDE para modelagem de ameaças, identificando e mitigando os seguintes tipos de ameaças:

### Spoofing (Falsificação de Identidade)
- **Ameaça**: Ataque de phishing, roubo de credenciais, falsificação de sessão
- **Mitigação**: Autenticação multifator, tokens de sessão seguros, headers de segurança HTTP, política de senhas fortes

### Tampering (Adulteração)
- **Ameaça**: Manipulação de dados durante transferência, injeção de conteúdo malicioso
- **Mitigação**: Assinatura digital de conteúdo crítico, validação de entrada rigorosa, HTTPS, integridade referencial no banco de dados

### Repudiation (Repúdio)
- **Ameaça**: Negação de ações realizadas, disputa de transações
- **Mitigação**: Sistema de auditoria abrangente, logs criptograficamente assinados, registro de atividades sensíveis

### Information Disclosure (Vazamento de Informação)
- **Ameaça**: Vazamento de dados sensíveis, acesso indevido a informações
- **Mitigação**: Criptografia de dados em repouso e em trânsito, mascaramento de dados sensíveis, isolamento multi-tenant, validação de autorizações

### Denial of Service (Negação de Serviço)
- **Ameaça**: Sobrecarga do sistema, consumo excessivo de recursos
- **Mitigação**: Rate limiting, timeout para operações longas, monitoramento proativo, arquitetura escalável

### Elevation of Privilege (Elevação de Privilégio)
- **Ameaça**: Exploração de vulnerabilidades para ganhar acesso indevido
- **Mitigação**: Princípio do menor privilégio, RBAC/ABAC, verificação de autorização em cada ação, isolamento de componentes

## Proteção de Dados Pessoais e Conformidade

### Conformidade com LGPD e GDPR

O Brainlink implementa mecanismos para garantir conformidade com regulamentações de proteção de dados:

```typescript
// lib/privacy/data-subject.ts
import { prisma } from '@/lib/db/prisma';
import { createId } from '@paralleldrive/cuid2';
import { AuditService, AuditAction } from '@/lib/security/audit';

export enum DataSubjectRequestType {
  ACCESS = 'access',         // Acesso aos dados
  RECTIFICATION = 'rectification', // Correção de dados
  ERASURE = 'erasure',       // Remoção de dados
  RESTRICTION = 'restriction',   // Restrição de processamento
  PORTABILITY = 'portability',   // Portabilidade de dados
  OBJECTION = 'objection',     // Objeção ao processamento
}

export enum DataSubjectRequestStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export class DataSubjectService {
  /**
   * Registra uma nova requisição de titular de dados
   */
  static async createRequest({
    userId,
    requestType,
    details,
    requestedBy,
  }: {
    userId: string;
    requestType: DataSubjectRequestType;
    details?: string;
    requestedBy: string;
  }): Promise<any> {
    // Verificar se usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Criar requisição
    const request = await prisma.dataSubjectRequest.create({
      data: {
        id: createId(),
        userId,
        type: requestType,
        status: DataSubjectRequestStatus.PENDING,
        details,
        requestedById: requestedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    // Registrar atividade
    await AuditService.logActivity({
      action: AuditAction.SENSITIVE_DATA_ACCESS,
      userId: requestedBy,
      resourceType: 'data_subject_request',
      resourceId: request.id,
      details: {
        requestType,
        subjectId: userId,
      },
      severity: 'warning',
    });
    
    return request;
  }

  /**
   * Atualiza status de uma requisição
   */
  static async updateRequestStatus({
    requestId,
    status,
    processorNotes,
    processedBy,
  }: {
    requestId: string;
    status: DataSubjectRequestStatus;
    processorNotes?: string;
    processedBy: string;
  }): Promise<any> {
    // Atualizar requisição
    const request = await prisma.dataSubjectRequest.update({
      where: { id: requestId },
      data: {
        status,
        processorNotes,
        processedById: processedBy,
        processedAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    // Registrar atividade
    await AuditService.logActivity({
      action: AuditAction.SENSITIVE_DATA_ACCESS,
      userId: processedBy,
      resourceType: 'data_subject_request',
      resourceId: requestId,
      details: {
        newStatus: status,
        processorNotes,
      },
      severity: 'info',
    });
    
    return request;
  }

  /**
   * Executa uma requisição de acesso a dados
   */
  static async executeAccessRequest(requestId: string): Promise<any> {
    // Buscar requisição
    const request = await prisma.dataSubjectRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });
    
    if (!request || request.type !== DataSubjectRequestType.ACCESS) {
      throw new Error('Invalid request');
    }
    
    // Coletar dados do usuário
    const userData = await this.collectUserData(request.userId);
    
    // Atualizar requisição
    await this.updateRequestStatus({
      requestId,
      status: DataSubjectRequestStatus.COMPLETED,
      processorNotes: 'Data access request completed',
      processedBy: request.requestedById,
    });
    
    return userData;
  }

  /**
   * Executa uma requisição de remoção de dados
   */
  static async executeErasureRequest(requestId: string): Promise<void> {
    // Buscar requisição
    const request = await prisma.dataSubjectRequest.findUnique({
      where: { id: requestId },
    });
    
    if (!request || request.type !== DataSubjectRequestType.ERASURE) {
      throw new Error('Invalid request');
    }
    
    // Anonimizar dados do usuário
    await this.anonymizeUserData(request.userId);
    
    // Atualizar requisição
    await this.updateRequestStatus({
      requestId,
      status: DataSubjectRequestStatus.COMPLETED,
      processorNotes: 'Data erasure request completed',
      processedBy: request.requestedById,
    });
  }

  /**
   * Executa uma requisição de portabilidade
   */
  static async executePortabilityRequest(requestId: string): Promise<any> {
    // Buscar requisição
    const request = await prisma.dataSubjectRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });
    
    if (!request || request.type !== DataSubjectRequestType.PORTABILITY) {
      throw new Error('Invalid request');
    }
    
    // Coletar dados do usuário em formato portável
    const portableData = await this.collectPortableUserData(request.userId);
    
    // Atualizar requisição
    await this.updateRequestStatus({
      requestId,
      status: DataSubjectRequestStatus.COMPLETED,
      processorNotes: 'Data portability request completed',
      processedBy: request.requestedById,
    });
    
    return portableData;
  }

  /**
   * Coleta todos os dados de um usuário
   */
  private static async collectUserData(userId: string): Promise<any> {
    // Buscar dados básicos do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        mfaEnabled: true,
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Buscar projetos do usuário
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { createdById: userId },
          { members: { some: { userId } } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    // Buscar atividades do usuário
    const activities = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    
    // Retornar dados compilados
    return {
      user,
      projects,
      activities,
    };
  }

  /**
   * Anonimiza dados de um usuário
   */
  private static async anonymizeUserData(userId: string): Promise<void> {
    // Obter dados atuais para auditoria
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Gerar valor anonimizado
    const anonymousValue = `anonymized-${createId()}`;
    
    // Atualizar usuário
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `${anonymousValue}@anonymous.com`,
        name: 'Anonymous User',
        password: null, // Remover senha
        active: false,
        anonymized: true,
        anonymizedAt: new Date(),
      },
    });
    
    // Registrar atividade
    await AuditService.logActivity({
      action: AuditAction.USER_UPDATE,
      userId,
      details: {
        action: 'anonymization',
        previousEmail: user.email,
      },
      severity: 'warning',
    });
  }

  /**
   * Coleta dados do usuário em formato portável
   */
  private static async collectPortableUserData(userId: string): Promise<any> {
    // Coleta dados completos
    const userData = await this.collectUserData(userId);
    
    // Converter para formato portável (JSON)
    return {
      dataSubject: {
        id: userData.user.id,
        email: userData.user.email,
        name: userData.user.name,
        createdAt: userData.user.createdAt,
      },
      userContent: {
        projects: userData.projects.map((project: any) => ({
          name: project.name,
          description: project.description,
          createdAt: project.createdAt,
        })),
      },
      metadata: {
        exportDate: new Date(),
        exportFormat: 'JSON',
        exportStandard: 'Brainlink Data Portability v1.0',
      },
    };
  }
}
```

## Conclusão

A segurança no Brainlink é implementada em múltiplas camadas, seguindo as melhores práticas da indústria e padrões de conformidade relevantes. A abordagem de "segurança por design" garante que considerações de segurança sejam incorporadas desde o início do desenvolvimento, não como um complemento posterior.

O sistema de segurança do Brainlink é desenvolvido para ser:

1. **Abrangente**: Cobrindo todos os aspectos, desde autenticação até proteção de dados
2. **Adaptável**: Capaz de evoluir com novas ameaças e requisitos
3. **Transparente**: Fornecendo auditoria clara e monitoramento de eventos de segurança
4. **Escalável**: Crescendo com a base de usuários sem comprometer a segurança
5. **Conformidade**: Atendendo regulamentações como LGPD, GDPR e outras exigências legais
6. **Resiliente**: Capaz de detectar, responder e recuperar-se de incidentes de segurança

### Recomendações Contínuas

Para manter o nível de segurança do Brainlink, as seguintes atividades devem ser contínuas:

1. **Testes de Penetração Regulares**: Conduzir testes de penetração a cada 6 meses ou após mudanças significativas na arquitetura.

2. **Revisões de Código Focadas em Segurança**: Implementar revisões de código específicas para segurança, além do processo normal de revisão.

3. **Treinamento da Equipe**: Manter a equipe atualizada sobre novas ameaças e práticas de segurança através de treinamentos regulares.

4. **Monitoramento Proativo**: Utilizar sistemas de detecção de intrusão e monitoramento contínuo para identificar possíveis ameaças.

5. **Resposta a Incidentes**: Manter um plano de resposta a incidentes atualizado e realizar simulações periodicamente.

6. **Gestão de Vulnerabilidades**: Implementar um processo para identificar, classificar e corrigir vulnerabilidades de forma sistemática.

7. **Atualizações de Segurança**: Manter todas as dependências e bibliotecas atualizadas com as últimas correções de segurança.

### Contatos de Segurança

Para relatar vulnerabilidades ou preocupações relacionadas à segurança:

- E-mail: security@brainlink.com
- Programa de Bug Bounty: https://brainlink.com/security/bounty
- Para emergências: +55 (11) 9999-8888

---

Data da última revisão deste documento: 2025-03-19
Responsável pela revisão: Equipe de Segurança do Brainlink