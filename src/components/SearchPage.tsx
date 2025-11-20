import { useState } from 'react';
import { Search, ArrowLeft, Book, ExternalLink, LogIn, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import searchImage from "figma:asset/mother.png";

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
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim() || isSearching) return;

    setIsSearching(true);
    setResults([]); // Clear previous results
    toast.loading("검색 중입니다...");

    const searchWebhook = 'https://ajjoona.app.n8n.cloud/webhook/search-documents'; // TODO: 실제 웹훅 URL로 교체

    try {
      const response = await fetch(searchWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error('검색에 실패했습니다.');
      }

      const searchResults: SearchResult[] = await response.json();
      
      if (searchResults.length === 0) {
        toast.info("검색 결과가 없습니다.");
      } else {
        toast.success(`${searchResults.length}개의 결과를 찾았습니다.`);
      }
      setResults(searchResults);

    } catch (error) {
      console.error('검색 중 오류 발생:', error);
      toast.error('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
      // For demonstration, falling back to dummy data on error
      setResults([
        {
          type: '판례',
          title: '전세보증금 반환 청구 사건 (에러 발생 시 예시)',
          content: '임대차 계약 종료 후 임대인이 보증금을 반환하지 않을 경우...',
          reference: '대법원 2023다12345',
          date: '2023. 5. 15.',
          court: '대법원',
          fullContent: `【판시사항】
임대차계약이 종료된 후 임차인이 임대인에게 목적물을 반환하였음에도 임대인이 보증금을 반환하지 않는 경우, 임차인은 보증금 반환청구권을 행사할 수 있습니다.`,
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로
          </Button>
          <Button 
            onClick={() => toast.info('로그인 기능은 준비 중입니다')}
            variant="outline"
            className="border-[#83AF3B] text-[#83AF3B] hover:bg-[#83AF3B]/10 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={searchImage}
                alt="똑똑한 법률 사전"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-gray-900">똑똑한 법률 사전</h1>
          </div>
          <p className="text-sm text-gray-700">
            궁금한 건 언제든 물어봐!
          </p>
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#83AF3B]" />
            <Input
              type="text"
              placeholder="예: 확정일자, 전세사기, 보증금 반환"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white border-gray-300 focus:border-[#83AF3B]"
              disabled={isSearching}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] hover:from-[#6f9632] hover:to-[#83AF3B] text-white w-full sm:w-auto"
            disabled={isSearching}
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={index} 
                className="p-4 sm:p-6 bg-white border-gray-200 hover:border-[#83AF3B] transition-colors cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="px-3 py-1 rounded-full bg-[#83AF3B]/20 text-[#83AF3B] text-xs shrink-0 self-start">
                    {result.type}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-gray-900 flex items-center gap-2">
                      {result.title}
                      <ExternalLink className="w-4 h-4 text-[#83AF3B]" />
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">{result.content}</p>
                    <p className="text-xs text-gray-600">{result.reference}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isSearching && results.length === 0 && (
          <div className="text-center py-12 text-gray-600 px-4">
            <p>검색어를 입력하면 관련 판례와 법률을 찾아드립니다.</p>
          </div>
        )}
      </div>

      {/* Result Detail Modal */}
      <Dialog open={selectedResult !== null} onOpenChange={(open) => !open && setSelectedResult(null)}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div className="px-3 py-1 rounded-full bg-[#83AF3B]/20 text-[#83AF3B] text-xs self-start">
                {selectedResult?.type}
              </div>
              {selectedResult?.date && (
                <span className="text-xs text-gray-600">{selectedResult.date}</span>
              )}
            </div>
            <DialogTitle className="text-gray-900">{selectedResult?.title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              {selectedResult?.reference}
              {selectedResult?.court && ` | ${selectedResult.court}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {selectedResult?.fullContent || selectedResult?.content}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedResult(null)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
            >
              닫기
            </Button>
            <Button
              className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] hover:from-[#6f9632] hover:to-[#83AF3B] text-white w-full sm:w-auto"
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
