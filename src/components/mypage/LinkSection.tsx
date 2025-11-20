import { useState, useEffect } from 'react';
import { Bookmark, Plus, ExternalLink, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface Link {
  id: number;
  name: string;
  url: string;
  description: string;
}

export function LinkSection() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '', description: '' });

  // gemini.md 기반 서비스 URL
  const checklistServiceUrl = '/checklist-service'; // TODO: 실제 체크리스트 서비스 URL로 교체

  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(checklistServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_links' }),
      });
      if (!response.ok) throw new Error('Failed to fetch links');
      const data = await response.json();
      setLinks(data || []);
    } catch (error) {
      console.error(error);
      toast.error('링크 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

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

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('링크 이름과 URL은 필수입니다');
      return;
    }
    setIsSubmitting(true);
    
    const action = editingLink ? 'update_link' : 'create_link';
    const body = {
      action,
      id: editingLink?.id,
      ...formData
    };

    try {
      const response = await fetch(checklistServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Save failed');
      
      toast.success(editingLink ? '링크가 수정되었습니다' : '새 링크가 저장되었습니다');
      setShowAddModal(false);
      fetchLinks(); // Re-fetch the list
    } catch (error) {
      console.error(error);
      toast.error('링크 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(checklistServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_link', id }),
      });
      if (!response.ok) throw new Error('Delete failed');

      setLinks(links.filter((link) => link.id !== id));
      toast.success('링크가 삭제되었습니다');
    } catch (error) {
      console.error(error);
      toast.error('링크 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
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
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{editingLink ? '링크 수정' : '새 링크 저장'}</DialogTitle>
            <DialogDescription className="text-gray-600">저장하고 싶은 웹사이트 정보를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">링크 이름 <span className="text-red-500">*</span></label>
              <Input placeholder="예: 국토교통부 실거래가" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="border-gray-300" />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-2 block">URL 주소 <span className="text-red-500">*</span></label>
              <Input placeholder="https://example.com" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="border-gray-300" />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-2 block">설명</label>
              <Textarea placeholder="이 링크에 대한 간단한 설명을 입력하세요" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="border-gray-300" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingLink ? '수정하기' : '저장하기')}
              </Button>
              <Button onClick={() => setShowAddModal(false)} variant="outline" className="flex-1 border-gray-300 text-gray-700" disabled={isSubmitting}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
