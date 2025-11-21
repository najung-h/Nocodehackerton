import { useCallback, useState } from "react";
import {
  Home,
  Search as SearchIcon,
  CheckSquare,
  MessageCircle,
  User as UserIcon,
  LogIn,
  LogOut,
} from "lucide-react";

import { 
  ActionType, 
  Page, 
  UserProfile, 
  Property, 
  Document, 
  Link as LinkType, 
  Conversation, 
  ChatMessage, 
  SearchResult 
} from "./types";

import { NestBadge } from "./components/NestBadge";
import { FeatureCard } from "./components/FeatureCard";
import { SearchPage } from "./components/SearchPage";
import { ChatbotPage } from "./components/ChatbotPage";
import { ChecklistPage } from "./components/ChecklistPage";
import { MyPage } from "./components/MyPage";
import { toast } from "sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // ==== 중앙 상태 ====
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // ==== 환경 변수 ====
  const checklistServiceUrl = import.meta.env.VITE_CHECKLIST_SERVICE_URL;
  const documentServiceUrl = import.meta.env.VITE_DOCUMENT_SERVICE_URL;
  const chatServiceUrl = import.meta.env.VITE_CHAT_SERVICE_URL;

  /* ============================================================
     중앙 액션 컨트롤러
  ============================================================ */
  const handleAction = useCallback(
    async (actionType: ActionType, payload: any = {}) => {
      if (isLoading[actionType]) return;

      setIsLoading((prev) => ({ ...prev, [actionType]: true }));

      try {
        let serviceUrl = checklistServiceUrl;
        let options: RequestInit = { method: "POST" };

        /* -------------------------
           1) URL 분기
        ------------------------- */
        if ([
          "send_chat_message",
          "get_conversations"
        ].includes(actionType)) {
          serviceUrl = chatServiceUrl;
        }
        if ([
          "upload_document",
          "analyze_document",
          "get_documents"
        ].includes(actionType)) {
          serviceUrl = documentServiceUrl;
        }

        /* -------------------------
           2) Method / Body 분기
        ------------------------- */
        switch (actionType) {
          /* ============================
             인증 관련
          ============================ */
          case "login":
            options = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            };
            break;

          case "logout":
            setIsLoggedIn(false);
            setUserProfile(null);
            toast.success("로그아웃되었습니다.");
            return;

          /* ============================
             GET 요청들
          ============================ */
          case "get_profile":
          case "get_properties":
          case "get_links":
          case "get_conversations":
          case "get_documents":
            options = { method: "GET" };
            break;

          /* ============================
             검색 / 챗봇 — JSON POST
          ============================ */
          case "search_legal":
          case "send_chat_message":
            options = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            };
            break;

          /* ============================
             주택 추가 — JSON POST
          ============================ */
          case "add_property":
          case "create_link":
          case "update_link":
          case "delete_link":
          case "export_pdf":
          case "send_email":
          case "add_to_calendar":
            options = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            };
            break;

          /* ============================
             파일 업로드 — FormData POST
          ============================ */
          case "upload_document":
          case "analyze_document":
            const form = new FormData();
            form.append("file", payload.file);
            if (payload.property_id) form.append("property_id", payload.property_id);

            options = { method: "POST", body: form };
            break;

          default:
            throw new Error(`Unknown action type: ${actionType}`);
        }

        /* -------------------------
           3) fetch 실행
        ------------------------- */
        const response = await fetch(serviceUrl, options);
        if (!response.ok) throw new Error("요청 처리 실패");

        /* -------------------------
           4) 응답 처리
        ------------------------- */
        switch (actionType) {
          case "login":
            setIsLoggedIn(true);
            toast.success("로그인 성공");
            break;

          case "get_profile":
            setUserProfile(await response.json());
            break;

          case "get_properties":
            setProperties(await response.json());
            break;

          case "add_property":
            toast.success("주택이 추가되었습니다.");
            await handleAction("get_properties");
            break;

          case "get_documents":
            setDocuments(await response.json());
            break;

          case "upload_document":
            toast.success("문서가 업로드되었습니다.");
            await handleAction("get_documents");
            break;

          case "analyze_document":
            toast.success("문서 분석 완료");
            setCurrentPage("checklist");
            break;

          case "get_links":
            setLinks(await response.json());
            break;

          case "create_link":
          case "update_link":
          case "delete_link":
            toast.success("링크 작업 완료");
            await handleAction("get_links");
            break;

          case "get_conversations":
            setConversations(await response.json());
            break;

          case "send_chat_message":
            setChatMessages(await response.json());
            break;

          case "search_legal":
            setSearchResults(await response.json());
            break;

          case "export_pdf":
            toast.success("PDF 생성 완료");
            break;

          case "send_email":
            toast.success("이메일 발송 완료");
            break;

          case "add_to_calendar":
            toast.success("캘린더에 추가되었습니다.");
            break;
        }
      } catch (err: any) {
        toast.error(err.message || "오류 발생");
      } finally {
        setIsLoading((prev) => ({ ...prev, [actionType]: false }));
      }
    },
    [isLoading]
  );

  /* =============================================================
     페이지 렌더기
  ============================================================= */
  const renderPageContent = () => {
    switch (currentPage) {
      case "search":
        return (
          <SearchPage
            onBack={() => setCurrentPage("home")}
            onAction={handleAction}
            results={searchResults}
            isLoading={isLoading["search_legal"]}
          />
        );

      case "chatbot":
        return (
          <ChatbotPage
            onBack={() => setCurrentPage("home")}
            onAction={handleAction}
            messages={chatMessages}
            isLoading={isLoading["send_chat_message"]}
          />
        );

      case "checklist":
        return (
          <ChecklistPage
            onBack={() => setCurrentPage("home")}
            onAction={handleAction}
            isLoading={isLoading}
          />
        );

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
          <main className="min-h-screen bg-white p-6">
            {/* 홈 화면 내용 그대로 유지 */}
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              <NestBadge />
              <FeatureCard
                icon={SearchIcon}
                title="법률 검색"
                onClick={() => setCurrentPage("search")}
              />
              <FeatureCard
                icon={CheckSquare}
                title="전세 체크리스트"
                onClick={() => setCurrentPage("checklist")}
              />
              <FeatureCard
                icon={MessageCircle}
                title="AI 챗봇"
                onClick={() => setCurrentPage("chatbot")}
              />
              <FeatureCard
                icon={UserIcon}
                title="MY"
                onClick={() => setCurrentPage("mypage")}
              />
            </div>
          </main>
        );
    }
  };

  return (
    <div>
      {renderPageContent()}
    </div>
  );
}
