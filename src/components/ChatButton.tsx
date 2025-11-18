import { Button } from './ui/button';
import chatbotImage from "figma:asset/2a81b212b759391823e79c02ecfb52fe0f3596c4.png";

interface ChatButtonProps {
  onClick: () => void;
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#22909D] via-[#22909D] to-[#22909D]/80 hover:from-[#22909D]/90 hover:via-[#22909D]/90 hover:to-[#22909D]/70 text-white shadow-2xl hover:shadow-[#22909D]/50 transition-all duration-300 transform hover:scale-110 border-4 border-white p-1.5"
        title="둥지 AI 챗봇"
        aria-label="AI 챗봇 열기"
      >
        <img 
          src={chatbotImage} 
          alt="챗봇" 
          className="w-full h-full object-contain"
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
      </Button>
    </div>
  );
}