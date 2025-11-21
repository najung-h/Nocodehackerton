import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronDown, ExternalLink, Calendar, Trash2, Save, X, FileText, Check, UserCheck, Zap, MessageCircle, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ChecklistItemData } from '../../types'; // 타입 import

// 복원: 모든 props를 포함하도록 인터페이스를 원상 복구
interface ChecklistItemProps {
  item: ChecklistItemData;
  onToggleCheck: () => void;
  onUpdate: (title: string, description: string) => void;
  onDelete: () => void;
  onOpenRiskDiagnosis?: () => void;
  onOpenOwnerCheck?: () => void;
  onOpenRegistryAnalysis?: () => void;
  onOpenEmptyJeonseCheck?: () => void;
  onExecuteAction?: (actionType: string, payload: any) => void;
  onChatbot?: () => void;
  onAddToCalendar: (item: ChecklistItemData) => void;
}

export function ChecklistItem({ 
  item, 
  onToggleCheck, 
  onUpdate, 
  onDelete, 
  onOpenRiskDiagnosis, 
  onOpenOwnerCheck, 
  onOpenRegistryAnalysis, 
  onOpenEmptyJeonseCheck, 
  onExecuteAction, 
  onChatbot,
  onAddToCalendar 
}: ChecklistItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  // ... 나머지 내부 상태 및 핸들러는 원본 구조 유지 ...

  // isEditing 상태에 따른 UI 렌더링 부분은 생략 (이 부분은 삭제되지 않았음)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`bg-white rounded-xl overflow-hidden ...`}>
        {/* CollapsibleTrigger 부분은 생략 */}
        <CollapsibleTrigger asChild>
            {/* ... */}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4 pt-4 mt-2">
            {/* what, why 등 설명 UI 부분은 생략 */}

            {/* ====================================================== */}
            {/* 🔥 여기부터가 실수로 삭제되었던 핵심 버튼 복원 영역 */}
            {/* ====================================================== */}
            <div className="flex flex-wrap gap-2 min-h-[80px] items-center">
              {/* 링크 버튼들 복원 */}
              {item.links?.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="flex-grow ..."
                  onClick={() => window.open(link.url, '_blank')}
                >
                  <ExternalLink className="size-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Button>
              ))}

              {/* 캘린더 버튼: 최신 로직 적용 */}
              {item.hasCalendar && (
                <Button variant="outline" size="sm" onClick={() => onAddToCalendar(item)} className="flex-grow ...">
                  <Calendar className="size-5 mr-2 flex-shrink-0" />
                  <span>구글 캘린더 연동</span>
                </Button>
              )}

              {/* 위험 진단 버튼 복원 */}
              {item.hasRiskDiagnosis && onOpenRiskDiagnosis && (
                <Button variant="outline" size="sm" onClick={onOpenRiskDiagnosis} className="flex-grow ...">
                  <FileText className="size-5 mr-2 flex-shrink-0" />
                  <span>계약서 위험 진단</span>
                </Button>
              )}

              {/* 소유자 확인 버튼 복원 */}
              {item.hasOwnerCheck && onOpenOwnerCheck && (
                <Button variant="outline" size="sm" onClick={onOpenOwnerCheck} className="flex-grow ...">
                  <UserCheck className="size-5 mr-2 flex-shrink-0" />
                  <span>소유자 확인</span>
                </Button>
              )}
              
              {/* 등록 정보 분석 버튼 복원 */}
              {item.hasRegistryAnalysis && onOpenRegistryAnalysis && (
                <Button variant="outline" size="sm" onClick={onOpenRegistryAnalysis} className="flex-grow ...">
                  <FileText className="size-5 mr-2 flex-shrink-0" />
                  <span>등록 정보 분석</span>
                </Button>
              )}

              {/* 깡통전세 위험도 분석 버튼 복원 */}
              {item.hasEmptyJeonseCheck && onOpenEmptyJeonseCheck && (
                <Button variant="outline" size="sm" onClick={onOpenEmptyJeonseCheck} className="flex-grow ...">
                  <FileText className="size-5 mr-2 flex-shrink-0" />
                  <span>깡통전세 위험도 분석</span>
                </Button>
              )}

              {/* ExecuteAction 버튼: 최신 로직 적용 */}
              {item.actionType && item.actionLabel && onExecuteAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExecuteAction(item.actionType!, { item })}
                  className="flex-grow bg-[#22909D] ..."
                >
                  <Zap className="size-5 mr-2 flex-shrink-0" />
                  <span>{item.actionLabel}</span>
                </Button>
              )}
            </div>
            
            {/* 챗봇 버튼 복원 */}
            {onChatbot && (item.what || item.why) && (
              <button onClick={onChatbot} className="group w-full flex ...">
                <MessageCircle className="w-4 h-4 group-hover:animate-bounce" />
                <span className="font-medium text-sm">AI 챗봇에게 자세히 물어보기</span>
                <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
