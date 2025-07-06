import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useChatStore, Persona } from "@/lib/store";
import { PersonaForm } from "./PersonaForm";
import { PersonaList } from "./PersonaList";
import { PersonaFormData } from "@/types/persona";

export const PersonaManager: React.FC = () => {
  const { personas, addPersona, updatePersona, deletePersona } = useChatStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);

  const handleOpenDialog = (persona?: Persona) => {
    if (persona) {
      setEditingPersona(persona);
    } else {
      setEditingPersona(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (formData: PersonaFormData) => {
    if (editingPersona) {
      updatePersona(editingPersona.id, formData);
    } else {
      const newPersona: Persona = {
        id: Date.now().toString(),
        ...formData,
      };
      addPersona(newPersona);
    }

    setIsDialogOpen(false);
    setEditingPersona(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingPersona(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("確定要刪除這個角色嗎？")) {
      deletePersona(id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">角色管理</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => handleOpenDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                新增角色
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingPersona ? "編輯角色" : "新增角色"}
                </DialogTitle>
              </DialogHeader>
              <PersonaForm
                editingPersona={editingPersona}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <PersonaList
          personas={personas}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
