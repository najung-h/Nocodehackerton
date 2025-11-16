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
          {/* Timeline */}
          {item.hasTimeline && (
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-3 h-3 rounded-full border-2 ${
                  item.isChecked
                    ? 'bg-blue-600 border-blue-600'
                    : item.isImportant
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-gray-300'
                }`}
              />
              {index < items.filter(i => i.hasTimeline).length - 1 && (
                <div className="w-0.5 h-full min-h-[60px] bg-gray-200 my-1" />
              )}
            </div>
          )}

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
            
            {/* Timeline Label */}
            {item.timelineLabel && (
              <div className={`mt-2 text-sm ${item.isImportant ? 'text-green-600' : 'text-blue-600'}`}>
                {item.timelineLabel}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}