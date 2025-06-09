import React from 'react';

const Pagination = () => {
  return (
    <div className="mt-10 flex justify-center">
      <nav className="flex items-center space-x-2">
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500 text-white font-medium">1</button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100">2</button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100">3</button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
          <i className="fas fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;