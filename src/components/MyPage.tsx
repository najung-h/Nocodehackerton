import { useState } from 'react';
import { ArrowLeft, User, Home, FileText, MessageSquare, Bookmark, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ProfileSection } from './mypage/ProfileSection';
import { PropertySection } from './mypage/PropertySection';
import { DocumentSection } from './mypage/DocumentSection';
import { ConversationSection } from './mypage/ConversationSection';
import { LinkSection } from './mypage/LinkSection';
import { toast } from 'sonner@2.0.3';

interface MyPageProps {
  onBack: () => void;
}

type Section = 'profile' | 'property' | 'document' | 'conversation' | 'link';

export function MyPage({ onBack }: MyPageProps) {
  const [currentSection, setCurrentSection] = useState<Section>('profile');

  const menuItems = [
    { id: 'profile' as Section, label: '내 프로필', icon: User },
    { id: 'property' as Section, label: '내 주택 정보', icon: Home },
    { id: 'document' as Section, label: '관련 문서', icon: FileText },
    { id: 'conversation' as Section, label: '대화 기록', icon: MessageSquare },
    { id: 'link' as Section, label: '저장한 링크', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로
              </Button>
              <h1 className="text-gray-900">마이페이지</h1>
            </div>
            <Button 
              onClick={() => toast.info('로그인 기능은 준비 중입니다')}
              variant="outline"
              className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">로그인</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 좌측 사이드바 */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-4 bg-white border-gray-200">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        currentSection === item.id
                          ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </aside>

          {/* 우측 콘텐츠 영역 */}
          <main className="flex-1">
            {currentSection === 'profile' && <ProfileSection />}
            {currentSection === 'property' && <PropertySection />}
            {currentSection === 'document' && <DocumentSection />}
            {currentSection === 'conversation' && <ConversationSection />}
            {currentSection === 'link' && <LinkSection />}
          </main>
        </div>
      </div>
    </div>
  );
}
