export const storageConfig = {
  // Sync configuration
  sync: {
    interval: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 5000, // 5 seconds
  },

  // Local storage configuration
  local: {
    name: 'workspace_storage',
    version: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  },

  // Cloud storage configuration
  cloud: {
    bucket: 'workspace',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['*'], // Allow all file types
  },

  // Cache configuration
  cache: {
    maxAge: 3600, // 1 hour
    maxItems: 100,
  }
};