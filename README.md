# Chatter GPT

一個基於 Next.js 15 和 OpenAI API 的智能聊天應用程式，支援多角色對話和會話管理。

## 功能特色

### 🤖 多角色支援

- **可愛貓咪**: 友善可愛的小貓咪角色
- **心理諮詢師**: 專業的心理諮詢師角色
- **自定義角色**: 可以創建和管理自己的角色

### 💬 會話管理

- **多會話支援**: 可以同時管理多個對話會話
- **會話切換**: 在不同會話間自由切換
- **會話刪除**: 刪除不需要的會話
- **會話預覽**: 顯示會話的最後一條訊息和時間

### 🎨 現代化 UI

- **響應式設計**: 支援桌面和移動設備
- **深色模式**: 支援深色和淺色主題
- **滾動控制**: 智能滾動和手動滾動控制
- **載入狀態**: 優雅的載入和錯誤處理
- **Radix UI 組件**: 使用高品質的 UI 組件庫

### 💾 狀態管理

- **Zustand Store**: 使用 Zustand 進行狀態管理
- **本地持久化**: 會話和角色設定會自動保存
- **實時同步**: 狀態變更即時反映在 UI 上

## 技術架構

### 前端技術

- **Next.js 15.3.4**: React 框架，支援 App Router
- **React 19.0.0**: 最新版本的 React
- **TypeScript 5**: 類型安全
- **Tailwind CSS 4**: 最新版本的樣式框架
- **Zustand 5.0.6**: 輕量級狀態管理
- **Lucide React 0.525.0**: 現代圖標庫
- **Radix UI**: 無障礙 UI 組件庫
- **Zod 3.25.67**: TypeScript 優先的 schema 驗證

### 後端技術

- **Next.js API Routes**: 後端 API
- **OpenAI API 5.8.2**: AI 對話服務
- **Turbopack**: 快速開發伺服器

## 安裝和運行

### 前置需求

- Node.js 18+
- npm 或 yarn

### 安裝步驟

1. 克隆專案

```bash
git clone <repository-url>
cd chatter-gpt
```

2. 安裝依賴

```bash
npm install
```

3. 設定環境變數
   創建 `.env.local` 文件並添加：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. 運行開發伺服器

```bash
npm run dev
```

5. 開啟瀏覽器訪問 `http://localhost:3000`

### 可用的腳本

```bash
npm run dev      # 啟動開發伺服器（使用 Turbopack）
npm run build    # 建構生產版本
npm run start    # 啟動生產伺服器
npm run lint     # 執行 ESLint 檢查
```

## 使用指南

### 基本聊天

1. 選擇一個角色（可愛貓咪、心理諮詢師）
2. 在輸入框中輸入您的訊息
3. 按 Enter 或點擊發送按鈕
4. AI 會根據選擇的角色回應

### 會話管理

1. **創建新會話**: 點擊側邊欄的 "+" 按鈕
2. **切換會話**: 點擊側邊欄中的會話項目
3. **刪除會話**: 點擊會話項目旁的垃圾桶圖標
4. **清除當前會話**: 點擊頂部的重置按鈕

### 角色管理

1. 點擊頂部的設定按鈕進入設定頁面
2. 在角色管理區域可以：
   - 新增自定義角色
   - 編輯現有角色（非預設角色）
   - 刪除角色（非預設角色）

### 自定義角色

創建角色時需要設定：

- **角色名稱**: 顯示在選擇器中的名稱
- **角色描述**: 角色的簡短描述
- **系統提示詞**: 定義角色的行為和回應方式

