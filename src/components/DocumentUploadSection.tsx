import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ActionType } from "../types"; // 1. 타입 import
import nestImage from "figma:asset/nest.png";

// 2. Props 타입 구체화
interface DocumentUploadSectionProps {
  onAction: (actionType: 'analyze_document', payload: { file: File }) => void;
}

export function DocumentUploadSection({ onAction }: DocumentUploadSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("PDF, JPG, PNG 파일만 업로드 가능합니다");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("파일 크기는 10MB 이하여야 합니다");
      return;
    }
    
    setUploadedFile(file);
    toast.info("문서 분석을 시작합니다...");
    onAction('analyze_document', { file });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full p-6 bg-white rounded-2xl shadow-md border-border">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
            <ImageWithFallback
              src={nestImage}
              alt="둥지"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-foreground text-[24px] font-bold">
              둥지 스캔하기
            </h3>
            <p className="text-sm text-muted-foreground">
              등기부등본, 건축물대장, 계약서 초안을 올려주면 어미새가 미리 확인해줄게!
            </p>
          </div>
        </div>
        
        {!uploadedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground text-[14px]">
                  파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-sm text-muted-foreground mt-1 text-[12px]">
                  PDF, JPG, PNG 파일 (최대 10MB)
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
