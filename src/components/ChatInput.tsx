import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  currentSessionId: string | null;
}

export function ChatInput({
  input,
  setInput,
  onSendMessage,
  onKeyPress,
  isLoading,
  currentSessionId,
}: ChatInputProps) {
  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder={isLoading ? "AI 正在回應中..." : "輸入您的訊息..."}
          className="flex-1 resize-none"
          rows={1}
          disabled={isLoading || !currentSessionId}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || isLoading || !currentSessionId}
          className="min-w-[80px]"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>發送中</span>
            </div>
          ) : (
            "發送"
          )}
        </Button>
      </div>
    </div>
  );
}
