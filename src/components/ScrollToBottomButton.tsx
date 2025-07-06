interface ScrollToBottomButtonProps {
  shouldAutoScroll: boolean;
  onScrollToBottom: () => void;
}

export function ScrollToBottomButton({
  shouldAutoScroll,
  onScrollToBottom,
}: ScrollToBottomButtonProps) {
  if (shouldAutoScroll) {
    return null;
  }

  return (
    <button
      onClick={onScrollToBottom}
      className="absolute bottom-30 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
      title="滾動到底部"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
}
