```
-- Criar tipos enumerados
CREATE TYPE public.profile_type AS ENUM ('fan', 'artist', 'collaborator', 'admin');
CREATE TYPE public.product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
CREATE TYPE public.model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab', 'nft', 'environment', 'character', 'prop');
CREATE TYPE public.press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator', 'user');

-- Atualizar/criar tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  profile_type profile_type NOT NULL DEFAULT 'fan',
  wallet_address TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  permissions TEXT[] DEFAULT '{}'::text[],
  roles TEXT[] DEFAULT '{}'::text[],
  preferences JSONB DEFAULT '{"theme": "dark", "currency": "BRL", "language": "pt", "notifications": {"email": true, "push": true, "sms": false}}'::jsonb,
  two_factor_enabled BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criação das tabelas da comunidade que faltam
CREATE TABLE IF NOT EXISTS public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  image_url TEXT,
  is_online BOOLEAN DEFAULT false,
  event_url TEXT,
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.giveaways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize TEXT NOT NULL,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  winner_count INTEGER NOT NULL DEFAULT 1,
  creator_id UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  giveaway_id UUID NOT NULL REFERENCES giveaways(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  is_winner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(giveaway_id, user_id)
);

-- Tabelas para o sistema de JestCoin
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelas para o sistema de Airdrop
CREATE TABLE IF NOT EXISTS public.airdrops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  token_type TEXT NOT NULL,
  token_amount NUMERIC NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  eligibility_criteria JSONB,
  created_by UUID NOT NULL REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.airdrop_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airdrop_id UUID NOT NULL REFERENCES airdrops(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  wallet_address TEXT,
  claimed_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  transaction_hash TEXT,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabelas para NFTs
CREATE TABLE IF NOT EXISTS public.nft_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  total_supply INTEGER,
  blockchain TEXT NOT NULL,
  contract_address TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nft_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES nft_collections(id),
  token_id TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  animation_url TEXT,
  external_url TEXT,
  attributes JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  price NUMERIC,
  is_for_sale BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, token_id)
);

-- Tabelas para Press Kit
CREATE TABLE IF NOT EXISTS public.press_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.press_kit_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES press_materials(id),
  user_id UUID REFERENCES profiles(id),
  email TEXT,
  ip_address TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabelas para CreativeFlow Board
CREATE TABLE IF NOT EXISTS public.creative_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  content JSONB DEFAULT '{}'::jsonb,
  last_edited TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.board_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES creative_boards(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL,
  position JSONB NOT NULL,
  content JSONB,
  style JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.automation_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  board_id UUID REFERENCES creative_boards(id),
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  nodes JSONB DEFAULT '[]'::jsonb,
  connections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  service_name TEXT NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Função para criar usuários de demonstração
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Criar usuário admin
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Criar usuário artista
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Criar usuário colaborador
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Criar usuário fã
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Adicionar os usuários na tabela de mfas (necessário para autenticação)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Criar wallets para os usuários
  INSERT INTO public.wallets (user_id, balance)
  VALUES 
    (admin_id, 1000),
    (artist_id, 500),
    (collaborator_id, 300),
    (fan_id, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente após criação de usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Criar carteira para o novo usuário
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 50);
  
  RETURN NEW;
END;
$$;

-- Criar trigger para novos usuários se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Funções para verificar o tipo de perfil do usuário
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_artist()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'artist'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_collaborator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'collaborator'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_fan()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'fan'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_collaborator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'collaborator')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_artist()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'artist')
  );
$$;

-- Criar políticas de RLS para as tabelas
-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seus próprios perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Administradores podem visualizar todos os perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Administradores podem editar todos os perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- NFTs
ALTER TABLE public.nft_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nft_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visualização pública de coleções NFT"
ON public.nft_collections FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Criação de coleções NFT por artistas e admins"
ON public.nft_collections FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_artist());

CREATE POLICY "Edição de coleções NFT pelo criador ou admin"
ON public.nft_collections FOR UPDATE
TO authenticated
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Visualização pública de itens NFT"
ON public.nft_items FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Adição de NFTs por admins e artistas"
ON public.nft_items FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.nft_collections
    WHERE id = collection_id AND (creator_id = auth.uid() OR is_admin())
  )
);

CREATE POLICY "Edição de NFTs pelo dono ou admin"
ON public.nft_items FOR UPDATE
TO authenticated
USING (owner_id = auth.uid() OR is_admin());

-- Wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas carteiras"
ON public.wallets FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todas as carteiras"
ON public.wallets FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Apenas sistema pode inserir e atualizar carteiras"
ON public.wallets FOR ALL
TO authenticated
USING (is_admin());

CREATE POLICY "Usuários podem ver suas transações"
ON public.transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.wallets
    WHERE id = wallet_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todas as transações"
ON public.transactions FOR SELECT
TO authenticated
USING (is_admin());

-- Executar função para criar usuários de demonstração
SELECT create_demo_users();

-- Criar Buckets de Storage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'Avatares de Usuário', true),
  ('demos', 'Uploads de Demo', false),
  ('community', 'Conteúdo da Comunidade', true),
  ('products', 'Imagens de Produtos', true),
  ('nfts', 'Arquivos de NFT', true),
  ('press_kit', 'Materiais para Imprensa', true),
  ('creativeflow', 'Arquivos do CreativeFlow', false),
  ('temp', 'Arquivos Temporários', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas para Storage
CREATE POLICY "Acesso público para visualizar avatares"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Usuários autenticados podem fazer upload de avatares"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Usuários podem atualizar seus próprios avatares"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

CREATE POLICY "Usuários podem excluir seus próprios avatares"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid());

```


