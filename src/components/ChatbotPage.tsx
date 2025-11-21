import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, LogIn, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";
import chatbotImage from "figma:asset/mother.png";
import { ChatMessage, ActionType } from "../types"; // 1. 타입 import

// 2. Props 타입 구체화
interface ChatbotPageProps {
  onBack: () => void;
  onAction: (actionType: 'send_chat_message', payload: { query: string, history: ChatMessage[] }) => void;
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatbotPage({ onBack, onAction, messages: initialMessages, isLoading }: ChatbotPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages.length > 0 ? initialMessages : [
    {
      role: "assistant",
      content: "안녕하세요! 둥지 AI 챗봇입니다. 전월세 계약에 대해 궁금한 점을 물어보세요. 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages); // Optimistic update

    onAction('send_chat_message', { query: input, history: updatedMessages });
    
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* ... */}
        <Card className="bg-white border-gray-200 overflow-hidden flex flex-col">
          <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {message.role === "assistant" && (
                  <div className="shrink-0 w-9 h-9">
                    <img src={chatbotImage} alt="AI 비서" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent/20 text-foreground"}`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-row gap-2 sm:gap-3">
                  {/* ... 로딩 UI ... */}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-3 sm:p-4 bg-green-50">
            {/* ... 자동완성 버튼들 ... */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={isLoading ? "답변을 생성하고 있습니다..." : "궁금한 점을 물어보세요..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-white ..."
                disabled={isLoading}
              />
              <Button onClick={handleSend} className="..." disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
