import { useState } from "react";
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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };
    setMessages([...messages, userMessage]);

    // 더미 응답
    setTimeout(() => {
      const assistantMessage: Message = {
        role: "assistant",
        content: `"${input}"에 대한 답변입니다.\n\n확정일자는 전월세 계약서에 날인되는 도장으로, 임차인의 우선변제권을 보장하는 중요한 제도입니다. 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있으며, 전입신고와 함께 꼭 받으셔야 합니다.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setInput("");
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
        <Card className="bg-white border-gray-200 overflow-hidden">
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
              >
                확정일자 안 받으면 어떻게 되나요?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("전세사기 위험징후는 뭘까요?")}
                className="text-xs bg-white border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 hover:border-[#83AF3B]"
              >
                전세사기 위험징후는 뭘까요?
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInput("반전세는 뭘까요?")}
                className="text-xs bg-white border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 hover:border-[#83AF3B]"
              >
                반전세는 뭘까요?
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="궁금한 점을 물어보세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSend()
                }
                className="flex-1 bg-white border-gray-300 focus:border-[#83AF3B] text-sm"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] hover:from-[#6f9632] hover:to-[#83AF3B] text-white shrink-0"
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
