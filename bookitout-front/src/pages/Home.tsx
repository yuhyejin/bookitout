// src/pages/Home.tsx
import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import LibraryList from '../components/LibraryList';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import InstallBanner from '../components/InstallBanner';
import AddLibraryModal from '../components/AddLibraryModal';
import { getFavoriteLibraries } from '../services/libraryService';
import { BookSearchDTO } from '../services/bookService';

const Home = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [favoriteLibraries, setFavoriteLibraries] = useState<Array<{ libId: number; libName: string; libUrl: string }>>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<string>('전체');
  const [searchResults, setSearchResults] = useState<BookSearchDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const libraryListRef = useRef<{ fetchFavoriteLibraries: () => void }>(null);
  
  // 즐겨찾기 도서관 목록 가져오기
  const fetchFavoriteLibraries = async () => {
    try {
      const data = await getFavoriteLibraries();
      setFavoriteLibraries(data);
    } catch (error) {
      console.error('즐겨찾기 도서관 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchFavoriteLibraries();
  }, []);

  const handleAddLibrarySuccess = () => {
    if (libraryListRef.current) {
      libraryListRef.current.fetchFavoriteLibraries();
    }
    fetchFavoriteLibraries();
  };

  const handleSearchResults = (results: BookSearchDTO[]) => {
    console.log('Home.tsx: handleSearchResults 호출됨 - 결과:', results);
    setSearchResults(results);
    setSearchError(null);
    setIsSearching(false);
    console.log('Home.tsx: isSearching을 false로 설정, searchResults 업데이트 완료.');
  };

  const handleSearchStart = () => {
    console.log('Home.tsx: handleSearchStart 호출됨.');
    setIsSearching(true);
    setSearchError(null);
    console.log('Home.tsx: isSearching을 true로 설정.');
  };

  const handleSearchError = (error: string) => {
    console.log('Home.tsx: handleSearchError 호출됨 - 에러:', error);
    setSearchError(error);
    setIsSearching(false);
    console.log('Home.tsx: 에러 발생으로 isSearching을 false로 설정.');
  };

  // 선택된 도서관에 따라 검색 결과 필터링
  const filteredResults = selectedLibrary === '전체'
    ? searchResults
    : searchResults.filter(book => book.libraryName === selectedLibrary);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Header />
      <main>
        <SearchBar 
          onSearchResults={handleSearchResults}
          onSearchStart={handleSearchStart}
          onSearchError={handleSearchError}
        />
        <LibraryList ref={libraryListRef} onAdd={() => setShowAddModal(true)} />

        <AddLibraryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddLibrarySuccess}
        />

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">검색 결과</h2>
            <div className="flex space-x-2 mb-3">
              <span className="text-sm font-medium text-gray-500 flex items-center">도서유형:</span>
              <button className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-600 font-medium">전체</button>
              <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">일반도서</button>
              <button className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">전자책</button>
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <span className="text-sm font-medium text-gray-500 flex items-center">도서관:</span>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${selectedLibrary === '전체' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'} font-medium`}
                onClick={() => setSelectedLibrary('전체')}
              >
                전체
              </button>
              {favoriteLibraries.map((lib) => (
                <button
                  key={lib.libId}
                  className={`px-3 py-1 text-sm rounded-full ${selectedLibrary === lib.libName ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'} font-medium`}
                  onClick={() => setSelectedLibrary(lib.libName)}
                >
                  {lib.libName}
                </button>
              ))}
            </div>
          </div>

          {searchError && (
            <div className="text-center text-red-600 mb-4">
              {searchError}
            </div>
          )}

          {isSearching ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500 mx-auto mb-4"></div>
              <div className="text-gray-600">검색 중...</div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResults.map((book, index) => (
                <BookCard
                  key={index}
                  title={book.title}
                  library={book.libraryName}
                  status={book.status}
                  author={book.author}
                  publisher={book.publisher}
                  shelfLoc={book.shelfLoc}
                  interLibrary={book.interLibrary}
                  returnDate={book.returnDate}
                  reservation={book.reservation}
                  canReserve={book.canReserve}
                  isLargePrint={book.isLargePrint}
                  imageUrl={book.imageUrl}
                />
              ))}
            </div>
          )}

          {searchResults.length > 0 && <Pagination />}
        </section>
      </main>
      <InstallBanner />
    </div>
  );
};

export default Home;