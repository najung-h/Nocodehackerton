import { useState, useEffect, useCallback } from "react";
import {
  Search,
  ClipboardList,
  MessageCircle,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { NestBadge } from "./components/NestBadge";
import { FeatureCard } from "./components/FeatureCard";
import { SearchPage } from "./components/SearchPage";
import { ChecklistPage } from "./components/ChecklistPage";
import { ChatbotPage } from "./components/ChatbotPage";
import { MyPage } from "./components/MyPage";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

// ActionType에 문서 관련 타입 추가
type ActionType = 
  | 'login'
  | 'logout'
  | 'get_profile'
  | 'get_properties'
  | 'add_property'
  | 'get_documents'   // 추가
  | 'upload_document' // 추가
  | 'get_conversations'
  | 'send_chat_message'
  | 'get_links'
  | 'create_link'
  | 'update_link'
  | 'delete_link'
  | 'search_legal'
  | 'analyze_document'
  | 'export_pdf'
  | 'send_email'
  | 'add_to_calendar';

type Page = "home" | "search" | "checklist" | "chatbot" | "mypage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // 중앙 상태에 documents, links 추가
  const [userProfile, setUserProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleAction = useCallback(async (actionType: ActionType, payload?: any) => {
    setIsLoading(prev => ({ ...prev, [actionType]: true }));
    const checklistServiceUrl = import.meta.env.VITE_CHECKLIST_SERVICE_URL;
    const documentServiceUrl = import.meta.env.VITE_DOCUMENT_SERVICE_URL;
    let serviceUrl = checklistServiceUrl; // 기본 URL

    try {
      let response;
      const body = { action: actionType, ...payload };
      let options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };

      switch (actionType) {
        // ... 기존 login, logout, get_profile 등 케이스 ...
        
        case 'get_documents':
          response = await fetch(documentServiceUrl, options);
          if (!response.ok) throw new Error('문서 목록 로딩 실패');
          setDocuments(await response.json());
          break;

        case 'upload_document':
          serviceUrl = documentServiceUrl;
          const formData = new FormData();
          formData.append('action', 'scan'); // n8n 워크플로우에 맞춘 액션
          formData.append('file', payload.file);
          if (payload.property_id) formData.append('property_id', payload.property_id);

          response = await fetch(serviceUrl, {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) throw new Error('문서 업로드 실패');
          // 업로드 후 문서 목록을 다시 불러옴
          handleAction('get_documents'); 
          toast.success("문서가 업로드되었습니다.");
          break;

        case 'get_links':
          response = await fetch(checklistServiceUrl, options);
          if (!response.ok) throw new Error('링크 로딩 실패');
          setLinks(await response.json());
          break;
        
        // ... 여기에 create/update/delete link 케이스 추가 필요 ...

        // ... 나머지 케이스 ...
        default:
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error(`${actionType} 처리 실패`);
          // toast.success(`${actionType} 처리 완료`);
      }
    } catch (error: any) {
      toast.error(error.message || `${actionType} 처리 중 오류 발생`);
    } finally {
      setIsLoading(prev => ({ ...prev, [actionType]: false }));
    }
  }, [isLoggedIn]);

  const renderPageContent = () => {
    switch (currentPage) {
      // ... 다른 페이지 케이스 ...
      case "mypage":
        return (
          <MyPage
            onBack={() => setCurrentPage("home")}
            isLoggedIn={isLoggedIn}
            onAction={handleAction}
            userProfile={userProfile}
            properties={properties}
            documents={documents}
            links={links}
            conversations={conversations}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <main className="container ...">
             {/* ... 홈 UI ... */}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ... 헤더 및 나머지 UI ... */}
      {renderPageContent()}
    </div>
  );
}
