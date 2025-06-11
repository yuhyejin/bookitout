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

  // 아이디 중복 확인 상태
  const [isIdAvailable, setIsIdAvailable] = useState<boolean | null>(null);
  const [idCheckMessage, setIdCheckMessage] = useState('');

  // 닉네임 중복 확인 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');

  // 유효성 검사 상태
  const [idValidationMessage, setIdValidationMessage] = useState('');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');

  // 아이디 유효성 검사
  const validateId = (id: string) => {
    if (id.length < 4 || id.length > 10) {
      setIdValidationMessage('아이디는 4~10자 사이여야 합니다.');
      return false;
    }
    setIdValidationMessage('');
    return true;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (pw: string) => {
    if (pw.length < 6) {
      setPasswordValidationMessage('비밀번호는 6자 이상이어야 합니다.');
      return false;
    }
    setPasswordValidationMessage('');
    return true;
  };

  // 아이디 중복 확인 함수
  const handleCheckId = async () => {
    if (userId.trim() === '') {
      setIdCheckMessage('아이디를 입력해주세요.');
      setIsIdAvailable(false);
      return;
    }
    if (!validateId(userId)) {
      return;
    }
    try {
      const response = await axiosInstance.get(`/api/v1/auth/check-id?userId=${userId}`);
      if (response.status === 200) {
        setIdCheckMessage('사용할 수 있는 아이디입니다.');
        setIsIdAvailable(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setIdCheckMessage('이미 존재하는 아이디입니다.');
        setIsIdAvailable(false);
      } else {
        setIdCheckMessage('아이디 중복 확인 중 오류가 발생했습니다.');
        setIsIdAvailable(false);
        console.error('아이디 중복 확인 실패:', error.response ? error.response.data : error.message);
      }
    }
  };

  // 닉네임 중복 확인 함수
  const handleCheckNickname = async () => {
    if (nickname.trim() === '') {
      setNicknameCheckMessage('닉네임을 입력해주세요.');
      setIsNicknameAvailable(false);
      return;
    }
    try {
      const response = await axiosInstance.get(`/api/v1/auth/check-nickname?nickname=${nickname}`);
      if (response.status === 200) {
        setNicknameCheckMessage('사용할 수 있는 닉네임입니다.');
        setIsNicknameAvailable(true);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setNicknameCheckMessage('이미 존재하는 닉네임입니다.');
        setIsNicknameAvailable(false);
      } else {
        setNicknameCheckMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
        setIsNicknameAvailable(false);
        console.error('닉네임 중복 확인 실패:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePersonalData) {
      alert('개인정보 수집 및 이용에 동의해야 합니다.');
      return;
    }
    if (!validateId(userId)) {
      alert('아이디 형식이 올바르지 않습니다.');
      return;
    }
    if (!validatePassword(password)) {
      alert('비밀번호 형식이 올바르지 않습니다.');
      return;
    }
    if (isIdAvailable === null || !isIdAvailable) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }
    if (isNicknameAvailable === null || !isNicknameAvailable) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }
    
    try {
      const response = await axiosInstance.post('/api/v1/auth/signup', {
        userId: userId,
        password: password,
        nickname: nickname,
      });
      console.log('회원가입 성공:', response.data);
      alert(response.data);
      navigate('/');
    } catch (error: any) {
      console.error('회원가입 실패:', error.response ? error.response.data : error.message);
      alert(error.response ? error.response.data.message || error.response.data : '회원가입 중 오류가 발생했습니다.');
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
            <div className="relative flex items-center">
              <label htmlFor="user-id" className="sr-only">아이디</label>
              <input
                id="user-id"
                name="userId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-20"
                placeholder="아이디 (4~10자)"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setIsIdAvailable(null);
                  setIdCheckMessage('');
                  validateId(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={handleCheckId}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-tr-md"
              >
                중복 확인
              </button>
            </div>
            {idValidationMessage && (
              <p className="mt-2 text-sm text-red-600">
                {idValidationMessage}
              </p>
            )}
            {idCheckMessage && (
              <p className={`mt-2 text-sm ${isIdAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {idCheckMessage}
              </p>
            )}
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호 (6자 이상)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
            </div>
            {passwordValidationMessage && (
              <p className="mt-2 text-sm text-red-600">
                {passwordValidationMessage}
              </p>
            )}
            <div className="relative flex items-center">
              <label htmlFor="nickname" className="sr-only">닉네임</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-20"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setIsNicknameAvailable(null);
                  setNicknameCheckMessage('');
                }}
              />
              <button
                type="button"
                onClick={handleCheckNickname}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-br-md"
              >
                중복 확인
              </button>
            </div>
            {nicknameCheckMessage && (
              <p className={`mt-2 text-sm ${isNicknameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {nicknameCheckMessage}
              </p>
            )}
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
              <button
                type="button"
                onClick={() => { setShowPrivacyModal(true); }}
                className="ml-1 text-purple-600 hover:text-purple-500 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                자세히 보기
              </button>
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
          <Link to="/" className="text-purple-600 hover:text-purple-800">
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>

      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
};

export default Register;