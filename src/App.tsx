import searchFeatureImage from "figma:asset/baby.png";
import chatbotFeatureImage from "figma:asset/mother.png";
import checklistFeatureImage from "figma:asset/baby_in_nest.png";
import { useState } from "react";
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
import { ChatButton } from "./components/ChatButton";
import { ChatDialog } from "./components/ChatDialog";
import { DocumentUploadSection } from "./components/DocumentUploadSection";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

type Page =
  | "home"
  | "search"
  | "checklist"
  | "chatbot"
  | "mypage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    toast.loading("로그인 중...");

    const loginWebhookUrl = 'https://ajjoona.app.n8n.cloud/webhook/YOUR_LOGIN_WEBHOOK_ID'; // TODO: 실제 로그인 웹훅 URL로 교체

    try {
      // 실제 앱에서는 사용자 이름, 비밀번호 등을 body에 담아 보냅니다.
      const response = await fetch(loginWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'demo-user', pass: 'demo-pass' }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      // n8n에서 성공 응답을 받았다고 가정
      // const data = await response.json(); // 예: 토큰 등 수신
      
      setIsLoggedIn(true);
      toast.success("로그인되었습니다");

    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
      toast.error('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    // 실제 앱에서는 n8n의 로그아웃 웹훅을 호출하여 세션을 무효화할 수 있습니다.
    setIsLoggedIn(false);
    toast.success("로그아웃되었습니다");
  };

  const handleMyPageClick = () => {
    if (!isLoggedIn) {
      toast.info("로그인이 필요한 서비스입니다");
      handleLogin(); // 자동 로그인 (실제로는 로그인 페이지로 이동)
    } else {
      setCurrentPage("mypage");
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "search":
        return (
          <SearchPage onBack={() => setCurrentPage("home")} />
        );
      case "checklist":
        return (
          <ChecklistPage
            onBack={() => setCurrentPage("home")}
            onChatbot={() => setCurrentPage("chatbot")}
          />
        );
      case "chatbot":
        return (
          <ChatbotPage onBack={() => setCurrentPage("home")} />
        );
      case "mypage":
        return (
          <MyPage
            onBack={() => setCurrentPage("home")}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        );
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
                  <DocumentUploadSection
                    onAnalysisComplete={(report) => {
                      toast.success(
                        `${report.checkedItems.length}개 항목이 자동 체크되었습니다`,
                      );
                      // 체크리스트 페이지로 이동
                      setTimeout(
                        () => setCurrentPage("checklist"),
                        1500,
                      );
                    }}
                  />
                </div>

                {/* 2. 체크리스트 */}
                <div className="flex-1">
                  <FeatureCard
                    icon={ClipboardList}
                    title="둥지 짓기 플랜"
                    description="집 구하는 순서대로 하나씩 떠먹여줄게!"
                    onClick={() => setCurrentPage("checklist")}
                    imageUrl={
                      checklistFeatureImage
                    }
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
                      imageUrl={
                        chatbotFeatureImage
                      }
                    />
                  </div>

                  {/* 검색 */}
                  <div className="flex-1">
                    <FeatureCard
                      icon={Search}
                      title="똑똑한 법률 사전"
                      description="궁금한 건 언제든 물어봐!"
                      onClick={() => setCurrentPage("search")}
                      imageUrl={
                        searchFeatureImage
                      }
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
      {/* Header - Always visible */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
            {/* Left Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentPage("home")}
                className={`text-sm transition-colors ${
                  currentPage === "home"
                    ? "text-[#83AF3B] font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                홈
              </button>
              <button
                onClick={() => setCurrentPage("checklist")}
                className={`text-sm transition-colors ${
                  currentPage === "checklist"
                    ? "text-[#83AF3B] font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                체크리스트
              </button>
              <button
                onClick={() => setCurrentPage("chatbot")}
                className={`text-sm transition-colors ${
                  currentPage === "chatbot"
                    ? "text-[#83AF3B] font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                AI 챗봇
              </button>
              <button
                onClick={() => setCurrentPage("search")}
                className={`text-sm transition-colors ${
                  currentPage === "search"
                    ? "text-[#83AF3B] font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                법률 검색
              </button>
            </nav>

            {/* Center Logo */}
            <div className="flex items-center gap-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <NestBadge size={40} />
              <h1 className="text-foreground text-xl font-bold text-[24px]">
                둥지
              </h1>
            </div>

            {/* Right Auth Buttons */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <Button
                    onClick={handleMyPageClick}
                    variant="ghost"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <UserIcon className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">
                      마이페이지
                    </span>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">
                      로그아웃
                    </span>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleLogin}
                    variant="ghost"
                    className="text-sm text-gray-600 hover:text-gray-900"
                    disabled={isLoggingIn}
                  >
                    로그인
                  </Button>
                  <Button
                    onClick={handleLogin}
                    className="bg-[#83AF3B] hover:bg-[#6f9632] text-white text-sm rounded-full px-4"
                    disabled={isLoggingIn}
                  >
                    회원가입
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {renderPageContent()}

      {/* 글로벌 챗봇 버튼 - 챗봇 페이지가 아닐 때만 표시 */}
      {currentPage !== "chatbot" && (
        <ChatButton onClick={() => setShowChatDialog(true)} />
      )}
      <ChatDialog
        isOpen={showChatDialog}
        onClose={() => setShowChatDialog(false)}
      />
    </div>
  );
}
