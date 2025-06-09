import React from "react";

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl mx-4 lg:hidden">
    <div className="flex justify-around">
      <a href="#" className="flex flex-col items-center py-3 px-4 text-purple-600">
        <i className="fas fa-home text-lg mb-1"></i>
        <span className="text-xs">홈</span>
      </a>
      <a href="#" className="flex flex-col items-center py-3 px-4 text-gray-500">
        <i className="fas fa-search text-lg mb-1"></i>
        <span className="text-xs">검색</span>
      </a>
      <a href="#" className="flex flex-col items-center py-3 px-4 text-gray-500">
        <i className="fas fa-heart text-lg mb-1"></i>
        <span className="text-xs">즐겨찾기</span>
      </a>
      <a href="#" className="flex flex-col items-center py-3 px-4 text-gray-500">
        <i className="fas fa-user text-lg mb-1"></i>
        <span className="text-xs">마이페이지</span>
      </a>
    </div>
  </nav>
);

export default BottomNav;