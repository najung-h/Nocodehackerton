import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ProgressBar } from './ProgressBar';
import { ChecklistList } from './ChecklistList';
import { Button } from './ui/button';
import { Download, Mail, Plus, FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

// 초기 체크리스트 데이터
const initialChecklists = {
  before: [
    {
      id: 'b1',
      title: '매매가격 확인하기',
      what: '해당 주택의 실제 시세(매매가격)를 확인하여 전세보증금 대비 위험도를 판단하고 깡통전세 가능성을 사전에 차단한다.',
      why: '깡통주택은 주택 시세(매매가)와 전세보증금이 비슷하거나 보증금이 더 높은 경우로, 집값 하락 또는 경매 시 보증금을 돌려받지 못할 위험이 크다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasEmptyJeonseCheck: true,
      actionType: 'molit_price_check',
      actionLabel: '실거래가 자동 조회',
      guidelines: '보증금 비율 70% 미만: 안전 / 70~80%: 주의 / 80% 이상: 위험',
      links: [
        { label: '국토교통부 실거래가 조회', url: 'https://rt.molit.go.kr' }
      ]
    },
    {
      id: 'b2',
      title: '보증보험 가입 가능 여부 확인하기',
      what: '해당 전세계약이 전세보증금반환보증(보증보험)에 가입 가능한지 사전에 확인한다.',
      why: '보증보험 가입이 불가한 매물은 임대인의 과도한 채무, 기존 세입자 보증금 합계 초과, 불법 건축물 등 구조적 위험이 있을 가능성이 높다. 특히 보증금이 시세의 80% 이상인 고위험 전세일수록 필수 점검 항목이다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      actionType: 'insurance_check',
      actionLabel: '보증보험 가입 가능 여부 확인',
      links: [
        { label: 'HUG 전세보증보험', url: 'https://www.khug.or.kr' },
        { label: 'SGI 전세보증보험', url: 'https://www.sgic.co.kr' }
      ]
    },
    {
      id: 'b3',
      title: '등기부등본 확인하기',
      what: '등기부등본을 통해 실제 소유자와 근저당·압류·가압류 등 권리관계를 확인하고 전세계약의 안전성을 평가한다.',
      why: '등기부등본은 해당 주택의 법적 상태를 가장 정확하게 보여주는 문서로, 임대인의 빚이 많거나 과거 임차권이 말소되지 않았다면 보증금 회수 위험이 크다. 또한 계약 후 잔금 지급 전 추가 대출이나 소유권 이전이 발생할 수 있어 입주 직전까지 반복 확인이 필요하다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasRegistryAnalysis: true,
      actionType: 'registry_check',
      actionLabel: '등기부등본 자동 조회',
      links: [
        { label: '인터넷등기소에서 발급받기', url: 'https://www.iros.go.kr' }
      ]
    },
    {
      id: 'b4',
      title: '우선변제권 확보하기',
      what: '확정일자를 받아 경매·배당 시 다른 채권자보다 우선하여 보증금을 회수할 수 있는 우선변제권을 완성한다.',
      why: '대항력만으로는 경매에서 보증금을 먼저 받을 수 없고, 확정일자를 받아야 우선변제권이 성립한다. 우선변제권이 없으면 은행 등 근저당권자가 먼저 배당을 받고 세입자는 남은 금액만 받게 될 위험이 크다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isImportant: true,
      actionType: 'priority_payment',
      actionLabel: '전입신고 및 확정일자 받기',
      guidelines: '전입신고 후 확정일자를 받으면 우선변제권이 발생합니다.'
    }
  ],
  during: [
    {
      id: 'd1',
      title: '임대인 확인하기',
      what: '전세계약을 체결하는 사람이 실제 소유자이거나 정당한 권한을 가진 임대인인지 확인한다.',
      why: '가짜 임대인, 명의 도용, 위조 신분증 등을 이용한 전세사기를 예방하고, 계약 무효나 보증금 미반환 위험을 줄이기 위함이다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasOwnerCheck: true
    },
    {
      id: 'd2',
      title: '신탁등기 전세사기 예방하기',
      what: '주택이 신탁등기 상태인지 여부와 신탁 구조를 확인하여 불법 임대계약, 계약 무효, 보증금 손실 위험을 예방한다.',
      why: '신탁등기가 된 부동산은 소유권이 신탁회사(수탁자)에게 이전된 상태로, 수탁자 동의 없이 위탁자와 체결한 임대차계약은 무효가 될 수 있다. 이 경우 세입자는 불법점유자로 간주되어 퇴거 및 보증금 손실 위험이 크다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      guidelines: '신탁등기 발견 시 신탁사에 임대차 계약 동의 여부를 확인해야 합니다.',
      links: [
        { label: '신탁등기 확인 방법', url: 'https://www.iros.go.kr' }
      ]
    },
    {
      id: 'd3',
      title: '공인중개사 확인하기',
      what: '중개인이 정식 등록된 공인중개사인지, 중개사무소가 정상 영업 중인지 확인한다.',
      why: '무등록·무자격 중개를 통해 발생하는 책임 회피, 보증보험 미가입, 분쟁 시 손해배상 청구 곤란 등의 위험을 방지하기 위함이다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      links: [
        { label: '공인중개사 자격 확인', url: 'https://www.gov.kr' }
      ]
    },
    {
      id: 'd4',
      title: '계약 내용 꼼꼼히 확인하기',
      what: '전세계약서에 기재된 내용이 실제 사실과 일치하는지 전 항목을 점검해 계약 오류·누락으로 인한 분쟁을 예방한다.',
      why: '전세계약은 금액 규모가 크고, 계약서 한 줄 차이로도 대항력·우선변제권 상실, 보증금 미반환, 특약 미이행 등의 피해가 발생할 수 있기 때문이다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasRiskDiagnosis: true,
      links: [
        { label: '표준 임대차 계약서 양식', url: 'https://www.molit.go.kr' }
      ]
    },
    {
      id: 'd5',
      title: '특약사항 작성하기',
      what: '임대인과 구두로 합의한 조건을 계약서 특약란에 명확히 기록하여 법적 효력을 확보한다.',
      why: '전세계약에서 구두 약속은 증명과 집행이 어려워 분쟁 시 임차인이 불리하다. 특약으로 명시해야만 이행 강제, 계약 해제, 보증금 반환 요구 등이 가능해진다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      guidelines: '수리 의무, 중개수수료 분담, 하자 보수 등을 명확히 기재한다.'
    },
    {
      id: 'd6',
      title: '선순위 임차보증금 / 근저당 허위 고지 예방하기',
      what: '다가구주택의 선순위 임차보증금과 근저당 현황을 확인해 내 보증금이 후순위로 밀리는 위험을 차단한다.',
      why: '이미 설정된 선순위 보증금·근저당 때문에 경매 시 자신의 보증금 대부분을 회수하지 못할 수 있으므로, 계약 전에 권리·부채 구조를 명확히 파악해야 한다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      links: [
        { label: '전입세대 열람 발급', url: 'https://www.gov.kr' }
      ]
    },
    {
      id: 'd7',
      title: '위임장 확인하기',
      what: '전세계약을 진행하는 대리인이 임대인으로부터 정당하게 권한을 위임받았는지, 위임 범위가 적절한지 확인한다.',
      why: '임대인이 직접 나오지 않는 계약에서 대리인의 권한이 불명확하면 계약 무효, 대항력·우선변제권 상실 등 중대한 위험이 발생할 수 있다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      guidelines: '위임장에는 인감도장이 날인되어야 하며, 인감증명서를 함께 확인한다.'
    }
  ],
  after: [
    {
      id: 'a1',
      title: '대항력 확보하기',
      what: '실제 거주와 전입신고를 통해 임차인의 대항력을 취득하여 임대인이 바뀌어도 계약 조건을 유지할 수 있도록 한다.',
      why: '대항력은 임차인의 거주권·계약 유지권으로, 임대인이 집을 매매하거나 명의를 이전해도 세입자를 내보내기 어렵게 만든다. 대항력이 없으면 보증금 반환 책임이 불명확해지고, 임대인 변경 시 협상력이 크게 떨어진다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      timelineLabel: '대항력 획득!',
      isImportant: true,
      hasCalendar: true,
      links: [
        { label: '정부24에서 전입신고', url: 'https://www.gov.kr' },
        { label: '인터넷등기소에서 확정일자', url: 'https://www.iros.go.kr' }
      ]
    },
    {
      id: 'a2',
      title: '주택 확인 및 이사',
      what: '입주 전·후 주택 상태를 점검하고, 이사·공과금·수선의무 관련 분쟁을 예방하기 위한 절차를 수행한다.',
      why: '입주 전 하자 기록이 부족하면 퇴거 시 원상복구 분쟁이 발생할 수 있고, 이사업체 계약이 불명확하면 추가요금·파손 책임 분쟁이 생긴다. 공과금 미정산과 수선의무 오해는 세입자의 불필요한 비용 부담으로 이어질 수 있다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasCalendar: true,
      guidelines: '수도, 전기, 가스, 난방 등 시설물이 정상 작동하는지 확인한다.'
    },
    {
      id: 'a3',
      title: '계약 종료 후 이사 나가기',
      what: '계약 만기 도래 시 적법하게 종료 의사를 통보하고, 공과금 정산 및 보증금 반환을 안전하게 처리한 뒤 이사한다.',
      why: '묵시적 갱신 기간(만기 6개월~2개월 전)에 해지 의사 표시를 하지 않으면 계약이 자동 연장된다. 임대인과 연락이 되지 않거나 분쟁이 발생하면 보증금 반환이 지연되고 추가 비용과 법적 분쟁이 생길 수 있다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasCalendar: true,
      isOptional: true,
      guidelines: '계약 종료 2~3개월 전에 임대인에게 통보하는 것이 좋다.'
    },
    {
      id: 'a4',
      title: '계약 갱신하기(계속 거주하기)',
      what: '묵시적 갱신 및 계약갱신청구권 제도를 활용해 안정적으로 계속 거주하고, 보증금·월세 조건을 합리적으로 조정한다.',
      why: '계약 만기 전 별도 의사 표시가 없으면 자동으로 2년 연장되는 묵시적 갱신이 성립한다. 임차인은 계약갱신청구권을 1회 행사해 추가 2년 거주를 요구할 수 있으며, 이때 임대인은 5%를 초과해 증액할 수 없다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      guidelines: '계약갱신청구권은 계약 만료 6개월 전~2개월 전 사이에 행사할 수 있다.',
      links: [
        { label: '계약갱신청구권 안내', url: 'https://www.molit.go.kr' }
      ]
    },
    {
      id: 'a5',
      title: '권리변동·이중계약·특약 불이행 점검하기',
      what: '잔금 지급 후 입주·전입 전까지 발생할 수 있는 추가 근저당 설정, 소유권 변경, 이중계약, 특약 불이행 위험을 점검한다.',
      why: '전입신고 다음 날 0시 전까지는 대항력이 없어 이 기간에 새 근저당·압류·매매가 이뤄지면 세입자 보증금이 후순위로 밀릴 수 있고, 이중계약이나 특약 불이행 시 전세사기로 이어질 수 있다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      guidelines: '6개월마다 등기부등본을 다시 발급받아 확인하는 것을 권장한다.'
    },
    {
      id: 'a6',
      title: '미납국세·임금채권·전출신고 위험 관리',
      what: '입주 후 임대인의 체납 세금·임금채권 및 전출신고로 인한 대항력 상실 위험을 관리한다.',
      why: '국세·임금채권은 사람에게 붙는 채권으로 예측이 어렵고, 우선변제 대상이 될 수 있다. 또한 보증금 반환 전 전출신고를 하면 대항력을 잃어 후순위로 밀릴 수 있다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      links: [
        { label: '전입세대 열람으로 확인', url: 'https://www.gov.kr' }
      ]
    },
    {
      id: 'a7',
      title: '보증금 반환 지연 대비하기',
      what: '계약 기간 종료 후 임대인이 보증금을 제때 반환하지 않을 상황에 대비해 법적 절차를 준비한다.',
      why: '전세사기 또는 자금 경색으로 보증금 반환이 지연될 수 있으며, 적절한 절차를 제때 밟지 않으면 회수 가능 금액이 줄어들 수 있다.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      guidelines: '보증금 반환이 지연되면 임대차보증금 반환보증보험이나 법적 절차를 고려한다.',
      links: [
        { label: '대한법률구조공단', url: 'https://www.klac.or.kr' }
      ]
    }
  ]
};

