// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // axiosInstance 임포트
import { saveUserRole } from '../utils/authUtils'; // authUtils 임포트

const Login = () => {
  const [userId, setUserId] = useState(''); // email 대신 userId로 변경
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 저장된 로그인 정보 불러오기
  useEffect(() => {
    const savedUserId = localStorage.getItem('savedUserId');
    console.log('저장된 아이디:', savedUserId); // 디버깅용 로그
    if (savedUserId) {
      setUserId(savedUserId);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/v1/auth/login', { // 백엔드 엔드포인트에 맞춤
        userId: userId, // 백엔드 LoginRequestVO의 userId 필드에 맞춤
        password: password,
      });

      console.log('로그인 성공:', response.data);
      const { accessToken, refreshToken, role } = response.data; // 백엔드 TokenResponseVO에서 토큰과 역할 추출

      // 사용자 역할 정보 저장
      if (role) {
        saveUserRole(role);
      }

      // 로그인 정보 저장 체크박스가 체크되어 있으면 userId 저장
      if (rememberMe) {
        console.log('아이디 저장:', userId); // 디버깅용 로그
        localStorage.setItem('savedUserId', userId);
      } else {
        console.log('저장된 아이디 삭제'); // 디버깅용 로그
        localStorage.removeItem('savedUserId');
      }

      localStorage.setItem('accessToken', accessToken); // Access Token 저장
      localStorage.setItem('refreshToken', refreshToken); // Refresh Token 저장 (자동 재발급 로직을 위해)

      navigate('/home'); // 성공 시 홈으로 이동
    } catch (error: any) {
      console.error('로그인 실패:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message || error.response.data : '로그인 중 오류가 발생했습니다.'); // 백엔드에서 보낸 오류 메시지 또는 기본 메시지
    }
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    console.log('체크박스 상태 변경:', isChecked); // 디버깅용 로그
    setRememberMe(isChecked);
    
    // 체크박스 해제 시 저장된 아이디 삭제
    if (!isChecked) {
      localStorage.removeItem('savedUserId');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center floating">
              <i className="fas fa-book text-white text-3xl"></i>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            계정에 로그인하여 서비스를 이용하세요.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-id" className="sr-only">아이디</label>
              <input
                id="user-id"
                name="userId"
                type="text" // 이메일 대신 아이디로 변경
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="아이디"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                로그인 정보 저장
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => alert('비밀번호 찾기 기능은 아직 구현되지 않았습니다.')}
                className="font-medium text-purple-600 hover:text-purple-500 focus:outline-none"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              로그인
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          계정이 없으신가요? <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;