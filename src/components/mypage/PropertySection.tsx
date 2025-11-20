import { useState, useEffect } from 'react';
import { Home, Plus, FileText, Eye, Upload, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

interface Property {
  id: number;
  address: string;
  documentCount: number;
  documents: Array<{ id: number; doc_type: string; issued_at: string; }>;
}

export function PropertySection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadPropertyId, setUploadPropertyId] = useState<number | null>(null);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // gemini.md 기반 서비스 URL
  const checklistServiceUrl = import.meta.env.VITE_CHECKLIST_SERVICE_URL; // 실제 체크리스트 서비스 URL로 교체
  const documentServiceUrl = import.meta.env.VITE_DOCUMENT_SERVICE_URL;   // 실제 문서 서비스 URL로 교체

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(checklistServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_properties' }),
      });
      if (!response.ok) throw new Error('Failed to fetch properties');
      const data = await response.json();
      setProperties(data || []);
    } catch (error) {
      console.error(error);
      toast.error('주택 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleAddProperty = async () => {
    if (!newAddress.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(checklistServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_property',
          address: newAddress
        }),
      });
      if (!response.ok) throw new Error('Failed to add property');
      
      toast.success('새 주택이 등록되었습니다');
      setShowAddModal(false);
      setNewAddress('');
      fetchProperties(); // Re-fetch
    } catch (error) {
      console.error(error);
      toast.error('주택 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenUpload = (propertyId: number) => {
    setUploadPropertyId(propertyId);
    setShowUploadModal(true);
  };

  const handleFileUpload = async () => {
    if (!fileToUpload || !uploadPropertyId) {
      toast.error('파일을 선택해주세요.');
      return;
    }
    setIsSubmitting(true);
    
    const formData = new FormData();
    // gemini.md에 따르면 Document Service는 'scan' 또는 'analyze' 액션을 받습니다.
    // 여기서는 범용적인 업로드이므로 'upload_for_property' 같은 액션을 새로 정의하거나
    // 기존 'scan'을 활용할 수 있습니다. 여기서는 'scan'을 사용합니다.
    formData.append('action', 'scan'); 
    formData.append('file', fileToUpload);
    formData.append('property_id', String(uploadPropertyId));

    try {
      const response = await fetch(documentServiceUrl, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      
      toast.success('문서가 업로드되었습니다');
      setShowUploadModal(false);
      fetchProperties(); // Re-fetch
    } catch (error) {
      console.error(error);
      toast.error('문서 업로드에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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

      <Dialog open={selectedProperty !== null} onOpenChange={(open) => !open && setSelectedProperty(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900"><Home className="w-5 h-5 text-cyan-600" /> 주택 상세 정보</DialogTitle>
            <DialogDescription className="text-gray-600">{selectedProperty?.address}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> 이 집과 연결된 문서 목록</h4>
              <div className="space-y-2">
                {selectedProperty?.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{doc.doc_type}</p>
                        <p className="text-xs text-gray-500">{doc.issued_at}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toast.info('문서 보기 기능은 준비 중입니다')} className="border-gray-300 text-gray-700 hover:bg-white">보기</Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">새 주택 등록</DialogTitle>
            <DialogDescription className="text-gray-600">주택 정보를 입력해주세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">주소</label>
              <Input placeholder="예: 서울특별시 강남구 테헤란로 123" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="border-gray-300" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddProperty} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '등록하기'}
              </Button>
              <Button onClick={() => { setShowAddModal(false); setNewAddress(''); }} variant="outline" className="flex-1 border-gray-300 text-gray-700" disabled={isSubmitting}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">문서 업로드</DialogTitle>
            <DialogDescription className="text-gray-600">주택에 관련된 문서를 업로드해주세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">문서 선택</label>
              <Input type="file" onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)} className="border-gray-300" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleFileUpload} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : '업로드'}
              </Button>
              <Button onClick={() => setShowUploadModal(false)} variant="outline" className="flex-1 border-gray-300 text-gray-700" disabled={isSubmitting}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}