import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, Paperclip, Download, Mail } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import chatbotImage from "figma:asset/mother.png";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const suggestedQuestions = [
  '등기부등본에서 뭘 확인해야 하나요?',
  '대항력이 뭔가요?',
  '확정일자는 왜 필요한가요?',
  '선순위 세입자가 있으면 어떻게 되나요?',
  '깡통전세를 피하려면 어떻게 해야 하나요?'
];

export function ChatDialog({ open, onOpenChange }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 둥지 AI 비서입니다. 🏠\n\n전월세 계약 과정에서 궁금한 점이 있으신가요? 법률 용어, 계약 절차, 주의사항 등 무엇이든 물어보세요!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // gemini.md 기반 서비스 URL
    const chatServiceUrl = import.meta.env.VITE_CHAT_SERVICE_URL; // TODO: 실제 챗 서비스 URL로 교체

    try {
      const response = await fetch(chatServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'new_query', // 액션 구분자
          query: currentInput 
        }),
      });

      if (!response.ok) {
        throw new Error('챗봇 응답을 가져오는데 실패했습니다.');
      }

      const data = await response.json();

      // n8n에서 { "response": "..." } 형태의 응답을 기대합니다.
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "죄송합니다. 답변을 생성할 수 없습니다.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('챗봇 Webhook 호출 중 오류 발생:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "죄송합니다. 오류가 발생하여 답변을 드릴 수 없습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`${file.name} 파일이 업로드되었습니다`);
    }
  };

  const handleExportPDF = () => {
    toast.success('대화 내용을 PDF로 내보냅니다');
  };

  const handleSendEmail = () => {
    toast.success('대화 내용을 메일로 전송합니다');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 bg-gradient-to-br from-green-50 to-lime-50 border-[#83AF3B] flex flex-col [&>button]:hidden">
        <DialogTitle className="sr-only">둥지 AI 비서</DialogTitle>
        <DialogDescription className="sr-only">
          전월세 계약 관련 질문을 AI 비서에게 물어보세요
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#83AF3B]/30 bg-gradient-to-r from-[#83AF3B] via-[#9ec590] to-[#83AF3B] text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 md:p-2 rounded-full">
              <img src={chatbotImage} className="size-5 md:size-6 text-white drop-shadow-md" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white truncate">둥지 AI 비서</h2>
              <p className="text-xs text-green-50 hidden sm:block">무엇이든 물어보세요</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportPDF}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <Download className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSendEmail}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <Mail className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea 
          className="flex-1 p-4 md:p-6 bg-gradient-to-b from-green-50/50 to-lime-50/30 overflow-y-auto"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
        >
          <div className="space-y-4 max-w-3xl mx-auto h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-[#83AF3B] to-[#9ec590] text-white'
                      : 'bg-white text-gray-950 border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words prose prose-sm max-w-none text-sm md:text-base">
                    {message.content.split('\n').map((line, i) => {
                      // 마크다운 스타일 헤더 처리
                      if (line.startsWith('## ')) {
                        return (
                          <h3 key={i} className={message.role === 'user' ? 'text-white' : 'text-gray-900'}>
                            {line.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={i} className={message.role === 'user' ? 'text-white' : 'text-gray-800'}>
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <p key={i}>
                            <strong>{line.replace(/\*\*/g, '')}</strong>
                          </p>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={i} className="ml-4">
                            {line.replace('- ', '')}
                          </li>
                        );
                      }
                      return line ? <p key={i}>{line}</p> : <br key={i} />;
                    })}
                  </div>
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-green-100' : 'text-gray-600'}`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#83AF3B] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#9ec590] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#83AF3B] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-3 bg-green-50/50">
            <p className="text-sm text-[#83AF3B] mb-3">💡 자주 묻는 질문:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer bg-white hover:bg-[#83AF3B]/10 border-[#83AF3B] text-[#83AF3B] hover:border-[#83AF3B] transition-all shadow-sm hover:shadow-md rounded-full px-3 py-1"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-lg">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleFileUpload}
              className="border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 hover:text-[#83AF3B] rounded-full"
            >
              <Paperclip className="size-4" />
            </Button>
            <Input
              placeholder="질문을 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1 border-gray-300 focus:border-[#83AF3B] focus:ring-[#83AF3B] rounded-full bg-white"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] hover:from-[#6f9632] hover:to-[#83AF3B] text-white rounded-full shadow-md"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
