import { Progress } from './ui/progress';

interface ProgressBarProps {
  items: Array<{ isChecked: boolean }>;
  phase: string;
}

export function ProgressBar({ items, phase }: ProgressBarProps) {
  const totalItems = items.length;
  const checkedItems = items.filter(item => item.isChecked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const getPhaseLabel = () => {
    switch (phase) {
      case 'before':
        return '계약 전';
      case 'during':
        return '계약 진행중';
      case 'after':
        return '계약 후';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-900">{getPhaseLabel()} 진행상황</span>
        <span className="text-gray-700">
          {checkedItems} / {totalItems} 완료
        </span>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-3 bg-gray-100" />
        
        {/* 귀여운 아기새 */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{ left: `calc(${progress}% - 12px)` }}
        >
          <div className="relative w-6 h-7">
            {/* Body */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-6 bg-gradient-to-b from-yellow-200 to-white rounded-full shadow-sm" />
            
            {/* Head */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-200 rounded-full" />
            
            {/* Eyes */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-gray-800 rounded-full" />
              <div className="w-1 h-1 bg-gray-800 rounded-full" />
            </div>
            
            {/* Beak */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-l-transparent border-r-[2px] border-r-transparent border-t-[3px] border-t-orange-400" />
            
            {/* Wings */}
            <div className="absolute top-3 left-0 w-1.5 h-2 bg-yellow-300 rounded-full -rotate-12" />
            <div className="absolute top-3 right-0 w-1.5 h-2 bg-yellow-300 rounded-full rotate-12" />
            
            {/* Hair tuft */}
            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2">
              <div className="w-0.5 h-1.5 bg-gray-700 rounded-full" />
            </div>
          </div>
        </div>

        {/* 둥지 아이콘 */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2">
          <div className="relative w-8 h-6">
            {/* Nest */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-amber-700 rounded-full opacity-40" />
            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-7 h-2.5 bg-amber-600 rounded-full opacity-60" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-yellow-700 rounded-full" />
            {/* House on nest */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[5px] border-b-amber-500" />
          </div>
        </div>
      </div>

      {progress === 100 && (
        <div className="text-center py-2">
          <p className="text-green-600 animate-pulse">
            🎉 축하합니다! 아기새가 둥지에 안착했어요!
          </p>
        </div>
      )}
    </div>
  );
}