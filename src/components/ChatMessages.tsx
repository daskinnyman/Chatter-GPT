import { TypingSpinner } from "@/components/ui/spinner";
import { Message } from "@/app/types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

function renderMessage(message: Message) {
  if (message.role === "user") {
    return (
      <div key={message.id} className="flex justify-end">
        <div className="max-w-[70%] rounded-lg p-3 bg-blue-600 text-white">
          <p className="text-sm">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <div key={message.id} className="flex justify-start">
        <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <p className="text-sm">{message.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
}

function renderStateIndicator(isLoading: boolean, error: string | null) {
  if (isLoading) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <TypingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[70%] rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <p className="text-sm">發生錯誤，請稍後再試。</p>
        </div>
      </div>
    );
  }
}

export function ChatMessages({
  messages,
  isLoading,
  error,
}: ChatMessagesProps) {
  function renderMessages() {
    if (messages.length === 1) {
      return (
        <div className="text-center text-gray-500 mt-8">
          <p className="text-lg">開始與 AI 聊天吧！</p>
          <p className="text-sm mt-2">輸入您的問題，AI 將為您提供協助。</p>
        </div>
      );
    }

    return messages.map((message) => renderMessage(message));
  }

  return (
    <>
      {renderMessages()}
      {renderStateIndicator(isLoading, error)}
    </>
  );
}
