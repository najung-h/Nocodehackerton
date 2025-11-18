import { ArrowLeft, ClipboardList, LogIn, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ChecklistSection } from './ChecklistSection';
import { toast } from 'sonner@2.0.3';
import checklistImage from "figma:asset/baby_in_nest.png";

interface ChecklistPageProps {
  onBack: () => void;
  onChatbot: () => void;
}

export function ChecklistPage({ onBack, onChatbot }: ChecklistPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로
          </Button>
          <Button 
            onClick={() => toast.info('로그인 기능은 준비 중입니다')}
            variant="outline"
            className="border-[#22909D] text-[#22909D] hover:bg-[#22909D]/10 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={checklistImage}
                alt="둥지 짓기 플랜"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-gray-900">둥지 짓기 플랜</h1>
          </div>
          <p className="text-sm text-gray-700">
            집 구하는 순서대로 하나씩 떠먹여줄게
          </p>
        </div>

        {/* Checklist */}
        <ChecklistSection onChatbot={onChatbot} />
      </div>

      {/* 챗봇 플로팅 버튼 */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          {/* 펄스 애니메이션 효과 */}
          <div className="absolute inset-0 bg-[#22909D] rounded-full opacity-75 group-hover:opacity-100 animate-pulse"></div>
          
          <Button
            onClick={onChatbot}
            className="relative w-16 h-16 rounded-full bg-[#22909D] hover:bg-[#22909D]/90 text-white shadow-2xl hover:shadow-[#22909D]/50 transition-all duration-300 transform hover:scale-110 border-4 border-white"
            title="둥지 AI 챗봇"
          >
            <div className="relative">
              <MessageCircle className="w-7 h-7" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            </div>
          </Button>
          
          {/* 툴팁 */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
              💬 AI 챗봇과 대화하기
              <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