type ChecklistPhase = 'before' | 'during' | 'after';

export function ChecklistSection() {
  const [activeTab, setActiveTab] = useState<ChecklistPhase>('before');
  const [checklists, setChecklists] = useState(initialChecklists);
  const [showRiskDiagnosis, setShowRiskDiagnosis] = useState(false);
  const [showOwnerCheck, setShowOwnerCheck] = useState(false);
  const [showRegistryAnalysis, setShowRegistryAnalysis] = useState(false);
  const [showEmptyJeonseCheck, setShowEmptyJeonseCheck] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [ownerCheckFile, setOwnerCheckFile] = useState<File | null>(null);
  const [ownerCheckAnalyzing, setOwnerCheckAnalyzing] = useState(false);
  const [ownerCheckResult, setOwnerCheckResult] = useState<any>(null);
  const [registryFile, setRegistryFile] = useState<File | null>(null);
  const [registryAnalyzing, setRegistryAnalyzing] = useState(false);
  const [registryResult, setRegistryResult] = useState<any>(null);
  const [emptyJeonseData, setEmptyJeonseData] = useState({
    salePrice: '',
    deposit: '',
    seniorDebt: '',
    seniorJeonse: ''
  });
  const [emptyJeonseResult, setEmptyJeonseResult] = useState<any>(null);
  const [knownOwnerName, setKnownOwnerName] = useState('');
  const [showOptional, setShowOptional] = useState({
    before: false,
    during: false,
    after: false
  });

  const handleToggleCheck = (phase: ChecklistPhase, id: string) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: prev[phase].map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    }));
  };

  const handleAddItem = (phase: ChecklistPhase) => {
    const newId = `${phase[0]}${Date.now()}`;
    const newItem = {
      id: newId,
      title: '',
      description: '',
      isChecked: false,
      isCustom: true,
      hasTimeline: false,
      isEditing: true
    };
    setChecklists(prev => ({
      ...prev,
      [phase]: [...prev[phase], newItem]
    }));
  };

  const handleUpdateItem = (phase: ChecklistPhase, id: string, title: string, description: string) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: prev[phase].map(item =>
        item.id === id ? { ...item, title, description, isEditing: false } : item
      )
    }));
  };

  const handleDeleteItem = (phase: ChecklistPhase, id: string) => {
    setChecklists(prev => ({
      ...prev,
      [phase]: prev[phase].filter(item => item.id !== id)
    }));
  };

  const handleExportPDF = () => {
    toast.success('PDF로 내보내기 기능이 실행됩니다');
  };

  const handleSendEmail = () => {
    toast.success('메일 보내기 기능이 실행됩니다');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReport(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;

    setAnalyzing(true);
    
    // 더미 분석 결과
    setTimeout(() => {
      setReport({
        deposit: '10,000만원',
        monthlyRent: '50만원',
        riskScore: 35,
        risks: [
          { level: 'warning', text: '특약사항에 "수리비 전액 임차인 부담" 조항 발견' },
          { level: 'info', text: '확정일자 날인 확인 필요' },
        ],
        analysis: [
          { category: '보증금', value: '10,000만원', status: 'safe' },
          { category: '임대인 정보', value: '확인 완료', status: 'safe' },
          { category: '특약 조항', value: '2건 검토 필요', status: 'warning' },
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  const handleOwnerCheckFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOwnerCheckFile(e.target.files[0]);
      setOwnerCheckResult(null);
    }
  };

  const handleOwnerCheckAnalyze = () => {
    if (!ownerCheckFile) return;

    setOwnerCheckAnalyzing(true);
    
    // 더미 분석 결과
    setTimeout(() => {
      setOwnerCheckResult({
        isMatch: true,
        ownerName: '김철수',
        matchScore: 95
      });
      setOwnerCheckAnalyzing(false);
    }, 2000);
  };

  const handleRegistryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegistryFile(e.target.files[0]);
      setRegistryResult(null);
    }
  };

  const handleRegistryAnalyze = () => {
    if (!registryFile) return;

    setRegistryAnalyzing(true);
    
    // 더미 분석 결과 - 등기부등본 권리관계 및 위험요소 분석
    setTimeout(() => {
      setRegistryResult({
        address: '서울특별시 강남구 테헤란로 123',
        ownerName: '김철수',
        ownershipType: '단독 소유',
        riskScore: 28,
        risks: [
          { level: 'warning', text: '근저당권 1건 설정됨 (금액: 5억원)' },
          { level: 'info', text: '선순위 전세권 없음' },
          { level: 'info', text: '신탁등기 없음 - 안전' },
        ],
        rights: [
          { type: '소유권', holder: '김철수', date: '2020.03.15', amount: '', status: 'safe' },
          { type: '근저당권', holder: 'OO은행', date: '2020.03.20', amount: '5억원', status: 'warning' },
        ],
        analysis: [
          { category: '소유권 확인', value: '단독 소유 - 명확함', status: 'safe' },
          { category: '근저당권', value: '5억원 (주의 필요)', status: 'warning' },
          { category: '전세권 설정', value: '없음', status: 'safe' },
          { category: '가압류/가처분', value: '없음', status: 'safe' },
          { category: '신탁등기', value: '없음', status: 'safe' },
          { category: '예고등기', value: '없음', status: 'safe' },
        ],
        safetyTip: '근저당권이 설정되어 있으므로, 보증금이 순위에서 보호받을 수 있는지 확인이 필요합니다. 부동산 시세와 선순위 채권 금액을 고려하여 안전한 보증금 한도를 계산하세요.'
      });
      setRegistryAnalyzing(false);
    }, 2000);
  };

  const handleEmptyJeonseCheck = () => {
    const { salePrice, deposit, seniorDebt, seniorJeonse } = emptyJeonseData;
    if (!salePrice || !deposit || !seniorDebt || !seniorJeonse) {
      toast.error('모든 값을 입력해주세요');
      return;
    }

    setEmptyJeonseResult(null);
    
    // 더미 분석 결과 - 빈전세 위험 분석
    setTimeout(() => {
      const salePriceNum = parseFloat(salePrice.replace(/,/g, ''));
      const depositNum = parseFloat(deposit.replace(/,/g, ''));
      const seniorDebtNum = parseFloat(seniorDebt.replace(/,/g, ''));
      const seniorJeonseNum = parseFloat(seniorJeonse.replace(/,/g, ''));
      
      const riskScore = Math.min(100, Math.max(0, (depositNum / salePriceNum) * 100 - (seniorDebtNum / salePriceNum) * 100 + (seniorJeonseNum / salePriceNum) * 100));
      const isSafe = riskScore < 40;
      
      setEmptyJeonseResult({
        riskScore,
        isSafe,
        analysis: [
          { category: '매매가격', value: salePrice, status: 'safe' },
          { category: '보증금', value: deposit, status: 'safe' },
          { category: '선순위 채권 금액', value: seniorDebt, status: 'safe' },
          { category: '선순위 전세금액', value: seniorJeonse, status: 'safe' },
        ],
        safetyTip: isSafe ? '안전한 빈전세 조건입니다.' : '보증금이 높거나 선순위 채권 금액이 많아 위험할 수 있습니다. 보증금 한도를 재고해보세요.'
      });
    }, 2000);
  };

  const handleExecuteAction = (actionType: string) => {
    // MCP 도구와 연동하여 실제 행정 액션 실행
    toast.loading('액션을 실행하고 있습니다...', { id: actionType });

    // 액션 타입별로 다른 처리
    setTimeout(() => {
      switch (actionType) {
        case 'molit_price_check':
          toast.success('실거래가 조회가 완료되었습니다!', { id: actionType });
          // 실제로는 MCP를 통해 국토교통부 API 호출
          break;
        case 'insurance_check':
          toast.success('보증보험 가입 가능 여부 확인이 완료되었습니다!', { id: actionType });
          // 실제로는 MCP를 통해 HUG/SGI API 호출
          break;
        case 'registry_check':
          toast.success('등기부등본 자동 조회가 완료되었습니다!', { id: actionType });
          // 실제로는 MCP를 통해 인터넷등기소 API 호출
          break;
        case 'priority_payment':
          toast.success('전입신고 및 확정일자 신청이 완료되었습니다!', { id: actionType });
          // 실제로는 MCP를 통해 정부24 API 호출
          break;
        default:
          toast.error('지원하지 않는 액션입니다', { id: actionType });
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-gray-900">전월세 계약 체크리스트</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 md:flex-initial">
            <Download className="size-4 md:mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSendEmail} className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 md:flex-initial">
            <Mail className="size-4 md:mr-2" />
            <span className="hidden sm:inline">메일</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ChecklistPhase)}>
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 border border-gray-200">
          <TabsTrigger value="before" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs sm:text-sm">계약 전</TabsTrigger>
          <TabsTrigger value="during" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs sm:text-sm">진행중</TabsTrigger>
          <TabsTrigger value="after" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs sm:text-sm">계약 후</TabsTrigger>
        </TabsList>

        <TabsContent value="before" className="space-y-6">
          <ProgressBar items={checklists.before.filter(item => !item.isOptional || showOptional.before)} phase="before" />
          <ChecklistList
            items={checklists.before.filter(item => !item.isOptional || showOptional.before)}
            phase="before"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onOpenOwnerCheck={() => setShowOwnerCheck(true)}
            onOpenRegistryAnalysis={() => setShowRegistryAnalysis(true)}
            onOpenEmptyJeonseCheck={() => setShowEmptyJeonseCheck(true)}
            onExecuteAction={handleExecuteAction}
          />
          {!showOptional.before && checklists.before.some(item => item.isOptional) && (
            <Button
              variant="outline"
              className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              onClick={() => setShowOptional(prev => ({ ...prev, before: true }))}
            >
              <Plus className="size-4 mr-2" />
              더 꼼꼼히 확인하기
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => handleAddItem('before')}
          >
            <Plus className="size-4 mr-2" />
            체크리스트 항목 추가
          </Button>
        </TabsContent>

        <TabsContent value="during" className="space-y-6">
          <ProgressBar items={checklists.during.filter(item => !item.isOptional || showOptional.during)} phase="during" />
          <ChecklistList
            items={checklists.during.filter(item => !item.isOptional || showOptional.during)}
            phase="during"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onOpenRiskDiagnosis={() => setShowRiskDiagnosis(true)}
            onOpenOwnerCheck={() => setShowOwnerCheck(true)}
          />
          {!showOptional.during && checklists.during.some(item => item.isOptional) && (
            <Button
              variant="outline"
              className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              onClick={() => setShowOptional(prev => ({ ...prev, during: true }))}
            >
              <Plus className="size-4 mr-2" />
              더 꼼꼼히 확인하기
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => handleAddItem('during')}
          >
            <Plus className="size-4 mr-2" />
            체크리스트 항목 추가
          </Button>
        </TabsContent>

        <TabsContent value="after" className="space-y-6">
          <ProgressBar items={checklists.after.filter(item => !item.isOptional || showOptional.after)} phase="after" />
          <ChecklistList
            items={checklists.after.filter(item => !item.isOptional || showOptional.after)}
            phase="after"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
          {!showOptional.after && checklists.after.some(item => item.isOptional) && (
            <Button
              variant="outline"
              className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
              onClick={() => setShowOptional(prev => ({ ...prev, after: true }))}
            >
              <Plus className="size-4 mr-2" />
              더 꼼꼼히 확인하기
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => handleAddItem('after')}
          >
            <Plus className="size-4 mr-2" />
            체크리스트 항목 추가
          </Button>
        </TabsContent>
      </Tabs>

      {/* Risk Diagnosis Modal */}
      <Dialog open={showRiskDiagnosis} onOpenChange={setShowRiskDiagnosis}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">내 계약서 위험 진단하기</DialogTitle>
            <DialogDescription className="text-gray-600">
              계약서 PDF를 업로드하면 AI가 위험 요소를 자동으로 분석합니다.
            </DialogDescription>
          </DialogHeader>

          {!report && !analyzing && (
            <Card className="p-6 sm:p-8 bg-gray-50 border-gray-200">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
                  </div>
                  <h3 className="mb-2 text-gray-900">계약서 PDF 업로드</h3>
                  <p className="text-sm text-gray-600 mb-4 px-4">
                    전월세 계약서를 업로드하면 AI가 자동으로 분석합니다
                  </p>
                </div>

                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white cursor-pointer transition-all text-sm sm:text-base">
                    <Upload className="w-4 h-4 mr-2" />
                    파일 선택
                  </span>
                </label>

                {file && (
                  <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg text-left border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-600 shrink-0" />
                        <span className="text-sm text-gray-900 break-all">{file.name}</span>
                      </div>
                      <Button
                        onClick={handleAnalyze}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:w-auto"
                      >
                        분석 시작
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {analyzing && (
            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <p className="text-sm text-gray-700 mb-3">계약서를 분석하고 있습니다...</p>
              <Progress value={65} className="h-2" />
            </Card>
          )}

          {report && !analyzing && (
            <div className="space-y-4 sm:space-y-6">
              {/* Risk Score */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">위험도 점수</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={report.riskScore} className="h-3" />
                  </div>
                  <span className="text-xl sm:text-2xl text-gray-900">{report.riskScore}점</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {report.riskScore < 40 ? '안전한 계약입니다' : '검토가 필요한 항목이 있습니다'}
                </p>
              </Card>

              {/* Key Info */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">주요 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">보증금</p>
                    <p className="text-gray-900">{report.deposit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">월세</p>
                    <p className="text-gray-900">{report.monthlyRent}</p>
                  </div>
                </div>
              </Card>

              {/* Risks */}
              {report.risks.length > 0 && (
                <Card className="p-4 sm:p-6 bg-white border-gray-200">
                  <h3 className="mb-4 text-gray-900">주의사항</h3>
                  <div className="space-y-3">
                    {report.risks.map((risk: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <AlertCircle className={`w-5 h-5 shrink-0 ${risk.level === 'warning' ? 'text-orange-500' : 'text-cyan-500'}`} />
                        <p className="text-sm text-gray-700">{risk.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Analysis Details */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">상세 분석</h3>
                <div className="space-y-4">
                  {report.analysis.map((item: any, index: number) => (
                    <div key={index} className="flex items-start sm:items-center justify-between pb-3 border-b border-gray-200 last:border-0 gap-2">
                      <div className="flex items-start sm:items-center gap-3">
                        <CheckCircle className={`w-5 h-5 shrink-0 ${item.status === 'safe' ? 'text-green-500' : 'text-orange-500'}`} />
                        <div>
                          <p className="text-sm text-gray-900">{item.category}</p>
                          <p className="text-xs text-gray-600">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRiskDiagnosis(false);
                    setFile(null);
                    setReport(null);
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:flex-1"
                >
                  닫기
                </Button>
                <Button
                  onClick={() => toast.success('보고서가 다운로드되었습니다')}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  보고서 다운로드
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Owner Check Modal */}
      <Dialog open={showOwnerCheck} onOpenChange={setShowOwnerCheck}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">임대인 신분 확인하기</DialogTitle>
            <DialogDescription className="text-gray-600">
              임대인 신분증 및 인감증명서를 업로드하면 AI가 신분을 자동으로 확인합니다.
            </DialogDescription>
          </DialogHeader>

          {!ownerCheckResult && !ownerCheckAnalyzing && (
            <Card className="p-6 sm:p-8 bg-gray-50 border-gray-200">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
                  </div>
                  <h3 className="mb-2 text-gray-900">신분증 및 인감증명서 업로드</h3>
                  <p className="text-sm text-gray-600 mb-4 px-4">
                    임대인 신분증 및 인감증명서를 업로드하면 AI가 자동으로 확인합니다
                  </p>
                </div>

                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleOwnerCheckFileUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white cursor-pointer transition-all text-sm sm:text-base">
                    <Upload className="w-4 h-4 mr-2" />
                    파일 선택
                  </span>
                </label>

                {ownerCheckFile && (
                  <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg text-left border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-600 shrink-0" />
                        <span className="text-sm text-gray-900 break-all">{ownerCheckFile.name}</span>
                      </div>
                      <Button
                        onClick={handleOwnerCheckAnalyze}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:w-auto"
                      >
                        분석 시작
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {ownerCheckAnalyzing && (
            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <p className="text-sm text-gray-700 mb-3">신분증 및 인감증명서를 분석하고 있습니다...</p>
              <Progress value={65} className="h-2" />
            </Card>
          )}

          {ownerCheckResult && !ownerCheckAnalyzing && (
            <div className="space-y-4 sm:space-y-6">
              {/* Risk Score */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">신분 확인 결과</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={ownerCheckResult.matchScore} className="h-3" />
                  </div>
                  <span className="text-xl sm:text-2xl text-gray-900">{ownerCheckResult.matchScore}점</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {ownerCheckResult.matchScore < 80 ? '불일치' : '일치'}
                </p>
              </Card>

              {/* Key Info */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">주요 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">임대인 이름</p>
                    <p className="text-gray-900">{ownerCheckResult.ownerName}</p>
                  </div>
                </div>
              </Card>

              {/* Analysis Details */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">상세 분석</h3>
                <div className="space-y-4">
                  <div className="flex items-start sm:items-center justify-between pb-3 border-b border-gray-200 last:border-0 gap-2">
                    <div className="flex items-start sm:items-center gap-3">
                      <CheckCircle className={`w-5 h-5 shrink-0 ${ownerCheckResult.isMatch ? 'text-green-500' : 'text-orange-500'}`} />
                      <div>
                        <p className="text-sm text-gray-900">신분 확인</p>
                        <p className="text-xs text-gray-600">{ownerCheckResult.isMatch ? '일치' : '불일치'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowOwnerCheck(false);
                    setOwnerCheckFile(null);
                    setOwnerCheckResult(null);
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:flex-1"
                >
                  닫기
                </Button>
                <Button
                  onClick={() => toast.success('보고서가 다운로드되었습니다')}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  보고서 다운로드
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Registry Analysis Modal */}
      <Dialog open={showRegistryAnalysis} onOpenChange={setShowRegistryAnalysis}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">등기부등본 분석하기</DialogTitle>
            <DialogDescription className="text-gray-600">
              등기부등본 PDF를 업로드하면 AI가 자동으로 분석합니다.
            </DialogDescription>
          </DialogHeader>

          {!registryResult && !registryAnalyzing && (
            <Card className="p-6 sm:p-8 bg-gray-50 border-gray-200">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
                  </div>
                  <h3 className="mb-2 text-gray-900">등기부등본 PDF 업로드</h3>
                  <p className="text-sm text-gray-600 mb-4 px-4">
                    등기부등본 PDF를 업로드하면 AI가 자동으로 분석합니다
                  </p>
                </div>

                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleRegistryFileUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white cursor-pointer transition-all text-sm sm:text-base">
                    <Upload className="w-4 h-4 mr-2" />
                    파일 선택
                  </span>
                </label>

                {registryFile && (
                  <div className="mt-4 p-3 sm:p-4 bg-white rounded-lg text-left border border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-600 shrink-0" />
                        <span className="text-sm text-gray-900 break-all">{registryFile.name}</span>
                      </div>
                      <Button
                        onClick={handleRegistryAnalyze}
                        className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:w-auto"
                      >
                        분석 시작
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {registryAnalyzing && (
            <Card className="p-4 sm:p-6 bg-white border-gray-200">
              <p className="text-sm text-gray-700 mb-3">등기부등본을 분석하고 있습니다...</p>
              <Progress value={65} className="h-2" />
            </Card>
          )}

          {registryResult && !registryAnalyzing && (
            <div className="space-y-4 sm:space-y-6">
              {/* Risk Score */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">등기부등본 분석 결과</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={registryResult.matchScore} className="h-3" />
                  </div>
                  <span className="text-xl sm:text-2xl text-gray-900">{registryResult.matchScore}점</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {registryResult.matchScore < 80 ? '불일치' : '일치'}
                </p>
              </Card>

              {/* Key Info */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">주요 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">주소</p>
                    <p className="text-gray-900">{registryResult.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">임대인 이름</p>
                    <p className="text-gray-900">{registryResult.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">소유권 형태</p>
                    <p className="text-gray-900">{registryResult.ownershipType}</p>
                  </div>
                </div>
              </Card>

              {/* Analysis Details */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">상세 분석</h3>
                <div className="space-y-4">
                  {registryResult.analysis.map((item: any, index: number) => (
                    <div key={index} className="flex items-start sm:items-center justify-between pb-3 border-b border-gray-200 last:border-0 gap-2">
                      <div className="flex items-start sm:items-center gap-3">
                        <CheckCircle className={`w-5 h-5 shrink-0 ${item.status === 'safe' ? 'text-green-500' : 'text-orange-500'}`} />
                        <div>
                          <p className="text-sm text-gray-900">{item.category}</p>
                          <p className="text-xs text-gray-600">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Rights */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">권리 정보</h3>
                <div className="space-y-4">
                  {registryResult.rights.map((right: any, index: number) => (
                    <div key={index} className="flex items-start sm:items-center justify-between pb-3 border-b border-gray-200 last:border-0 gap-2">
                      <div className="flex items-start sm:items-center gap-3">
                        <CheckCircle className={`w-5 h-5 shrink-0 ${right.status === 'safe' ? 'text-green-500' : 'text-orange-500'}`} />
                        <div>
                          <p className="text-sm text-gray-900">{right.type}</p>
                          <p className="text-xs text-gray-600">소유자: {right.holder}</p>
                          <p className="text-xs text-gray-600">일자: {right.date}</p>
                          {right.amount && <p className="text-xs text-gray-600">금액: {right.amount}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Risks */}
              {registryResult.risks.length > 0 && (
                <Card className="p-4 sm:p-6 bg-white border-gray-200">
                  <h3 className="mb-4 text-gray-900">주의사항</h3>
                  <div className="space-y-3">
                    {registryResult.risks.map((risk: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <AlertCircle className={`w-5 h-5 shrink-0 ${risk.level === 'warning' ? 'text-orange-500' : 'text-cyan-500'}`} />
                        <p className="text-sm text-gray-700">{risk.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Safety Tip */}
              {registryResult.safetyTip && (
                <Card className="p-4 sm:p-6 bg-white border-gray-200">
                  <h3 className="mb-4 text-gray-900">안전 팁</h3>
                  <p className="text-sm text-gray-600">{registryResult.safetyTip}</p>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRegistryAnalysis(false);
                    setRegistryFile(null);
                    setRegistryResult(null);
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:flex-1"
                >
                  닫기
                </Button>
                <Button
                  onClick={() => toast.success('보고서가 다운로드되었습니다')}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  보고서 다운로드
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty Jeonse Check Modal */}
      <Dialog open={showEmptyJeonseCheck} onOpenChange={setShowEmptyJeonseCheck}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">빈전세 위험 분석하기</DialogTitle>
            <DialogDescription className="text-gray-600">
              매매가격, 보증금, 선순위 채권 금액, 선순위 전세금액을 입력하면 AI가 위험 요소를 자동으로 분석합니다.
            </DialogDescription>
          </DialogHeader>

          {!emptyJeonseResult && (
            <Card className="p-6 sm:p-8 bg-gray-50 border-gray-200">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
                  </div>
                  <h3 className="mb-2 text-gray-900">빈전세 위험 분석</h3>
                  <p className="text-sm text-gray-600 mb-4 px-4">
                    매매가격, 보증금, 선순위 채권 금액, 선순위 전세금액을 입력하면 AI가 자동으로 분석합니다
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">매매가격 (원)</p>
                    <input
                      type="text"
                      value={emptyJeonseData.salePrice}
                      onChange={(e) => setEmptyJeonseData(prev => ({ ...prev, salePrice: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">보증금 (원)</p>
                    <input
                      type="text"
                      value={emptyJeonseData.deposit}
                      onChange={(e) => setEmptyJeonseData(prev => ({ ...prev, deposit: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">선순위 채권 금액 (원)</p>
                    <input
                      type="text"
                      value={emptyJeonseData.seniorDebt}
                      onChange={(e) => setEmptyJeonseData(prev => ({ ...prev, seniorDebt: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">선순위 전세금액 (원)</p>
                    <input
                      type="text"
                      value={emptyJeonseData.seniorJeonse}
                      onChange={(e) => setEmptyJeonseData(prev => ({ ...prev, seniorJeonse: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleEmptyJeonseCheck}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:w-auto mt-4"
                >
                  분석 시작
                </Button>
              </div>
            </Card>
          )}

          {emptyJeonseResult && (
            <div className="space-y-4 sm:space-y-6">
              {/* Risk Score */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">빈전세 위험도 점수</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress value={emptyJeonseResult.riskScore} className="h-3" />
                  </div>
                  <span className="text-xl sm:text-2xl text-gray-900">{emptyJeonseResult.riskScore}점</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {emptyJeonseResult.isSafe ? '안전한 빈전세 조건입니다' : '보증금이 높거나 선순위 채권 금액이 많아 위험할 수 있습니다'}
                </p>
              </Card>

              {/* Key Info */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">주요 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">매매가격</p>
                    <p className="text-gray-900">{emptyJeonseData.salePrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">보증금</p>
                    <p className="text-gray-900">{emptyJeonseData.deposit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">선순위 채권 금액</p>
                    <p className="text-gray-900">{emptyJeonseData.seniorDebt}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">선순위 전세금액</p>
                    <p className="text-gray-900">{emptyJeonseData.seniorJeonse}</p>
                  </div>
                </div>
              </Card>

              {/* Analysis Details */}
              <Card className="p-4 sm:p-6 bg-white border-gray-200">
                <h3 className="mb-4 text-gray-900">상세 분석</h3>
                <div className="space-y-4">
                  {emptyJeonseResult.analysis.map((item: any, index: number) => (
                    <div key={index} className="flex items-start sm:items-center justify-between pb-3 border-b border-gray-200 last:border-0 gap-2">
                      <div className="flex items-start sm:items-center gap-3">
                        <CheckCircle className={`w-5 h-5 shrink-0 ${item.status === 'safe' ? 'text-green-500' : 'text-orange-500'}`} />
                        <div>
                          <p className="text-sm text-gray-900">{item.category}</p>
                          <p className="text-xs text-gray-600">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Safety Tip */}
              {emptyJeonseResult.safetyTip && (
                <Card className="p-4 sm:p-6 bg-white border-gray-200">
                  <h3 className="mb-4 text-gray-900">안전 팁</h3>
                  <p className="text-sm text-gray-600">{emptyJeonseResult.safetyTip}</p>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEmptyJeonseCheck(false);
                    setEmptyJeonseData({
                      salePrice: '',
                      deposit: '',
                      seniorDebt: '',
                      seniorJeonse: ''
                    });
                    setEmptyJeonseResult(null);
                  }}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:flex-1"
                >
                  닫기
                </Button>
                <Button
                  onClick={() => toast.success('보고서가 다운로드되었습니다')}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white w-full sm:flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  보고서 다운로드
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}