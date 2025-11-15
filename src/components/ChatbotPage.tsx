import { useState } from 'react';
import { ArrowLeft, MessageCircle, Send, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { NestBadge } from './NestBadge';
import { toast } from 'sonner';

interface ChatbotPageProps {
  onBack: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatbotPage({ onBack }: ChatbotPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '안녕하세요! 둥지 AI 챗봇입니다. 전월세 계약에 대해 궁금한 점을 물어보세요. 😊',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);

    // 더미 응답
    setTimeout(() => {
      const assistantMessage: Message = {
        role: 'assistant',
        content: `"${input}"에 대한 답변입니다.\n\n확정일자는 전월세 계약서에 날인되는 도장으로, 임차인의 우선변제권을 보장하는 중요한 제도입니다. 계약 체결 후 주민센터나 등기소에서 무료로 받을 수 있으며, 전입신고와 함께 꼭 받으셔야 합니다.`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
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
            onClick={() => toast.info('로그인 기능은 준비 중입니다')}
            variant="outline"
            className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
            </div>
            <h1 className="text-amber-900">둥지 AI 챗봇</h1>
          </div>
          <p className="text-sm text-amber-700">
            어려운 법률 언어도 쉽게 설명해주는 당신의 전월세 비서.
          </p>
        </div>

        {/* Chat Container */}
        <Card className="bg-white border-amber-100 overflow-hidden">
          {/* Messages */}
          <div className="h-[400px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {message.role === 'assistant' && (
                  <div className="shrink-0">
                    <NestBadge size={36} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] sm:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white'
                      : 'bg-amber-50 text-amber-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-amber-100 p-3 sm:p-4 bg-amber-50">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="궁금한 점을 물어보세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-white border-amber-200 focus:border-cyan-400 text-sm"
              />
              <Button
                onClick={handleSend}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              예: 확정일자 뭐예요? / 전세사기는 어떻게 피하나요?
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}