## 專案結構

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   └── chat/         # 聊天 API 端點
│   │       └── route.ts  # 聊天 API 實現
│   ├── settings/          # 設定頁面
│   ├── types/             # TypeScript 類型定義
│   ├── globals.css        # 全域樣式
│   ├── layout.tsx         # 根佈局組件
│   └── page.tsx           # 主頁面
├── components/            # React 組件
│   ├── ui/               # UI 基礎組件（Radix UI）
│   │   ├── button.tsx    # 按鈕組件
│   │   ├── card.tsx      # 卡片組件
│   │   ├── dialog.tsx    # 對話框組件
│   │   ├── input.tsx     # 輸入框組件
│   │   ├── select.tsx    # 選擇器組件
│   │   ├── spinner.tsx   # 載入動畫組件
│   │   └── textarea.tsx  # 文字區域組件
│   ├── ChatInput.tsx     # 聊天輸入組件
│   ├── ChatMessages.tsx  # 聊天訊息組件
│   ├── PersonaForm.tsx   # 角色表單組件
│   ├── PersonaList.tsx   # 角色列表組件
│   ├── PersonaManager.tsx # 角色管理組件
│   ├── ScrollToBottomButton.tsx # 滾動到底部按鈕
│   └── SessionManager.tsx # 會話管理組件
├── hooks/                # 自定義 Hooks
│   └── useChatWithStore.ts # Zustand 整合 Hook
└── lib/                  # 工具函數
    ├── store.ts          # Zustand Store
    └── utils.ts          # 工具函數
```

## 狀態管理

### Zustand Store 結構

```typescript
interface ChatStore {
  // 角色相關
  personas: Persona[];
  currentPersonaId: string;

  // 會話相關
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentMessages: Message[];

  // Actions
  addPersona;
  updatePersona;
  deletePersona;
  createSession;
  switchSession;
  deleteSession;
  addMessage;
  updateMessage;
  deleteMessage;
}
```

### 持久化

- 使用 Zustand 的 `persist` middleware
- 資料自動保存到 localStorage
- 包含角色設定和會話歷史

## 開發指南

### 添加新功能

1. 在 `src/lib/store.ts` 中添加新的狀態和 actions
2. 在 `src/hooks/useChatWithStore.ts` 中整合新功能
3. 在對應的組件中使用新的功能

### 樣式修改

- 使用 Tailwind CSS 4 類名
- 支援深色模式：使用 `dark:` 前綴
- 響應式設計：使用 `sm:`, `md:`, `lg:` 等斷點
- 使用 `class-variance-authority` 和 `clsx` 進行條件樣式

### API 整合

- API 路由位於 `src/app/api/chat/route.ts`
- 使用 Next.js 的 API Routes 功能
- 支援 TypeScript 類型檢查
- 使用 Zod 進行請求驗證

### 組件開發

- 使用 Radix UI 作為基礎組件庫
- 遵循無障礙設計原則
- 使用 TypeScript 進行類型安全

## 部署

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 中導入專案
3. 設定環境變數 `OPENAI_API_KEY`
4. 部署完成

### 其他平台

專案可以部署到任何支援 Next.js 的平台：

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 開發工具

### 程式碼品質

- **ESLint 9**: 程式碼品質檢查
- **TypeScript 5**: 靜態類型檢查
- **Prettier**: 程式碼格式化（透過 ESLint 整合）

### 效能優化

- **Turbopack**: 快速開發伺服器
- **Next.js 15.3.4**: 最新的效能優化
- **Tailwind CSS 4**: 更小的 CSS 包大小

## 貢獻

歡迎提交 Issue 和 Pull Request！

### 開發流程

1. Fork 專案
2. 創建功能分支
3. 提交變更
4. 創建 Pull Request

### 程式碼規範

- 使用 TypeScript 進行開發
- 遵循 ESLint 規則
- 使用 Prettier 格式化程式碼
- 撰寫清晰的 commit 訊息

## 授權

MIT License

## 更新日誌

### v0.1.0

- ✅ 基本聊天功能
- ✅ 多角色支援
- ✅ 響應式設計
- ✅ Zustand 狀態管理
- ✅ 多會話管理
- ✅ 角色管理功能
- ✅ 設定頁面
- ✅ 改進 UI/UX 設計
- ✅ Radix UI 組件整合
- ✅ TypeScript 完整支援
- ✅ Tailwind CSS 4 升級
- ✅ Next.js 15.3.4 升級
- ✅ React 19.0.0 升級
- ✅ 新增滾動控制功能
- ✅ 優化組件結構
