import { ChecklistItem } from './ChecklistItem';

// 부모(ChecklistSection)로부터 받을 데이터 타입을 명확히 정의
interface ChecklistItemData {
  id: string;
  title: string;
  description?: string;
  what?: string;
  why?: string;
  isChecked: boolean;
  isCustom: boolean;
  hasTimeline: boolean;
  timelineLabel?: string;
  isImportant?: boolean;
  links?: Array<{ label: string; url: string }>;
  guidelines?: string;
  hasCalendar?: boolean;
  isEditing?: boolean;
  hasRiskDiagnosis?: boolean;
  hasOwnerCheck?: boolean;
  hasRegistryAnalysis?: boolean;
  hasEmptyJeonseCheck?: boolean;
  actionType?: string;
  actionLabel?: string;
}

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
  onExecuteAction?: (actionType: string) => void;
  onChatbot?: () => void;
  onAddToCalendar: (item: ChecklistItemData) => void; // 1. onAddToCalendar prop을 추가합니다.
}

export function ChecklistList({
  items,
  phase,
  onToggleCheck,
  onUpdateItem,
  onDeleteItem,
  onOpenRiskDiagnosis,
  onOpenOwnerCheck,
  onOpenRegistryAnalysis,
  onOpenEmptyJeonseCheck,
  onExecuteAction,
  onChatbot,
  onAddToCalendar // 2. prop을 받습니다.
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
              onOpenRiskDiagnosis={onOpenRiskDiagnosis}
              onOpenOwnerCheck={onOpenOwnerCheck}
              onOpenRegistryAnalysis={onOpenRegistryAnalysis}
              onOpenEmptyJeonseCheck={onOpenEmptyJeonseCheck}
              onExecuteAction={onExecuteAction}
              onChatbot={onChatbot}
              onAddToCalendar={onAddToCalendar} // 3. 받은 prop을 ChecklistItem으로 그대로 전달합니다.
            />
          </div>
        </div>
      ))}
    </div>
  );
}
