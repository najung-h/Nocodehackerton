import { useState } from 'react';
import { Home, Plus, FileText, Eye, Upload, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Property, ActionType } from '../../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface PropertySectionProps {
  properties: Property[];
  isLoading: boolean;
  onAction: (actionType: 'add_property' | 'upload_document', payload?: any) => void;
}

export function PropertySection({ properties, isLoading, onAction }: PropertySectionProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPropertyId, setUploadPropertyId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
  const handleAddProperty = () => {
    if (!newAddress.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }
    onAction('add_property', { address: newAddress });
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

  if (isLoading && properties.length === 0) {
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
                  <FileText className="w-3 h-3 mr-1" /> 관련 문서 {property.documentCount}개
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedProperty(property)} className="flex-1 rounded-full border-border text-foreground hover:bg-muted">
                  <Eye className="w-4 h-4 mr-1" /> 상세 보기
                </Button>
                <Button size="sm" onClick={() => handleOpenUpload(property.id)} className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Upload className="w-4 h-4 mr-1" /> 문서 업로드
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {properties.length === 0 && !isLoading && (
        <Card className="p-12 bg-white rounded-2xl shadow-md border-border">
          <div className="text-center text-muted-foreground">
            <Home className="w-12 h-12 mx-auto mb-4 text-muted" />
            <p className="mb-4">등록된 주택이 없습니다.</p>
            <Button onClick={() => setShowAddModal(true)} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> 첫 주택 등록하기
            </Button>
          </div>
        </Card>
      )}

      {/* ... Modals with specific handlers ... */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
           {/* ... */}
            <Button onClick={handleAddProperty} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '등록하기'}
            </Button>
           {/* ... */}
        </DialogContent>
      </Dialog>
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          {/* ... */}
            <Button onClick={handleFileUpload} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '업로드'}
            </Button>
          {/* ... */}
        </DialogContent>
      </Dialog>
    </div>
  );
}