```
-- Adjust existing types if needed (wrap in try-catch)
DO $$ 
BEGIN
  -- Only create types if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
    CREATE TYPE public.product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'model_type') THEN
    CREATE TYPE public.model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab', 'nft', 'environment', 'character', 'prop');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'press_role') THEN
    CREATE TYPE public.press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator', 'user');
  END IF;
END $$;

-- Drop triggers if they exist to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate trigger and functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 50);
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Recreate RLS policies after dropping existing ones
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem visualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem editar todos os perfis" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seus próprios perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Administradores podem visualizar todos os perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Administradores podem editar todos os perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'Avatares de Usuário', true),
  ('demos', 'Uploads de Demo', false),
  ('community', 'Conteúdo da Comunidade', true),
  ('products', 'Imagens de Produtos', true),
  ('nfts', 'Arquivos de NFT', true),
  ('press_kit', 'Materiais para Imprensa', true),
  ('creativeflow', 'Arquivos do CreativeFlow', false),
  ('temp', 'Arquivos Temporários', false)
ON CONFLICT (id) DO NOTHING;

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```


```
-- Create the demo users function first
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Create wallets for users
  INSERT INTO public.wallets (user_id, balance)
  VALUES 
    (admin_id, 1000),
    (artist_id, 500),
    (collaborator_id, 300),
    (fan_id, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now run the previous migration again
DO $$ 
BEGIN
  -- Only create types if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_type') THEN
    CREATE TYPE public.product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'model_type') THEN
    CREATE TYPE public.model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab', 'nft', 'environment', 'character', 'prop');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'press_role') THEN
    CREATE TYPE public.press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'creator', 'user');
  END IF;
END $$;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 50);
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Recreate RLS policies
DROP POLICY IF EXISTS "Usuários podem visualizar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem visualizar todos os perfis" ON public.profiles;
DROP POLICY IF EXISTS "Administradores podem editar todos os perfis" ON public.profiles;

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuários podem editar seus próprios perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Administradores podem visualizar todos os perfis"
ON public.profiles FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Administradores podem editar todos os perfis"
ON public.profiles FOR UPDATE
TO authenticated
USING (is_admin());

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'Avatares de Usuário', true),
  ('demos', 'Uploads de Demo', false),
  ('community', 'Conteúdo da Comunidade', true),
  ('products', 'Imagens de Produtos', true),
  ('nfts', 'Arquivos de NFT', true),
  ('press_kit', 'Materiais para Imprensa', true),
  ('creativeflow', 'Arquivos do CreativeFlow', false),
  ('temp', 'Arquivos Temporários', false)
ON CONFLICT (id) DO NOTHING;

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```


The SQL migration failed with the following error:

ERROR: 42P01: relation "public.wallets" does not exist
QUERY: INSERT INTO public.wallets (user_id, balance) VALUES (NEW.id, 50)

This indicates that the public.wallets table doesn't exist yet, but the functions are trying to insert data into it. Let me fix this by creating the missing wallet tables first.

```
-- Create wallet table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modify handle_new_user function to handle missing wallet table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Only create wallet if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (NEW.id, 50);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update create_demo_users function to handle missing wallet table
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Only create wallets if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallets') THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES 
      (admin_id, 1000),
      (artist_id, 500),
      (collaborator_id, 300),
      (fan_id, 100);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```

