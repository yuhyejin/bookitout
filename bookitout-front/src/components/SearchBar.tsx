// src/components/SearchBar.tsx
import React, { useState } from "react";
import { searchBooks, BookSearchDTO } from '../services/bookService';

type SearchBarProps = {
  onSearchResults: (results: BookSearchDTO[]) => void;
  onSearchStart: () => void;
  onSearchError: (error: string) => void;
};

const SearchBar = ({ onSearchResults, onSearchStart, onSearchError }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      onSearchError('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    onSearchStart();

    try {
      console.log('검색 시작:', searchQuery);
      const results = await searchBooks(searchQuery);
      console.log('검색 결과:', results);
      
      if (results.length === 0) {
        onSearchError('검색 결과가 없습니다.');
      } else {
        onSearchResults(results);
      }
    } catch (error: any) {
      console.error('검색 에러 상세:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response
      });
      onSearchError(error.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="mb-12">
      <div className="relative">
        <input
          type="text"
          placeholder="책 제목으로 검색해보세요..."
          className="w-full py-4 px-6 rounded-full border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 pl-14"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
          <i className="fas fa-search"></i>
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-6 rounded-full text-sm font-medium hover:opacity-90 transition ${
            isSearching ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSearching ? '검색 중...' : '검색'}
        </button>
      </div>
    </section>
  );
};

export default SearchBar;