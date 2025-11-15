import { useState } from 'react';
import { Bookmark, Plus, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner@2.0.3';

// 더미 데이터
const dummyLinks = [
  {
    id: 1,
    name: '국토교통부 실거래가 공개시스템',
    url: 'https://rt.molit.go.kr',
    description: '전국의 아파트, 단독/다가구, 연립/다세대, 오피스텔 등의 실거래가 정보를 조회할 수 있습니다.',
  },
  {
    id: 2,
    name: '인터넷등기소',
    url: 'https://www.iros.go.kr',
    description: '등기부등본, 건축물대장 등 부동산 관련 공적 문서를 온라인으로 발급받을 수 있습니다.',
  },
  {
    id: 3,
    name: 'HUG 전세보증보험',
    url: 'https://www.khug.or.kr',
    description: '주택도시보증공사(HUG)에서 제공하는 전세보증금 반환보증 서비스 안내 및 신청 페이지입니다.',
  },
  {
    id: 4,
    name: '정부24',
    url: 'https://www.gov.kr',
    description: '전입신고, 확정일자, 전입세대 열람 등 정부 민원 서비스를 온라인으로 이용할 수 있습니다.',
  },
];

export function LinkSection() {
  const [links, setLinks] = useState(dummyLinks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<typeof dummyLinks[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: '',
  });

  const handleOpenAddModal = () => {
    setFormData({ name: '', url: '', description: '' });
    setEditingLink(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (link: typeof dummyLinks[0]) => {
    setFormData({
      name: link.name,
      url: link.url,
      description: link.description,
    });
    setEditingLink(link);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('링크 이름과 URL은 필수입니다');
      return;
    }

    if (editingLink) {
      toast.success('링크가 수정되었습니다');
    } else {
      toast.success('새 링크가 저장되었습니다');
    }
    setShowAddModal(false);
  };

  const handleDelete = (id: number) => {
    setLinks(links.filter((link) => link.id !== id));
    toast.success('링크가 삭제되었습니다');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">저장한 링크</h2>
          <p className="text-sm text-gray-600">유용한 웹사이트를 저장하고 관리할 수 있습니다.</p>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          새 링크 저장
        </Button>
      </div>

      {/* 링크 카드 그리드 */}
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
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-600 hover:text-cyan-700 flex items-center gap-1 break-all"
                  >
                    {link.url}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-gray-600">{link.description}</p>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEditModal(link)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  수정
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(link.id)}
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  삭제
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {links.length === 0 && (
        <Card className="p-12 bg-white border-gray-200">
          <div className="text-center text-gray-500">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">저장된 링크가 없습니다.</p>
            <Button
              onClick={handleOpenAddModal}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              첫 링크 저장하기
            </Button>
          </div>
        </Card>
      )}

      {/* 링크 추가/수정 모달 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {editingLink ? '링크 수정' : '새 링크 저장'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              저장하고 싶은 웹사이트 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                링크 이름 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="예: 국토교통부 실거래가"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">
                URL 주소 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="border-gray-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">설명</label>
              <Textarea
                placeholder="이 링크에 대한 간단한 설명을 입력하세요"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="border-gray-300"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {editingLink ? '수정하기' : '저장하기'}
              </Button>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
