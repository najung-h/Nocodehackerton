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
      what: '이 집이 실제로 얼마에 팔리는지(시세) 알아보는 거예요. 내가 낼 전세금이 집값에 비해 너무 비싼지 확인해서, 위험한 \'깡통전세\'를 피하려는 거예요.',
      why: '\'깡통전세\'는 집주인 빚이 너무 많거나 집값이 떨어져서, 나중에 내가 낸 전세금을 돌려받기 어려운 위험한 집을 말해요. 만약 집값(예: 3억)이랑 전세금(예: 2억 8천)이 별 차이 안 나면, 집이 경매로 넘어갔을 때 내 보증금을 다 못 받을 수도 있어요.',
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
      what: '내가 낸 전세금을 나중에 집주인 대신 보증 기관(HUG 등)이 꼭 돌려주겠다고 약속하는 \'보험\'에 가입할 수 있는지 미리 알아보는 거예요.',
      why: '만약 이 집에 \'보증보험\' 가입이 안 된다면, 그건 집주인 빚이 너무 많거나, 집에 다른 문제가 있을 가능성이 높다는 신호예요. 이런 집은 나중에 보증금을 돌려받기 더 위험할 수 있어요.',
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
      what: '이 집의 \'주민등록증\' 같은 서류를 떼어보는 거예요. 진짜 집주인이 맞는지, 이 집을 담보로 은행에서 돈을 얼마나 빌렸는지(근저당) 확인하는 거예요.',
      why: '이 서류를 보면 집의 법적인 상태를 정확히 알 수 있어요. 만약 집주인이 빚이 너무 많으면, 나중에 집이 경매로 넘어갔을 때 내 보증금을 떼일 수 있어요. 그래서 계약 전, 이사 직전 등 여러 번 확인해야 해요.',
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
      what: '이사(전입신고) + 계약서에 \'확정일자\'라는 도장을 받아서, \'내 보증금을 다른 빚쟁이들보다 먼저 돌려받을 수 있는 힘\'을 만드는 거예요.',
      why: '그냥 이사만(전입신고) 하면, 집이 경매에 넘어갔을 때 은행 빚보다 내 보증금을 늦게 받아요. 하지만 \'확정일자\' 도장이 있으면, 내 순서가 빨라져서 은행보다 먼저 내 보증금을 챙길 수 있게 돼요.',
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
      what: '지금 나랑 계약하는 사람이 이 집의 진짜 주인이 맞는지, 아니면 주인에게 허락을 받은 대리인이 맞는지 신분증과 서류로 확인하는 거예요.',
      why: '가짜 집주인(사기꾼)에게 속아서 계약하면, 내 소중한 보증금을 통째로 날릴 수 있어요. 사기를 막기 위한 가장 기본 단계예요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasOwnerCheck: true
    },
    {
      id: 'd2',
      title: '신탁등기 전세사기 예방하기',
      what: '이 집 주인이 집을 \'신탁회사\'라는 곳에 맡겨놨는지 확인하는 거예요.',
      why: '집이 신탁회사에 맡겨져(신탁등기) 있으면, 집의 진짜 주인은 \'신탁회사\'예요. 만약 원래 주인(집주인)이랑만 계약하고 신탁회사의 허락을 안 받으면, 그 계약은 가짜(무효)가 돼요. 그럼 나는 집에서 쫓겨나고 보증금도 못 받을 수 있어요.',
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
      what: '나에게 이 집을 소개해준 부동산 사장님이 나라에 정식으로 등록된 \'진짜\' 공인중개사인지 확인하는 거예요.',
      why: '자격증이 없는 가짜 중개인이랑 계약하다가 문제가 생기면, 아무런 보호나 보상을 받기 어려워요. 사고를 막기 위해 꼭 확인해야 해요.',
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
      what: '계약서에 적힌 집 주소, 주인이름, 보증금 액수, 이사 날짜 등이 내가 알고 있는 거랑 똑같은지 글자 하나하나 다 확인하는 거예요.',
      why: '전세계약은 아주 큰돈이 오가는 약속이에요. 계약서에 숫자 하나, 글자 하나만 잘못 적혀도 나중에 큰 문제(돈 문제, 법적 문제)가 생길 수 있어요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isImportant: true,
      hasRiskDiagnosis: true,
      links: [
        { label: '표준 임대차 계약서 양식', url: 'https://www.molit.go.kr' }
      ]
    },
    {
      id: 'd5',
      title: '특약사항 작성하기',
      what: '계약서의 \'특별 약속\' 칸에 집주인과 말로 정한 약속들(예: "집주인이 5월 10일까지 도배 새로 해준다", "이사 나갈 때 청소비 안 받는다")을 글로 적어두는 거예요.',
      why: '말로만 한 약속은 나중에 집주인이 "나 그런 말 한 적 없는데?" 하고 오리발 내밀면 증거가 없어서 불리해요. 계약서에 \'특약\'으로 적어 놔야 법적으로 힘이 생겨요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      guidelines: '수리 의무, 중개수수료 분담, 하자 보수 등을 명확히 기재한다.'
    },
    {
      id: 'd6',
      title: '선순위 임차보증금 / 근저당 허위 고지 예방하기',
      what: '(주로 원룸 건물 같은 \'다가구주택\'에서) 나보다 먼저 이 집에 이사 온 다른 사람들의 보증금이 총 얼마인지, 집주인 빚은 얼마인지 확인하는 거예요.',
      why: '만약 집이 경매로 넘어가면, 나보다 먼저 이사 온 \'선배\' 세입자들이 보증금을 먼저 받아 가요. 내 차례가 왔을 땐 돈이 안 남아있을 수도 있어요. 그래서 내 순서가 안전한지 미리 확인해야 해요.',
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
      what: '집주인 대신 나온 사람(대리인)이 정말 집주인에게 "네가 나 대신 계약해도 돼"라고 허락받았는지 \'위임장\'이라는 서류와 도장(인감)을 확인하는 거예요.',
      why: '집주인 허락도 안 받은 사람이랑 계약하면 그 계약은 가짜(무효)가 될 수 있어요. 집주인의 아내, 아들, 친구라고 해도 꼭 서류(위임장, 인감증명서)를 확인해야 안전해요.',
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
      what: '①그 집에 진짜 이사해서 살고, ②주민센터에 "저 이 집으로 이사 왔어요"라고 신고(전입신고)하는 거예요.',
      why: '이 두 가지를 해야 \'대항력\'이라는 힘이 생겨요. 이 힘이 있으면, 계약 기간 중에 집주인이 바뀌어도 "난 계약 기간 끝날 때까지 여기서 살 거예요!"라고 당당하게 말할 수 있어요. 새 주인이 나가라고 해도 안 나가도 돼요.',
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
      what: '이사 들어가기 전/후에 집에 흠집 난 곳(벽지, 바닥 등)이나 고장 난 건 없는지 사진을 찍어두고, 이사 업체랑 약속을 잘 정하고, 전기요금/가스비 등을 잘 정리하는 거예요.',
      why: '이사 들어오기 전에 미리 사진을 안 찍어두면, 나중에 이사 나갈 때 집주인이 "이거 네가 망가뜨렸지? 돈 내놔"라고 할 때 억울할 수 있어요. 또, 이사 업체나 공과금 문제를 미리 정리해야 나중에 돈 문제로 싸우지 않아요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      hasCalendar: true,
      guidelines: '수도, 전기, 가스, 난방 등 시설물이 정상 작동하는지 확인한다.'
    },
    {
      id: 'a3',
      title: '계약 종료 후 이사 나가기',
      what: '계약 기간이 끝나기 전에(보통 2~6개월 전) 집주인에게 "저 이사 나갈 거예요"라고 미리 말하고, 이사 당일에 공과금(전기세 등)을 다 낸 뒤 보증금을 돌려받고 나가는 거예요.',
      why: '이사 가겠다고 미리 말 안 하면, 집주인은 "계속 살 건가 보네?" 하고 계약이 자동으로 2년 더 연장(묵시적 갱신)될 수 있어요. 또, 보증금을 돌려받기 전에 짐을 빼거나 전입신고를 옮기면 안 돼요.',
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
      what: '이사 안 가고 이 집에 2년 더 살기로 정하는 거예요. 가만히 있으면 자동 연장(묵시적 갱신)되거나, 내가 "2년 더 살게요!"라고 요구(계약갱신청구권)할 수 있어요.',
      why: '세입자는 한 번(1회)은 집주인에게 "저 2년 더 살게요"라고 요구할 권리(계약갱신청구권)가 있어요. 이 권리를 쓰면, 집주인이 전세금을 올려도 5%까지만 올릴 수 있어서 좋아요.',
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
      what: '내가 이사(전입신고)하고 다음 날 0시가 되기 전 \'딱 하루\' 동안, 집주인이 몰래 은행 빚을 만들거나 집을 팔아버리는지 감시하는 거예요.',
      why: '내가 전입신고를 해도 \'진짜 힘(대항력)\'은 다음 날 0시부터 생겨요. 그 사이에 집주인이 나쁜 맘먹고 빚을 만들면, 내 보증금이 은행 빚보다 뒷순서로 밀려날 수 있어요. 이사 당일에도 서류(등기부등본)를 꼭 다시 확인해야 해요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      guidelines: '6개월마다 등기부등본을 다시 발급받아 확인하는 것을 권장한다.'
    },
    {
      id: 'a6',
      title: '미납국세·임금채권·전출신고 위험 관리',
      what: '집주인이 세금(국세)을 안 냈거나, 직원들 월급을 밀렸는지 확인하고, 내가 보증금을 돌려받기 전에 다른 곳으로 이사(전출신고)하지 않도록 조심하는 거예요.',
      why: '집주인이 안 낸 세금이나 밀린 월급은, 집이 경매에 넘어가면 내 보증금보다 먼저 떼어 가요. 또, 내가 보증금 받기도 전에 이사(전출신고) 가면, 스스로 "내 보증금 포기할게요"라고 하는 것과 같아서 절대 안 돼요.',
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
      what: '이사 나가는 날 집주인이 "지금 돈이 없네"라며 보증금을 안 돌려줄 때를 대비해서, 법적으로 내 돈을 받아낼 준비를 하는 거예요.',
      why: '집주인이 돈을 안 줄 때 가만히 있으면 안 돼요. \'내용증명\'을 보내거나, 법원에 \'임차권등기명령\'을 신청해서 "나는 아직 이 집에 대한 권리가 있다"는 걸 꼭 표시해 둬야 내 돈을 지킬 수 있어요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isOptional: true,
      guidelines: '보증금 반환이 지연되면 임대차보증금 반환보증보험이나 법적 절차를 고려한다.',
      links: [
        { label: '대한법률구조공단', url: 'https://www.klac.or.kr' }
      ]
    },
    {
      id: 'a8',
      title: '임대차 신고하기',
      what: '"저 이 집이랑 얼마에, 얼마 동안 살기로 계약했어요"라고 정부(주민센터, 온라인 등)에 신고하는 거예요. **핵심: 보증금 6천만원 초과 또는 월세 30만원 초과 등 일정 금액 이상의 계약일 경우 의무예요.** 신고 시 계약서 원본을 제출해야 하며, 신고를 완료하면 **확정일자**가 자동으로 부여됩니다. (확정일자를 따로 받지 않아도 돼요.)',
      why: '① **보증금 안전 확보 (확정일자 자동 부여):** 임대차 신고를 하면 **\'확정일자\'**가 자동으로 부여되어 **\'우선변제권\'**이 생겨요. 전입신고(대항력)와 함께 내 보증금을 다른 채권자보다 먼저 돌려받을 수 있는 법적 순위가 확보되는 거예요. ② **법적 의무 이행:** 신고 대상 계약(일정 금액 이상)인데 신고를 안 하면 법에 따라 과태료가 부과될 수 있어요.',
      isChecked: false,
      isCustom: false,
      hasTimeline: true,
      isImportant: true,
      guidelines: '보증금 6천만원 초과 또는 월세 30만원 초과 시 의무. 신고 시 확정일자 자동 부여.',
      links: [
        { label: '정부24 임대차 신고', url: 'https://www.gov.kr' }
      ]
    }
  ]
};

