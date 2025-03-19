import { z } from 'zod';

export const PluginConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  icon: z.string().optional(),
  entry: z.string(),
  permissions: z.array(z.string()).default([]),
  dependencies: z.record(z.string(), z.string()).default({}),
  config: z.record(z.string(), z.unknown()).default({}),
  userId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export type PluginConfig = z.infer<typeof PluginConfigSchema>;

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  isActive: boolean;
  isInstalled: boolean;
  entry: string;
  permissions: string[];
  dependencies: Record<string, string>;
  config: Record<string, unknown>;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}