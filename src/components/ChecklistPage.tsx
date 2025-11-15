import { ArrowLeft, ClipboardList, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { ChecklistSection } from './ChecklistSection';
import { toast } from 'sonner';

interface ChecklistPageProps {
  onBack: () => void;
}

export function ChecklistPage({ onBack }: ChecklistPageProps) {
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
            className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
            </div>
            <h1 className="text-gray-900">전월세 체크리스트</h1>
          </div>
          <p className="text-sm text-gray-700">
            계약 전 필수 14개 항목을 자동으로 점검해드립니다.
          </p>
        </div>

        {/* Checklist */}
        <ChecklistSection />
      </div>
    </div>
  );
}