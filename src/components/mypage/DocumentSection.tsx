import { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Filter, Plus, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { toast } from 'sonner';

const documentTypes = [
  '임대차계약서',
  '등기부등본',
  '건축물대장',
  '전입세대열람',
  '보증보험증권',
  '기타',
];

export function DocumentSection() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Modal states
  const [uploadDocType, setUploadDocType] = useState('');
  const [uploadIssuedAt, setUploadIssuedAt] = useState('');
  const [uploadPropertyId, setUploadPropertyId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // gemini.md 기반 서비스 URL
  const documentServiceUrl = import.meta.env.VITE_DOCUMENT_SERVICE_URL; // TODO: 실제 문서 서비스 URL로 교체

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(documentServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get_documents' }),
        });
        if (!response.ok) throw new Error('Failed to fetch documents');
        const data = await response.json();
        setDocuments(data || []);
      } catch (error) {
        console.error(error);
        toast.error('문서 목록을 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    if (!uploadDocType || !uploadIssuedAt || !uploadPropertyId || !uploadFile) {
      toast.error('모든 필드를 채우고 파일을 선택해주세요.');
      return;
    }
    setIsUploading(true);
    
    const formData = new FormData();
    // gemini.md에 따르면 Document Service는 'scan' 또는 'analyze' 액션을 받습니다.
    // 여기서는 범용적인 업로드이므로 'upload_for_property' 같은 액션을 새로 정의하거나
    // 기존 'scan'을 활용할 수 있습니다. 여기서는 'scan'을 사용합니다.
    formData.append('action', 'scan');
    formData.append('file', uploadFile);
    formData.append('doc_type', uploadDocType);
    formData.append('issued_at', uploadIssuedAt);
    formData.append('property_id', uploadPropertyId);

    try {
      const response = await fetch(documentServiceUrl, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      
      const newDocument = await response.json();
      setDocuments(prev => [...prev, newDocument]);
      
      setShowUploadModal(false);
      toast.success('문서가 성공적으로 업로드되었습니다.');
    } catch (error) {
      console.error(error);
      toast.error('문서 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocuments = filterProperty === 'all'
    ? documents
    : documents.filter((doc) => doc.property_id.toString() === filterProperty);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900 mb-2">관련 문서</h2>
          <p className="text-sm text-gray-600">계약 관련 문서를 관리할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 문서 업로드
          </Button>
        </div>
      </div>

      <Card className="bg-white border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <p className="ml-2 text-gray-600">문서 목록을 불러오는 중입니다...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">문서 유형</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">발급일</th>
                    <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider hidden md:table-cell">주택 주소</th>
                    <th className="px-6 py-3 text-right text-xs text-gray-700 uppercase tracking-wider">작업</th>
                  </tr>
                </thead>
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
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => toast.info('문서 보기 기능은 준비 중입니다')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Eye className="w-3 h-3 mr-1" /> 보기
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => toast.info('다운로드 기능은 준비 중입니다')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Download className="w-3 h-3 mr-1" /> 다운
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDocuments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>등록된 문서가 없습니다.</p>
              </div>
            )}
          </>
        )}
      </Card>

      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">새 문서 업로드</DialogTitle>
            <DialogDescription className="text-gray-600">문서 정보를 입력하고 파일을 업로드해주세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">문서 유형</label>
              <select value={uploadDocType} onChange={(e) => setUploadDocType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">선택해주세요</option>
                {documentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-2 block">발급일</label>
              <Input type="date" value={uploadIssuedAt} onChange={(e) => setUploadIssuedAt(e.target.value)} className="border-gray-300" />
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-2 block">연결할 주택</label>
              <select value={uploadPropertyId} onChange={(e) => setUploadPropertyId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">선택해주세요</option>
                <option value="1">서울특별시 강남구 테헤란로 123</option>
                <option value="2">서울특별시 서초구 반포대로 456</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-700 mb-2 block">파일 첨부</label>
              <Input type="file" onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)} className="border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpload} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isUploading}>
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : '업로드'}
              </Button>
              <Button onClick={() => setShowUploadModal(false)} variant="outline" className="flex-1 border-gray-300 text-gray-700" disabled={isUploading}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
