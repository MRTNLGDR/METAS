/*
  # Authentication and Authorization System

  1. Tables
    - organizations: Stores organization data
    - organization_members: Links users to organizations with roles
    - module_permissions: Defines module access for each role
    - user_settings: Stores user-specific settings and preferences

  2. Roles
    - super_admin: Platform owner with full access
    - admin: Organization admin who can manage their organization's access
    - collaborator: Organization member with limited access
    - client: End user with restricted access

  3. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Create organizations table if not exists
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organization_members table if not exists
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_role CHECK (role IN ('super_admin', 'admin', 'collaborator', 'client')),
  UNIQUE(organization_id, user_id)
);

-- Create module_permissions table if not exists
CREATE TABLE IF NOT EXISTS module_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  module_name text NOT NULL,
  role text NOT NULL,
  permissions jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_role CHECK (role IN ('admin', 'collaborator', 'client')),
  UNIQUE(organization_id, module_name, role)
);

-- Create user_settings table if not exists
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'dark',
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Super admin can manage all organizations" ON organizations;
DROP POLICY IF EXISTS "Admins can view their organization" ON organizations;
DROP POLICY IF EXISTS "Super admin can manage all members" ON organization_members;
DROP POLICY IF EXISTS "Admins can manage their organization members" ON organization_members;
DROP POLICY IF EXISTS "Super admin can manage all module permissions" ON module_permissions;
DROP POLICY IF EXISTS "Admins can manage their organization module permissions" ON module_permissions;
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;

-- Create new policies
CREATE POLICY "Super admin can manage all organizations"
  ON organizations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND organization_id = organizations.id
      AND role IN ('admin', 'collaborator', 'client')
    )
  );

CREATE POLICY "Super admin can manage all members"
  ON organization_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can manage their organization members"
  ON organization_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND organization_id = organization_members.organization_id
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND organization_id = organization_members.organization_id
      AND role = 'admin'
    )
  );

CREATE POLICY "Super admin can manage all module permissions"
  ON module_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Admins can manage their organization module permissions"
  ON module_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND organization_id = module_permissions.organization_id
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND organization_id = module_permissions.organization_id
      AND role = 'admin'
    )
  );

CREATE POLICY "Users can manage their own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_org_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_module_permissions_org ON module_permissions(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);

-- Create triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_organizations_updated_at'
  ) THEN
    CREATE TRIGGER update_organizations_updated_at
      BEFORE UPDATE ON organizations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_organization_members_updated_at'
  ) THEN
    CREATE TRIGGER update_organization_members_updated_at
      BEFORE UPDATE ON organization_members
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_module_permissions_updated_at'
  ) THEN
    CREATE TRIGGER update_module_permissions_updated_at
      BEFORE UPDATE ON module_permissions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_user_settings_updated_at
      BEFORE UPDATE ON user_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Insert super admin organization and member if they don't exist
DO $$
BEGIN
  -- Insert organization if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM organizations 
    WHERE id = 'e87e0e8e-9a3a-4c70-8c9a-4a3b0e8e9a3a'
  ) THEN
    INSERT INTO organizations (id, name, metadata)
    VALUES (
      'e87e0e8e-9a3a-4c70-8c9a-4a3b0e8e9a3a',
      'Platform Organization',
      jsonb_build_object(
        'type', 'platform',
        'features', jsonb_build_array('all')
      )
    );
  END IF;

  -- Insert super admin member if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM organization_members om
    JOIN auth.users u ON u.id = om.user_id
    WHERE u.email = 'saintgangfamilyltda@gmail.com'
    AND om.role = 'super_admin'
  ) THEN
    INSERT INTO organization_members (
      organization_id,
      user_id,
      role,
      permissions
    )
    VALUES (
      'e87e0e8e-9a3a-4c70-8c9a-4a3b0e8e9a3a',
      (SELECT id FROM auth.users WHERE email = 'saintgangfamilyltda@gmail.com'),
      'super_admin',
      jsonb_build_object(
        'modules', jsonb_build_array('all'),
        'features', jsonb_build_array('all'),
        'admin', true
      )
    );
  END IF;
END $$;