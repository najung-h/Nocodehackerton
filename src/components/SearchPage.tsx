import { useState } from 'react';
import { Search, ArrowLeft, ExternalLink, LogIn, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import searchImage from "figma:asset/mother.png";
import { SearchResult, ActionType } from '../types'; // 1. 타입 import

// 2. Props 타입 구체화
interface SearchPageProps {
  onBack: () => void;
  onAction: (actionType: 'search_legal', payload: { query: string }) => void;
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchPage({ onBack, onAction, results, isLoading }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim() || isLoading) return;
    onAction('search_legal', { query: searchQuery });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <Button onClick={onBack} variant="ghost" className="text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로
          </Button>
          <Button onClick={() => toast.info('로그인 기능은 준비 중입니다')} variant="outline" className="border-[#83AF3B] ...">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">로그인</span>
          </Button>
        </div>

        <div className="mb-6 sm:mb-8 text-center">
            {/* ... 헤더 UI ... */}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mb-6 sm:mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 ... text-[#83AF3B]" />
            <Input
              type="text"
              placeholder="예: 확정일자, 전세사기, 보증금 반환"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white ..."
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleSearch} className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] ..." disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={index} 
                className="p-4 sm:p-6 bg-white ... cursor-pointer"
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

        {!isLoading && results.length === 0 && (
          <div className="text-center py-12 text-gray-600 px-4">
            <p>검색어를 입력하면 관련 판례와 법률을 찾아드립니다.</p>
          </div>
        )}
      </div>

      <Dialog open={selectedResult !== null} onOpenChange={(open) => !open && setSelectedResult(null)}>
          {/* ... 상세 보기 모달 UI ... */}
      </Dialog>
    </div>
  );
}
