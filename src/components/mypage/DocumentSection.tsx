import { useState } from 'react';
import { FileText, Plus, Filter, Loader2, Eye, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Document as DocumentType, ActionType } from '../../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface DocumentSectionProps {
  documents: DocumentType[];
  isLoading: boolean;
  onAction: (actionType: 'upload_document', payload?: any) => void;
}

const documentTypes = [
  '임대차계약서', '등기부등본', '건축물대장', '전입세대열람', '보증보험증권', '기타',
];

export function DocumentSection({ documents, isLoading, onAction }: DocumentSectionProps) {
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Modal states
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadIssuedAt, setUploadIssuedAt] = useState('');
  const [uploadPropertyId, setUploadPropertyId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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
    : documents.filter((doc: any) => doc.property_id.toString() === filterProperty);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">관련 문서</h2>
          <p className="text-sm text-gray-600">계약 관련 문서를 관리할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
          <Button onClick={() => setShowUploadModal(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            새 문서 업로드
          </Button>
        </div>
      </div>

      <Card className="bg-white border-gray-200 overflow-hidden">
        {isLoading && documents.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="ml-2 text-gray-600">문서 목록을 불러오는 중입니다...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* ... 테이블 헤더 ... */}
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{doc.doc_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.issued_at}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{doc.address}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {/* ... 버튼들 ... */}
                      </td>
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

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 문서 업로드</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* ... 폼 요소들 ... */}
            <Button onClick={handleUpload} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '업로드'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
