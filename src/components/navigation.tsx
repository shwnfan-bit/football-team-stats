'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, BarChart3, Home, Calendar, Lock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { getAdminPassword, changePassword } from '@/lib/auth';

const navItems = [
  { href: '/', icon: Home, label: '首页' },
  { href: '/players', icon: Trophy, label: '球员' },
  { href: '/matches', icon: Calendar, label: '比赛' },
  { href: '/stats', icon: BarChart3, label: '统计' },
];

export function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, login, logout } = useAuth();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  const handleLogin = () => {
    setError('');
    const success = login(password);
    if (success) {
      setIsLoginDialogOpen(false);
      setPassword('');
    } else {
      setError('密码错误');
    }
  };

  const handleChangePassword = () => {
    setChangePasswordError('');
    
    if (newPassword !== confirmPassword) {
      setChangePasswordError('两次输入的密码不一致');
      return;
    }
    
    const result = changePassword(oldPassword, newPassword);
    if (result.success) {
      setIsChangePasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert(result.message);
    } else {
      setChangePasswordError(result.message);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 导航链接 */}
          <div className="flex items-center justify-around md:justify-center md:gap-8 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 text-sm transition-colors md:flex-row md:gap-2',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs md:text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* 登录/登出按钮 */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChangePasswordDialogOpen(true)}
                  className="text-sm"
                >
                  修改密码
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">登出</span>
                </Button>
              </>
            ) : (
              <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm">
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="hidden md:inline">登录</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>管理员登录</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="password">密码</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleLogin();
                          }
                        }}
                        placeholder="请输入管理员密码"
                      />
                    </div>
                    {error && (
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                    <Button onClick={handleLogin} className="w-full bg-red-700 hover:bg-red-800">
                      登录
                    </Button>
                    <p className="text-xs text-slate-500 text-center">
                      默认密码: admin123
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* 修改密码对话框 */}
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="old-password">旧密码</Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="请输入旧密码"
              />
            </div>
            <div>
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码（至少6个字符）"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入新密码"
              />
            </div>
            {changePasswordError && (
              <p className="text-sm text-red-600 dark:text-red-400">{changePasswordError}</p>
            )}
            <Button onClick={handleChangePassword} className="w-full bg-red-700 hover:bg-red-800">
              确认修改
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
