import { useState } from 'react';
import { ArrowLeft, Shield, CreditCard, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AgentPageProps {
  onBack: () => void;
}

// Mock 금리 추이 데이터
const rateHistoryData = [
  { month: '1월', 버팀목: 1.8, 청년: 1.5, 일반: 4.2 },
  { month: '2월', 버팀목: 1.9, 청년: 1.6, 일반: 4.3 },
  { month: '3월', 버팀목: 2.0, 청년: 1.7, 일반: 4.4 },
  { month: '4월', 버팀목: 2.1, 청년: 1.8, 일반: 4.5 },
  { month: '5월', 버팀목: 2.3, 청년: 1.9, 일반: 4.5 },
  { month: '6월', 버팀목: 2.5, 청년: 2.0, 일반: 4.5 },
];

// Mock 현재 금리 데이터
const currentRates = [
  { name: '버팀목', rate: 2.5, change: 0.2, color: 'bg-blue-500' },
  { name: '청년', rate: 2.0, change: 0.1, color: 'bg-green-500' },
  { name: '일반', rate: 4.5, change: 0.0, color: 'bg-amber-500' },
];

export function AgentPage({ onBack }: AgentPageProps) {
  const [activeTab, setActiveTab] = useState('insurance');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-4xl">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-amber-700 hover:text-amber-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          메인으로
        </Button>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
            </div>
            <h1 className="text-amber-900">AI 맞춤 추천</h1>
          </div>
          <p className="text-sm text-amber-700">
            당신의 상황에 딱 맞는 전월세 정보와 팁을 추천해드립니다.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-amber-100 border border-amber-200">
            <TabsTrigger value="insurance" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              보증보험
            </TabsTrigger>
            <TabsTrigger value="loan" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              전세대출
            </TabsTrigger>
          </TabsList>

          {/* 보증보험 */}
          <TabsContent value="insurance" className="space-y-6">
            <Card className="p-4 sm:p-6 bg-white border-amber-100">
              <h3 className="mb-4 text-amber-900">전세보증보험이란?</h3>
              <p className="text-sm text-amber-700 mb-4 leading-relaxed">
                임대인이 전세금을 돌려주지 못할 경우, 보험사가 대신 보증금을 지급해주는 보험입니다. 
                전세사기를 예방하고 보증금을 안전하게 지키는 가장 확실한 방법입니다.
              </p>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 space-y-3">
                <h4 className="text-sm text-cyan-900">주요 특징</h4>
                <ul className="text-sm text-cyan-800 space-y-2 list-disc list-inside">
                  <li>보증금의 80~95% 보장 (상품별 차이)</li>
                  <li>보험료: 보증금의 0.128%~0.204% (연간)</li>
                  <li>가입 조건: 임대인 동의 필요</li>
                </ul>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-white border-amber-100">
              <h3 className="mb-4 text-amber-900">추천 보증보험 상품</h3>
              <div className="space-y-4">
                <div className="border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-amber-900">SGI서울보증 전세보증보험</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">추천</span>
                  </div>
                  <p className="text-sm text-amber-600 mb-3">
                    보증금의 95%까지 보장, 온라인 가입 가능
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 w-full sm:w-auto"
                      onClick={() => window.open('https://www.sgic.co.kr', '_blank')}
                    >
                      자세히 보기
                    </Button>
                  </div>
                </div>

                <div className="border border-amber-200 rounded-lg p-4">
                  <h4 className="text-amber-900 mb-2">HUG 주택도시보증공사</h4>
                  <p className="text-sm text-amber-600 mb-3">
                    공공기관 운영, 안정적인 보장
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 w-full sm:w-auto"
                      onClick={() => window.open('https://www.khug.or.kr', '_blank')}
                    >
                      자세히 보기
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* 전세대출 */}
          <TabsContent value="loan" className="space-y-6">
            {/* 금리 대시보드 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* 전세대출이란 */}
              <Card className="p-4 sm:p-6 bg-white border-amber-100">
                <h3 className="mb-4 text-amber-900">전세대출이란?</h3>
                <p className="text-sm text-amber-700 mb-4 leading-relaxed">
                  전세 보증금 마련이 어려운 경우, 은행에서 저금리로 전세 자금을 빌릴 수 있는 대출 상품입니다.
                  정부 지원 대출과 은행 자체 대출로 나뉘며, 조건에 따라 금리가 달라집니다.
                </p>
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm text-cyan-900">주요 특징</h4>
                  <ul className="text-sm text-cyan-800 space-y-2 list-disc list-inside">
                    <li>금리: 연 1.2%~4.5% (상품별 차이)</li>
                    <li>대출한도: 최대 3억원 (버팀목 기준)</li>
                    <li>대출기간: 2년 (연장 가능)</li>
                  </ul>
                </div>
              </Card>

              {/* 현재 금리 미니 대시보드 */}
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-cyan-900">현재 전세 금리</h3>
                  <span className="text-xs text-cyan-600">2024년 11월 기준</span>
                </div>
                
                <div className="space-y-3">
                  {currentRates.map((item, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-cyan-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                          <span className="text-sm text-amber-900">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-900">{item.rate}%</span>
                          {item.change !== 0 && (
                            <span className={`flex items-center text-xs ${item.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {item.change > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                              {Math.abs(item.change)}%
                            </span>
                          )}
                          {item.change === 0 && (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`${item.color} h-1.5 rounded-full transition-all`}
                          style={{ width: `${(item.rate / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-cyan-200">
                  <div className="text-xs text-cyan-700 space-y-1">
                    <p>• 정부지원 대출 금리 최저 수준 유지중</p>
                    <p>• 일반 대출은 시중 금리와 연동</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 금리 추이 그래프 */}
            <Card className="p-4 sm:p-6 bg-white border-amber-100">
              <h3 className="mb-4 text-amber-900">6개월 금리 추이</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={rateHistoryData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#78716c"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#78716c"
                    style={{ fontSize: '12px' }}
                    domain={[0, 5]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #fbbf24',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="버팀목" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="청년" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="일반" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-amber-600 mt-3 text-center">
                * Mock 데이터 기반 시각화입니다. 실제 금리는 금융기관에 문의하세요.
              </p>
            </Card>

            <Card className="p-4 sm:p-6 bg-white border-amber-100">
              <h3 className="mb-4 text-amber-900">추천 전세대출 상품</h3>
              <div className="space-y-4">
                <div className="border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-amber-900">버팀목 전세자금대출</h4>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">저금리</span>
                  </div>
                  <p className="text-sm text-amber-600 mb-2">
                    정부 지원, 연 1.2%~2.7% 저금리
                  </p>
                  <p className="text-xs text-amber-500 mb-3">
                    조건: 무주택 세대주, 연소득 5천만원 이하
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 w-full sm:w-auto"
                      onClick={() => window.open('https://nhuf.molit.go.kr', '_blank')}
                    >
                      자세히 보기
                    </Button>
                  </div>
                </div>

                <div className="border border-amber-200 rounded-lg p-4">
                  <h4 className="text-amber-900 mb-2">청년 전세대출</h4>
                  <p className="text-sm text-amber-600 mb-2">
                    만 19~34세 청년 대상, 연 1.2%~2.1%
                  </p>
                  <p className="text-xs text-amber-500 mb-3">
                    조건: 무주택 청년, 연소득 5천만원 이하
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 w-full sm:w-auto"
                      onClick={() => window.open('https://nhuf.molit.go.kr', '_blank')}
                    >
                      자세히 보기
                    </Button>
                  </div>
                </div>

                <div className="border border-amber-200 rounded-lg p-4">
                  <h4 className="text-amber-900 mb-2">일반 전세대출</h4>
                  <p className="text-sm text-amber-600 mb-2">
                    소득 제한 없음, 연 3.5%~4.5%
                  </p>
                  <p className="text-xs text-amber-500 mb-3">
                    조건: 담보 평가 후 승인
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-cyan-300 text-cyan-700 hover:bg-cyan-50 w-full sm:w-auto"
                    >
                      은행 상담 필요
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}