import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, Paperclip, Download, Mail, Sparkles } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

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
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('대항력')) {
      return `## 대항력이란?

**대항력**은 임차인이 제3자(경매 낙찰자 등)에게 자신의 임차권을 주장할 수 있는 법적 권리입니다.

### 대항력 취득 요건
1. **전입신고**: 해당 주소지로 전입신고를 완료해야 합니다
2. **주택 인도**: 실제로 그 집에 거주해야 합니다
3. **익일 0시**: 위 두 가지 요건을 충족한 다음날 0시부터 대항력이 발생합니다

### 왜 중요한가요?
- 집주인이 집을 팔거나 경매가 진행되어도 계약기간 동안 보증금을 보호받을 수 있습니다
- 대항력이 없으면 새로운 집주인이 나가라고 할 수 있고, 보증금을 돌려받지 못할 수 있습니다

💡 **중요**: 잔금을 지급한 당일 바로 전입신고를 하는 것이 가장 안전합니다!`;
    }

    if (lowerQuestion.includes('확정일자')) {
      return `## 확정일자란?

**확정일자**는 임대차계약서에 찍히는 공식 날짜 도장으로, 우선변제권을 얻기 위한 필수 요건입니다.

### 확정일자 받는 방법
- 주민센터 방문
- 인터넷등기소 온라인 신청
- 공증 사무소

### 우선변제권이란?
집이 경매로 넘어갈 때 다른 채권자보다 먼저 보증금을 돌려받을 수 있는 권리입니다.

### 대항력 vs 확정일자
| 구분 | 대항력 | 확정일자 |
|------|--------|----------|
| 요건 | 전입신고 + 주택인도 | 계약서에 확정일자 날인 |
| 효력 | 임차권 주장 가능 | 우선변제권 획득 |

💡 **TIP**: 전입신고와 확정일자 모두 받아야 완전한 보호를 받을 수 있습니다!`;
    }

    if (lowerQuestion.includes('등기부등본')) {
      return `## 등기부등본 확인 방법

등기부등본은 집의 모든 법적 정보가 담긴 가장 중요한 서류입니다.

### 확인해야 할 사항

**1. 갑구 (소유권 관련)**
- 소유자가 계약하려는 임대인과 일치하는지
- 가압류, 압류가 있는지
- 소유권 분쟁이 있는지

**2. 을구 (권리 관련)**
- 근저당권: 얼마나 설정되어 있는지
- 전세권: 선순위 전세권이 있는지
- 지상권 등 기타 권리

### 위험 신호 ⚠️
- 근저당권 설정액이 너무 큰 경우
- 여러 개의 근저당권이 설정된 경우
- 가압류나 압류가 있는 경우

### 발급 방법
인터넷등기소(www.iros.go.kr)에서 온라인으로 발급 가능 (수수료 700원)

💡 **중요**: 잔금 지급 직전에 다시 한번 확인하여 변동사항이 없는지 체크하세요!`;
    }

    if (lowerQuestion.includes('선순위') || lowerQuestion.includes('세입자')) {
      return `## 선순위 세입자란?

나보다 먼저 전입신고나 확정일자를 받은 세입자를 **선순위 세입자**라고 합니다.

### 왜 중요한가요?
경매가 진행될 때 보증금을 받는 순서가 정해지는데, 선순위 세입자가 먼저 보증금을 받습니다.

### 확인 방법
**전입세대 열람 내역**을 발급받아 확인할 수 있습니다.
- 정부24(www.gov.kr)에서 온라인 발급 가능
- 주민센터 방문 발급

### 주의사항
선순위 세입자의 보증금 + 나의 보증금 + 근저당권 총액이 집의 시세보다 크다면 위험합니다.

**예시**
- 집 시세: 4억원
- 선순위 보증금: 2억원
- 근저당권: 1.5억원
- 나의 보증금: 1.5억원
- 합계: 5억원 > 4억원 ⚠️ 위험!

💡 **TIP**: 계약 전 반드시 전입세대 열람으로 선순위 세입자 유무를 확인하세요!`;
    }

    if (lowerQuestion.includes('깡통전세')) {
      return `## 깡통전세란?

집의 실제 가치보다 전세 보증금이 너무 높아서, 나중에 보증금을 돌려받지 못할 위험이 있는 전세를 말합니다.

### 위험도 체크

**보증금 비율 = (전세 보증금 / 집 시세) × 100**

- 70% 미만: 안전 ✅
- 70~80%: 주의 ⚠️
- 80% 이상: 위험 🚨

### 확인 방법
1. **실거래가 조회**: 국토교통부 실거래가 공개시스템
2. **주변 시세 확인**: 부동산 앱, 직방, 네이버 부동산
3. **등기부등본 확인**: 근저당권 설정액 확인

### 추가 위험 신호
- 주변 시세보다 전세가가 비정상적으로 높은 경우
- 집주인이 전세를 급하게 구하는 경우
- 여러 채의 집을 동시에 전세 놓는 집주인

### 보호 방법
- 전세보증보험 가입
- HUG(주택도시보증공사) 전세보증금반환보증 가입

💡 **중요**: 계약 전 반드시 시세를 확인하고, 의심스러우면 계약하지 마세요!`;
    }

    // 기본 응답
    return `질문해주셔서 감사합니다!

"${question}"에 대한 답변을 준비중입니다.

전월세 계약과 관련된 모든 궁금증을 해결해드리기 위해 노력하고 있습니다. 

자주 묻는 질문:
- 대항력이 뭔가요?
- 확정일자는 왜 필요한가요?
- 등기부등본에서 뭘 확인해야 하나요?
- 선순위 세입자가 있으면 어떻게 되나요?
- 깡통전세를 피하려면 어떻게 해야 하나요?

더 구체적인 질문이 있으시면 언제든 물어보세요! 📝`;
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
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 flex flex-col [&>button]:hidden">
        <DialogTitle className="sr-only">둥지 AI 비서</DialogTitle>
        <DialogDescription className="sr-only">
          전월세 계약 관련 질문을 AI 비서에게 물어보세요
        </DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-amber-200 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="bg-white/20 backdrop-blur-sm p-1.5 md:p-2 rounded-full">
              <Sparkles className="size-5 md:size-6 text-white drop-shadow-md" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white truncate">둥지 AI 비서</h2>
              <p className="text-xs text-amber-50 hidden sm:block">무엇이든 물어보세요</p>
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
        <ScrollArea className="flex-1 p-4 md:p-6 bg-gradient-to-b from-amber-50/50 to-orange-50/30 overflow-y-auto">
          <div className="space-y-4 max-w-3xl mx-auto h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                      : 'bg-white text-amber-950 border border-amber-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words prose prose-sm max-w-none text-sm md:text-base">
                    {message.content.split('\n').map((line, i) => {
                      // 마크다운 스타일 헤더 처리
                      if (line.startsWith('## ')) {
                        return (
                          <h3 key={i} className={message.role === 'user' ? 'text-white' : 'text-amber-900'}>
                            {line.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={i} className={message.role === 'user' ? 'text-white' : 'text-amber-800'}>
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
                  <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-amber-100' : 'text-amber-600'}`}>
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
                <div className="bg-white rounded-2xl p-4 shadow-md border border-amber-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-3 bg-amber-50/50">
            <p className="text-sm text-amber-800 mb-3">💡 자주 묻는 질문:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer bg-white hover:bg-amber-100 border-amber-300 text-amber-800 hover:border-amber-400 transition-all shadow-sm hover:shadow-md rounded-full px-3 py-1"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  {question}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-6 border-t border-amber-200 bg-white/80 backdrop-blur-sm rounded-b-lg">
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
              className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900 rounded-full"
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
              className="flex-1 border-amber-300 focus:border-amber-500 focus:ring-amber-500 rounded-full bg-white"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full shadow-md"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}