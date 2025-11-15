import { useState } from 'react';
import { Search, ArrowLeft, Book, ExternalLink, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';

interface SearchPageProps {
  onBack: () => void;
}

interface SearchResult {
  type: string;
  title: string;
  content: string;
  reference: string;
  fullContent?: string;
  date?: string;
  court?: string;
}

export function SearchPage({ onBack }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const handleSearch = () => {
    // RAG 기반 검색 로직 (현재는 더미 데이터)
    if (searchQuery.trim()) {
      setResults([
        {
          type: '판례',
          title: '전세보증금 반환 청구 사건',
          content: '임대차 계약 종료 후 임대인이 보증금을 반환하지 않을 경우...',
          reference: '대법원 2023다12345',
          date: '2023. 5. 15.',
          court: '대법원',
          fullContent: `【판시사항】
임대차계약이 종료된 후 임차인이 임대인에게 목적물을 반환하였음에도 임대인이 보증금을 반환하지 않는 경우, 임차인은 보증금 반환청구권을 행사할 수 있습니다.

【판결요지】
1. 임대차계약이 종료되면 임대인은 임차인에게 보증금을 반환할 의무가 있습니다.
2. 임차인이 목적물을 명도하였다면, 특별한 사정이 없는 한 임대인은 지체 없이 보증금을 반환하여야 합니다.
3. 임대인이 보증금 반환을 지체하는 경우, 임차인은 지연손해금을 청구할 수 있습니다.

【참조조문】
민법 제618조, 주택임대차보호법 제3조

【참조판례】
대법원 2020다234567 판결`,
        },
        {
          type: '법령',
          title: '주택임대차보호법 제3조 (대항력 등)',
          content: '임차인이 주택의 인도와 주민등록을 마친 때에는...',
          reference: '주택임대차보호법',
          fullContent: `제3조(대항력 등)
① 임대차는 그 등기가 없는 경우에도 임차인이 주택의 인도와 주민등록을 마친 때에는 그 다음 날부터 제3자에 대하여 효력이 생긴다.

② 임차인은 임차주택을 양수인에게 인도하고 보증금을 반환받을 때까지는 양수인에게 대항할 수 있다.

③ 제1항의 대항요건을 갖춘 임차인은 민사집행법에 따른 경매 또는 국세징수법에 따른 공매 시 임차주택(대지를 포함한다)의 환가대금에서 후순위권리자나 그 밖의 채권자보다 우선하여 보증금을 변제받을 권리가 있다.`,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-amber-700 hover:text-amber-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로
          </Button>
          <Button 
            onClick={() => toast.info('로그인 기능은 준비 중입니다')}
            variant="outline"
            className="border-cyan-500 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
              <Book className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
            </div>
            <h1 className="text-amber-900">판례/법률 검색</h1>
          </div>
          <p className="text-sm text-amber-700">
            궁금한 전월세 분쟁이나 법령을 한 번에 찾아보세요.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-500" />
            <Input
              type="text"
              placeholder="예: 확정일자, 전세사기, 보증금 반환"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white border-amber-200 focus:border-cyan-400"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:w-auto"
          >
            검색
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={index} 
                className="p-4 sm:p-6 bg-white border-amber-100 hover:border-cyan-300 transition-colors cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs shrink-0 self-start">
                    {result.type}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-amber-900 flex items-center gap-2">
                      {result.title}
                      <ExternalLink className="w-4 h-4 text-cyan-500" />
                    </h3>
                    <p className="text-sm text-amber-700 mb-3">{result.content}</p>
                    <p className="text-xs text-amber-500">{result.reference}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && searchQuery === '' && (
          <div className="text-center py-12 text-amber-600 px-4">
            <p>검색어를 입력하면 관련 판례와 법률을 찾아드립니다.</p>
          </div>
        )}
      </div>

      {/* Result Detail Modal */}
      <Dialog open={selectedResult !== null} onOpenChange={(open) => !open && setSelectedResult(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs self-start">
                {selectedResult?.type}
              </div>
              {selectedResult?.date && (
                <span className="text-xs text-amber-500">{selectedResult.date}</span>
              )}
            </div>
            <DialogTitle className="text-amber-900">{selectedResult?.title}</DialogTitle>
            <DialogDescription className="text-sm text-amber-600">
              {selectedResult?.reference}
              {selectedResult?.court && ` | ${selectedResult.court}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-amber-800 leading-relaxed">
                {selectedResult?.fullContent || selectedResult?.content}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-100 flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedResult(null)}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
            >
              닫기
            </Button>
            <Button
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              원문 보기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}