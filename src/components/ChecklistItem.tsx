import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ChevronDown, ExternalLink, Calendar, AlertCircle, Trash2, Save, X, FileText, Check, UserCheck, Zap, MessageCircle, Info, AlertTriangle, DollarSign, Shield, ClipboardList, Star, User, Building2, Store, Edit3, Search, Home, Package, RefreshCw, Scale, Briefcase, Banknote, Megaphone, CheckCircle } from 'lucide-react';
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
  onChatbot?: () => void;
}

export function ChecklistItem({ item, onToggleCheck, onUpdate, onDelete, onOpenRiskDiagnosis, onOpenOwnerCheck, onOpenRegistryAnalysis, onOpenEmptyJeonseCheck, onExecuteAction, onChatbot }: ChecklistItemProps) {
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

  const getItemIcon = (item: ChecklistItemProps['item']) => {
    const title = item.title.toLowerCase();
    
    // 항목별 고유 아이콘 매핑
    if (title.includes('매매가격') || title.includes('실거래가')) {
      return <DollarSign className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('보증보험')) {
      return <Shield className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('등기부등본')) {
      return <ClipboardList className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('우선변제') || title.includes('확정일자')) {
      return <Star className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('임대인') || title.includes('집주인')) {
      return <User className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('신탁')) {
      return <Building2 className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('공인중개사') || title.includes('중개')) {
      return <Store className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('계약')) {
      return <FileText className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('특약')) {
      return <Edit3 className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('선순위') || title.includes('근저당')) {
      return <Search className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('위임장')) {
      return <FileText className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('대항력')) {
      return <Home className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('이사')) {
      return <Package className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('갱신')) {
      return <RefreshCw className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('권리변동')) {
      return <Scale className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('국세') || title.includes('임금')) {
      return <Briefcase className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('보증금 반환')) {
      return <Banknote className="w-6 h-6 text-[#22909D]" />;
    } else if (title.includes('신고')) {
      return <Megaphone className="w-6 h-6 text-[#22909D]" />;
    } else {
      return <CheckCircle className="w-6 h-6 text-[#22909D]" />;
    }
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
          <Button size="sm" onClick={handleSave} className="bg-[#83AF3B] hover:bg-[#6f9632] text-white">
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
      <div className={`bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
        item.isImportant && !item.isChecked
          ? 'border-2 border-[#E65A5A]'
          : 'border border-gray-200'
      } ${
        item.isChecked 
          ? 'opacity-60' 
          : ''
      }`}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center gap-4 p-4 px-6">
            {/* 왼쪽 아이콘 영역 */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#FFF4E6] flex items-center justify-center">
                {getItemIcon(item)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg font-bold ${
                    item.isChecked ? 'line-through text-gray-400' : 'text-[#262626]'
                  }`}
                >
                  {item.title}
                </h3>
                {item.isImportant && !item.isChecked && (
                  <Badge variant="outline" className="border-[#E65A5A] text-[#E65A5A] bg-[#E65A5A]/10 text-xs">
                    중요
                  </Badge>
                )}
              </div>
              {item.guidelines && !item.isChecked && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {item.guidelines}
                </p>
              )}
            </div>

            {/* 오른쪽 큰 체크박스 */}
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheck();
                }}
                className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                  item.isChecked
                    ? 'bg-[#22909D] border-[#22909D]'
                    : 'border-gray-300 hover:border-[#22909D]'
                }`}
              >
                {item.isChecked && <Check className="w-5 h-5 text-white" />}
              </button>
            </div>

            {item.isCustom && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-[#E65A5A] hover:text-[#E65A5A] hover:bg-[#E65A5A]/10 flex-shrink-0"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-6 pb-6 space-y-4 pt-4 mt-2">
            {/* WHAT - 무엇을 하는지 (실용적, action-oriented) */}
            {item.what && (
              <div className="relative bg-gradient-to-br from-[#22909D]/5 via-[#22909D]/10 to-[#22909D]/5 border-2 border-[#22909D]/30 rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-[#22909D] flex items-center justify-center shadow-lg">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#22909D] font-semibold mb-2">
                      이게 뭐에요?
                    </h4>
                    <p className="text-sm text-[#262626] leading-relaxed">{item.what}</p>
                  </div>
                </div>
              </div>
            )}

            {/* WHY - 왜 하는지 (경고/주의/설명적) */}
            {item.why && (
              <div className="relative bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 border-2 border-[#fda400] rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fda400] to-[#ff8c00] flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#cc8400] font-semibold mb-2">
                      왜 해야 하나요?
                    </h4>
                    <p className="text-sm text-[#262626] leading-relaxed">{item.why}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 레거시 description 지원 (커스텀 항목용) */}
            {item.description && !item.what && !item.why && (
              <p className="text-sm text-[#262626]">{item.description}</p>
            )}

            {/* 링크 버튼 + 액션 버튼들을 한 줄에 배치 */}
            <div className="flex flex-wrap gap-2 min-h-[80px] items-center">
              {/* 링크 버튼들 */}
              {item.links && item.links.length > 0 && (
                <>
                  {item.links.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex-grow border-[#9D9D9D] text-[#262626] hover:bg-[#ECECEC] rounded-lg h-16 text-base"
                      onClick={() => window.open(link.url, '_blank')}
                    >
                      <ExternalLink className="size-5 mr-2 flex-shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </Button>
                  ))}
                </>
              )}

              {/* 액션 버튼들 */}
              {item.hasCalendar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCalendar}
                  className="flex-grow border-[#9D9D9D] text-[#262626] hover:bg-[#ECECEC] rounded-lg h-16 text-base"
                >
                  <Calendar className="size-5 mr-2 flex-shrink-0" />
                  <span>구글 캘린더 연동</span>
                </Button>
              )}

              {item.hasRiskDiagnosis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenRiskDiagnosis}
                  className="flex-grow border-[#22909D] text-[#22909D] hover:bg-[#22909D]/10 rounded-lg h-16 text-base"
                >
                  <FileText className="size-5 mr-2 flex-shrink-0" />
                  <span>계약서 위험 진단</span>
                </Button>
              )}

              {item.hasOwnerCheck && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenOwnerCheck}
                  className="flex-grow border-[#22909D] text-[#22909D] hover:bg-[#22909D]/10 rounded-lg h-16 text-base"
                >
                  <UserCheck className="size-5 mr-2 flex-shrink-0" />
                  <span>소유자 확인</span>
                </Button>
              )}

              {item.hasRegistryAnalysis && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenRegistryAnalysis}
                  className="flex-grow border-[#22909D] text-[#22909D] hover:bg-[#22909D]/10 rounded-lg h-16 text-base"
                >
                  <FileText className="size-5 mr-2 flex-shrink-0" />
                  <span>등록 정보 분석</span>
                </Button>
              )}

              {item.hasEmptyJeonseCheck && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenEmptyJeonseCheck}
                  className="flex-grow border-[#22909D] text-[#22909D] hover:bg-[#22909D]/10 rounded-lg h-16 text-base"
                >
                  <FileText className="size-5 mr-2 flex-shrink-0" />
                  <span>깡통전세 위험도 분석</span>
                </Button>
              )}

              {item.actionType && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onExecuteAction && onExecuteAction(item.actionType)}
                  className="flex-grow bg-[#22909D] text-white hover:bg-[#1a7580] border-[#22909D] rounded-lg h-16 text-base shadow-md"
                >
                  <Zap className="size-5 mr-2 flex-shrink-0" />
                  <span>{item.actionLabel}</span>
                </Button>
              )}
            </div>

            {/* AI 챗봇 버튼 - 최하단 */}
            {onChatbot && (item.what || item.why) && (
              <button
                onClick={onChatbot}
                className="group w-full flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#22909D] border-2 border-[#22909D] hover:border-[#22909D] rounded-xl text-[#22909D] hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
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