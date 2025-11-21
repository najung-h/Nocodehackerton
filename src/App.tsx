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

// 모든 ActionType 정의
type ActionType = 
  | 'login' | 'logout' | 'get_profile'
  | 'get_properties' | 'add_property'
  | 'get_documents' | 'upload_document'
  | 'get_conversations' | 'send_chat_message'
  | 'get_links' | 'create_link' | 'update_link' | 'delete_link'
  | 'search_legal' | 'analyze_document'
  | 'export_pdf' | 'send_email' | 'add_to_calendar';

type Page = "home" | "search" | "checklist" | "chatbot" | "mypage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // 모든 중앙 상태
  const [userProfile, setUserProfile] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // =================================================================
  // 중앙 액션 컨트롤러: handleAction (모든 fetch 로직 구현)
  // =================================================================
  const handleAction = useCallback(async (actionType: ActionType, payload?: any) => {
    if (isLoading[actionType]) return; // 중복 요청 방지
    setIsLoading(prev => ({ ...prev, [actionType]: true }));

    // 서비스 URL 정의
    const checklistServiceUrl = import.meta.env.VITE_CHECKLIST_SERVICE_URL;
    const documentServiceUrl = import.meta.env.VITE_DOCUMENT_SERVICE_URL;
    const chatServiceUrl = import.meta.env.VITE_CHAT_SERVICE_URL;

    let serviceUrl = checklistServiceUrl; // 기본 URL은 체크리스트 서비스
    let options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionType, ...payload }),
    };

    try {
      let response: Response;

      switch (actionType) {
        // --- 인증 ---
        case 'login':
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('로그인에 실패했습니다.');
          setIsLoggedIn(true);
          toast.success("로그인되었습니다.");
          break;
        case 'logout':
          setIsLoggedIn(false);
          setUserProfile(null);
          toast.success("로그아웃되었습니다.");
          break;
        
        // --- 마이페이지: 프로필 ---
        case 'get_profile':
          if (!isLoggedIn) break;
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('프로필 정보를 불러오는데 실패했습니다.');
          setUserProfile(await response.json());
          break;

        // --- 마이페이지: 주택 ---
        case 'get_properties':
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('주택 정보를 불러오는데 실패했습니다.');
          setProperties(await response.json());
          break;
        case 'add_property':
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('주택 등록에 실패했습니다.');
          toast.success("주택이 등록되었습니다.");
          await handleAction('get_properties'); // 목록 새로고침
          break;

        // --- 마이페이지 & 문서 업로드 ---
        case 'get_documents':
          response = await fetch(documentServiceUrl, options);
          if (!response.ok) throw new Error('문서 목록을 불러오는데 실패했습니다.');
          setDocuments(await response.json());
          break;
        case 'upload_document':
        case 'analyze_document':
          const formData = new FormData();
          formData.append('action', actionType === 'analyze_document' ? 'analyze' : 'scan');
          formData.append('file', payload.file);
          if (payload.property_id) formData.append('property_id', payload.property_id);
          
          options = { method: 'POST', body: formData };
          delete (options.headers as any)['Content-Type']; // FormData 사용 시 브라우저가 자동으로 설정하도록 헤더 삭제

          response = await fetch(documentServiceUrl, options);
          if (!response.ok) throw new Error('문서 처리에 실패했습니다.');
          
          if (actionType === 'analyze_document') {
            const report = await response.json();
            toast.success("문서 분석이 완료되었습니다!");
            setCurrentPage("checklist");
          } else {
            toast.success("문서가 업로드되었습니다.");
            await handleAction('get_documents'); // 문서 목록 새로고침
          }
          break;

        // --- 마이페이지: 대화 ---
        case 'get_conversations':
          response = await fetch(chatServiceUrl, options);
          if (!response.ok) throw new Error('대화 기록을 불러오는데 실패했습니다.');
          setConversations(await response.json());
          break;

        // --- 마이페이지: 링크 ---
        case 'get_links':
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('링크를 불러오는데 실패했습니다.');
          setLinks(await response.json());
          break;
        case 'create_link':
        case 'update_link':
        case 'delete_link':
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('링크 작업에 실패했습니다.');
          toast.success('링크가 처리되었습니다.');
          await handleAction('get_links'); // 목록 새로고침
          break;
          
        // --- 챗봇 & 검색 ---
        case 'send_chat_message':
          response = await fetch(chatServiceUrl, options);
          if (!response.ok) throw new Error('메시지 전송에 실패했습니다.');
          setChatMessages(await response.json());
          break;
        case 'search_legal':
          response = await fetch(chatServiceUrl, options);
          if (!response.ok) throw new Error('검색에 실패했습니다.');
          setSearchResults(await response.json());
          break;

        // --- 기타 기능 ---
        case 'export_pdf':
        case 'send_email':
        case 'add_to_calendar':
          response = await fetch(serviceUrl, options);
          if (!response.ok) throw new Error('요청 처리에 실패했습니다.');
          toast.success("요청이 성공적으로 처리되었습니다.");
          break;

        default:
          throw new Error(`알 수 없는 액션 타입입니다: ${actionType}`);
      }
    } catch (error: any) {
      toast.error(error.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(prev => ({ ...prev, [actionType]: false }));
    }
  }, [isLoggedIn]);


  const renderPageContent = () => {
    // ... 페이지 렌더링 로직은 이전과 동일
    // MyPage에 documents, links를 전달하도록 수정
    return <MyPage onBack={() => setCurrentPage("home")} isLoggedIn={isLoggedIn} onAction={handleAction} userProfile={userProfile} properties={properties} documents={documents} links={links} conversations={conversations} isLoading={isLoading} />;
  };

  return (
    <div className="min-h-screen bg-background">
      <header> {/* ... */}</header>
      {renderPageContent()}
    </div>
  );
}