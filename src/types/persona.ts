import { z } from "zod";

// Zod schema 用於驗證 Persona 資料
export const personaSchema = z.object({
  name: z
    .string()
    .min(1, "角色名稱不能為空")
    .max(50, "角色名稱不能超過 50 個字元")
    .regex(/^[^\s].*[^\s]$/, "角色名稱不能以空格開頭或結尾"),
  systemPrompt: z
    .string()
    .min(10, "系統提示詞至少需要 10 個字元")
    .max(2000, "系統提示詞不能超過 2000 個字元"),
  description: z.string().max(200, "角色描述不能超過 200 個字元"),
});

export type PersonaFormData = z.infer<typeof personaSchema>;

// 錯誤訊息型別
export interface FormErrors {
  name?: string;
  systemPrompt?: string;
  description?: string;
}
