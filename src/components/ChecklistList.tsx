import { ChecklistItem } from './ChecklistItem';

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
  onChatbot
}: ChecklistListProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          {/* Timeline - removed */}

          {/* Checklist Item */}
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
            />
          </div>
        </div>
      ))}
    </div>
  );
}