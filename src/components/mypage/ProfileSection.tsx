import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit, Key, LogOut, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toast } from 'sonner';

interface ProfileSectionProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function ProfileSection({ isLoggedIn, onLogout }: ProfileSectionProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      // '사용자' 기능 통합 웹훅
      const userManagerWebhook = 'https://ajjoona.app.n8n.cloud/webhook/manage-users'; // TODO: 실제 통합 웹훅 URL로 교체
      try {
        const response = await fetch(userManagerWebhook); // 통합 웹훅 GET
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error('프로필 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        <p className="ml-2 text-gray-600">프로필 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <Card className="p-8 bg-white rounded-2xl shadow-md border-border text-center">
        <h2 className="text-xl font-semibold mb-4">로그인이 필요합니다</h2>
        <p className="text-muted-foreground">프로필 정보를 보려면 로그인해주세요.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground mb-2">내 프로필</h2>
        <p className="text-sm text-muted-foreground">회원 정보를 관리할 수 있습니다.</p>
      </div>

      <Card className="p-8 bg-white rounded-2xl shadow-md border-border">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
            <User className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center gap-3 justify-center text-foreground">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg font-semibold">{user.username}</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-foreground">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3 justify-center text-muted-foreground">
              <Calendar className="w-5 h-5" />
              <span>가입일: {new Date(user.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex-1">
                    <Button disabled className="w-full rounded-full bg-primary/50 text-primary-foreground cursor-not-allowed">
                      <Edit className="w-4 h-4 mr-2" /> 프로필 수정
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent><p>준비 중인 기능입니다</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex-1">
                    <Button disabled variant="outline" className="w-full rounded-full border-border text-muted-foreground cursor-not-allowed">
                      <Key className="w-4 h-4 mr-2" /> 비밀번호 변경
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent><p>준비 중인 기능입니다</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isLoggedIn && (
            <div className="w-full max-w-md pt-2 border-t border-border">
              <Button onClick={onLogout} variant="ghost" className="w-full rounded-full text-[#E65A5A] hover:text-[#E65A5A] hover:bg-[#E65A5A]/10">
                <LogOut className="w-4 h-4 mr-2" /> 로그아웃
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
