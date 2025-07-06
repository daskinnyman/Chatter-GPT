import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message } from "@/app/types/chat";

// 角色定義
export interface Persona {
  id: string;
  name: string;
  systemPrompt: string;
  description: string;
}

// 對話會話
export interface ChatSession {
  id: string;
  personaId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Store 狀態
interface ChatStore {
  // 角色相關
  personas: Persona[];
  currentPersonaId: string;

  // 對話會話相關
  sessions: ChatSession[];
  currentSessionId: string | null;

  // 當前會話的訊息
  currentMessages: Message[];

  // Actions
  addPersona: (persona: Persona) => void;
  updatePersona: (id: string, updates: Partial<Persona>) => void;
  deletePersona: (id: string) => void;
  setCurrentPersona: (id: string) => void;

  // 會話管理
  createSession: (personaId: string) => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;

  // 訊息管理
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearCurrentSession: () => void;

  // 獲取當前角色
  getCurrentPersona: () => Persona | undefined;
  getCurrentSession: () => ChatSession | undefined;
}

// 預設角色
const defaultPersonas: Persona[] = [
  {
    id: "cuteCat",
    name: "可愛貓咪",
    systemPrompt:
      "你是一隻可愛的貓咪，會用喵喵叫和可愛的語氣回答問題。你會用中文回答，語氣要像一隻友善的小貓咪。",
    description: "一隻友善可愛的小貓咪",
  },
  {
    id: "psychologist",
    name: "心理諮詢師",
    systemPrompt:
      "你是一個專業的心理諮詢師，擅長使用阿德勒學派的理論回答問題。你會使用中文回答使用者提出的問題，並且要使用類似使用者朋友的方式回答，不要使用專業術語，回應盡量簡潔。",
    description: "專業的心理諮詢師",
  },
];

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // 初始狀態
      personas: defaultPersonas,
      currentPersonaId: "psychologist",
      sessions: [],
      currentSessionId: null,
      currentMessages: [],

      // 角色管理 Actions
      addPersona: (persona) => {
        set((state) => ({
          personas: [...state.personas, persona],
        }));
      },

      updatePersona: (id, updates) => {
        set((state) => ({
          personas: state.personas.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deletePersona: (id) => {
        set((state) => ({
          personas: state.personas.filter((p) => p.id !== id),
          currentPersonaId:
            state.currentPersonaId === id
              ? "psychologist"
              : state.currentPersonaId,
        }));
      },

      setCurrentPersona: (id) => {
        set({ currentPersonaId: id });
      },

      // 會話管理 Actions
      createSession: (personaId) => {
        const sessionId = Date.now().toString();
        const persona = get().personas.find((p) => p.id === personaId);

        if (!persona) return;

        const newSession: ChatSession = {
          id: sessionId,
          personaId,
          messages: [
            {
              id: Date.now().toString(),
              role: "system",
              content: persona.systemPrompt,
              isUser: false,
              timestamp: new Date(),
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: sessionId,
          currentMessages: newSession.messages,
        }));
      },

      switchSession: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          set({
            currentSessionId: sessionId,
            currentMessages: session.messages,
            currentPersonaId: session.personaId,
          });
        }
      },

      deleteSession: (sessionId) => {
        set((state) => {
          const newSessions = state.sessions.filter((s) => s.id !== sessionId);
          const newCurrentSessionId =
            state.currentSessionId === sessionId
              ? newSessions.length > 0
                ? newSessions[0].id
                : null
              : state.currentSessionId;

          const newCurrentMessages = newCurrentSessionId
            ? newSessions.find((s) => s.id === newCurrentSessionId)?.messages ||
              []
            : [];

          return {
            sessions: newSessions,
            currentSessionId: newCurrentSessionId,
            currentMessages: newCurrentMessages,
          };
        });
      },

      clearAllSessions: () => {
        set({
          sessions: [],
          currentSessionId: null,
          currentMessages: [],
        });
      },

      // 訊息管理 Actions
      addMessage: (message) => {
        set((state) => {
          const newMessages = [...state.currentMessages, message];

          // 更新當前會話
          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: newMessages, updatedAt: new Date() }
              : session
          );

          return {
            currentMessages: newMessages,
            sessions: updatedSessions,
          };
        });
      },

      updateMessage: (id, updates) => {
        set((state) => {
          const newMessages = state.currentMessages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          );

          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: newMessages, updatedAt: new Date() }
              : session
          );

          return {
            currentMessages: newMessages,
            sessions: updatedSessions,
          };
        });
      },

      deleteMessage: (id) => {
        set((state) => {
          const newMessages = state.currentMessages.filter(
            (msg) => msg.id !== id
          );

          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: newMessages, updatedAt: new Date() }
              : session
          );

          return {
            currentMessages: newMessages,
            sessions: updatedSessions,
          };
        });
      },

      clearCurrentSession: () => {
        set((state) => {
          const currentPersona = get().getCurrentPersona();
          const systemMessage: Message = {
            id: Date.now().toString(),
            role: "system",
            content: currentPersona?.systemPrompt || "",
            isUser: false,
            timestamp: new Date(),
          };

          const newMessages = [systemMessage];

          const updatedSessions = state.sessions.map((session) =>
            session.id === state.currentSessionId
              ? { ...session, messages: newMessages, updatedAt: new Date() }
              : session
          );

          return {
            currentMessages: newMessages,
            sessions: updatedSessions,
          };
        });
      },

      // 獲取器
      getCurrentPersona: () => {
        const { personas, currentPersonaId } = get();
        return personas.find((p) => p.id === currentPersonaId);
      },

      getCurrentSession: () => {
        const { sessions, currentSessionId } = get();
        return sessions.find((s) => s.id === currentSessionId);
      },
    }),
    {
      name: "chat-store",
    }
  )
);
