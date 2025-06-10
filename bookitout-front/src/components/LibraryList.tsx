// src/components/LibraryList.tsx
import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react"; // 임포트 추가
import { getFavoriteLibraries, deleteFavoriteLibrary } from '../services/libraryService';

// 백엔드 응답 VO에 맞춰 타입 정의
type LibraryFavoriteResponseVO = {
  libId: number;
  libName: string;
  libUrl: string;
};

type LibraryListProps = {
  onAdd: () => void;
};

// Ref를 통해 노출할 함수 타입 정의
export type LibraryListHandle = {
  fetchFavoriteLibraries: () => void;
};

// forwardRef로 컴포넌트 감싸기
const LibraryList = forwardRef<LibraryListHandle, LibraryListProps>(({ onAdd }, ref) => {
  const [favoriteLibraries, setFavoriteLibraries] = useState<LibraryFavoriteResponseVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoriteLibraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFavoriteLibraries();
      setFavoriteLibraries(data);
    } catch (err: any) {
      setError(err.response?.data?.message || '즐겨찾는 도서관을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (libId: number) => {
    if (window.confirm('정말로 이 도서관을 즐겨찾기에서 삭제하시겠습니까?')) {
      try {
        await deleteFavoriteLibrary(libId);
        fetchFavoriteLibraries(); // 삭제 후 목록 새로고침
      } catch (err: any) {
        alert(err.response?.data?.message || '즐겨찾는 도서관 삭제에 실패했습니다.');
        console.error(err);
      }
    }
  };

  // 부모 컴포넌트(Home.tsx)에서 호출할 수 있는 함수들을 노출
  useImperativeHandle(ref, () => ({
    fetchFavoriteLibraries, // 이 함수를 외부에서 호출할 수 있게 됩니다.
  }));

  useEffect(() => {
    fetchFavoriteLibraries();
  }, []); // 컴포넌트 마운트 시 한 번만 호출

  if (loading) return <div className="text-center text-gray-600">도서관 목록을 불러오는 중...</div>;
  if (error) return <div className="text-center text-red-600">오류: {error}</div>;

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">나의 도서관</h2>
        <button onClick={onAdd} className="text-purple-600 text-sm font-medium flex items-center">
          <i className="fas fa-plus mr-1"></i> 추가하기
        </button>
      </div>

      {favoriteLibraries.length === 0 ? (
        <div className="text-center text-gray-500 py-4">즐겨찾는 도서관이 없습니다.</div>
      ) : (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {favoriteLibraries.map((lib) => (
            <div key={lib.libId} className="flex-shrink-0 flex items-center space-x-2 bg-purple-50 rounded-full px-4 py-2 cursor-pointer relative group">
              <span className="text-sm font-medium">{lib.libName}</span>
              <a href={lib.libUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-purple-600">
                <i className="fas fa-external-link-alt"></i>
              </a>
              <button
                onClick={() => handleDeleteFavorite(lib.libId)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label={`즐겨찾기에서 ${lib.libName} 삭제`}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

export default LibraryList;