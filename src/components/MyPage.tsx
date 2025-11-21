import { useState, useEffect } from 'react';
import { ArrowLeft, User, Home, MessageSquare, Bookmark, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ProfileSection } from './mypage/ProfileSection';
import { PropertySection } from './mypage/PropertySection';
import { ConversationSection } from './mypage/ConversationSection';
import { LinkSection } from './mypage/LinkSection';
import { DocumentSection } from './mypage/DocumentSection'; // 1. DocumentSection import

type ActionType = any; // 간소화

interface MyPageProps {
  onBack: () => void;
  isLoggedIn: boolean;
  onAction: (actionType: ActionType, payload?: any) => void;
  userProfile: any;
  properties: any[];
  documents: any[]; // 2. documents prop 추가
  links: any[];
  conversations: any[];
  isLoading: Record<string, boolean>;
}

// 3. Section 타입 및 메뉴 아이템 추가
type Section = 'profile' | 'property' | 'conversation' | 'documents' | 'link';

export function MyPage({ 
  onBack, 
  isLoggedIn, 
  onAction,
  userProfile,
  properties,
  documents,
  links,
  conversations,
  isLoading,
}: MyPageProps) {
  const [currentSection, setCurrentSection] = useState<Section>('profile');

  useEffect(() => {
    if (!isLoggedIn) return;

    switch (currentSection) {
      case 'profile':
        if (!userProfile) onAction('get_profile');
        break;
      case 'property':
        onAction('get_properties');
        break;
      case 'documents': // 4. documents 섹션 데이터 요청 추가
        onAction('get_documents');
        break;
      case 'conversation':
        onAction('get_conversations');
        break;
      case 'link':
        onAction('get_links');
        break;
    }
  }, [currentSection, isLoggedIn, onAction, userProfile]);

  const menuItems = [
    { id: 'profile' as Section, label: '내 프로필', icon: User },
    { id: 'property' as Section, label: '내 주택 정보', icon: Home },
    { id: 'documents' as Section, label: '나의 문서함', icon: FileText },
    { id: 'conversation' as Section, label: '대화 기록', icon: MessageSquare },
    { id: 'link' as Section, label: '저장한 링크', icon: Bookmark },
  ];

  const renderSection = () => {
    switch (currentSection) {
      // ... 다른 섹션 케이스
      case 'documents': // 5. documents 섹션 렌더링 및 props 전달
        return (
          <DocumentSection 
            documents={documents}
            onAction={onAction}
            isLoading={isLoading['get_documents'] || isLoading['upload_document']}
          />
        );
      case 'link':
        return (
          <LinkSection 
            links={links} 
            onAction={onAction}
            isLoading={isLoading['get_links'] || isLoading['create_link'] || isLoading['update_link']}
          />
        );
      default:
        return <ProfileSection 
            userProfile={userProfile} 
            isLoggedIn={isLoggedIn} 
            onAction={onAction}
            isLoading={isLoading['get_profile']}
          />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ... */}
      <div className="container mx-auto ...">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            {/* ... 사이드바 메뉴 UI ... */}
          </aside>
          <main className="flex-1">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
}
