/*
  # Add Default Plugins

  1. Changes
    - Add default plugins to the plugins table with rich metadata and configurations
    - Each plugin includes category, features, and default settings
    
  2. Default Plugins Added
    - Code Formatter
    - Git Integration
    - Database Explorer
    - Terminal Plus
    - AI Assistant
*/

-- Insert default plugins
INSERT INTO plugins (id, name, version, description, author, entry, config)
VALUES
  (
    gen_random_uuid(),
    'Code Formatter',
    '1.0.0',
    'Format code with support for multiple languages including JavaScript, TypeScript, Python, and more.',
    'Workspace Team',
    'code-formatter/index.ts',
    jsonb_build_object(
      'category', 'Development',
      'languages', ARRAY['javascript', 'typescript', 'python'],
      'settings', jsonb_build_object(
        'formatOnSave', true,
        'indentSize', 2
      )
    )
  ),
  (
    gen_random_uuid(),
    'Git Integration',
    '1.0.0',
    'Seamless Git integration with commit, push, pull, and branch management capabilities.',
    'Workspace Team',
    'git-integration/index.ts',
    jsonb_build_object(
      'category', 'Version Control',
      'features', ARRAY['commit', 'push', 'pull', 'branch'],
      'settings', jsonb_build_object(
        'autoFetch', true,
        'fetchInterval', 300
      )
    )
  ),
  (
    gen_random_uuid(),
    'Database Explorer',
    '1.0.0',
    'Explore and manage your database with a powerful visual interface.',
    'Workspace Team',
    'db-explorer/index.ts',
    jsonb_build_object(
      'category', 'Database',
      'features', ARRAY['query', 'visualize', 'export'],
      'settings', jsonb_build_object(
        'maxRows', 1000,
        'timeout', 30
      )
    )
  ),
  (
    gen_random_uuid(),
    'Terminal Plus',
    '1.0.0',
    'Enhanced terminal with multi-tab support, command history, and autocompletion.',
    'Workspace Team',
    'terminal-plus/index.ts',
    jsonb_build_object(
      'category', 'Development',
      'features', ARRAY['tabs', 'history', 'autocomplete'],
      'settings', jsonb_build_object(
        'maxHistory', 1000,
        'theme', 'dark'
      )
    )
  ),
  (
    gen_random_uuid(),
    'AI Assistant',
    '1.0.0',
    'Intelligent coding assistant powered by machine learning.',
    'Workspace Team',
    'ai-assistant/index.ts',
    jsonb_build_object(
      'category', 'AI & ML',
      'features', ARRAY['code-completion', 'refactoring', 'documentation'],
      'settings', jsonb_build_object(
        'model', 'gpt-4',
        'contextLength', 2048
      )
    )
  );