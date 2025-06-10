// src/components/Header.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import axiosInstance from '../utils/axiosInstance'; // axiosInstance 임포트

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 백엔드 로그아웃 엔드포인트 호출 (Refresh Token 무효화 등)
    try {
      await axiosInstance.post('/api/v1/auth/logout'); 
    } catch (error) {
      console.error('서버 로그아웃 실패 또는 이미 로그아웃 상태:', error);
    }

    // 토큰만 삭제하고 savedUserId는 유지
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    alert('로그아웃 되었습니다.');
    navigate('/'); // 로그인 페이지로 리다이렉트
  };

  return (
    <header className="flex justify-between items-center mb-10">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-3 floating">
          <i className="fas fa-book text-white text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">BookItOut</span>
          <span className="text-sm ml-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">(책잇아웃: 책을 찾고 확인한다)</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-white font-bold">
          HJ
        </div>
        {/* 로그아웃 버튼 추가 */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-medium hover:bg-red-200 transition"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;