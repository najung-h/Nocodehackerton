import { User, Mail, Calendar, Edit, Key } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

// 더미 데이터
const dummyUser = {
  username: '김둥지',
  email: 'doongji@example.com',
  created_at: '2025-01-01',
};

export function ProfileSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">내 프로필</h2>
        <p className="text-sm text-gray-600">회원 정보를 관리할 수 있습니다.</p>
      </div>

      <Card className="p-8 bg-white border-gray-200">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* 프로필 아이콘 */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center">
            <User className="w-12 h-12 text-cyan-600" />
          </div>

          {/* 사용자 정보 */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center gap-3 justify-center text-gray-900">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-lg">{dummyUser.username}</span>
            </div>

            <div className="flex items-center gap-3 justify-center text-gray-700">
              <Mail className="w-5 h-5 text-gray-500" />
              <span>{dummyUser.email}</span>
            </div>

            <div className="flex items-center gap-3 justify-center text-gray-600">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>가입일: {new Date(dummyUser.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
            <Button
              onClick={() => toast.info('프로필 수정 기능은 준비 중입니다')}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              프로필 수정
            </Button>
            <Button
              onClick={() => toast.info('비밀번호 변경 기능은 준비 중입니다')}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Key className="w-4 h-4 mr-2" />
              비밀번호 변경
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
