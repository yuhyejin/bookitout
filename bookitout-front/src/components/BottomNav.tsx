import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaBook, FaUser } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const BottomNav = () => {
  return (
    <IconContext.Provider value={{ size: '24px' }}>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center">
            <FaHome />
            <span className="text-xs mt-1">홈</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center">
            <FaSearch />
            <span className="text-xs mt-1">검색</span>
          </Link>
          <Link to="/library" className="flex flex-col items-center">
            <FaBook />
            <span className="text-xs mt-1">도서관</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center">
            <FaUser />
            <span className="text-xs mt-1">프로필</span>
          </Link>
        </div>
      </nav>
    </IconContext.Provider>
  );
};

export default BottomNav;