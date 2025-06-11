// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import axiosInstance from '../utils/axiosInstance'; // axiosInstance 임포트
import { isAdmin, clearUserRole } from '../utils/authUtils'; // authUtils 임포트
import { syncLibraryData } from '../services/libraryService'; // libraryService 임포트

const Header = () => {
  const navigate = useNavigate();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 역할 확인
    setIsAdminUser(isAdmin());
  }, []);

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
    clearUserRole(); // 사용자 역할 정보 삭제
    
    alert('로그아웃 되었습니다.');
    navigate('/'); // 로그인 페이지로 리다이렉트
  };

  const handleSyncLibrary = async () => {
    if (isSyncing) return; // 이미 동기화 중이면 중복 요청 방지
    
    try {
      setIsSyncing(true);
      await syncLibraryData();
      alert('도서관 동기화가 완료되었습니다.');
    } catch (error: any) {
      console.error('도서관 동기화 실패:', error);
      alert(error.response?.data?.message || '도서관 동기화 중 오류가 발생했습니다.');
    } finally {
      setIsSyncing(false);
    }
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
        {isAdminUser && (
          <button
            onClick={handleSyncLibrary}
            disabled={isSyncing}
            className={`px-4 py-2 rounded-full ${
              isSyncing 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            } text-sm font-medium transition`}
          >
            {isSyncing ? '동기화 중...' : '도서관 동기화'}
          </button>
        )}
        {isAdminUser && (
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition"
          >
            관리자 페이지
          </button>
        )}
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