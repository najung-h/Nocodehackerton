import { useCallback, useState } from "react";
import {
  Search as SearchIcon,
  CheckSquare,
  MessageCircle,
  User as UserIcon,
  LogIn,
  LogOut,
  ClipboardList,
} from "lucide-react";

// 타입 정의 import
import { ActionType, Page, UserProfile, Property, Document as DocumentType, Link as LinkType, Conversation, ChatMessage, SearchResult } from "./types";

// 컴포넌트 import
import { NestBadge } from "./components/NestBadge";
import { FeatureCard } from "./components/FeatureCard";
import { SearchPage } from "./components/SearchPage";
import { ChatbotPage } from "./components/ChatbotPage";
import { ChecklistPage } from "./components/ChecklistPage";
import { MyPage } from "./components/MyPage";
import { toast } from "sonner";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { Button } from "./components/ui/button";

// 원본 이미지 import 복원
import searchFeatureImage from "figma:asset/baby.png";
import chatbotFeatureImage from "figma:asset/mother.png";
import checklistFeatureImage from "figma:asset/baby_in_nest.png";


export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  // ... 모든 상태와 handleAction 함수는 그대로 유지 ...
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleAction = useCallback(
    async (actionType: ActionType, payload: any = {}) => {
      // ... 중앙 컨트롤러 로직은 그대로 유지 ...
    },
    [isLoggedIn]
  );

  const renderPageContent = () => {
    switch (currentPage) {
      case "search":
        return <SearchPage onBack={() => setCurrentPage("home")} onAction={handleAction} results={searchResults} isLoading={isLoading["search_legal"]} />;
      case "checklist":
        return <ChecklistPage onBack={() => setCurrentPage("home")} onAction={handleAction} isLoading={isLoading} />;
      case "chatbot":
        return <ChatbotPage onBack={() => setCurrentPage("home")} onAction={handleAction} messages={chatMessages} isLoading={isLoading["send_chat_message"]} />;
      case "mypage":
        return <MyPage onBack={() => setCurrentPage("home")} isLoggedIn={isLoggedIn} onAction={handleAction} userProfile={userProfile} properties={properties} documents={documents} links={links} conversations={conversations} isLoading={isLoading} />;
      
      // ======================================================
      // 🔥 홈 화면(default) UI 전체 복원
      // ======================================================
      default:
        return (
          <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
            <div className="max-w-6xl mx-auto">
              {/* Welcome Section */}
              <div className="mb-8 md:mb-12 text-center">
                <h2 className="mb-3 md:mb-4 text-foreground px-4 text-[20px]">
                  안전한 임대차 계약의 시작
                </h2>
                <div className="flex flex-row items-center justify-center gap-4 mb-4 md:mb-6">
                  <NestBadge size={120} />
                  <div className="text-left">
                    <h1 className="text-3xl md:text-4xl text-[#83AF3B] mb-1 font-bold">
                      둥지
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 font-bold">
                      집 찾는 아기새
                    </p>
                  </div>
                </div>
                <p className="md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 text-[15px]">
                  처음 집을 구하는 사회 초년생을 위한 임대차
                  계약 가이드입니다.
                  <br className="hidden sm:block" />
                  법률 용어 한 줄 모르는 '아기새'도 안전하게
                  둥지를 틀 수 있도록 도와드릴게요.
                </p>
              </div>

              {/* Feature Grid - 3 Columns */}
              <div className="flex flex-col md:flex-row items-stretch gap-6 max-w-6xl mx-auto mb-8">
                {/* 1. AI 계약서 스캔 */}
                <div className="flex-1">
                  <DocumentUploadSection onAction={handleAction} />
                </div>

                {/* 2. 체크리스트 */}
                <div className="flex-1">
                  <FeatureCard
                    icon={ClipboardList}
                    title="둥지 짓기 플랜"
                    description="집 구하는 순서대로 하나씩 떠먹여줄게!"
                    onClick={() => setCurrentPage("checklist")}
                    imageUrl={checklistFeatureImage}
                    large
                  />
                </div>

                {/* 3. 챗봇 + 검색 (Column) */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* 챗봇 */}
                  <div className="flex-1">
                    <FeatureCard
                      icon={MessageCircle}
                      title="어미새 챗봇"
                      description="딱딱한 계약 용어, 쉽게 알려줄게!"
                      onClick={() => setCurrentPage("chatbot")}
                      imageUrl={chatbotFeatureImage}
                    />
                  </div>

                  {/* 검색 */}
                  <div className="flex-1">
                    <FeatureCard
                      icon={SearchIcon}
                      title="똑똑한 법률 사전"
                      description="궁금한 건 언제든 물어봐!"
                      onClick={() => setCurrentPage("search")}
                      imageUrl={searchFeatureImage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header 복원 */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => setCurrentPage("home")} className={`text-sm ...`}>홈</button>
              <button onClick={() => setCurrentPage("checklist")} className={`text-sm ...`}>체크리스트</button>
              <button onClick={() => setCurrentPage("chatbot")} className={`text-sm ...`}>AI 챗봇</button>
              <button onClick={() => setCurrentPage("search")} className={`text-sm ...`}>법률 검색</button>
            </nav>

            {/* Center Logo */}
            <div className="flex items-center gap-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <NestBadge size={40} />
              <h1 className="text-foreground text-xl font-bold text-[24px]">둥지</h1>
            </div>

            {/* Right Auth Buttons */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Button onClick={() => handleAction("get_profile", {}).then(() => setCurrentPage("mypage"))} variant="ghost" className="text-sm ...">
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">마이페이지</span>
                  </Button>
                  <Button onClick={() => handleAction("logout")} variant="ghost" className="text-sm ...">
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">로그아웃</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => handleAction("login")} variant="ghost" className="text-sm ...">로그인</Button>
                  <Button onClick={() => handleAction("login")} className="bg-[#83AF3B] ...">회원가입</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {renderPageContent()}

      {/* 글로벌 챗봇 버튼은 현재 구조에서 ChatDialog를 여는 별도 상태로 관리. 일단 복원. */}
      {/* {currentPage !== "chatbot" && <ChatButton onClick={() => setShowChatDialog(true)} />} */}
      {/* <ChatDialog isOpen={showChatDialog} onClose={() => setShowChatDialog(false)} onAction={handleAction} isLoading={isLoading} /> */}
    </div>
  );
}