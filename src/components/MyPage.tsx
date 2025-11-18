import { useState } from 'react';
import { ArrowLeft, User, Home, MessageSquare, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ProfileSection } from './mypage/ProfileSection';
import { PropertySection } from './mypage/PropertySection';
import { ConversationSection } from './mypage/ConversationSection';
import { LinkSection } from './mypage/LinkSection';

interface MyPageProps {
  onBack: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

type Section = 'profile' | 'property' | 'conversation' | 'link';

export function MyPage({ onBack, isLoggedIn, onLogout }: MyPageProps) {
  const [currentSection, setCurrentSection] = useState<Section>('profile');

  const menuItems = [
    { id: 'profile' as Section, label: '내 프로필', icon: User },
    { id: 'property' as Section, label: '내 주택 정보', icon: Home },
    { id: 'conversation' as Section, label: '대화 기록', icon: MessageSquare },
    { id: 'link' as Section, label: '저장한 링크', icon: Bookmark },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인으로
              </Button>
              <h1 className="text-foreground">마이페이지</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 좌측 사이드바 */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-4 bg-white rounded-2xl shadow-md border-border">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all text-left ${
                        currentSection === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
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
            {currentSection === 'profile' && <ProfileSection isLoggedIn={isLoggedIn} onLogout={onLogout} />}
            {currentSection === 'property' && <PropertySection />}
            {currentSection === 'conversation' && <ConversationSection />}
            {currentSection === 'link' && <LinkSection />}
          </main>
        </div>
      </div>
    </div>
  );
}
