


```
-- Count followers for a user
CREATE OR REPLACE FUNCTION public.count_followers(user_id uuid)
 RETURNS integer
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.user_follows
  WHERE following_id = user_id;
$function$

-- Count following for a user
CREATE OR REPLACE FUNCTION public.count_following(user_id uuid)
 RETURNS integer
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.user_follows
  WHERE follower_id = user_id;
$function$

-- Check if a user is following another user
CREATE OR REPLACE FUNCTION public.is_following(follower uuid, following uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_follows
    WHERE follower_id = follower
    AND following_id = following
  );
$function$

-- Function to follow a user
CREATE OR REPLACE FUNCTION public.follow_user(follower uuid, following uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_follows (follower_id, following_id)
  VALUES (follower, following)
  ON CONFLICT (follower_id, following_id) DO NOTHING;
END;
$function$

-- Function to unfollow a user
CREATE OR REPLACE FUNCTION public.unfollow_user(follower uuid, following uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  DELETE FROM public.user_follows
  WHERE follower_id = follower
  AND following_id = following;
END;
$function$

-- Check authentication connectivity
CREATE OR REPLACE FUNCTION public.check_auth_connectivity()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result jsonb;
BEGIN
  -- Check if we can access necessary tables
  WITH checks AS (
    SELECT 
      EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') AS profiles_exists,
      EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users') AS auth_users_exists,
      (SELECT COUNT(*) FROM public.profiles) AS profiles_count
  )
  SELECT 
    jsonb_build_object(
      'database_connection', true,
      'profiles_table_exists', profiles_exists,
      'auth_users_exists', auth_users_exists,
      'profiles_count', profiles_count,
      'timestamp', NOW()
    ) INTO result
  FROM checks;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'database_connection', false,
    'error', SQLERRM,
    'timestamp', NOW()
  );
END;
$function$

-- Check user data
CREATE OR REPLACE FUNCTION public.check_user_data(user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result jsonb;
  user_profile jsonb;
  auth_user jsonb;
BEGIN
  -- Get profile data
  SELECT to_jsonb(p) INTO user_profile
  FROM public.profiles p
  WHERE p.id = user_id;
  
  -- Result object
  result := jsonb_build_object(
    'profile_exists', user_profile IS NOT NULL,
    'profile_data', COALESCE(user_profile, '{}'::jsonb),
    'timestamp', NOW()
  );
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'timestamp', NOW()
  );
END;
$function$

-- Log authentication diagnostic
CREATE OR REPLACE FUNCTION public.log_auth_diagnostic(message text, metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.system_logs(
    level,
    message,
    metadata,
    created_at
  )
  VALUES (
    'diagnostic',
    message,
    metadata,
    now()
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$

-- Create user wallet
CREATE OR REPLACE FUNCTION public.create_user_wallet()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Check if wallet already exists
    IF NOT EXISTS (SELECT 1 FROM wallets WHERE user_id = NEW.id) THEN
        INSERT INTO wallets (user_id, balance)
        VALUES (NEW.id, 0);
    END IF;
    RETURN NEW;
END;
$function$

-- Transfer JestCoin
CREATE OR REPLACE FUNCTION public.transfer_jestcoin(sender_id uuid, receiver_id uuid, amount numeric, description text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    sender_wallet_id UUID;
    receiver_wallet_id UUID;
    sender_balance DECIMAL;
    transaction_id UUID;
BEGIN
    -- Get sender wallet
    SELECT id, balance INTO sender_wallet_id, sender_balance
    FROM wallets
    WHERE user_id = sender_id;
    
    -- Check if sender has enough balance
    IF sender_balance < amount THEN
        RETURN json_build_object('success', false, 'message', 'Insufficient balance');
    END IF;
    
    -- Get receiver wallet
    SELECT id INTO receiver_wallet_id
    FROM wallets
    WHERE user_id = receiver_id;
    
    -- Check if receiver wallet exists
    IF receiver_wallet_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Receiver wallet not found');
    END IF;
    
    -- Update sender wallet
    UPDATE wallets
    SET balance = balance - amount,
        updated_at = NOW()
    WHERE id = sender_wallet_id;
    
    -- Update receiver wallet
    UPDATE wallets
    SET balance = balance + amount,
        updated_at = NOW()
    WHERE id = receiver_wallet_id;
    
    -- Record sender transaction
    INSERT INTO transactions (wallet_id, amount, transaction_type, description, reference_id)
    VALUES (sender_wallet_id, -amount, 'transfer', description, receiver_id)
    RETURNING id INTO transaction_id;
    
    -- Record receiver transaction
    INSERT INTO transactions (wallet_id, amount, transaction_type, description, reference_id)
    VALUES (receiver_wallet_id, amount, 'transfer', description, sender_id);
    
    RETURN json_build_object('success', true, 'transaction_id', transaction_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Reward user
CREATE OR REPLACE FUNCTION public.reward_user(user_id uuid, amount numeric, reward_description text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    wallet_id UUID;
    transaction_id UUID;
BEGIN
    -- Get user wallet
    SELECT id INTO wallet_id
    FROM wallets
    WHERE user_id = user_id;
    
    -- Check if wallet exists
    IF wallet_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'Wallet not found');
    END IF;
    
    -- Update wallet
    UPDATE wallets
    SET balance = balance + amount,
        updated_at = NOW()
    WHERE id = wallet_id;
    
    -- Record transaction
    INSERT INTO transactions (wallet_id, amount, transaction_type, description)
    VALUES (wallet_id, amount, 'reward', reward_description)
    RETURNING id INTO transaction_id;
    
    RETURN json_build_object('success', true, 'transaction_id', transaction_id);
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Purchase NFT
CREATE OR REPLACE FUNCTION public.purchase_nft(nft_id uuid, buyer_id uuid, price numeric)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  nft_record RECORD;
  buyer_wallet_id UUID;
  seller_wallet_id UUID;
  creator_wallet_id UUID;
  buyer_balance NUMERIC;
  royalty_amount NUMERIC;
  creator_amount NUMERIC;
  seller_amount NUMERIC;
  transaction_id UUID;
BEGIN
  -- Check if NFT exists and is for sale
  SELECT * INTO nft_record
  FROM public.nfts
  WHERE id = nft_id AND is_for_sale = true;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'NFT not found or not for sale');
  END IF;
  
  -- Check if price matches
  IF nft_record.price != price THEN
    RETURN json_build_object('success', false, 'message', 'Price mismatch');
  END IF;
  
  -- Get buyer wallet
  SELECT id, balance INTO buyer_wallet_id, buyer_balance
  FROM wallets
  WHERE user_id = buyer_id;
  
  -- Check buyer has enough balance
  IF buyer_balance < price THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient balance');
  END IF;
  
  -- Get seller wallet
  SELECT id INTO seller_wallet_id
  FROM wallets
  WHERE user_id = nft_record.owner_id;
  
  -- Calculate royalty if creator is not the seller
  IF nft_record.creator_id != nft_record.owner_id AND nft_record.royalty_percentage > 0 THEN
    -- Get creator wallet
    SELECT id INTO creator_wallet_id
    FROM wallets
    WHERE user_id = nft_record.creator_id;
    
    -- Calculate royalty
    royalty_amount := (price * nft_record.royalty_percentage) / 100;
    creator_amount := royalty_amount;
    seller_amount := price - royalty_amount;
    
    -- Update creator wallet if royalty exists
    IF creator_amount > 0 THEN
      UPDATE wallets
      SET balance = balance + creator_amount,
          updated_at = NOW()
      WHERE id = creator_wallet_id;
      
      -- Record creator transaction
      INSERT INTO transactions (wallet_id, amount, transaction_type, description)
      VALUES (creator_wallet_id, creator_amount, 'nft_royalty', 'Royalty from NFT sale: ' || nft_record.title);
    END IF;
  ELSE
    seller_amount := price;
    royalty_amount := 0;
  END IF;
  
  -- Update buyer wallet
  UPDATE wallets
  SET balance = balance - price,
      updated_at = NOW()
  WHERE id = buyer_wallet_id;
  
  -- Update seller wallet
  UPDATE wallets
  SET balance = balance + seller_amount,
      updated_at = NOW()
  WHERE id = seller_wallet_id;
  
  -- Record buyer transaction
  INSERT INTO transactions (wallet_id, amount, transaction_type, description, reference_id)
  VALUES (buyer_wallet_id, -price, 'nft_purchase', 'Purchased NFT: ' || nft_record.title, nft_id);
  
  -- Record seller transaction
  INSERT INTO transactions (wallet_id, amount, transaction_type, description, reference_id)
  VALUES (seller_wallet_id, seller_amount, 'nft_sale', 'Sold NFT: ' || nft_record.title, nft_id);
  
  -- Record NFT transaction
  INSERT INTO nft_transactions (nft_id, seller_id, buyer_id, price, royalty_paid)
  VALUES (nft_id, nft_record.owner_id, buyer_id, price, royalty_amount)
  RETURNING id INTO transaction_id;
  
  -- Update NFT ownership
  UPDATE nfts
  SET owner_id = buyer_id,
      is_for_sale = false,
      updated_at = NOW()
  WHERE id = nft_id;
  
  RETURN json_build_object(
    'success', true, 
    'transaction_id', transaction_id,
    'message', 'NFT purchased successfully'
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Create NFT offer
CREATE OR REPLACE FUNCTION public.create_nft_offer(nft_id uuid, bidder_id uuid, amount numeric, expires_in_hours integer DEFAULT 24, message text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  nft_record RECORD;
  bidder_balance NUMERIC;
  offer_id UUID;
  expiry TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if NFT exists
  SELECT * INTO nft_record
  FROM public.nfts
  WHERE id = nft_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'NFT not found');
  END IF;
  
  -- Cannot bid on own NFT
  IF nft_record.owner_id = bidder_id THEN
    RETURN json_build_object('success', false, 'message', 'Cannot bid on your own NFT');
  END IF;
  
  -- Check bidder has enough balance
  SELECT balance INTO bidder_balance
  FROM wallets
  WHERE user_id = bidder_id;
  
  IF bidder_balance < amount THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient balance');
  END IF;
  
  -- Calculate expiry time
  expiry := NOW() + (expires_in_hours * INTERVAL '1 hour');
  
  -- Create the offer
  INSERT INTO nft_offers (nft_id, bidder_id, amount, expires_at, message)
  VALUES (nft_id, bidder_id, amount, expiry, message)
  RETURNING id INTO offer_id;
  
  RETURN json_build_object(
    'success', true, 
    'offer_id', offer_id,
    'message', 'Offer created successfully',
    'expires_at', expiry
  );
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Accept NFT offer
CREATE OR REPLACE FUNCTION public.accept_nft_offer(offer_id uuid, owner_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  offer_record RECORD;
  nft_record RECORD;
  purchase_result JSON;
BEGIN
  -- Check if offer exists and is still pending
  SELECT * INTO offer_record
  FROM public.nft_offers
  WHERE id = offer_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Offer not found or already processed');
  END IF;
  
  -- Check if offer has expired
  IF offer_record.expires_at < NOW() THEN
    UPDATE public.nft_offers
    SET status = 'expired'
    WHERE id = offer_id;
    
    RETURN json_build_object('success', false, 'message', 'Offer has expired');
  END IF;
  
  -- Get NFT details
  SELECT * INTO nft_record
  FROM public.nfts
  WHERE id = offer_record.nft_id;
  
  -- Check if caller is the owner
  IF nft_record.owner_id != owner_id THEN
    RETURN json_build_object('success', false, 'message', 'Only the NFT owner can accept offers');
  END IF;
  
  -- Process the purchase
  purchase_result := public.purchase_nft(
    nft_record.id,
    offer_record.bidder_id,
    offer_record.amount
  );
  
  -- Update offer status based on purchase result
  IF (purchase_result->>'success')::BOOLEAN THEN
    UPDATE public.nft_offers
    SET status = 'accepted'
    WHERE id = offer_id;
    
    -- Decline all other offers for this NFT
    UPDATE public.nft_offers
    SET status = 'declined'
    WHERE nft_id = nft_record.id 
      AND id != offer_id 
      AND status = 'pending';
      
    RETURN json_build_object(
      'success', true,
      'message', 'Offer accepted and purchase completed',
      'transaction_details', purchase_result
    );
  ELSE
    RETURN purchase_result;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Get collection stats
CREATE OR REPLACE FUNCTION public.get_collection_stats(collection_id uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  total_nfts INTEGER;
  floor_price NUMERIC;
  total_volume NUMERIC;
  unique_owners INTEGER;
BEGIN
  -- Count total NFTs in collection
  SELECT COUNT(*) INTO total_nfts
  FROM nfts
  WHERE nfts.collection_id = get_collection_stats.collection_id;
  
  -- Get floor price (lowest price of NFTs for sale in the collection)
  SELECT MIN(price) INTO floor_price
  FROM nfts
  WHERE nfts.collection_id = get_collection_stats.collection_id
    AND is_for_sale = true
    AND price > 0;
  
  -- Get total trading volume from transactions
  SELECT COALESCE(SUM(price), 0) INTO total_volume
  FROM nft_transactions
  JOIN nfts ON nft_transactions.nft_id = nfts.id
  WHERE nfts.collection_id = get_collection_stats.collection_id;
  
  -- Count unique owners
  SELECT COUNT(DISTINCT owner_id) INTO unique_owners
  FROM nfts
  WHERE nfts.collection_id = get_collection_stats.collection_id;
  
  RETURN json_build_object(
    'total_nfts', total_nfts,
    'floor_price', COALESCE(floor_price, 0),
    'total_volume', COALESCE(total_volume, 0),
    'unique_owners', unique_owners
  );
END;
$function$

-- Update modified column
CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$

-- Increment comments count
CREATE OR REPLACE FUNCTION public.increment_comments_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.community_posts
  SET comments_count = comments_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$function$

-- Decrement comments count
CREATE OR REPLACE FUNCTION public.decrement_comments_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.community_posts
  SET comments_count = comments_count - 1
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$function$

-- Update likes count
CREATE OR REPLACE FUNCTION public.update_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$function$

-- Update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.post_comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.post_comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$function$

-- Create project from template
CREATE OR REPLACE FUNCTION public.create_project_from_template(p_user_id uuid, p_template_id uuid, p_title text, p_description text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_project_id UUID;
  v_template RECORD;
  v_element_mapping JSONB := '{}';
  v_element RECORD;
  v_new_element_id UUID;
  v_connection RECORD;
BEGIN
  -- Obter informações do template
  SELECT * INTO v_template FROM public.canvas_templates WHERE id = p_template_id;
  
  -- Criar novo projeto
  INSERT INTO public.canvas_projects (
    title, 
    description, 
    user_id, 
    template_id, 
    thumbnail_url
  ) VALUES (
    p_title, 
    COALESCE(p_description, v_template.description), 
    p_user_id,
    p_template_id,
    v_template.thumbnail_url
  ) RETURNING id INTO v_project_id;
  
  -- Adicionar elementos do template
  FOR v_element IN SELECT * FROM jsonb_array_elements(v_template.elements)
  LOOP
    INSERT INTO public.canvas_elements (
      project_id,
      element_type,
      title,
      content,
      position,
      size,
      style,
      created_by,
      metadata
    ) VALUES (
      v_project_id,
      (v_element.value->>'element_type')::canvas_element_type,
      v_element.value->>'title',
      v_element.value->>'content',
      COALESCE(v_element.value->'position', '{"x": 0, "y": 0}'),
      COALESCE(v_element.value->'size', '{"width": 200, "height": 100}'),
      COALESCE(v_element.value->'style', '{}'),
      p_user_id,
      COALESCE(v_element.value->'metadata', '{}')
    ) RETURNING id INTO v_new_element_id;
    
    -- Mapear ID antigo para novo
    v_element_mapping := v_element_mapping || jsonb_build_object(v_element.value->>'id', v_new_element_id);
  END LOOP;
  
  -- Adicionar conexões do template
  FOR v_connection IN SELECT * FROM jsonb_array_elements(v_template.connections)
  LOOP
    INSERT INTO public.canvas_connections (
      project_id,
      source_id,
      target_id,
      label,
      style,
      created_by
    ) VALUES (
      v_project_id,
      (v_element_mapping->>v_connection.value->>'source_id')::UUID,
      (v_element_mapping->>v_connection.value->>'target_id')::UUID,
      v_connection.value->>'label',
      COALESCE(v_connection.value->'style', '{}'),
      p_user_id
    );
  END LOOP;
  
  RETURN v_project_id;
END;
$function$

-- Update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$

-- Create project snapshot
CREATE OR REPLACE FUNCTION public.create_project_snapshot(p_project_id uuid, p_comment text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_snapshot_id UUID;
  v_snapshot JSONB;
  v_project JSONB;
  v_elements JSONB;
  v_connections JSONB;
  v_tasks JSONB;
BEGIN
  -- Obter projeto
  SELECT to_jsonb(p) INTO v_project
  FROM public.canvas_projects p
  WHERE id = p_project_id;
  
  -- Obter elementos
  SELECT jsonb_agg(to_jsonb(e)) INTO v_elements
  FROM public.canvas_elements e
  WHERE project_id = p_project_id;
  
  -- Obter conexões
  SELECT jsonb_agg(to_jsonb(c)) INTO v_connections
  FROM public.canvas_connections c
  WHERE project_id = p_project_id;
  
  -- Obter tarefas
  SELECT jsonb_agg(to_jsonb(t)) INTO v_tasks
  FROM public.canvas_tasks t
  WHERE project_id = p_project_id;
  
  -- Construir snapshot
  v_snapshot := jsonb_build_object(
    'project', v_project,
    'elements', COALESCE(v_elements, '[]'::jsonb),
    'connections', COALESCE(v_connections, '[]'::jsonb),
    'tasks', COALESCE(v_tasks, '[]'::jsonb),
    'timestamp', now()
  );
  
  -- Inserir snapshot
  INSERT INTO public.canvas_history (
    project_id,
    snapshot,
    created_by,
    comment
  ) VALUES (
    p_project_id,
    v_snapshot,
    auth.uid(),
    p_comment
  ) RETURNING id INTO v_snapshot_id;
  
  RETURN v_snapshot_id;
END;
$function$

-- Trigger set timestamp
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$

-- Check user profile type
CREATE OR REPLACE FUNCTION public.check_user_profile_type(required_type text)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND profile_type::text = required_type
    );
$function$

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'admin'
  );
$function$

-- Check if user is artist
CREATE OR REPLACE FUNCTION public.is_artist()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'artist'
  );
$function$

-- Check if user is collaborator
CREATE OR REPLACE FUNCTION public.is_collaborator()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type = 'collaborator'
  );
$function$

-- Check if user is admin or collaborator
CREATE OR REPLACE FUNCTION public.is_admin_or_collaborator()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'collaborator')
  );
$function$

-- Check if user is admin or artist
CREATE OR REPLACE FUNCTION public.is_admin_or_artist()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND profile_type IN ('admin', 'artist')
  );
$function$

-- Log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(action text, entity_type text DEFAULT NULL::text, entity_id uuid DEFAULT NULL::uuid, details jsonb DEFAULT '{}'::jsonb, success boolean DEFAULT true)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$

-- On auth user login
CREATE OR REPLACE FUNCTION public.on_auth_user_login()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$

-- Update last login
CREATE OR REPLACE FUNCTION public.update_last_login()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.profiles 
  SET last_login = now() 
  WHERE id = auth.uid();
  RETURN NEW;
END;
$function$

-- Handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$

-- Create demo users
CREATE OR REPLACE FUNCTION public.create_demo_users()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$

-- Handle updated at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$

-- Has role
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role app_role)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_roles.user_id = $1
        AND role = $2
    );
$function$

```



