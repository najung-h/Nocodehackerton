import { useState, useEffect } from 'react';
import { Bookmark, Plus, ExternalLink, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

// 1. props 타입 정의 변경
interface Link {
  id: number;
  name: string;
  url: string;
  description: string;
}

interface LinkSectionProps {
  links: Link[];
  isLoading: boolean;
  onAction: (actionType: 'create_link' | 'update_link' | 'delete_link', payload?: any) => void;
}

export function LinkSection({ links, isLoading, onAction }: LinkSectionProps) {
  // 2. 내부 상태 간소화
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '', description: '' });

  // 3. fetch, useEffect 제거

  const handleOpenAddModal = () => {
    setFormData({ name: '', url: '', description: '' });
    setEditingLink(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (link: Link) => {
    setFormData({ name: link.name, url: link.url, description: link.description });
    setEditingLink(link);
    setShowAddModal(true);
  };
  
  // 4. 핸들러 함수 로직 변경: onAction 호출
  const handleSave = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('링크 이름과 URL은 필수입니다');
      return;
    }
    const action = editingLink ? 'update_link' : 'create_link';
    const payload = {
      id: editingLink?.id,
      ...formData
    };
    onAction(action, payload);
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    onAction('delete_link', { id });
  };

  if (isLoading && links.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="ml-2 text-gray-600">링크 목록을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          {/* ... 헤더 UI (동일) ... */}
      </div>
      
      {/* 5. props로 받은 links를 렌더링 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <Card key={link.id} className="p-6 bg-white border-gray-200 hover:border-cyan-300 transition-colors">
            <div className="space-y-4">
               {/* ... 링크 카드 UI (삭제 핸들러 변경) ... */}
               <Button size="sm" variant="outline" onClick={() => handleDelete(link.id)} className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3 h-3 mr-1" /> 삭제
                </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {links.length === 0 && !isLoading && (
        <Card className="p-12 bg-white border-gray-200">
           {/* ... 링크 없을 때 UI (동일) ... */}
        </Card>
      )}

      {/* ... 모달 UI (저장 핸들러 변경) ... */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{editingLink ? '링크 수정' : '새 링크 저장'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* ... 폼 입력 UI ... */}
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingLink ? '수정하기' : '저장하기')}
            </Button>
            <Button onClick={() => setShowAddModal(false)} variant="outline" disabled={isLoading}>
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}