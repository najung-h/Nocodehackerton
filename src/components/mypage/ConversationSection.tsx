import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Send, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

// 1. props 타입 정의 변경
interface ConversationSectionProps {
  conversations: any[];
  // messages: any; // App.tsx에 messages 상태 추가 필요
  isLoading: boolean;
  onAction: (actionType: 'send_chat_message', payload?: any) => void;
}

export function ConversationSection({ conversations, isLoading, onAction }: ConversationSectionProps) {
  // 2. 내부 상태 간소화: API 관련 상태 제거, UI 상태만 유지
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<any>({}); // 임시: App.tsx에서 내려줄 때까지

  // 3. fetch, useEffect 제거
  
  useEffect(() => {
    // 부모로부터 받은 conversations가 있을 때 첫번째를 선택
    if (conversations.length > 0 && !selectedConv) {
      setSelectedConv(conversations[0].id);
    }
  }, [conversations, selectedConv]);


  const currentMessages = selectedConv ? messages[selectedConv as keyof typeof messages] || [] : [];

  // 4. 핸들러 함수 로직 변경: onAction 호출
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConv || isLoading) return;
    onAction('send_chat_message', { conversationId: selectedConv, content: messageInput });
    setMessageInput('');
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="ml-2 text-gray-600">대화 기록을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">대화 기록</h2>
          <p className="text-sm text-gray-600">AI 챗봇과의 대화 내역을 확인할 수 있습니다.</p>
        </div>
        <Button
          onClick={() => toast.info('새 대화 시작 기능은 준비 중입니다')}
          className="bg-[#83AF3B] hover:bg-[#6f9632] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          새로운 대화
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* 5. props로 받은 conversations 렌더링 */}
        <Card className="lg:col-span-1 bg-white border-gray-200 flex flex-col overflow-hidden">
            {/* ... 대화 목록 UI (동일) ... */}
        </Card>

        <Card className="lg:col-span-2 bg-white border-gray-200 flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-gray-900">
                  {conversations.find((c) => c.id === selectedConv)?.title}
                </h3>
              </div>

              <ScrollArea className="flex-1 p-4">
                 {/* ... 메시지 목록 UI (동일) ... */}
              </ScrollArea>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border-gray-300"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-gray-500">
                {/* ... 대화 선택 전 UI (동일) ... */}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}