```
Trigger Name: notes_updated_at
Schema: public
Table: notes
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION handle_updated_at()

---

Trigger Name: after_delete_comment
Schema: public
Table: post_comments
Event: DELETE
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION decrement_comments_count()

---

Trigger Name: after_post_like_change
Schema: public
Table: post_likes
Event: INSERT
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION update_likes_count()

---

Trigger Name: after_post_like_change
Schema: public
Table: post_likes
Event: DELETE
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION update_likes_count()

---

Trigger Name: after_comment_like_change
Schema: public
Table: comment_likes
Event: INSERT
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION update_comment_likes_count()

---

Trigger Name: after_comment_like_change
Schema: public
Table: comment_likes
Event: DELETE
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION update_comment_likes_count()

---

Trigger Name: on_auth_user_created
Schema: auth
Table: users
Event: INSERT
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION handle_new_user()

---

Trigger Name: on_user_created
Schema: public
Table: profiles
Event: INSERT
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION create_user_wallet()

---

Trigger Name: on_user_login
Schema: auth
Table: sessions
Event: INSERT
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION update_last_login()

---

Trigger Name: set_timestamp
Schema: public
Table: profiles
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION trigger_set_timestamp()

---

Trigger Name: handle_system_tasks_updated_at
Schema: public
Table: system_tasks
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION handle_updated_at()

---

Trigger Name: handle_system_config_updated_at
Schema: public
Table: system_config
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION handle_updated_at()

---

Trigger Name: handle_models_updated_at
Schema: public
Table: models
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION handle_updated_at()

---

Trigger Name: set_updated_at
Schema: public
Table: profiles
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION update_updated_at_column()

---

Trigger Name: update_community_posts_modtime
Schema: public
Table: community_posts
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION update_modified_column()

---

Trigger Name: update_post_comments_modtime
Schema: public
Table: post_comments
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION update_modified_column()

---

Trigger Name: after_insert_comment
Schema: public
Table: post_comments
Event: INSERT
Timing: AFTER
Orientation: ROW
Statement:
EXECUTE FUNCTION increment_comments_count()

---

Trigger Name: set_timestamp_canvas_projects
Schema: public
Table: canvas_projects
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION trigger_set_timestamp()

---

Trigger Name: set_timestamp_canvas_elements
Schema: public
Table: canvas_elements
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION trigger_set_timestamp()

---

Trigger Name: set_timestamp_canvas_connections
Schema: public
Table: canvas_connections
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION trigger_set_timestamp()

---

Trigger Name: set_timestamp_canvas_tasks
Schema: public
Table: canvas_tasks
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION trigger_set_timestamp()

---

Trigger Name: set_timestamp_canvas_calendar_events
Schema: public
Table: canvas_calendar_events
Event: UPDATE
Timing: BEFORE
Orientation: ROW
Statement:
EXECUTE FUNCTION trigger_set_timestamp()



```

## Supabase Secrets

Here are all the Supabase secrets defined in the project:

Secret Name: SUPABASE_URL
Secret Name: SUPABASE_ANON_KEY
Secret Name: SUPABASE_SERVICE_ROLE_KEY
Secret Name: SUPABASE_DB_URL

## Storage Buckets

The project doesn't have any storage buckets defined:

There are no storage buckets in the Supabase project.

This is all the database information available in the codebase. The database includes functions for user management, wallet operations, NFT transactions, community features, and various utility functions. There are also triggers for maintaining data integrity and timestamps, and secrets for Supabase configuration.