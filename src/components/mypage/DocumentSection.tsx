import { useState } from 'react';
import { FileText, Upload, Download, Eye, Filter, Plus, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';

// 1. props 타입 정의
interface DocumentSectionProps {
  documents: any[];
  isLoading: boolean;
  onAction: (actionType: 'upload_document', payload?: any) => void;
}

const documentTypes = [
  '임대차계약서',
  '등기부등본',
  '건축물대장',
  '전입세대열람',
  '보증보험증권',
  '기타',
];

export function DocumentSection({ documents, isLoading, onAction }: DocumentSectionProps) {
  // 2. 내부 상태 간소화 (UI 상태만 유지)
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Modal states
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadIssuedAt, setUploadIssuedAt] = useState('');
  const [uploadPropertyId, setUploadPropertyId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // 3. useEffect 및 fetch 로직 전체 제거

  // 4. 핸들러 로직 변경
  const handleUpload = () => {
    if (!uploadDocType || !uploadIssuedAt || !uploadPropertyId || !uploadFile) {
      toast.error('모든 필드를 채우고 파일을 선택해주세요.');
      return;
    }
    
    onAction('upload_document', {
      file: uploadFile,
      doc_type: uploadDocType,
      issued_at: uploadIssuedAt,
      property_id: uploadPropertyId,
    });
    
    setShowUploadModal(false);
  };

  const filteredDocuments = filterProperty === 'all'
    ? documents
    : documents.filter((doc) => doc.property_id.toString() === filterProperty);

  return (
    <div className="space-y-6">
      <div className="flex ... justify-between ...">
        {/* ... 헤더 UI ... */}
      </div>

      <Card className="bg-white border-gray-200 overflow-hidden">
        {/* 5. props로 받은 isLoading과 documents 사용 */}
        {isLoading && documents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="ml-2 text-gray-600">문서 목록을 불러오는 중입니다...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* ... 테이블 UI ... */}
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      {/* ... 테이블 행 UI ... */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDocuments.length === 0 && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>등록된 문서가 없습니다.</p>
              </div>
            )}
          </>
        )}
      </Card>

      {/* 6. 모달 핸들러 로직 변경 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>새 문서 업로드</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* ... 폼 UI ... */}
            <Button onClick={handleUpload} className="..." disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '업로드'}
            </Button>
            <Button onClick={() => setShowUploadModal(false)} variant="outline" className="..." disabled={isLoading}>
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}