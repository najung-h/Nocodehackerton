import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ChevronDown, ExternalLink, Calendar, AlertCircle, Trash2, Save, X, FileText, Check, UserCheck, Zap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChecklistItemProps {
  item: {
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
  };
  onToggleCheck: () => void;
  onUpdate: (title: string, description: string) => void;
  onDelete: () => void;
  onOpenRiskDiagnosis?: () => void;
  onOpenOwnerCheck?: () => void;
  onOpenRegistryAnalysis?: () => void;
  onOpenEmptyJeonseCheck?: () => void;
  onExecuteAction?: (actionType: string) => void;
}

export function ChecklistItem({ item, onToggleCheck, onUpdate, onDelete, onOpenRiskDiagnosis, onOpenOwnerCheck, onOpenRegistryAnalysis, onOpenEmptyJeonseCheck, onExecuteAction }: ChecklistItemProps) {
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
      // 새로 추가한 항목인데 취소하면 삭제
      onDelete();
    } else {
      setEditTitle(item.title);
      setEditDescription(item.description || '');
      setIsEditing(false);
    }
  };

  const handleAddToCalendar = () => {
    toast.success('캘린더에 일정이 추가되었습니다');
  };

  if (isEditing) {
    return (
      <div className="bg-gray-50 border-2 border-gray-400 rounded-lg p-4 space-y-3">
        <Input
          placeholder="체크리스트 제목을 입력하세요"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          autoFocus
          className="border-gray-300"
        />
        <Textarea
          placeholder="설명을 입력하세요"
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          rows={3}
          className="border-gray-300"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Save className="size-4 mr-1" />
            저장
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="border-gray-300 text-gray-700">
            <X className="size-4 mr-1" />
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={`border rounded-lg transition-colors ${
          item.isChecked ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
        } ${item.isImportant ? 'ring-2 ring-cyan-400' : ''}`}
      >
        <div className="flex items-start gap-3 p-4">
          <Checkbox
            checked={item.isChecked}
            onCheckedChange={onToggleCheck}
            className="mt-1 border-gray-400 data-[state=checked]:bg-cyan-500"
            id={item.id}
          />
          
          <div className="flex-1 min-w-0">
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
              <span
                className={`flex-1 ${
                  item.isChecked ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {item.title}
              </span>
              <ChevronDown
                className={`size-5 text-gray-500 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </CollapsibleTrigger>

            {item.isImportant && (
              <Badge variant="outline" className="mt-2 border-cyan-500 text-cyan-700 bg-cyan-50">
                중요
              </Badge>
            )}
          </div>

          {item.isCustom && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4 mt-2">
            {/* WHAT - 무엇을 하는지 (실용적, action-oriented) */}
            {item.what && (
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-16 py-1 px-2 bg-cyan-500 text-white rounded text-xs text-center">WHAT</div>
                  <p className="text-sm text-gray-900 flex-1">{item.what}</p>
                </div>
              </div>
            )}

            {/* WHY - 왜 하는지 (경고/주의/설명적) */}
            {item.why && (
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-16 py-1 px-2 bg-gray-600 text-white rounded text-xs text-center">WHY</div>
                  <p className="text-sm text-gray-700 flex-1">{item.why}</p>
                </div>
              </div>
            )}

            {/* 레거시 description 지원 (커스텀 항목용) */}
            {item.description && !item.what && !item.why && (
              <p className="text-sm text-gray-700">{item.description}</p>
            )}

            {/* 완료 체크 버튼 */}
            <Button
              onClick={onToggleCheck}
              className={`w-full ${
                item.isChecked
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              {item.isChecked ? (
                <>
                  <Check className="size-4 mr-2" />
                  완료됨
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  완료 체크
                </>
              )}
            </Button>

            {item.guidelines && (
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-3 flex gap-2">
                <AlertCircle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-900">{item.guidelines}</div>
              </div>
            )}

            {item.links && item.links.length > 0 && (
              <div className="space-y-2">
                {item.links.map((link, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="size-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </Button>
                ))}
              </div>
            )}

            {item.hasCalendar && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCalendar}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
                >
                  <Calendar className="size-4 mr-2 flex-shrink-0" />
                  <span>구글 캘린더와 연동</span>
                </Button>
              </div>
            )}

            {item.isCustom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-gray-700 hover:bg-gray-50"
              >
                수정하기
              </Button>
            )}

            {item.hasRiskDiagnosis && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenRiskDiagnosis}
                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
              >
                <FileText className="size-4 mr-2 flex-shrink-0" />
                <span>내 계약서 위험 진단하기</span>
              </Button>
            )}

            {item.hasOwnerCheck && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenOwnerCheck}
                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
              >
                <UserCheck className="size-4 mr-2 flex-shrink-0" />
                <span>소유자 확인하기</span>
              </Button>
            )}

            {item.hasRegistryAnalysis && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenRegistryAnalysis}
                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
              >
                <FileText className="size-4 mr-2 flex-shrink-0" />
                <span>등록 정보 분석하기</span>
              </Button>
            )}

            {item.hasEmptyJeonseCheck && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenEmptyJeonseCheck}
                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
              >
                <FileText className="size-4 mr-2 flex-shrink-0" />
                <span>깡통전세 위험도 분석하기</span>
              </Button>
            )}

            {item.actionType && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExecuteAction && onExecuteAction(item.actionType)}
                className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 text-xs sm:text-sm"
              >
                <Zap className="size-4 mr-2 flex-shrink-0" />
                <span>{item.actionLabel}</span>
              </Button>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}