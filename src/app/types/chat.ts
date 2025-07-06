import z from "zod";

export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
  isUser: z.boolean(),
  timestamp: z.date().or(z.string()),
});

export type Message = z.infer<typeof messageSchema>;

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