```
-- Create wallet table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Modify handle_new_user function to check if wallet exists before creating
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    username,
    profile_type,
    avatar,
    created_at,
    updated_at,
    last_login,
    is_verified,
    two_factor_enabled,
    preferences
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
    COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
    NULL,
    NOW(),
    NOW(),
    NOW(),
    NEW.email_confirmed_at IS NOT NULL,
    false,
    '{
      "theme": "dark",
      "language": "pt",
      "currency": "BRL",
      "notifications": {
        "email": true,
        "push": true,
        "sms": false
      }
    }'::JSONB
  );
  
  -- Only create wallet if it doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = NEW.id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (NEW.id, 50);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update create_demo_users function to check if wallets exist
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS void AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"display_name":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Create wallets only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = admin_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (admin_id, 1000);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = artist_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (artist_id, 500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = collaborator_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (collaborator_id, 300);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = fan_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (fan_id, 100);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create demo users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jestfly.com') THEN
    PERFORM create_demo_users();
  END IF;
END $$;

```




000000000000000000000000000



##Implementado


```
-- Enumerações (Tipos personalizados)
CREATE TYPE profile_type AS ENUM ('fan', 'artist', 'admin', 'collaborator');
CREATE TYPE product_type AS ENUM ('nft', 'music', 'merch', 'collectible');
CREATE TYPE booking_type AS ENUM ('session', 'consultation', 'event', 'collaboration');
CREATE TYPE transaction_type AS ENUM ('purchase', 'sale', 'reward', 'transfer', 'airdrop', 'refund');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'pending_review');
CREATE TYPE notification_type AS ENUM ('system', 'transaction', 'social', 'event', 'booking', 'message');
CREATE TYPE event_type AS ENUM ('release', 'concert', 'livestream', 'meetup', 'collaboration');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE press_role AS ENUM ('journalist', 'blogger', 'editor', 'podcaster', 'other');
CREATE TYPE creative_node_type AS ENUM ('text', 'image', 'audio', 'video', 'link', 'canvas');
CREATE TYPE demo_status AS ENUM ('pending', 'approved', 'rejected', 'featured');
CREATE TYPE model_type AS ENUM ('diamond', 'sphere', 'torus', 'crystal', 'sketchfab');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'expired', 'trial');
CREATE TYPE achievement_category AS ENUM ('engagement', 'creation', 'social', 'collection', 'support');

-- Tabela de Perfis (estende auth.users da Supabase)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    profile_type profile_type NOT NULL DEFAULT 'fan',
    bio TEXT,
    avatar TEXT,
    banner_image TEXT,
    wallet_address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    permissions TEXT[] DEFAULT '{}',
    roles TEXT[] DEFAULT '{}',
    social_links JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{"theme": "dark", "language": "en", "currency": "USD", "notifications": {}}',
    last_login TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$')
);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar perfil ao registrar usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (
        id,
        email,
        display_name,
        username,
        profile_type,
        avatar,
        created_at,
        updated_at,
        last_login,
        is_verified,
        two_factor_enabled,
        preferences
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'username', CONCAT('user_', SUBSTR(NEW.id::text, 1, 8))),
        COALESCE((NEW.raw_user_meta_data->>'profileType')::profile_type, 'fan'),
        NULL,
        NOW(),
        NOW(),
        NOW(),
        NEW.email_confirmed_at IS NOT NULL,
        false,
        '{
          "theme": "dark",
          "language": "pt",
          "currency": "BRL",
          "notifications": {
            "email": true,
            "push": true,
            "sms": false
          }
        }'::JSONB
    );
  
    -- Create wallet for new user
    INSERT INTO wallets (user_id, balance)
    VALUES (NEW.id, 50);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Tabela de Carteiras (JestCoin)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_wallets_modtime
BEFORE UPDATE ON wallets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de Transações
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    transaction_type transaction_type NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    stock INTEGER DEFAULT 0,
    type product_type NOT NULL,
    artist_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de NFTs (estende produtos)
CREATE TABLE nfts (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    contract_address TEXT,
    token_id TEXT,
    blockchain TEXT DEFAULT 'ethereum',
    metadata_uri TEXT,
    royalty_percentage NUMERIC DEFAULT 10.0 CHECK (royalty_percentage >= 0 AND royalty_percentage <= 100),
    total_supply INTEGER DEFAULT 1,
    tokens_sold INTEGER DEFAULT 0,
    properties JSONB DEFAULT '{}'
);

-- Tabela de Pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total NUMERIC NOT NULL CHECK (total >= 0),
    status TEXT NOT NULL DEFAULT 'pending',
    shipping_address JSONB,
    payment_intent_id TEXT,
    payment_method TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_orders_modtime
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de Itens de Pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC NOT NULL CHECK (price_at_time >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sistema de Disponibilidade para Agendamentos
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL,
    resource_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (start_time < end_time)
);

-- Tabela de Reservas/Agendamentos
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    resource_id UUID,
    resource_type TEXT,
    booking_type TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    status TEXT NOT NULL DEFAULT 'pending',
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    location TEXT,
    details TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (start_time < end_time)
);

CREATE TRIGGER update_bookings_modtime
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de Notas
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT[] DEFAULT '{}',
    links TEXT[] DEFAULT '{}',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    color TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_notes_modtime
BEFORE UPDATE ON notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela de Posts da Comunidade
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_community_posts_modtime
BEFORE UPDATE ON community_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Tabela de Comentários
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    parent_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_post_comments_modtime
BEFORE UPDATE ON post_comments
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Tabela de Likes em Posts
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Tabela de Likes em Comentários
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Sistema de Submissão de Demos
CREATE TABLE demo_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    genre TEXT,
    biography TEXT,
    social_links TEXT,
    status demo_status NOT NULL DEFAULT 'pending',
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Contatos de Imprensa (Press Kit)
CREATE TABLE press_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    outlet TEXT,
    role press_role,
    date_requested TIMESTAMPTZ NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Assets do Press Kit
CREATE TABLE press_kit_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    asset_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Conteúdo para Canvas Criativo
CREATE TABLE creative_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    node_type creative_node_type NOT NULL,
    content JSONB NOT NULL,
    position_x FLOAT NOT NULL,
    position_y FLOAT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Projetos Criativos
CREATE TABLE creative_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    collaborators UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Conexões de Nós Criativos
CREATE TABLE creative_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES creative_projects(id) ON DELETE CASCADE,
    source_node_id UUID NOT NULL REFERENCES creative_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES creative_nodes(id) ON DELETE CASCADE,
    connection_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_node_id, target_node_id)
);

-- Tabela de Modelos 3D
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    model_type model_type NOT NULL,
    url TEXT,
    thumbnail_url TEXT,
    params JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER handle_models_updated_at
BEFORE UPDATE ON models
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Tabela de Eventos
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type event_type NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    stream_url TEXT,
    thumbnail_url TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    price NUMERIC DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (start_time < end_time)
);

-- Tabela de Participantes de Eventos
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    ticket_id TEXT,
    attendance_status TEXT DEFAULT 'registered',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Tabela de Mensagens Diretas
CREATE TABLE direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status message_status DEFAULT 'sent',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Conversas de Chat
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    is_group BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Membros de Conversas
CREATE TABLE chat_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

-- Tabela de Mensagens de Chat
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachments JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Status de Mensagem de Chat (lida por)
CREATE TABLE chat_message_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Tabela de Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Assinaturas
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status subscription_status NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    payment_method_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Planos de Assinatura
CREATE TABLE subscription_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    interval TEXT NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Conquistas/Badges
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category achievement_category NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    icon_url TEXT,
    requirements JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Conquistas dos Usuários
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Tabela de Sistema de Airdrop
CREATE TABLE airdrops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reward_type TEXT NOT NULL,
    reward_amount NUMERIC NOT NULL CHECK (reward_amount > 0),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    eligibility_criteria JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (start_date < end_date)
);

-- Tabela de Reclamações de Airdrop
CREATE TABLE airdrop_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airdrop_id UUID NOT NULL REFERENCES airdrops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    UNIQUE(airdrop_id, user_id)
);

-- Tabela de Config do Sistema
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER handle_system_config_updated_at
BEFORE UPDATE ON system_config
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Tabela de Métricas do Sistema
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Tabela de Tarefas do Sistema
CREATE TABLE system_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    data JSONB DEFAULT '{}',
    result JSONB,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER handle_system_tasks_updated_at
BEFORE UPDATE ON system_tasks
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Tabela de Logs do Sistema
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Logs de Atividade do Usuário
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR NOT NULL,
    entity_type VARCHAR,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address VARCHAR,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funções úteis para RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_artist()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'artist'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_collaborator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'collaborator'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_collaborator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'collaborator')
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_artist()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'artist')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Log de atividades do usuário
CREATE OR REPLACE FUNCTION log_user_activity(
  action TEXT,
  entity_type TEXT DEFAULT NULL,
  entity_id UUID DEFAULT NULL,
  details JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT TRUE
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.user_activity_logs(
    user_id,
    action,
    entity_type,
    entity_id,
    details,
    ip_address,
    success,
    created_at
  )
  VALUES (
    auth.uid(),
    action,
    entity_type,
    entity_id,
    details,
    current_setting('request.headers')::json->>'x-forwarded-for',
    success,
    now()
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar modified_column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função genérica para handle_updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Registro de login do usuário
CREATE OR REPLACE FUNCTION on_auth_user_login()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_activity_logs(
    user_id,
    action,
    entity_type,
    details,
    ip_address,
    success,
    created_at
  )
  VALUES (
    NEW.id,
    'user.login',
    'auth.users',
    json_build_object('email', NEW.email),
    current_setting('request.headers', true)::json->>'x-forwarded-for',
    true,
    now()
  );
  
  -- Atualiza o last_login no perfil do usuário
  UPDATE public.profiles 
  SET last_login = now() 
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualização do last_login
CREATE OR REPLACE FUNCTION update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles 
  SET last_login = now() 
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para login do usuário
CREATE TRIGGER on_user_login
AFTER INSERT ON auth.sessions
FOR EACH ROW EXECUTE FUNCTION update_last_login();

-- Ativação do Realtime para tabelas principais
ALTER publication supabase_realtime ADD TABLE profiles;
ALTER publication supabase_realtime ADD TABLE community_posts;
ALTER publication supabase_realtime ADD TABLE post_comments;
ALTER publication supabase_realtime ADD TABLE chat_messages;
ALTER publication supabase_realtime ADD TABLE notifications;
ALTER publication supabase_realtime ADD TABLE events;
ALTER publication supabase_realtime ADD TABLE products;
ALTER publication supabase_realtime ADD TABLE wallets;

-- Configurar Replica Identity para a funcionalidade Realtime
ALTER TABLE profiles REPLICA IDENTITY FULL;
ALTER TABLE community_posts REPLICA IDENTITY FULL;
ALTER TABLE post_comments REPLICA IDENTITY FULL;
ALTER TABLE chat_messages REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE events REPLICA IDENTITY FULL;
ALTER TABLE products REPLICA IDENTITY FULL;
ALTER TABLE wallets REPLICA IDENTITY FULL;

-- Aplicar RLS em todas as tabelas
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar seus próprios perfis"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins podem visualizar todos os perfis"
ON profiles FOR SELECT
USING (is_admin());

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Wallets
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar suas próprias carteiras"
ON wallets FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem visualizar todas as carteiras"
ON wallets FOR SELECT
USING (is_admin());

CREATE POLICY "Sistema pode atualizar carteiras"
ON wallets FOR UPDATE
USING (is_admin() OR auth.uid() = user_id);

-- Transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar suas próprias transações"
ON transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM wallets
    WHERE wallets.id = wallet_id
    AND wallets.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem visualizar todas as transações"
ON transactions FOR SELECT
USING (is_admin());

CREATE POLICY "Sistema pode inserir transações"
ON transactions FOR INSERT
WITH CHECK (is_admin() OR 
  EXISTS (
    SELECT 1 FROM wallets
    WHERE wallets.id = wallet_id
    AND wallets.user_id = auth.uid()
  )
);

-- Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos são visíveis para todos"
ON products FOR SELECT
USING (true);

CREATE POLICY "Artistas podem gerenciar seus próprios produtos"
ON products FOR ALL
USING (
  (is_artist() AND artist_id = auth.uid()) OR is_admin()
);

-- NFTs
ALTER TABLE nfts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "NFTs são visíveis para todos"
ON nfts FOR SELECT
USING (true);

CREATE POLICY "Artistas podem gerenciar seus próprios NFTs"
ON nfts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_id
    AND ((is_artist() AND products.artist_id = auth.uid()) OR is_admin())
  )
);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar seus próprios pedidos"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem visualizar todos os pedidos"
ON orders FOR SELECT
USING (is_admin());

CREATE POLICY "Usuários podem criar seus próprios pedidos"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios pedidos"
ON orders FOR UPDATE
USING (auth.uid() = user_id);

-- Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar seus próprios itens de pedido"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem visualizar todos os itens de pedido"
ON order_items FOR SELECT
USING (is_admin());

CREATE POLICY "Usuários podem inserir itens em seus próprios pedidos"
ON order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_id
    AND orders.user_id = auth.uid()
  )
);

-- Availability
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disponibilidade visível para todos"
ON availability FOR SELECT
USING (true);

CREATE POLICY "Artistas podem gerenciar sua própria disponibilidade"
ON availability FOR ALL
USING (
  (is_artist() AND resource_id = auth.uid()) OR is_admin()
);

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar suas próprias reservas"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Artistas podem visualizar reservas para seus recursos"
ON bookings FOR SELECT
USING (is_artist() AND resource_id = auth.uid());

CREATE POLICY "Admins podem visualizar todas as reservas"
ON bookings FOR SELECT
USING (is_admin());

CREATE POLICY "Usuários podem criar reservas"
ON bookings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias reservas"
ON bookings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Artistas podem atualizar reservas para seus recursos"
ON bookings FOR UPDATE
USING (is_artist() AND resource_id = auth.uid());

-- Notes
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias notas"
ON notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias notas"
ON notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias notas"
ON notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias notas"
ON notes FOR DELETE
USING (auth.uid() = user_id);

-- Community Posts
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts são visíveis para todos"
ON community_posts FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem criar posts"
ON community_posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios posts"
ON community_posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios posts"
ON community_posts FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar todos os posts"
ON community_posts FOR ALL
USING (is_admin());

-- Post Comments
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentários são visíveis para todos"
ON post_comments FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem criar comentários"
ON post_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios comentários"
ON post_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios comentários"
ON post_comments FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem gerenciar todos os comentários"
ON post_comments FOR ALL
USING (is_admin());

-- Post Likes
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes são visíveis para todos"
ON post_likes FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem dar likes"
ON post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover seus próprios likes"
ON post_likes FOR DELETE
USING (auth.uid() = user_id);

-- Comment Likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes de comentários são visíveis para todos"
ON comment_likes FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem dar likes em comentários"
ON comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover seus próprios likes de comentários"
ON comment_likes FOR DELETE
USING (auth.uid() = user_id);

-- Demo Submissions
ALTER TABLE demo_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode enviar demos"
ON demo_submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Artistas e admins podem visualizar demos"
ON demo_submissions FOR SELECT
USING (is_admin_or_artist());

CREATE POLICY "Admins podem atualizar demos"
ON demo_submissions FOR UPDATE
USING (is_admin());

-- Press Contacts
ALTER TABLE press_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer pessoa pode registrar contato de imprensa"
ON press_contacts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins podem visualizar e gerenciar contatos de imprensa"
ON press_contacts FOR ALL
USING (is_admin());

-- Press Kit Assets
ALTER TABLE press_kit_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Assets públicos do press kit são visíveis para todos"
ON press_kit_assets FOR SELECT
USING (is_public = true);

CREATE POLICY "Contatos de imprensa verificados podem ver todos os assets"
ON press_kit_assets FOR SELECT
USING (
  is_public = true OR
  EXISTS (
    SELECT 1 FROM press_contacts
    WHERE press_contacts.email = auth.email()
    AND press_contacts.verified = true
  ) OR
  is_admin()
);

CREATE POLICY "Admins podem gerenciar assets do press kit"
ON press_kit_assets FOR ALL
USING (is_admin());

-- Creative Projects
ALTER TABLE creative_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios projetos criativos"
ON creative_projects FOR SELECT
USING (
  auth.uid() = user_id OR 
  auth.uid() = ANY(collaborators) OR
  is_public = true
);

CREATE POLICY "Usuários autenticados podem criar projetos criativos"
ON creative_projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios projetos criativos"
ON creative_projects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios projetos criativos"
ON creative_projects FOR DELETE
USING (auth.uid() = user_id);

-- Creative Nodes
ALTER TABLE creative_nodes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver nós de projetos a que têm acesso"
ON creative_nodes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators) OR
      creative_projects.is_public = true
    )
  )
);

CREATE POLICY "Usuários podem criar nós em projetos próprios ou como colaboradores"
ON creative_nodes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators)
    )
  )
);

CREATE POLICY "Usuários podem atualizar nós em projetos próprios ou como colaboradores"
ON creative_nodes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators)
    )
  )
);

CREATE POLICY "Usuários podem excluir nós em projetos próprios ou como colaboradores"
ON creative_nodes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators)
    )
  )
);

-- Creative Connections
ALTER TABLE creative_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver conexões de projetos a que têm acesso"
ON creative_connections FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators) OR
      creative_projects.is_public = true
    )
  )
);

CREATE POLICY "Usuários podem criar conexões em projetos próprios ou como colaboradores"
ON creative_connections FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators)
    )
  )
);

CREATE POLICY "Usuários podem excluir conexões em projetos próprios ou como colaboradores"
ON creative_connections FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM creative_projects
    WHERE creative_projects.id = project_id
    AND (
      creative_projects.user_id = auth.uid() OR
      auth.uid() = ANY(creative_projects.collaborators)
    )
  )
);

-- Models
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modelos são visíveis para todos"
ON models FOR SELECT
USING (true);

CREATE POLICY "Admins podem gerenciar modelos"
ON models FOR ALL
USING (is_admin());

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eventos são visíveis para todos"
ON events FOR SELECT
USING (true);

CREATE POLICY "Artistas podem criar eventos"
ON events FOR INSERT
WITH CHECK (is_admin_or_artist());

CREATE POLICY "Criadores podem gerenciar seus próprios eventos"
ON events FOR UPDATE
USING (creator_id = auth.uid() OR is_admin());

CREATE POLICY "Criadores podem excluir seus próprios eventos"
ON events FOR DELETE
USING (creator_id = auth.uid() OR is_admin());

-- Event Attendees
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios registros de eventos"
ON event_attendees FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Criadores de eventos podem ver participantes"
ON event_attendees FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_id
    AND events.creator_id = auth.uid()
  )
);

CREATE POLICY "Admins podem ver todos os participantes de eventos"
ON event_attendees FOR SELECT
USING (is_admin());

CREATE POLICY "Usuários podem se registrar em eventos"
ON event_attendees FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem cancelar sua participação em eventos"
ON event_attendees FOR DELETE
USING (user_id = auth.uid());

-- Direct Messages
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver mensagens enviadas ou recebidas por eles"
ON direct_messages FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Usuários autenticados podem enviar mensagens"
ON direct_messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Usuários podem excluir mensagens enviadas por eles"
ON direct_messages FOR DELETE
USING (sender_id = auth.uid());

-- Chat Conversations
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver conversas das quais são membros"
ON chat_conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = id
    AND chat_members.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários autenticados podem criar conversas"
ON chat_conversations FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Administradores de conversas podem atualizá-las"
ON chat_conversations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = id
    AND chat_members.user_id = auth.uid()
    AND chat_members.is_admin = true
  )
);

CREATE POLICY "Administradores de conversas podem excluí-las"
ON chat_conversations FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = id
    AND chat_members.user_id = auth.uid()
    AND chat_members.is_admin = true
  )
);

-- Chat Members
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver membros de conversas das quais participam"
ON chat_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chat_members AS cm
    WHERE cm.conversation_id = conversation_id
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Administradores de conversas podem adicionar membros"
ON chat_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = conversation_id
    AND chat_members.user_id = auth.uid()
    AND chat_members.is_admin = true
  ) OR
  EXISTS (
    SELECT 1 FROM chat_conversations
    WHERE chat_conversations.id = conversation_id
    AND chat_conversations.created_by = auth.uid()
  )
);

CREATE POLICY "Administradores de conversas podem remover membros"
ON chat_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = conversation_id
    AND chat_members.user_id = auth.uid()
    AND chat_members.is_admin = true
  ) OR
  user_id = auth.uid() -- Usuários podem sair de conversas
);

-- Chat Messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver mensagens de conversas das quais participam"
ON chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = conversation_id
    AND chat_members.user_id = auth.uid()
  )
);

CREATE POLICY "Membros de conversas podem enviar mensagens"
ON chat_messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_members
    WHERE chat_members.conversation_id = conversation_id
    AND chat_members.user_id = auth.uid()
  ) AND
  sender_id = auth.uid()
);

CREATE POLICY "Usuários podem excluir suas próprias mensagens"
ON chat_messages FOR DELETE
USING (sender_id = auth.uid());

-- Chat Message Status
ALTER TABLE chat_message_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver status de mensagens de conversas das quais participam"
ON chat_message_status FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM chat_messages
    JOIN chat_members ON chat_messages.conversation_id = chat_members.conversation_id
    WHERE chat_messages.id = message_id
    AND chat_members.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem marcar mensagens como lidas"
ON chat_message_status FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias notificações"
ON notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Sistema e admins podem criar notificações"
ON notifications FOR INSERT
WITH CHECK (
  is_admin() OR
  (SELECT current_setting('role')::text) = 'service_role'
);

CREATE POLICY "Usuários podem marcar suas notificações como lidas"
ON notifications FOR UPDATE
USING (
  user_id = auth.uid() AND
  NEW.is_read <> OLD.is_read
);

CREATE POLICY "Usuários podem excluir suas próprias notificações"
ON notifications FOR DELETE
USING (user_id = auth.uid());

-- Subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias assinaturas"
ON subscriptions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todas as assinaturas"
ON subscriptions FOR SELECT
USING (is_admin());

CREATE POLICY "Sistema pode gerenciar assinaturas"
ON subscriptions FOR ALL
USING (
  is_admin() OR
  (SELECT current_setting('role')::text) = 'service_role'
);

-- Subscription Plans
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Planos de assinatura são visíveis para todos"
ON subscription_plans FOR SELECT
USING (true);

CREATE POLICY "Admins podem gerenciar planos de assinatura"
ON subscription_plans FOR ALL
USING (is_admin());

-- Achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conquistas são visíveis para todos"
ON achievements FOR SELECT
USING (true);

CREATE POLICY "Admins podem gerenciar conquistas"
ON achievements FOR ALL
USING (is_admin());

-- User Achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias conquistas"
ON user_achievements FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Conquistas de usuários são visíveis para todos"
ON user_achievements FOR SELECT
USING (true);

CREATE POLICY "Sistema pode conceder conquistas"
ON user_achievements FOR INSERT
WITH CHECK (
  is_admin() OR
  (SELECT current_setting('role')::text) = 'service_role'
);

-- Airdrops
ALTER TABLE airdrops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Airdrops são visíveis para todos"
ON airdrops FOR SELECT
USING (true);

CREATE POLICY "Admins podem gerenciar airdrops"
ON airdrops FOR ALL
USING (is_admin());

-- Airdrop Claims
ALTER TABLE airdrop_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias reclamações de airdrop"
ON airdrop_claims FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins podem ver todas as reclamações de airdrop"
ON airdrop_claims FOR SELECT
USING (is_admin());

CREATE POLICY "Usuários podem reclamar airdrops"
ON airdrop_claims FOR INSERT
WITH CHECK (user_id = auth.uid());

-- System Config
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver configurações do sistema"
ON system_config FOR SELECT
USING (is_admin());

CREATE POLICY "Admins podem gerenciar configurações do sistema"
ON system_config FOR ALL
USING (is_admin());

-- System Metrics
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver métricas do sistema"
ON system_metrics FOR SELECT
USING (is_admin());

CREATE POLICY "Sistema pode inserir métricas"
ON system_metrics FOR INSERT
WITH CHECK (
  is_admin() OR
  (SELECT current_setting('role')::text) = 'service_role'
);

-- System Tasks
ALTER TABLE system_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver tarefas do sistema"
ON system_tasks FOR SELECT
USING (is_admin());

CREATE POLICY "Sistema pode gerenciar tarefas"
ON system_tasks FOR ALL
USING (
  is_admin() OR
  (SELECT current_setting('role')::text) = 'service_role'
);

-- System Logs
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver logs do sistema"
ON system_logs FOR SELECT
USING (is_admin());

CREATE POLICY "Sistema pode inserir logs"
ON system_logs FOR INSERT
WITH CHECK (
  is_admin() OR
  (SELECT current_setting('role')::text) = 'service_role'
);

-- Configuração inicial do sistema para teste
-- Apenas executar se for criar um ambiente de teste

INSERT INTO system_config (key, value)
VALUES 
  ('site_settings', '{"name": "JestFly", "description": "Plataforma para artistas e fãs", "maintenance_mode": false}'),
  ('theme_settings', '{"primary_color": "#6D28D9", "secondary_color": "#4F46E5", "dark_mode": true}'),
  ('feature_flags', '{"nft_marketplace": true, "live_streaming": true, "creative_flow": true}');

-- Cria uma função para inicialização de dados de demonstração
CREATE OR REPLACE FUNCTION create_demo_users()
RETURNS VOID AS $$
DECLARE
  admin_id UUID;
  artist_id UUID;
  collaborator_id UUID;
  fan_id UUID;
BEGIN
  -- Create admin user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin@jestfly.com', 
          crypt('admin123', gen_salt('bf')), 
          now(), now(), 
          '{"displayName":"Administrador JestFly", "username":"admin_jestfly", "profileType":"admin"}'::jsonb,
          now(), now())
  RETURNING id INTO admin_id;
  
  -- Create artist user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'artist@jestfly.com', 
          crypt('artist123', gen_salt('bf')), 
          now(), now(), 
          '{"displayName":"DJ SoundMaster", "username":"dj_soundmaster", "profileType":"artist"}'::jsonb,
          now(), now())
  RETURNING id INTO artist_id;
          
  -- Create collaborator user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'collaborator@jestfly.com', 
          crypt('collab123', gen_salt('bf')), 
          now(), now(), 
          '{"displayName":"Tech Support", "username":"tech_support", "profileType":"collaborator"}'::jsonb,
          now(), now())
  RETURNING id INTO collaborator_id;
  
  -- Create fan user
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, confirmation_sent_at, 
                         raw_user_meta_data, created_at, updated_at)
  VALUES (gen_random_uuid(), 'fan@jestfly.com', 
          crypt('fan123', gen_salt('bf')), 
          now(), now(), 
          '{"displayName":"Fã de Música", "username":"music_fan", "profileType":"fan"}'::jsonb,
          now(), now())
  RETURNING id INTO fan_id;
  
  -- Add users to mfa table (required for authentication)
  INSERT INTO auth.mfa_factors (id, user_id, created_at, updated_at, factor_type, status)
  VALUES 
    (gen_random_uuid(), admin_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), artist_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), collaborator_id, now(), now(), 'totp', 'verified'),
    (gen_random_uuid(), fan_id, now(), now(), 'totp', 'verified');
    
  -- Create wallets only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = admin_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (admin_id, 1000);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = artist_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (artist_id, 500);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = collaborator_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (collaborator_id, 300);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.wallets WHERE user_id = fan_id) THEN
    INSERT INTO public.wallets (user_id, balance)
    VALUES (fan_id, 100);
  END IF;
END;
$$ LANGUAGE plpgsql;

```