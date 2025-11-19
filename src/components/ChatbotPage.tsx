import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";
import chatbotImage from "figma:asset/mother.png";

interface ChatbotPageProps {
  onBack: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatbotPage({ onBack }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "안녕하세요! 둥지 AI 챗봇입니다. 전월세 계약에 대해 궁금한 점을 물어보세요. 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    // ❗️ 챗봇 응답을 처리할 n8n Webhook URL
    const chatbotWebhookUrl = 'https://ajjoona.app.n8n.cloud/webhook/YOUR_CHATBOT_WEBHOOK_ID'; // TODO: 실제 웹훅 URL로 교체

    try {
      const response = await fetch(chatbotWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: currentInput,
          // 필요하다면 이전 대화 기록이나 사용자 정보를 함께 보낼 수 있습니다.
          // history: messages 
        }),
      });

      if (!response.ok) {
        throw new Error('챗봇 응답을 가져오는데 실패했습니다.');
      }

      const data = await response.json();

      // n8n에서 { "response": "..." } 형태의 응답을 기대합니다.
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "죄송합니다. 답변을 생성할 수 없습니다.",
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('챗봇 Webhook 호출 중 오류 발생:', error);
      const errorMessage: Message = {
        role: "assistant",
        content: "죄송합니다. 오류가 발생하여 답변을 드릴 수 없습니다. 잠시 후 다시 시도해주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로
          </Button>
          <Button
            onClick={() =>
              toast.info("로그인 기능은 준비 중입니다")
            }
            variant="outline"
            className="border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-4 sm:mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={chatbotImage}
                alt="어미새 챗봇"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-[#000000]">어미새 챗봇</h1>
          </div>
          <p className="text-sm text-gray-700">
            딱딱한 계약 용어, 쉽게 알려줄게
          </p>
        </div>

        {/* Chat Container */}
        <Card className="bg-white border-gray-200 overflow-hidden flex flex-col">
          {/* Messages */}
          <div
            className="h-[400px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4"
            aria-live="polite"
            aria-atomic="false"
            aria-relevant="additions"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {message.role === "assistant" && (
                  <div className="shrink-0 w-9 h-9">
                    <img
                      src={chatbotImage}
                      alt="AI 비서"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent/20 text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-row gap-2 sm:gap-3">
                <div className="shrink-0 w-9 h-9">
                  <img
                    src={chatbotImage}
                    alt="AI 비서"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 bg-accent/20 text-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 sm:p-4 bg-green-50">
            {/* 자동완성 버튼들 */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("확정일자 안 받으면 어떻게 되나요?")}
                className="text-xs bg-white border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 hover:border-[#83AF3B]"
                disabled={isLoading}
              >
                확정일자 안 받으면 어떻게 되나요?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("전세사기 위험징후는 뭘까요?")}
                className="text-xs bg-white border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 hover:border-[#83AF3B]"
                disabled={isLoading}
              >
                전세사기 위험징후는 뭘까요?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("반전세는 뭘까요?")}
                className="text-xs bg-white border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 hover:border-[#83AF3B]"
                disabled={isLoading}
              >
                반전세는 뭘까요?
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={isLoading ? "답변을 생성하고 있습니다..." : "궁금한 점을 물어보세요..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSend()
                }
                className="flex-1 bg-white border-gray-300 focus:border-[#83AF3B] text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] hover:from-[#6f9632] hover:to-[#83AF3B] text-white shrink-0"
                disabled={isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
