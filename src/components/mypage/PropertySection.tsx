import { useState } from 'react';
import { Home, Plus, FileText, Eye, Upload } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

// 더미 데이터
const dummyProperties = [
  {
    id: 1,
    address: '서울특별시 강남구 테헤란로 123',
    documentCount: 3,
    documents: [
      { id: 1, doc_type: '임대차계약서', issued_at: '2024-12-01' },
      { id: 2, doc_type: '등기부등본', issued_at: '2024-11-28' },
      { id: 3, doc_type: '건축물대장', issued_at: '2024-11-28' },
    ],
  },
  {
    id: 2,
    address: '서울특별시 서초구 반포대로 456',
    documentCount: 2,
    documents: [
      { id: 4, doc_type: '임대차계약서', issued_at: '2024-10-15' },
      { id: 5, doc_type: '등기부등본', issued_at: '2024-10-10' },
    ],
  },
];

export function PropertySection() {
  const [properties] = useState(dummyProperties);
  const [selectedProperty, setSelectedProperty] = useState<typeof dummyProperties[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPropertyId, setUploadPropertyId] = useState<number | null>(null);

  const handleAddProperty = () => {
    if (!newAddress.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }
    toast.success('새 주택이 등록되었습니다');
    setShowAddModal(false);
    setNewAddress('');
  };

  const handleOpenUpload = (propertyId: number) => {
    setUploadPropertyId(propertyId);
    setShowUploadModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast.success('문서가 업로드되었습니다');
      setShowUploadModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">내 주택 정보</h2>
          <p className="text-sm text-muted-foreground">등록된 주택과 관련 문서를 관리할 수 있습니다.</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          새 주택 등록
        </Button>
      </div>

      {/* 주택 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="p-6 bg-white rounded-2xl shadow-md border-border hover:border-primary/30 transition-all">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-foreground mb-1 break-words font-semibold">{property.address}</h3>
                  <p className="text-sm text-muted-foreground">주택 ID: {property.id}</p>
                </div>
              </div>

              <div>
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                  <FileText className="w-3 h-3 mr-1" />
                  관련 문서 {property.documentCount}개
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedProperty(property)}
                  className="flex-1 rounded-full border-border text-foreground hover:bg-muted"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  상세 보기
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenUpload(property.id)}
                  className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  문서 업로드
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {properties.length === 0 && (
        <Card className="p-12 bg-white rounded-2xl shadow-md border-border">
          <div className="text-center text-muted-foreground">
            <Home className="w-12 h-12 mx-auto mb-4 text-muted" />
            <p className="mb-4">등록된 주택이 없습니다.</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              첫 주택 등록하기
            </Button>
          </div>
        </Card>
      )}

      {/* 주택 상세 모달 */}
      <Dialog open={selectedProperty !== null} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <Home className="w-5 h-5 text-cyan-600" />
              주택 상세 정보
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedProperty?.address}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">주소</p>
                  <p className="text-gray-900">{selectedProperty?.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">주택 ID</p>
                  <p className="text-gray-900">{selectedProperty?.id}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                이 집과 연결된 문서 목록
              </h4>
              <div className="space-y-2">
                {selectedProperty?.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{doc.doc_type}</p>
                        <p className="text-xs text-gray-500">{doc.issued_at}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.info('문서 보기 기능은 준비 중입니다')}
                      className="border-gray-300 text-gray-700 hover:bg-white"
                    >
                      보기
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 주택 추가 모달 */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">새 주택 등록</DialogTitle>
            <DialogDescription className="text-gray-600">
              주택 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">주소</label>
              <Input
                placeholder="예: 서울특별시 강남구 테헤란로 123"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddProperty}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                등록하기
              </Button>
              <Button
                onClick={() => {
                  setShowAddModal(false);
                  setNewAddress('');
                }}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700"
              >
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 문서 업로드 모달 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">문서 업로드</DialogTitle>
            <DialogDescription className="text-gray-600">
              주택에 관련된 문서를 업로드해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">문서 선택</label>
              <Input
                type="file"
                onChange={handleFileUpload}
                className="border-gray-300"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                업로드
              </Button>
              <Button
                onClick={() => setShowUploadModal(false)}
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