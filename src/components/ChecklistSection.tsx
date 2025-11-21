import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProgressBar } from './ProgressBar';
import { ChecklistList } from './ChecklistList';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatDialog } from './ChatDialog';
import { ActionType, ChecklistItemData } from '../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface ChecklistSectionProps {
  onAction: (actionType: ActionType, payload?: any) => void;
  isLoading: Record<string, boolean>;
}

// 이 컴포넌트에서만 사용하는 타입
const initialChecklists: { before: ChecklistItemData[], during: ChecklistItemData[], after: ChecklistItemData[] } = { 
  before: [], // 실제 데이터는 여기서 초기화
  during: [],
  after: [],
};
type ChecklistPhase = 'before' | 'during' | 'after';

export function ChecklistSection({ onAction, isLoading }: ChecklistSectionProps) {
  const [activeTab, setActiveTab] = useState<ChecklistPhase>('before');
  const [checklists, setChecklists] = useState(initialChecklists);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // 3. 모든 핸들러가 구체적인 타입을 사용해 onAction 호출
  const handleChatAction = useCallback((actionType: 'send_chat_message' | 'export_pdf' | 'send_email', payload?: any) => {
      onAction(actionType, payload);
  }, [onAction]);

  const handleAddToCalendar = useCallback((item: ChecklistItemData) => {
    onAction('add_to_calendar', { item });
  }, [onAction]);
  
  // 1. PDF 내보내기 버튼 핸들러
  const handleExportPDF = () => {
    // 'export_pdf' 액션으로 호출 -> App.tsx에서 처리
    onAction('export_pdf', { 
      // 필요한 경우 현재 체크리스트 상태 등을 payload로 전달 가능
      phase: activeTab 
    });
  };

  // 2. 이메일 발송 버튼 핸들러
  const handleSendEmail = () => {
    // 'send_email' 액션으로 호출
    onAction('send_email', {
      phase: activeTab
    });
  };

  const handleExecuteAction = useCallback((actionType: string, payload?: any) => {
    onAction(actionType as ActionType, payload);
  }, [onAction]);
  
  const handleToggleCheck = (phase: ChecklistPhase, id: string) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: prev[phase].map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    }));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-foreground">전월세 계약 체크리스트</h2>
        <div className="flex gap-2">
          {/* 3. PDF 버튼에 핸들러 및 로딩 상태 연결 */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportPDF} 
            disabled={isLoading['export_pdf']} // 로딩 중 비활성화
            className="rounded-full border-primary/30 text-primary hover:bg-primary/10 flex-1 md:flex-initial"
          >
            <Download className="size-4 md:mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          
          {/* 4. 메일 버튼에 핸들러 및 로딩 상태 연결 */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendEmail} 
            disabled={isLoading['send_email']} // 로딩 중 비활성화
            className="rounded-full border-primary/30 text-primary hover:bg-primary/10 flex-1 md:flex-initial"
          >
            <Mail className="size-4 md:mr-2" />
            <span className="hidden sm:inline">메일</span>
          </Button>
        </div>
      </div>

      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChecklistPhase)}>
        {/* ... */}
        <TabsContent value="before">
          <ProgressBar items={checklists.before} phase="before" />
          <ChecklistList
            items={checklists.before}
            phase="before"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={() => {}}
            onDeleteItem={() => {}}
            onExecuteAction={handleExecuteAction}
            onChatbot={() => setIsChatOpen(true)}
            onAddToCalendar={handleAddToCalendar}
          />
        </TabsContent>
        {/* ... 다른 Tabs ... */}
      </Tabs>
      
      <ChatDialog
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        onAction={handleChatAction}
        isLoading={isLoading}
      />
    </div>
  );
}
