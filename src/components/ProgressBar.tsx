import { Progress } from "./ui/progress";
import birdImage from "figma:asset/183c1031e148483d35585f93e39c1e87fcdc52d9.png";
import nestImage from "figma:asset/7aa8802e8a9a89ec6a81ed81887103f2d2aa3ff0.png";
import completedImage from "figma:asset/d5fc0f218b8d903f791d1bdbffdaa485864b2ee3.png";

interface ProgressBarProps {
  items: Array<{ isChecked: boolean }>;
  phase: string;
}

export function ProgressBar({
  items,
  phase,
}: ProgressBarProps) {
  const totalItems = items.length;
  const checkedItems = items.filter(
    (item) => item.isChecked,
  ).length;
  const progress =
    totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const getPhaseLabel = () => {
    switch (phase) {
      case "before":
        return "계약 전";
      case "during":
        return "계약 중";
      case "after":
        return "계약 후";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-6">
        <span className="text-foreground font-semibold text-sm whitespace-nowrap">
          {getPhaseLabel()} 진행상황
        </span>

        <div className="relative flex-1">
          <Progress value={progress} className="h-3 bg-muted" />

          {/* 진행 중인 아기새: progress bar의 끝에 위치 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
            style={{
              left: `${progress}%`,
              transform: `translate(-50%, -50%)`,
            }}
          >
            <img
              src={birdImage}
              alt="아기새"
              className="w-10 h-10 object-contain"
            />
          </div>

          {/* 끝 이모지: 둥지 🪹 또는 완료 시 아기새 둥지 */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
            <img
              src={progress === 100 ? completedImage : nestImage}
              alt={progress === 100 ? "아기새가 둥지에 안착" : "둥지"}
              className="w-15 h-15 object-contain"
            />
          </div>
        </div>

        <span className="text-muted-foreground font-medium text-sm whitespace-nowrap">
          {checkedItems} / {totalItems} 완료
        </span>
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