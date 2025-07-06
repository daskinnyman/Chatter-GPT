import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Persona } from "@/lib/store";
import { personaSchema, PersonaFormData, FormErrors } from "@/types/persona";
import { z } from "zod";

// PersonaForm 元件
interface PersonaFormProps {
  editingPersona: Persona | null;
  onSubmit: (formData: PersonaFormData) => void;
  onCancel: () => void;
}

export const PersonaForm: React.FC<PersonaFormProps> = ({
  editingPersona,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<PersonaFormData>({
    name: editingPersona?.name || "",
    systemPrompt: editingPersona?.systemPrompt || "",
    description: editingPersona?.description || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    try {
      personaSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof PersonaFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // 清除該欄位的錯誤訊息
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">
          角色名稱
        </label>
        <Input
          value={formData.name}
          required
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="例如：可愛貓咪"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">角色描述</label>
        <Input
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="簡短描述這個角色的特色"
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium after:content-['*'] after:text-red-500 after:ml-1">
          系統提示詞
        </label>
        <Textarea
          required
          value={formData.systemPrompt}
          onChange={(e) => handleInputChange("systemPrompt", e.target.value)}
          placeholder="定義這個角色的行為和回應方式..."
          rows={6}
          className={errors.systemPrompt ? "border-red-500" : ""}
        />
        {errors.systemPrompt && (
          <p className="text-sm text-red-500 mt-1">{errors.systemPrompt}</p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSubmit}>
          {editingPersona ? "更新" : "新增"}
        </Button>
      </div>
    </div>
  );
};
