import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { useChatStore } from "@/lib/store";
import { Message } from "@/app/types/chat";

interface SessionManagerProps {
  onNewSession: (personaId: string) => void;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const SessionManager: React.FC<SessionManagerProps> = ({
  onNewSession,
  onSwitchSession,
  onDeleteSession,
}) => {
  const { personas, sessions, currentSessionId } = useChatStore();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("zh-TW", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPersonaName = (personaId: string) => {
    return personas.find((p) => p.id === personaId)?.name || "未知角色";
  };

  const getSessionPreview = (messages: Message[]) => {
    const userMessages = messages.filter((msg) => msg.role === "user");
    if (userMessages.length === 0) return "新對話";
    return userMessages[userMessages.length - 1].content.slice(0, 30) + "...";
  };

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">對話會話</CardTitle>
          <div className="flex items-center gap-2">
            <Select onValueChange={onNewSession}>
              <SelectTrigger className="w-32">
                <Plus className="w-4 h-4" />
              </SelectTrigger>
              <SelectContent>
                {personas.map((persona) => (
                  <SelectItem key={persona.id} value={persona.id}>
                    {persona.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>還沒有對話會話</p>
            <p className="text-sm">點擊 + 開始新對話</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  session.id === currentSessionId
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
                onClick={() => onSwitchSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getPersonaName(session.personaId)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(session.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {getSessionPreview(session.messages)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {
                        session.messages.filter((msg) => msg.role !== "system")
                          .length
                      }{" "}
                      則訊息
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
