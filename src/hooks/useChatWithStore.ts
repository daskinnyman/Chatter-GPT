import { useState, useRef, useEffect } from "react";
import { Message } from "@/app/types/chat";
import { useChatStore } from "@/lib/store";

const fetchResponse = async (messages: Message[]) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages }),
  });
  return response.json();
};

export const useChatWithStore = () => {
  const {
    personas,
    currentPersonaId,
    sessions,
    currentSessionId,
    currentMessages,
    setCurrentPersona,
    createSession,
    switchSession,
    deleteSession,
    addMessage,
    clearCurrentSession,
    getCurrentPersona,
    getCurrentSession,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 添加 ref 用於滾動到底部
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // 自動滾動到底部的函數
  const scrollToBottom = () => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 檢測用戶是否手動滾動
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px 的容錯範圍

    setShouldAutoScroll(isAtBottom);
  };

  // 當訊息或 loading 狀態改變時，自動滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isLoading]);

  // 強制滾動到底部的函數
  const forceScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setShouldAutoScroll(true);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !currentSessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      isUser: true,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput("");

    try {
      setIsLoading(true);
      setError(null);

      // 準備要發送的訊息
      const messagesToSend = [...currentMessages, userMessage];

      // 只送出系統訊息和最近的九個訊息
      const systemMessage = messagesToSend.find((msg) => msg.role === "system");
      const chatMessages = messagesToSend.filter(
        (msg) => msg.role !== "system"
      );
      const recentMessages = chatMessages.slice(-9);

      const finalMessages = systemMessage
        ? [systemMessage, ...recentMessages]
        : recentMessages;

      const response = await fetchResponse(finalMessages);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: response,
        role: "assistant",
        isUser: false,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error(error);
      setError("發生錯誤，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePersonaChange = (personaId: string) => {
    setCurrentPersona(personaId);

    // 如果當前會話存在，更新系統訊息
    if (currentSessionId) {
      const persona = personas.find((p) => p.id === personaId);
      if (persona) {
        const systemMessage: Message = {
          id: Date.now().toString(),
          role: "system",
          content: persona.systemPrompt,
          isUser: false,
          timestamp: new Date(),
        };

        // 清除當前會話並重新開始
        clearCurrentSession();
        addMessage(systemMessage);
      }
    } else {
      // 如果沒有當前會話，創建一個新的
      createSession(personaId);
    }
  };

  const handleNewSession = (personaId: string) => {
    createSession(personaId);
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  const handleClearCurrentSession = () => {
    clearCurrentSession();
  };

  return {
    // 狀態
    messages: currentMessages,
    input,
    setInput,
    isLoading,
    error,
    selectedPersona: currentPersonaId,
    personas,
    sessions,
    currentSessionId,
    messagesEndRef,
    messagesContainerRef,
    shouldAutoScroll,

    // 事件處理
    handleScroll,
    handleSendMessage,
    handleKeyPress,
    handlePersonaChange,
    handleNewSession,
    handleSwitchSession,
    handleDeleteSession,
    handleClearCurrentSession,
    forceScrollToBottom,

    // 獲取器
    getCurrentPersona,
    getCurrentSession,
  };
};
