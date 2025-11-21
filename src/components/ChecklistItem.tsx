import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ChevronDown, ExternalLink, Calendar, AlertCircle, Trash2, Save, X, FileText, Check, UserCheck, Zap, MessageCircle, Info, AlertTriangle, DollarSign, Shield, ClipboardList, Star, User, Building2, Store, Edit3, Search, Home, Package, RefreshCw, Scale, Briefcase, Banknote, Megaphone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 부모에게 전달할 데이터 타입을 명확히 정의합니다.
interface ChecklistItemData {
  id: string;
  title: string;
  description?: string;
  what?: string;
  why?: string;
  isChecked: boolean;
  isCustom: boolean;
  links?: Array<{ label: string; url: string }>;
  guidelines?: string;
  hasCalendar?: boolean;
  isImportant?: boolean;
  isEditing?: boolean;
  hasRiskDiagnosis?: boolean;
  hasOwnerCheck?: boolean;
  hasRegistryAnalysis?: boolean;
  hasEmptyJeonseCheck?: boolean;
  actionType?: string;
  actionLabel?: string;
}

interface ChecklistItemProps {
  item: ChecklistItemData; // item 타입을 명확히 합니다.
  onToggleCheck: () => void;
  onUpdate: (title: string, description: string) => void;
  onDelete: () => void;
  onOpenRiskDiagnosis?: () => void;
  onOpenOwnerCheck?: () => void;
  onOpenRegistryAnalysis?: () => void;
  onOpenEmptyJeonseCheck?: () => void;
  onExecuteAction?: (actionType: string) => void;
  onChatbot?: () => void;
  onAddToCalendar: (item: ChecklistItemData) => void; // 1. onAddToCalendar prop을 추가합니다.
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
  onAddToCalendar // 2. prop을 받습니다.
}: ChecklistItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(item.isEditing || false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(item.description || '');

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }
    onUpdate(editTitle, editDescription);
    setIsEditing(false);
    toast.success('체크리스트 항목이 저장되었습니다');
  };

  const handleCancel = () => {
    if (!item.title) {
      onDelete();
    } else {
      setEditTitle(item.title);
      setEditDescription(item.description || '');
      setIsEditing(false);
    }
  };

  // 3. 내부 구현 로직을 제거합니다.
  // const handleAddToCalendar = () => {
  //   toast.success('캘린더에 일정이 추가되었습니다');
  // };

  const getItemIcon = (item: ChecklistItemProps['item']) => {
    // ... 아이콘 로직은 동일 ...
    return <CheckCircle className="w-6 h-6 text-[#22909D]" />;
  };

  if (isEditing) {
    // ... 수정 UI는 동일 ...
    return (
      <div className="bg-gray-50 border-2 border-gray-400 rounded-lg p-4 space-y-3">
        {/* ... */}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`bg-white rounded-xl overflow-hidden ...`}>
        <CollapsibleTrigger className="w-full">
          {/* ... CollapsibleTrigger 내용은 동일 ... */}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4 pt-4 mt-2">
            {/* ... what, why, description 내용은 동일 ... */}

            <div className="flex flex-wrap gap-2 min-h-[80px] items-center">
              {/* ... 다른 버튼들은 동일 ... */}

              {/* 4. onAddToCalendar prop을 호출하도록 onClick 핸들러를 수정합니다.
                   item 전체를 넘겨서 부모가 필요한 정보를 활용할 수 있도록 합니다. */}
              {item.hasCalendar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddToCalendar(item)}
                  className="flex-grow border-[#9D9D9D] text-[#262626] hover:bg-[#ECECEC] rounded-lg h-16 text-base"
                >
                  <Calendar className="size-5 mr-2 flex-shrink-0" />
                  <span>구글 캘린더 연동</span>
                </Button>
              )}

              {/* ... 나머지 버튼들은 동일 ... */}
            </div>

            {onChatbot && (item.what || item.why) && (
              <button
                onClick={onChatbot}
                className="group w-full flex items-center justify-center ..."
              >
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
