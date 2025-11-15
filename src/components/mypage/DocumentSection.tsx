import { useState } from 'react';
import { FileText, Upload, Download, Eye, Filter, Plus } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';

// 더미 데이터
const dummyDocuments = [
  {
    id: 1,
    doc_type: '임대차계약서',
    issued_at: '2025-01-10',
    address: '서울특별시 강남구 테헤란로 123',
    property_id: 1,
  },
  {
    id: 2,
    doc_type: '등기부등본',
    issued_at: '2025-01-08',
    address: '서울특별시 강남구 테헤란로 123',
    property_id: 1,
  },
  {
    id: 3,
    doc_type: '건축물대장',
    issued_at: '2024-12-20',
    address: '서울특별시 서초구 반포대로 456',
    property_id: 2,
  },
  {
    id: 4,
    doc_type: '임대차계약서',
    issued_at: '2024-10-15',
    address: '서울특별시 서초구 반포대로 456',
    property_id: 2,
  },
];

const documentTypes = [
  '임대차계약서',
  '등기부등본',
  '건축물대장',
  '전입세대열람',
  '보증보험증권',
  '기타',
];

export function DocumentSection() {
  const [documents] = useState(dummyDocuments);
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

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

      {/* 문서 리스트 테이블 */}
      <Card className="bg-white border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  문서 유형
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider">
                  발급일
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-700 uppercase tracking-wider hidden md:table-cell">
                  주택 주소
                </th>
                <th className="px-6 py-3 text-right text-xs text-gray-700 uppercase tracking-wider">
                  작업
                </th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {doc.issued_at}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {doc.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('문서 보기 기능은 준비 중입니다')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        보기
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info('다운로드 기능은 준비 중입니다')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        다운
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
      </Card>

      {/* 문서 업로드 모달 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">새 문서 업로드</DialogTitle>
            <DialogDescription className="text-gray-600">
              문서 정보를 입력하고 파일을 업로드해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm text-gray-700 mb-2 block">문서 유형</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">선택해주세요</option>
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">발급일</label>
              <Input type="date" className="border-gray-300" />
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">연결할 주택</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="">선택해주세요</option>
                <option value="1">서울특별시 강남구 테헤란로 123</option>
                <option value="2">서울특별시 서초구 반포대로 456</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700 mb-2 block">파일 첨부</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">파일을 드래그하거나 클릭하여 선택</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (최대 10MB)</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  toast.success('문서가 업로드되었습니다');
                  setShowUploadModal(false);
                }}
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
