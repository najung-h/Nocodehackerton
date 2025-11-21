import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, Paperclip, Download, Mail, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import chatbotImage from "figma:asset/mother.png";

// 1. 타입 정의 단순화 및 onAction 통합
type ActionType = 'send_chat_message' | 'export_pdf' | 'send_email';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (actionType: ActionType, payload?: any) => void;
  isLoading: Record<string, boolean>;
  // messages: Message[]; // 이 컴포넌트는 이제 자체 메시지 상태를 가집니다.
}

const suggestedQuestions = [
  '등기부등본에서 뭘 확인해야 하나요?',
  '대항력이 뭔가요?',
  '확정일자는 왜 필요한가요?',
];

export function ChatDialog({ open, onOpenChange, onAction, isLoading }: ChatDialogProps) {
  // 2. ChatDialog는 자체적인 대화 상태를 가집니다.
  // 이 대화는 ChecklistSection의 메인 워크플로우와 분리되어 있기 때문입니다.
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 둥지 AI 비서입니다. 🏠\n\n전월세 계약 과정에서 궁금한 점이 있으신가요? 무엇이든 물어보세요!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 3. handleSendMessage에서 fetch를 제거하고 onAction을 호출합니다.
  const handleSendMessage = () => {
    const isSending = isLoading['send_chat_message'];
    if (!inputValue.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    // Optimistic UI update
    setMessages(prev => [...prev, userMessage]);

    // actionType과 payload를 부모로 전달
    onAction('send_chat_message', { query: inputValue, history: [...messages, userMessage] });
    
    setInputValue('');
  };
  
  // 4. 나머지 핸들러들도 onAction을 호출하도록 통일합니다.
  const handleExportPDF = () => {
    onAction('export_pdf', { messages });
  };
  
  const handleSendEmail = () => {
    onAction('send_email', { messages });
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };
  
  const handleFileUpload = () => { fileInputRef.current?.click(); };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) toast.success(`${e.target.files[0].name} 파일이 업로드되었습니다`);
  };

  const isExportingPdf = isLoading['export_pdf'];
  const isSendingEmail = isLoading['send_email'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 ...">
        {/* ... Header ... */}
        <div className="flex items-center justify-between p-4 md:p-6 ...">
          {/* ... */}
          <div className="flex items-center gap-1 md:gap-2 ...">
            <Button variant="ghost" size="sm" onClick={handleExportPDF} disabled={isExportingPdf} className="...">
              {isExportingPdf ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSendEmail} disabled={isSendingEmail} className="...">
              {isSendingEmail ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="...">
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 md:p-6 ...">
          {/* ... Messages UI ... */}
        </ScrollArea>
        
        {/* ... Suggested Questions UI ... */}

        <div className="p-6 border-t ...">
          <div className="flex gap-2">
            {/* ... File Upload Button ... */}
            <Input
              placeholder="질문을 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading['send_chat_message']}
              className="..."
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading['send_chat_message']} className="...">
              {isLoading['send_chat_message'] ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
