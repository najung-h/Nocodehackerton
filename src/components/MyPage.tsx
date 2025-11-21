import { useState, useEffect } from 'react';
import { ArrowLeft, User, Home, MessageSquare, Bookmark, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ProfileSection } from './mypage/ProfileSection';
import { PropertySection } from './mypage/PropertySection';
import { ConversationSection } from './mypage/ConversationSection';
import { LinkSection } from './mypage/LinkSection';
import { DocumentSection } from './mypage/DocumentSection';
// 1. 중앙 타입 정의 import
import { 
  ActionType, 
  UserProfile,
  Property,
  Document as DocumentType,
  Link as LinkType,
  Conversation
} from '../types';

// 2. Props 타입 구체화
interface MyPageProps {
  onBack: () => void;
  isLoggedIn: boolean;
  onAction: (actionType: ActionType, payload?: any) => void;
  userProfile: UserProfile | null;
  properties: Property[];
  documents: DocumentType[];
  links: LinkType[];
  conversations: Conversation[];
  isLoading: Record<string, boolean>;
}

type Section = 'profile' | 'property' | 'documents' | 'conversation' | 'link';

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
      case 'documents':
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
    // 3. 자식 컴포넌트에 구체화된 타입의 props 전달
    switch (currentSection) {
      case 'profile':
        return (
          <ProfileSection 
            userProfile={userProfile} 
            isLoggedIn={isLoggedIn} 
            onAction={onAction}
            isLoading={isLoading['get_profile']}
          />
        );
      case 'property':
        return (
          <PropertySection 
            properties={properties}
            onAction={onAction}
            isLoading={isLoading['get_properties'] || isLoading['add_property'] || isLoading['upload_document']}
          />
        );
      case 'documents':
        return (
          <DocumentSection 
            documents={documents}
            onAction={onAction}
            isLoading={isLoading['get_documents'] || isLoading['upload_document']}
          />
        );
      case 'conversation':
        return (
          <ConversationSection 
            conversations={conversations}
            onAction={onAction}
            isLoading={isLoading['get_conversations'] || isLoading['send_chat_message']}
          />
        );
      case 'link':
        return (
          <LinkSection 
            links={links} 
            onAction={onAction}
            isLoading={isLoading['get_links'] || isLoading['create_link'] || isLoading['update_link'] || isLoading['delete_link']}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border sticky top-0 z-20">
        {/* ... */}
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-4 bg-white rounded-2xl shadow-md border-border">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-full transition-all text-left ${
                      currentSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </aside>
          <main className="flex-1">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
}