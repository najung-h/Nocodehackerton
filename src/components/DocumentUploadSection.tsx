import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import nestImage from "figma:asset/nest.png";
import { 
  documentAnalysisService, 
  DocumentAnalysisResult 
} from "../services/documentAnalysis.service";

interface DocumentUploadSectionProps {
  onAnalysisComplete?: (result: DocumentAnalysisResult) => void;
}

export function DocumentUploadSection({ onAnalysisComplete }: DocumentUploadSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // 파일 설정
      setUploadedFile(file);
      setAnalysisResult(null);
      setIsAnalyzing(true);

      toast.info("문서 분석을 시작합니다... 잠시만 기다려주세요 🔍");

      // 문서 분석 실행
      const result = await documentAnalysisService.analyzeDocument(file);

      // 결과 저장
      setAnalysisResult(result);
      setIsAnalyzing(false);

      // 성공 메시지
      toast.success("문서 분석이 완료되었습니다! ✅");

      // 부모 컴포넌트에 결과 전달
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }

    } catch (error) {
      setIsAnalyzing(false);
      console.error('File analysis error:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '문서 분석 중 오류가 발생했습니다.';
      
      toast.error(errorMessage);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case '등기부등본':
        return 'bg-blue-100 text-blue-800';
      case '건축물대장':
        return 'bg-green-100 text-green-800';
      case '계약서':
      case '계약서 초안':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full p-6 bg-white rounded-2xl shadow-md border-border">
      <div className="space-y-4">
        {/* 헤더 */}
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
              disabled={isAnalyzing}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {/* 업로드된 파일 정보 */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {!isAnalyzing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* 분석 중 표시 */}
            {isAnalyzing && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-blue-700 font-medium">
                  AI가 문서를 분석하고 있습니다...
                </p>
              </div>
            )}

            {/* 분석 결과 표시 */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-3">
                {/* 문서 타입 */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">분석 완료</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(analysisResult.documentType)}`}>
                    {analysisResult.documentType}
                  </span>
                </div>

                {/* 요약 정보 */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-semibold mb-2">📋 분석 결과</h4>
                  <p className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                    {analysisResult.analysis.summary}
                  </p>
                </div>

                {/* 위험 요소 (있는 경우) */}
                {analysisResult.analysis.risks && analysisResult.analysis.risks.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-800 mb-2">
                          ⚠️ 주의사항
                        </h4>
                        <ul className="text-xs text-red-700 space-y-1">
                          {analysisResult.analysis.risks.map((risk, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="mt-0.5">•</span>
                              <span>{risk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 상세 정보 보기 버튼 */}
                <Button
                  onClick={() => {
                    // 상세 정보를 모달이나 별도 페이지로 표시
                    console.log('Full analysis:', analysisResult);
                    toast.info('상세 분석 결과를 확인하세요');
                  }}
                  className="w-full"
                  variant="outline"
                >
                  상세 분석 결과 보기
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}