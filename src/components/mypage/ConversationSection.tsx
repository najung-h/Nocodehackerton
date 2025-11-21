import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Send, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Conversation, ChatMessage, ActionType } from '../../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface ConversationSectionProps {
  conversations: Conversation[];
  isLoading: boolean;
  onAction: (actionType: 'send_chat_message', payload?: any) => void;
  // messages prop은 App.tsx의 메인 챗봇과 상태를 공유하므로, 여기서는 자체 관리하거나 별도 상태로 분리해야 함.
  // 이 섹션은 과거 대화 '기록'을 보는 것이므로, 일단 conversations에서 파생된 메시지를 보여주는 것으로 가정.
}

export function ConversationSection({ conversations, isLoading, onAction }: ConversationSectionProps) {
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  
  // 현재는 messages가 App.tsx에 없으므로, 임시로 로컬 상태를 유지.
  // 이상적으로는 App.tsx에 `conversationMessages` 같은 별도 상태가 있어야 함.
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});

  useEffect(() => {
    if (conversations.length > 0 && !selectedConv) {
      setSelectedConv(conversations[0].id);
    }
  }, [conversations, selectedConv]);

  const currentMessages = selectedConv ? messages[selectedConv] || [] : [];

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
        {/* ... 헤더 UI ... */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        <Card className="lg:col-span-1 bg-white border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-gray-900">대화 목록</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConv === conv.id
                      ? 'bg-[#83AF3B]/10 border border-[#83AF3B]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{conv.title}</p>
                      <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.updated_at).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
        <Card className="lg:col-span-2 ...">
          {/* ... 메시지 표시 UI ... */}
        </Card>
      </div>
    </div>
  );
}
