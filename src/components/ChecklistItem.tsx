import { useState } from 'react';
import { Button } from './ui/button';
import { /* ... 아이콘들 ... */ Zap } from 'lucide-react';
import { toast } from 'sonner';
import { ChecklistItemData, ActionType } from '../../types';

interface ChecklistItemProps {
  item: ChecklistItemData;
  onToggleCheck: () => void;
  onUpdate: (title: string, description: string) => void;
  onDelete: () => void;
  onOpenRiskDiagnosis?: () => void;
  onOpenOwnerCheck?: () => void;
  onOpenRegistryAnalysis?: () => void;
  onOpenEmptyJeonseCheck?: () => void;
  // 1. onExecuteAction의 타입 시그니처를 payload를 받도록 명확히 함
  onExecuteAction?: (actionType: string, payload: any) => void;
  onChatbot?: () => void;
  onAddToCalendar: (item: ChecklistItemData) => void;
}

export function ChecklistItem({ 
  item, 
  onExecuteAction,
  // ... 다른 props
}: ChecklistItemProps) {
  // ... 내부 상태 및 핸들러 ...

  return (
    // ... Collapsible UI ...
        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4 pt-4 mt-2">
            {/* ... */}
            <div className="flex flex-wrap gap-2 min-h-[80px] items-center">
              {/* ... 다른 버튼들 ... */}

              {/* 2. onExecuteAction 호출 시, payload에 item 전체를 담아 전달 */}
              {item.actionType && item.actionLabel && onExecuteAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExecuteAction(item.actionType!, { item })}
                  className="flex-grow bg-[#22909D] text-white hover:bg-[#1a7580] border-[#22909D] rounded-lg h-16 text-base shadow-md"
                >
                  <Zap className="size-5 mr-2 flex-shrink-0" />
                  <span>{item.actionLabel}</span>
                </Button>
              )}
            </div>
            {/* ... */}
          </div>
        </CollapsibleContent>
    // ...
  );
}