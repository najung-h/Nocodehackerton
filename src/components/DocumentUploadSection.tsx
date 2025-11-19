import image_7aa8802e8a9a89ec6a81ed81887103f2d2aa3ff0 from "figma:asset/nest.png";
import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DocumentUploadSectionProps {
  onAnalysisComplete: (report: AnalysisReport) => void;
}

interface AnalysisReport {
  fileName: string;
  checkedItems: string[];
  findings: Array<{
    type: "info" | "warning" | "error";
    message: string;
  }>;
}

export function DocumentUploadSection({
  onAnalysisComplete,
}: DocumentUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("PDF, JPG, PNG 파일만 업로드 가능합니다");
      return;
    }

    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("파일 크기는 10MB 이하여야 합니다");
      return;
    }

    setUploadedFile(file);
    analyzeDocument(file);
  };

  const analyzeDocument = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // ❗️ 문서 분석을 처리할 n8n의 Webhook URL
    const analysisWebhookUrl = 'https://ajjoona.app.n8n.cloud/webhook/YOUR_DOCUMENT_ANALYSIS_WEBHOOK_ID'; // TODO: 실제 웹훅 URL로 교체

    const formData = new FormData();
    formData.append('file', file);

    // 업로드 진행 시뮬레이션 (fetch는 기본적으로 진행률을 제공하지 않으므로)
    const interval = setInterval(() => {
      setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const response = await fetch(analysisWebhookUrl, {
        method: 'POST',
        body: formData, // FormData를 사용하면 Content-Type은 브라우저가 자동으로 설정합니다.
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('문서 분석에 실패했습니다.');
      }

      const report: AnalysisReport = await response.json();

      toast.success("문서 분석이 완료되었습니다!");
      onAnalysisComplete(report);

    } catch (error) {
      clearInterval(interval);
      setUploadProgress(0);
      console.error('문서 분석 중 오류 발생:', error);
      toast.error('문서 분석 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
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
              src={
                image_7aa8802e8a9a89ec6a81ed81887103f2d2aa3ff0
              }
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

        {/* 파일 업로드 영역 */}
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
            {/* 업로드된 파일 정보 */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {!isUploading && uploadProgress === 100 && (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* 업로드 진행바 */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    AI 분석 중...
                  </span>
                  <span className="text-primary">
                    {uploadProgress}%
                  </span>
                </div>
                <Progress
                  value={uploadProgress}
                  className="h-2"
                />
              </div>
            )}

            {/* 분석 완료 메시지 */}
            {!isUploading && uploadProgress === 100 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-green-800">
                    분석이 완료되었습니다! 체크리스트 항목이
                    자동으로 업데이트됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-blue-800">
            <p>
              <strong>지원하는 문서:</strong> 등기부등본, 전월세
              계약서 초안, 건축물대장 등
            </p>
            <p className="mt-1 text-xs text-blue-700">
              개인정보는 분석 후 즉시 삭제되며 저장되지 않습니다
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
