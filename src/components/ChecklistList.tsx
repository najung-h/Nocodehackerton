import { ChecklistItem } from './ChecklistItem';
import { ChecklistItemData } from '../../types'; // 1. 타입 import

interface ChecklistListProps {
  items: ChecklistItemData[];
  phase: string;
  onToggleCheck: (phase: string, id: string) => void;
  onUpdateItem: (phase: string, id: string, title: string, description: string) => void;
  onDeleteItem: (phase: string, id: string) => void;
  onOpenRiskDiagnosis?: () => void;
  onOpenOwnerCheck?: () => void;
  onOpenRegistryAnalysis?: () => void;
  onOpenEmptyJeonseCheck?: () => void;
  // 2. onExecuteAction의 타입 시그니처 수정
  onExecuteAction?: (actionType: string, payload: any) => void;
  onChatbot?: () => void;
  onAddToCalendar: (item: ChecklistItemData) => void;
}

export function ChecklistList({
  items,
  phase,
  onToggleCheck,
  onUpdateItem,
  onDeleteItem,
  onExecuteAction,
  onChatbot,
  onAddToCalendar
}: ChecklistListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex-1">
            <ChecklistItem
              item={item}
              onToggleCheck={() => onToggleCheck(phase, item.id)}
              onUpdate={(title, description) => onUpdateItem(phase, item.id, title, description)}
              onDelete={() => onDeleteItem(phase, item.id)}
              onExecuteAction={onExecuteAction} // 3. 수정된 핸들러 전달
              onChatbot={onChatbot}
              onAddToCalendar={onAddToCalendar}
              // ... 다른 onOpen 핸들러들 전달
            />
          </div>
        </div>
      ))}
    </div>
  );
}