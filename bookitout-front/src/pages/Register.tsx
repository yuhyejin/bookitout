// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PrivacyPolicyModal from '../components/PrivacyPolicyModal';
import axiosInstance from '../utils/axiosInstance'; // axiosInstance 임포트

const Register = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [agreePersonalData, setAgreePersonalData] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePersonalData) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return;
    }
    
    try {
      const response = await axiosInstance.post('/api/v1/auth/signup', { // 백엔드 엔드포인트에 맞춤
        userId: userId,
        password: password,
        nickname: nickname,
      });
      console.log('회원가입 성공:', response.data);
      alert(response.data); // 성공 메시지 표시
      navigate('/'); // 성공 시 로그인 페이지로 이동
    } catch (error: any) {
      console.error('회원가입 실패:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message || error.response.data : '회원가입 중 오류가 발생했습니다.'); // 백엔드에서 보낸 오류 메시지 또는 기본 메시지
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center floating">
              <i className="fas fa-user-plus text-white text-3xl"></i>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            새 계정을 만들어 서비스를 이용하세요.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-id" className="sr-only">아이디</label>
              <input
                id="user-id"
                name="userId"
                type="text"
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
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="nickname" className="sr-only">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-personal-data"
              name="agree-personal-data"
              type="checkbox"
              required
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={agreePersonalData}
              onChange={(e) => setAgreePersonalData(e.target.checked)}
            />
            <label htmlFor="agree-personal-data" className="ml-2 block text-sm text-gray-900">
              <span className="font-bold">개인정보 수집 및 이용</span>에 동의합니다.
              <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }} className="ml-1 text-purple-600 hover:text-purple-500 underline">자세히 보기</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              회원가입
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          이미 계정이 있으신가요? <Link to="/" className="font-medium text-purple-600 hover:text-purple-500">로그인</Link>
        </div>
      </div>

      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
};

export default Register;