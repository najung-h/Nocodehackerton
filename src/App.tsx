import { useState } from 'react';
import { Search, ClipboardList, MessageCircle, LogIn, User as UserIcon } from 'lucide-react';
import { NestBadge } from './components/NestBadge';
import { FeatureCard } from './components/FeatureCard';
import { SearchPage } from './components/SearchPage';
import { ChecklistPage } from './components/ChecklistPage';
import { ChatbotPage } from './components/ChatbotPage';
import { MyPage } from './components/MyPage';
import { Button } from './components/ui/button';
import { toast } from 'sonner';

type Page = 'home' | 'search' | 'checklist' | 'chatbot' | 'mypage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (currentPage === 'search') {
    return <SearchPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'checklist') {
    return <ChecklistPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'chatbot') {
    return <ChatbotPage onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'mypage') {
    return <MyPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center justify-center">
                <NestBadge size={48} />
              </div>
              <div>
                <h1 className="text-gray-900">둥지</h1>
                <p className="text-xs sm:text-sm text-gray-600">집 찾는 아기새의 첫 전월세 비서</p>
              </div>
            </div>
            <Button 
              onClick={() => setCurrentPage('mypage')}
              variant="outline"
              className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden sm:inline">마이페이지</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 md:mb-12 text-center">
            <div className="flex justify-center mb-4 md:mb-6">
              <NestBadge size={120} />
            </div>
            <h2 className="mb-3 md:mb-4 text-gray-900 px-4">안전한 전월세 계약의 시작</h2>
            <p className="text-sm md:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed px-4">
              처음 집을 구하는 사회 초년생을 위한 전월세 계약 가이드입니다.
              <br className="hidden sm:block" />
              법률 용어 한 줄 모르는 '아기새'도 안전하게 둥지를 틀 수 있도록 도와드릴게요.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Left: Checklist (Full Height) */}
            <div className="md:row-span-2 w-full">
              <FeatureCard
                icon={ClipboardList}
                title="전월세 체크리스트"
                description="계약 전 필수 14개 항목을 자동으로 점검해드립니다."
                onClick={() => setCurrentPage('checklist')}
                large
              />
            </div>
            
            {/* Right Top: Chatbot */}
            <div className="w-full">
              <FeatureCard
                icon={MessageCircle}
                title="둥지 AI 챗봇"
                description="어려운 법률 언어도 쉽게 설명해주는 당신의 전월세 비서."
                onClick={() => setCurrentPage('chatbot')}
              />
            </div>
            
            {/* Right Bottom: Search */}
            <div className="w-full">
              <FeatureCard
                icon={Search}
                title="판례/법률 검색"
                description="궁금한 전월세 분쟁이나 법령을 한 번에 찾아보세요."
                onClick={() => setCurrentPage('search')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}