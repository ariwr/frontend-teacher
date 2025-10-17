'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: 실제 로그인 로직 구현
    console.log('Login attempt:', formData);
    
    // 임시 로딩 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-godding-bg-primary to-godding-bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 로고 섹션 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-godding-primary rounded-full mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">고</span>
          </div>
          <h1 className="text-3xl font-bold text-godding-text-primary mb-2">고딩픽</h1>
          <p className="text-godding-text-secondary text-sm">교사용</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-godding-card-border p-8">
          <h2 className="text-2xl font-semibold text-godding-text-primary text-center mb-8">로그인</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 아이디 입력 */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-godding-text-primary">
                아이디
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="h-12 text-base"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-godding-text-primary">
                비밀번호
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="h-12 text-base"
              />
            </div>

            {/* 로그인 버튼 */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          {/* 아이디/비밀번호 찾기 링크 */}
          <div className="mt-6 text-center">
            <Link 
              href="/find-account" 
              className="text-sm text-godding-text-secondary hover:text-godding-primary transition-colors"
            >
              아이디/비밀번호 찾기
            </Link>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="text-center mt-8 text-xs text-godding-text-secondary">
          <p>고교학점제 교사 관리 플랫폼</p>
        </div>
      </div>
    </div>
  );
}
