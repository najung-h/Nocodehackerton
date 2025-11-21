import { useState } from 'react';
import { Home, Plus, FileText, Eye, Upload, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

// 1. props 타입 정의 변경
interface Property {
  id: number;
  address: string;
  documentCount: number;
  documents: Array<{ id: number; doc_type: string; issued_at: string; }>;
}

interface PropertySectionProps {
  properties: Property[];
  isLoading: boolean;
  onAction: (actionType: 'add_property' | 'upload_document', payload?: any) => void;
}

export function PropertySection({ properties, isLoading, onAction }: PropertySectionProps) {
  // 2. 내부 상태 간소화: API 관련 상태 제거, UI 상태만 유지
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPropertyId, setUploadPropertyId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
  // 3. fetchProperties, useEffect 제거

  // 4. 핸들러 함수 로직 변경: onAction 호출
  const handleAddProperty = () => {
    if (!newAddress.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }
    onAction('add_property', { address: newAddress });
    // 성공 후 모달 닫기 및 초기화는 부모의 데이터 변경에 따라 이뤄지므로 여기선 제거하거나 optimistic하게 처리 가능
    setShowAddModal(false);
    setNewAddress('');
  };

  const handleOpenUpload = (propertyId: number) => {
    setUploadPropertyId(propertyId);
    setShowUploadModal(true);
  };

  const handleFileUpload = () => {
    if (!fileToUpload || !uploadPropertyId) {
      toast.error('파일을 선택해주세요.');
      return;
    }
    onAction('upload_document', { file: fileToUpload, property_id: uploadPropertyId });
    setShowUploadModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="ml-2 text-gray-600">주택 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground mb-2">내 주택 정보</h2>
          <p className="text-sm text-muted-foreground">등록된 주택과 관련 문서를 관리할 수 있습니다.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" /> 새 주택 등록
        </Button>
      </div>

      {/* 5. props로 받은 properties를 렌더링 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="p-6 bg-white rounded-2xl shadow-md border-border hover:border-primary/30 transition-all">
            {/* ... 주택 카드 UI (동일) ... */}
          </Card>
        ))}
      </div>

      {properties.length === 0 && !isLoading && (
        <Card className="p-12 bg-white rounded-2xl shadow-md border-border">
            {/* ... 등록된 주택 없을 때 UI (동일) ... */}
        </Card>
      )}
      
      {/* ... 모달 UI들 (내부 핸들러 로직 변경) ... */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>새 주택 등록</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="예: 서울특별시 강남구 테헤란로 123" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
            <Button onClick={handleAddProperty} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '등록하기'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

       <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>문서 업로드</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input type="file" onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)} />
            <Button onClick={handleFileUpload} disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '업로드'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
