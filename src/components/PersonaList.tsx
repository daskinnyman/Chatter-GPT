import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Persona } from "@/lib/store";

// PersonaList 元件
interface PersonaListProps {
  personas: Persona[];
  onEdit: (persona: Persona) => void;
  onDelete: (id: string) => void;
}

export const PersonaList: React.FC<PersonaListProps> = ({
  personas,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-3">
      {personas.map((persona) => (
        <div
          key={persona.id}
          className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium">{persona.name}</h3>
                {persona.id === "cuteCat" ||
                  persona.id === "scaryBird" ||
                  (persona.id === "psychologist" && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      預設
                    </span>
                  ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {persona.description}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {persona.systemPrompt}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(persona)}
                disabled={
                  persona.id === "cuteCat" ||
                  persona.id === "scaryBird" ||
                  persona.id === "psychologist"
                }
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(persona.id)}
                disabled={
                  persona.id === "cuteCat" ||
                  persona.id === "scaryBird" ||
                  persona.id === "psychologist"
                }
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
