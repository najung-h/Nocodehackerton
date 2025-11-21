import { ArrowLeft, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { ChecklistSection } from './ChecklistSection';
import { toast } from 'sonner';
import checklistImage from "figma:asset/baby_in_nest.png";
import { ActionType } from '../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface ChecklistPageProps {
  onBack: () => void;
  onAction: (actionType: ActionType, payload?: any) => void;
  isLoading: Record<string, boolean>;
}

export function ChecklistPage({ onBack, onAction, isLoading }: ChecklistPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="ghost" className="text-gray-700 hover:text-gray-900">
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

        {/* 3. onAction과 isLoading을 ChecklistSection으로 전달 */}
        <ChecklistSection onAction={onAction} isLoading={isLoading} />
      </div>
    </div>
  );
}
