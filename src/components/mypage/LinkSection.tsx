import { useState } from 'react';
import { Bookmark, Plus, ExternalLink, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Link as LinkType, ActionType } from '../../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface LinkSectionProps {
  links: LinkType[];
  isLoading: boolean;
  onAction: (actionType: 'create_link' | 'update_link' | 'delete_link', payload?: any) => void;
}

export function LinkSection({ links, isLoading, onAction }: LinkSectionProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '', description: '' });

  const handleOpenAddModal = () => {
    setFormData({ name: '', url: '', description: '' });
    setEditingLink(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (link: LinkType) => {
    setFormData({ name: link.name, url: link.url, description: link.description });
    setEditingLink(link);
    setShowAddModal(true);
  };
  
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
        <div>
          <h2 className="text-gray-900 mb-2">저장한 링크</h2>
          <p className="text-sm text-gray-600">유용한 웹사이트를 저장하고 관리할 수 있습니다.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="bg-cyan-500 hover:bg-cyan-600 text-white">
          <Plus className="w-4 h-4 mr-2" /> 새 링크 저장
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <Card key={link.id} className="p-6 bg-white border-gray-200 hover:border-cyan-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 mb-1">{link.name}</h3>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 break-all">
                    {link.url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-gray-600">{link.description}</p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(link)} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Edit className="w-3 h-3 mr-1" /> 수정
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(link.id)} className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3 h-3 mr-1" /> 삭제
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {links.length === 0 && !isLoading && (
        <Card className="p-12 bg-white border-gray-200">
          <div className="text-center text-gray-500">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">저장된 링크가 없습니다.</p>
            <Button onClick={handleOpenAddModal} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> 첫 링크 저장하기
            </Button>
          </div>
        </Card>
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? '링크 수정' : '새 링크 저장'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* ... Form inputs ... */}
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingLink ? '수정하기' : '저장하기')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
