import { Button } from './ui/button';
import { NestBadge } from './NestBadge';

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="relative group transition-transform hover:scale-105"
      >
        {/* NestBadge with sparkle */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <NestBadge size={90} />
          
          {/* Sparkle */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-xs">✨</span>
          </div>
        </div>

        <span className="sr-only">AI 챗봇 열기</span>
      </button>
    </div>
  );
}