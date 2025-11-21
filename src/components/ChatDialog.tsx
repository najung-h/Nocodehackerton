import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, Paperclip, Download, Mail, Loader2 } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import chatbotImage from "figma:asset/mother.png";
import { ActionType, ChatMessage } from '../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (actionType: 'send_chat_message' | 'export_pdf' | 'send_email', payload?: any) => void;
  isLoading: Record<string, boolean>;
}

const suggestedQuestions = [
  '등기부등본에서 뭘 확인해야 하나요?',
  '대항력이 뭔가요?',
  '확정일자는 왜 필요한가요?',
];

export function ChatDialog({ open, onOpenChange, onAction, isLoading }: ChatDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '안녕하세요! 둥지 AI 비서입니다. 🏠\n\n전월세 계약 과정에서 궁금한 점이 있으신가요? 무엇이든 물어보세요!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    const isSending = isLoading['send_chat_message'];
    if (!inputValue.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    onAction('send_chat_message', { query: inputValue, history: [...messages, userMessage] });
    setInputValue('');
  };
  
  const handleExportPDF = () => {
    onAction('export_pdf', { messages });
  };
  
  const handleSendEmail = () => {
    onAction('send_email', { messages });
  };

  const isExportingPdf = isLoading['export_pdf'];
  const isSendingEmail = isLoading['send_email'];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 ...">
        <div className="flex items-center justify-between p-4 md:p-6 ...">
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
        
        <ScrollArea>
           {/* ... */}
        </ScrollArea>
        
        <div className="p-6 border-t ...">
          <div className="flex gap-2">
            <Input
              placeholder="질문을 입력하세요..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              disabled={isLoading['send_chat_message']}
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading['send_chat_message']}>
              {isLoading['send_chat_message'] ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}