import { useState } from 'react';
import { Search, ArrowLeft, Book, ExternalLink, LogIn, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import searchImage from "figma:asset/mother.png";

// 1. props 타입 정의: 부모로부터 받을 데이터와 함수, 상태를 명시합니다.
interface SearchResult {
  type: string;
  title: string;
  content: string;
  reference: string;
  fullContent?: string;
  date?: string;
  court?: string;
}

interface SearchPageProps {
  onBack: () => void;
  onAction: (actionType: 'search_legal', payload: { query: string }) => void;
  results: SearchResult[];
  isLoading: boolean;
}

export function SearchPage({ onBack, onAction, results, isLoading }: SearchPageProps) {
  // 2. 내부 상태 간소화: API 결과와 로딩 상태를 제거하고, UI 상태만 남깁니다.
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // 3. handleSearch 로직 변경: fetch 대신 onAction prop을 호출합니다.
  const handleSearch = () => {
    if (!searchQuery.trim() || isLoading) return;
    onAction('search_legal', { query: searchQuery });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-green-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
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

        <div className="mb-6 sm:mb-8 text-center">
          {/* ... 헤더 UI ... */}
        </div>

        {/* 4. UI에 로딩 상태(isLoading)를 직접 사용합니다. */}
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
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#83AF3B] to-[#9ec590] hover:from-[#6f9632] hover:to-[#83AF3B] text-white w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : '검색'}
          </Button>
        </div>

        {/* 5. API 결과(results)를 props에서 직접 받아 렌더링합니다. */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={index} 
                className="p-4 sm:p-6 bg-white border-gray-200 hover:border-[#83AF3B] transition-colors cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                {/* ... 결과 아이템 UI ... */}
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