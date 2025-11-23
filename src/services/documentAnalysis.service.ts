// src/services/documentAnalysis.service.ts

/**
 * n8n Webhook과 통신하여 문서 분석을 수행하는 서비스
 */

export interface DocumentAnalysisResult {
  success: boolean;
  analysisId: string;
  documentType: string;
  fileName: string;
  analysis: {
    // 등기부등본
    propertyInfo?: {
      address: string;
      area: string;
      landType: string;
    };
    ownership?: {
      owner: string;
      shareRatio: string;
    };
    encumbrances?: Array<{
      type: string;
      amount: string;
      creditor: string;
    }>;
    
    // 건축물대장
    buildingInfo?: {
      address: string;
      buildingName: string;
      totalArea: string;
      structure: string;
      purpose: string;
    };
    floors?: Array<{
      floor: string;
      area: string;
      purpose: string;
    }>;
    violations?: string[];
    
    // 계약서
    parties?: {
      seller: string;
      buyer: string;
    };
    amount?: {
      total: string;
      deposit: string;
      intermediate: string;
      balance: string;
    };
    specialTerms?: string[];
    concerns?: string[];
    recommendations?: string[];
    
    // 공통
    risks?: string[];
    summary: string;
  };
  message: string;
}

class DocumentAnalysisService {
  private webhookUrl: string;

  constructor() {
    // Vite 환경 변수 사용 (VITE_ 접두사 필요)
    this.webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || 
                      'https://najungh.app.n8n.cloud/webhook-test/analyze-document-langchain';
  }

  /**
   * 파일을 Base64로 인코딩
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * n8n Webhook으로 문서 분석 요청
   */
  async analyzeDocument(file: File): Promise<any> {
    try {
      // 1. 파일 검증
      this.validateFile(file);

      // 2. 파일을 Base64로 변환
      const base64Data = await this.fileToBase64(file);

      // 3. n8n Webhook 호출
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
            data: base64Data,
            name: file.name,
            type: file.type,
          }
        }),
      });

      // 4. 응답 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: 문서 분석 요청 실패`
        );
      }

      const result: DocumentAnalysisResult = await response.json();

      // 5. 결과 검증
      if (!result.success) {
        throw new Error(result.message || '문서 분석에 실패했습니다.');
      }

      return result;

    } catch (error) {
      console.error('Document analysis error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('문서 분석 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  /**
   * 파일 검증
   */
  private validateFile(file: File): void {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('PDF, JPG, PNG 파일만 업로드 가능합니다.');
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('파일 크기는 10MB 이하여야 합니다.');
    }

    if (!file.name || file.name.trim() === '') {
      throw new Error('유효한 파일 이름이 필요합니다.');
    }
  }

  /**
   * 분석 결과를 사용자 친화적인 메시지로 변환
   */
  formatAnalysisSummary(result: DocumentAnalysisResult): string {
    const { documentType, analysis } = result;

    switch (documentType) {
      case '등기부등본':
        return `
📋 등기부등본 분석 완료

📍 부동산 정보:
- 주소: ${analysis.propertyInfo?.address || '정보 없음'}
- 면적: ${analysis.propertyInfo?.area || '정보 없음'}
- 지목: ${analysis.propertyInfo?.landType || '정보 없음'}

👤 소유권:
- 소유자: ${analysis.ownership?.owner || '정보 없음'}
- 지분: ${analysis.ownership?.shareRatio || '정보 없음'}

⚠️ 권리관계:
${analysis.encumbrances?.length ? 
  analysis.encumbrances.map(e => `- ${e.type}: ${e.amount} (${e.creditor})`).join('\n') : 
  '- 특이사항 없음'
}

💡 종합 의견:
${analysis.summary}
        `.trim();

      case '건축물대장':
        return `
🏢 건축물대장 분석 완료

📍 건축물 정보:
- 소재지: ${analysis.buildingInfo?.address || '정보 없음'}
- 건물명: ${analysis.buildingInfo?.buildingName || '정보 없음'}
- 연면적: ${analysis.buildingInfo?.totalArea || '정보 없음'}
- 구조: ${analysis.buildingInfo?.structure || '정보 없음'}
- 용도: ${analysis.buildingInfo?.purpose || '정보 없음'}

⚠️ 위반 건축:
${analysis.violations?.length ? 
  analysis.violations.map(v => `- ${v}`).join('\n') : 
  '- 위반사항 없음'
}

💡 종합 의견:
${analysis.summary}
        `.trim();

      case '계약서':
      case '계약서 초안':
        return `
📝 계약서 검토 완료

👥 계약 당사자:
- 매도인: ${analysis.parties?.seller || '정보 없음'}
- 매수인: ${analysis.parties?.buyer || '정보 없음'}

💰 계약 금액:
- 총액: ${analysis.amount?.total || '정보 없음'}
- 계약금: ${analysis.amount?.deposit || '정보 없음'}
- 중도금: ${analysis.amount?.intermediate || '정보 없음'}
- 잔금: ${analysis.amount?.balance || '정보 없음'}

⚠️ 주의사항:
${analysis.concerns?.length ? 
  analysis.concerns.map(c => `- ${c}`).join('\n') : 
  '- 특이사항 없음'
}

✅ 개선 제안:
${analysis.recommendations?.length ? 
  analysis.recommendations.map(r => `- ${r}`).join('\n') : 
  '- 개선 필요사항 없음'
}

💡 종합 의견:
${analysis.summary}
        `.trim();

      default:
        return `
📄 문서 분석 완료

💡 종합 의견:
${analysis.summary}
        `.trim();
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const documentAnalysisService = new DocumentAnalysisService();

// 기본 export
export default documentAnalysisService;