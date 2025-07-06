"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatWithStore } from "@/hooks/useChatWithStore";
import { SessionManager } from "@/components/SessionManager";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessages } from "@/components/ChatMessages";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
import { RotateCcw, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    personas,
    sessions,
    currentSessionId,
    messagesEndRef,
    messagesContainerRef,
    shouldAutoScroll,
    handleScroll,
    handleSendMessage,
    handleKeyPress,
    handleNewSession,
    handleSwitchSession,
    handleDeleteSession,
    handleClearCurrentSession,
    forceScrollToBottom,
  } = useChatWithStore();

  return (
    <div className="max-w-7xl mx-auto h-screen p-4">
      <div className="flex gap-4 h-full">
        {/* 會話管理側邊欄 */}
        <SessionManager
          onNewSession={handleNewSession}
          onSwitchSession={handleSwitchSession}
          onDeleteSession={handleDeleteSession}
        />

        {/* 主要聊天區域 */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-left text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Chatter GPT
                  </CardTitle>
                </div>

                {/* 操作按鈕 */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCurrentSession}
                    disabled={!currentSessionId || messages.length <= 1}
                    title="清除當前對話"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/settings")}
                    title="設定"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 當前會話資訊 */}
              {currentSessionId && (
                <div className="text-sm text-gray-500 mt-2">
                  當前會話：
                  {sessions.find((s) => s.id === currentSessionId)?.personaId
                    ? personas.find(
                        (p) =>
                          p.id ===
                          sessions.find((s) => s.id === currentSessionId)
                            ?.personaId
                      )?.name
                    : "未知角色"}
                  ({messages.filter((msg) => msg.role !== "system").length}{" "}
                  則訊息)
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-scroll relative">
              {/* 聊天訊息區域 */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={messagesContainerRef}
                onScroll={handleScroll}
              >
                <ChatMessages
                  messages={messages}
                  isLoading={isLoading}
                  error={error}
                />
                {/* 隱形的滾動目標元素 */}
                <div ref={messagesEndRef} />
              </div>

              {/* 輸入區域 */}
              <ChatInput
                input={input}
                setInput={setInput}
                onKeyPress={handleKeyPress}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                currentSessionId={currentSessionId}
              />

              {/* 滾動到底部按鈕 - 固定在 CardContent 右下角 */}
              <ScrollToBottomButton
                shouldAutoScroll={shouldAutoScroll}
                onScrollToBottom={forceScrollToBottom}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
