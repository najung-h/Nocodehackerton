import { User, Mail, Calendar, Edit, Key, LogOut } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

// 더미 데이터
const dummyUser = {
  username: '김둥지',
  email: 'doongji@example.com',
  created_at: '2025-01-01',
};

interface ProfileSectionProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function ProfileSection({ isLoggedIn, onLogout }: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground mb-2">내 프로필</h2>
        <p className="text-sm text-muted-foreground">회원 정보를 관리할 수 있습니다.</p>
      </div>

      <Card className="p-8 bg-white rounded-2xl shadow-md border-border">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* 프로필 아이콘 */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>

          {/* 사용자 정보 */}
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center gap-3 justify-center text-foreground">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{dummyUser.username}</span>
            </div>

            <div className="flex items-center gap-3 justify-center text-foreground">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span>{dummyUser.email}</span>
            </div>

            <div className="flex items-center gap-3 justify-center text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span>가입일: {new Date(dummyUser.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex-1">
                    <Button
                      disabled
                      className="w-full rounded-full bg-primary/50 text-primary-foreground cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      프로필 수정
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>준비 중인 기능입니다</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex-1">
                    <Button
                      disabled
                      variant="outline"
                      className="w-full rounded-full border-border text-muted-foreground cursor-not-allowed"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      비밀번호 변경
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>준비 중인 기능입니다</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* 로그아웃 버튼 */}
          {isLoggedIn && (
            <div className="w-full max-w-md pt-2 border-t border-border">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full rounded-full text-[#E65A5A] hover:text-[#E65A5A] hover:bg-[#E65A5A]/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