type ChecklistPhase = 'before' | 'during' | 'after';

interface ChecklistSectionProps {
  onChatbot?: () => void;
}

export function ChecklistSection({ onChatbot }: ChecklistSectionProps = {}) {
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
    
    // 더미 분석 결과 - 독소조항 포함
    setTimeout(() => {
      setReport({
        deposit: '10,000만원',
        monthlyRent: '50만원',
        riskScore: 45,
        toxicClauses: [
          { 
            clause: '제10조 3항: 임차인은 퇴거 시 도배, 장판, 싱크대 등 모든 시설물을 신품으로 교체 후 인도하여야 한다.',
            risk: 'high',
            reason: '통상적인 사용으로 인한 마모도 임차인이 전액 부담해야 하는 과도한 원상복구 조항입니다.'
          },
          { 
            clause: '제12조 2항: 계약 해지 시 보증금의 30%를 위약금으로 지불한다.',
            risk: 'high',
            reason: '법정 위약금 한도(10%)를 초과하는 과도한 위약금 조항으로 무효 가능성이 있습니다.'
          },
          { 
            clause: '특약 1조: 전입신고 및 확정일자는 임차인이 직접 처리하며, 이로 인한 불이익은 임대인이 책임지지 않는다.',
            risk: 'medium',
            reason: '임대인의 협조 의무를 회피하는 조항으로 주의가 필요합니다.'
          }
        ],
        risks: [
          { level: 'warning', text: '독소조항 3건 발견 - 계약 전 반드시 수정 요청 필요' },
          { level: 'warning', text: '특약사항 "수리비 전액 임차인 부담" 조항은 법적으로 무효일 수 있습니다' },
          { level: 'info', text: '확정일자 날인 확인 필요' },
        ],
        analysis: [
          { category: '보증금', value: '10,000만원', status: 'safe' },
          { category: '임대인 정보', value: '확인 완료', status: 'safe' },
          { category: '독소조항', value: '3건 발견 (위험)', status: 'warning' },
          { category: '특약 조항', value: '5건 중 2건 검토 필요', status: 'warning' },
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
            onChatbot={onChatbot}
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
            onChatbot={onChatbot}
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
        </TabsContent>

        <TabsContent value="after" className="space-y-6">
          <ProgressBar items={checklists.after.filter(item => !item.isOptional || showOptional.after)} phase="after" />
          <ChecklistList
            items={checklists.after.filter(item => !item.isOptional || showOptional.after)}
            phase="after"
            onToggleCheck={handleToggleCheck}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onChatbot={onChatbot}
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
        </TabsContent>
      </Tabs>

      {/* Risk Diagnosis Modal */}
      <Dialog open={showRiskDiagnosis} onOpenChange={setShowRiskDiagnosis}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex items-center gap-2">
              내 계약서 독소조항 판단해드릴게요!
              <span className="group relative">
                <AlertCircle className="w-4 h-4 text-cyan-600 cursor-help" />
                <span className="invisible group-hover:visible absolute left-0 top-6 w-64 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  독소조항: 임차인에게 일방적으로 불리한 조항 (예: 보증금 돌려줄 때 과도한 수리비 청구, 계약 해지 시 막대한 위약금, 세입자 권리 제한 등)
                </span>
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              계약서 PDF를 업로드하면 AI가 독소조항과 위험 요소를 자동으로 분석합니다.
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

              {/* Toxic Clauses */}
              {report.toxicClauses && report.toxicClauses.length > 0 && (
                <Card className="p-4 sm:p-6 bg-red-50 border-red-200">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h3 className="text-red-900">🚨 독소조항 발견!</h3>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    아래 조항들은 임차인에게 일방적으로 불리한 내용입니다. 계약 전 반드시 수정을 요청하세요.
                  </p>
                  <div className="space-y-4">
                    {report.toxicClauses.map((item: any, index: number) => (
                      <div key={index} className="p-4 bg-white rounded-lg border border-red-200">
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs shrink-0 ${
                            item.risk === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {item.risk === 'high' ? '높음' : '중간'}
                          </span>
                          <p className="text-sm text-gray-900 italic">"{item.clause}"</p>
                        </div>
                        <p className="text-xs text-red-600 ml-14">⚠️ {item.reason}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

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