import { useState } from 'react';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner@2.0.3';

// 더미 데이터
const dummyConversations = [
  {
    id: 1,
    title: '확정일자 관련 질문',
    updated_at: '2025-01-15T14:30:00',
    lastMessage: '확정일자는 주민센터에서 무료로...',
  },
  {
    id: 2,
    title: '전세보증금 반환 문의',
    updated_at: '2025-01-14T10:20:00',
    lastMessage: '계약 종료 시 보증금 반환 절차는...',
  },
  {
    id: 3,
    title: '등기부등본 보는 법',
    updated_at: '2025-01-12T16:45:00',
    lastMessage: '등기부등본의 갑구와 을구는...',
  },
];

const dummyMessages = {
  1: [
    {
      id: 1,
      sender_type: 'bot',
      content: '안녕하세요! 확정일자에 대해 궁금하신 점이 있으신가요?',
      created_at: '2025-01-15T14:20:00',
    },
    {
      id: 2,
      sender_type: 'user',
      content: '확정일자는 어디서 받을 수 있나요?',
      created_at: '2025-01-15T14:25:00',
    },
    {
      id: 3,
      sender_type: 'bot',
      content: '확정일자는 주민센터나 인터넷등기소에서 무료로 받을 수 있습니다. 전입신고 후 바로 받으시는 것을 권장합니다.',
      created_at: '2025-01-15T14:30:00',
    },
  ],
  2: [
    {
      id: 4,
      sender_type: 'user',
      content: '전세보증금은 언제 돌려받나요?',
      created_at: '2025-01-14T10:15:00',
    },
    {
      id: 5,
      sender_type: 'bot',
      content: '계약 종료 시 보증금 반환 절차는 다음과 같습니다:\n\n1. 계약 만료 2-3개월 전 임대인에게 통보\n2. 계약 종료일에 집 인도\n3. 인도 후 보증금 반환\n\n임대인이 반환하지 않으면 법적 조치를 취할 수 있습니다.',
      created_at: '2025-01-14T10:20:00',
    },
  ],
  3: [
    {
      id: 6,
      sender_type: 'user',
      content: '등기부등본 보는 법을 알려주세요',
      created_at: '2025-01-12T16:40:00',
    },
    {
      id: 7,
      sender_type: 'bot',
      content: '등기부등본의 갑구와 을구는 다음과 같습니다:\n\n갑구: 소유권 관련 사항 (소유자, 압류, 가압류 등)\n을구: 소유권 외 권리 (근저당권, 전세권 등)\n\n특히 을구의 근저당권 금액을 꼼꼼히 확인하세요!',
      created_at: '2025-01-12T16:45:00',
    },
  ],
};

export function ConversationSection() {
  const [conversations] = useState(dummyConversations);
  const [selectedConv, setSelectedConv] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');

  const currentMessages = selectedConv ? dummyMessages[selectedConv as keyof typeof dummyMessages] || [] : [];

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    toast.success('메시지가 전송되었습니다');
    setMessageInput('');
  };

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

      {/* 대화 UI: 좌측 리스트 + 우측 메시지 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* 좌측: 대화 리스트 */}
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
                        {new Date(conv.updated_at).toLocaleString('ko-KR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* 우측: 선택된 대화 메시지 */}
        <Card className="lg:col-span-2 bg-white border-gray-200 flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-gray-900">
                  {conversations.find((c) => c.id === selectedConv)?.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  마지막 업데이트:{' '}
                  {new Date(
                    conversations.find((c) => c.id === selectedConv)?.updated_at || ''
                  ).toLocaleString('ko-KR')}
                </p>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender_type === 'user'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            msg.sender_type === 'user' ? 'text-cyan-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString('ko-KR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 border-gray-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>대화를 선택해주세요</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
