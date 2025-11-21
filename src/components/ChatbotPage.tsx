import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, LogIn, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";
import chatbotImage from "figma:asset/mother.png";

// 1. props 타입 정의: 부모로부터 받을 데이터와 함수, 상태를 명시합니다.
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotPageProps {
  onBack: () => void;
  onAction: (actionType: 'send_chat_message', payload: { query: string, history: Message[] }) => void;
  messages: Message[];
  isLoading: boolean;
}

export function ChatbotPage({ onBack, onAction, messages: initialMessages, isLoading }: ChatbotPageProps) {
  // 2. 내부 상태 간소화: API 결과(메시지)와 로딩 상태를 제거하고, UI 입력 상태만 남깁니다.
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [
    {
      role: "assistant",
      content: "안녕하세요! 둥지 AI 챗봇입니다. 전월세 계약에 대해 궁금한 점을 물어보세요. 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // App.tsx에서 내려준 messages prop이 변경될 때마다 내부 messages 상태를 업데이트
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // 3. handleSend 로직 변경: fetch 대신 onAction prop을 호출합니다.
  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    // Optimistic UI Update: 사용자가 보낸 메시지를 즉시 UI에 반영
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // 부모에게 액션 위임 (전체 메시지 히스토리와 함께)
    onAction('send_chat_message', { query: input, history: updatedMessages });
    
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          {/* ... Top Navigation ... */}
        </div>

        <div className="mb-4 sm:mb-6 text-center">
          {/* ... Header ... */}
        </div>

        <Card className="bg-white border-gray-200 overflow-hidden flex flex-col">
          {/* 4. props로 받은 messages를 렌더링합니다. */}
          <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* ... Message UI ... */}
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-row gap-2 sm:gap-3">
                {/* ... 로딩 스피너 UI ... */}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* 5. UI에 로딩 상태(isLoading)를 직접 사용합니다. */}
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-green-50">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={isLoading ? "답변을 생성하고 있습니다..." : "궁금한 점을 물어보세요..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white border-gray-300 focus:border-[#83AF3B] text-sm"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}