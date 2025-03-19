import { z } from 'zod';

export const AssistantConfigSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  expertise: z.array(z.string()),
  personality: z.object({
    traits: z.array(z.string()),
    communicationStyle: z.string(),
    formality: z.enum(["casual", "neutral", "formal"]),
  }),
  knowledge: z.object({
    domains: z.array(z.string()),
    limitations: z.array(z.string()),
  }),
  responseFormat: z.object({
    style: z.enum(["concise", "detailed", "conversational"]),
    structure: z.enum(["free", "bullet-points", "numbered", "structured"]),
  }),
  language: z.object({
    primary: z.string(),
    tone: z.enum(["professional", "friendly", "technical"]),
  }),
  contextHandling: z.object({
    memoryLength: z.number().min(1).max(100),
    contextStrategy: z.enum(["recent", "relevant", "combined"]),
  }),
  modelConfig: z.object({
    model: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(1).max(4096),
    topP: z.number().min(0).max(1),
    frequencyPenalty: z.number().min(-2).max(2),
    presencePenalty: z.number().min(-2).max(2),
    stopSequences: z.array(z.string()),
  }),
});

export type AssistantConfig = z.infer<typeof AssistantConfigSchema>;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  config: AssistantConfig;
  createdAt: number;
  updatedAt: number;
}