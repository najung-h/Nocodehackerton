import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Send, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';

export function ConversationSection() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any>({});
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // '대화' 기능 통합 웹훅
  const conversationManagerWebhook = 'https://ajjoona.app.n8n.cloud/webhook/manage-conversations'; // TODO: 실제 통합 웹훅 URL로 교체

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(conversationManagerWebhook); // 통합 웹훅 GET
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        setConversations(data.conversations || []);
        setMessages(data.messages || {});
        if (data.conversations && data.conversations.length > 0) {
          setSelectedConv(data.conversations[0].id);
        }
      } catch (error) {
        console.error(error);
        toast.error('대화 기록을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentMessages = selectedConv ? messages[selectedConv as keyof typeof messages] || [] : [];

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConv || isSending) return;
    
    setIsSending(true);

    try {
      const response = await fetch(conversationManagerWebhook, { // 통합 웹훅 POST
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message', // 액션 구분자 추가
          conversationId: selectedConv,
          content: messageInput,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const newMessage = await response.json();
      
      // Optimistic update or refetch
      setMessages((prev: any) => ({
        ...prev,
        [selectedConv]: [...(prev[selectedConv] || []), newMessage],
      }));
      setMessageInput('');
      toast.success('메시지가 전송되었습니다');

    } catch (error) {
      console.error(error);
      toast.error('메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
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

        <Card className="lg:col-span-2 bg-white border-gray-200 flex flex-col overflow-hidden">
          {selectedConv ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-gray-900">
                  {conversations.find((c) => c.id === selectedConv)?.title}
                </h3>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {currentMessages.map((msg: any) => (
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
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                    disabled={isSending}
                  >
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
