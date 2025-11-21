import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProgressBar } from './ProgressBar';
import { ChecklistList } from './ChecklistList';
import { Button } from './ui/button';
import { MessageSquare } from 'lucide-react';
import { ChatDialog } from './ChatDialog';

// 1. props 타입 정의
type ActionType = any; // App.tsx와 동일하게 정의 필요
interface ChecklistItemData {
  id: string;
  title: string;
  [key: string]: any; 
}

interface ChecklistSectionProps {
  onAction: (actionType: ActionType, payload?: any) => void;
  isLoading: Record<string, boolean>;
}

const initialChecklists = { /* ... 초기 데이터 ... */ };
type ChecklistPhase = 'before' | 'during' | 'after';

// 2. props에서 onAction과 isLoading을 받도록 함
export function ChecklistSection({ onAction, isLoading }: ChecklistSectionProps) {
  const [activeTab, setActiveTab] = useState<ChecklistPhase>('before');
  const [checklists, setChecklists] = useState(initialChecklists);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // 3. 모든 핸들러 함수가 onAction을 호출하도록 변경
  const handlePdfExport = useCallback((payload: any) => {
    onAction('export_pdf', payload);
  }, [onAction]);

  const handleSendEmail = useCallback((payload: any) => {
    onAction('send_email', payload);
  }, [onAction]);

  const handleAddToCalendar = useCallback((payload: any) => {
    onAction('add_to_calendar', payload);
  }, [onAction]);
  
  const handleExecuteAction = useCallback((actionType: string, payload?: any) => {
    onAction(actionType, payload);
  }, [onAction]);
  
  const handleChatAction = useCallback((actionType: 'send_chat_message' | 'export_pdf' | 'send_email', payload?: any) => {
      onAction(actionType, payload);
  }, [onAction]);


  const handleToggleCheck = (phase: ChecklistPhase, id: string) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: prev[phase].map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    }));
  };
  
  // ... (handleAddItem, handleUpdateItem 등 UI 로직은 그대로 유지) ...

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-foreground">전월세 계약 체크리스트</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsChatOpen(true)} className="rounded-full ...">
            <MessageSquare className="size-4 md:mr-2" />
            <span className="hidden sm:inline">AI 비서와 상담</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChecklistPhase)}>
        <div className="flex gap-0 mb-6 ...">
           {/* ... Tab Triggers ... */}
        </div>

        {/* 4. 자식 컴포넌트에 핸들러 함수 전달 */}
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
        
        <TabsContent value="during">
          <ProgressBar items={checklists.during} phase="during" />
          <ChecklistList
            items={checklists.during}
            phase="during"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={() => {}}
            onDeleteItem={() => {}}
            onExecuteAction={handleExecuteAction}
            onChatbot={() => setIsChatOpen(true)}
            onAddToCalendar={handleAddToCalendar}
          />
        </TabsContent>

        <TabsContent value="after">
          <ProgressBar items={checklists.after} phase="after" />
          <ChecklistList
            items={checklists.after}
            phase="after"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={() => {}}
            onDeleteItem={() => {}}
            onExecuteAction={handleExecuteAction}
            onChatbot={() => setIsChatOpen(true)}
            onAddToCalendar={handleAddToCalendar}
          />
        </TabsContent>
      </Tabs>
      
      {/* 5. ChatDialog에 onAction 핸들러와 isLoading 상태 전달 */}
      <ChatDialog
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
        onAction={handleChatAction}
        isLoading={isLoading}
      />
    </div>
  );
}