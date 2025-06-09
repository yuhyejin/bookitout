// src/components/AddLibraryModal.tsx
import React, { useState } from 'react';
import { addFavoriteLibrary, searchLibraries } from '../services/libraryService'; // searchLibraries도 임포트
import NotificationModal from './NotificationModal';

// 백엔드 Library 엔티티 구조에 맞춰 타입 정의
type Library = {
  libCode: string;
  libName: string;
  address: string;
  homepageUrl: string;
};

type AddLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // 즐겨찾기 추가 성공 시 호출될 콜백
};

const AddLibraryModal = ({ isOpen, onClose, onSuccess }: AddLibraryModalProps) => {
  const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
  const [searchResults, setSearchResults] = useState<Library[]>([]); // 검색 결과 상태
  const [loadingSearch, setLoadingSearch] = useState(false); // 검색 로딩 상태
  const [submittingFavorite, setSubmittingFavorite] = useState<string | null>(null); // 즐겨찾기 등록 로딩 상태
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'info' | 'warning';
  }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  if (!isOpen) return null;

  const handleSearchLibraries = async () => {
    if (!searchQuery.trim()) {
      setNotification({
        isOpen: true,
        message: '검색할 도서관 이름을 입력해주세요.',
        type: 'warning'
      });
      return;
    }
    setLoadingSearch(true);
    setSearchResults([]); // 새 검색 전에 결과 초기화
    try {
      // searchLibraries API 호출 (libName을 쿼리 파라미터로 보냄)
      const data: Library[] = await searchLibraries(searchQuery);
      setSearchResults(data);
      if (data.length === 0) {
        setNotification({
          isOpen: true,
          message: '검색 결과가 없습니다.',
          type: 'info'
        });
      }
    } catch (error: any) {
      setNotification({
        isOpen: true,
        message: error.response?.data?.message || '도서관 검색에 실패했습니다.',
        type: 'warning'
      });
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleAddFavorite = async (library: Library) => {
    setSubmittingFavorite(library.libCode);
    try {
      const response = await addFavoriteLibrary(library.libName, library.homepageUrl);
      if (response.existsInLibrary) {
        setNotification({
          isOpen: true,
          message: `${library.libName} 도서관 즐겨찾기 등록 완료!`,
          type: 'success'
        });
      } else {
        setNotification({
          isOpen: true,
          message: '해당 도서관은 현재 구현이 안되어있습니다. 관리자에게 요청하였으니 1-2일 정도 소요될 예정입니다.',
          type: 'info'
        });
      }
      setSearchQuery('');
      setSearchResults([]);
      onSuccess();
    } catch (error: any) {
      setNotification({
        isOpen: true,
        message: error.response?.data?.message || '도서관 즐겨찾기 등록에 실패했습니다.',
        type: 'warning'
      });
    } finally {
      setSubmittingFavorite(null);
    }
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
    onClose(); // 알림 모달이 닫힐 때 메인 모달도 닫기
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchLibraries();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg flex flex-col max-h-[90vh]"> {/* 높이 조정 */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">도서관 즐겨찾기 추가</h3>
            <button
              onClick={onClose}
              className="bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300 transition"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* 도서관 검색 입력 필드 및 버튼 */}
          <div className="relative mb-4 flex items-center">
            <input
              type="text"
              placeholder="도서관 이름 검색 (예: 중앙도서관)"
              className="w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loadingSearch}
            />
            <button
              onClick={handleSearchLibraries}
              className="absolute right-0 top-0 h-full px-3 py-1 bg-purple-500 text-white rounded-r-lg hover:bg-purple-600 transition"
              disabled={loadingSearch}
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* 검색 결과 표시 영역 */}
          <div className="flex-grow overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg p-2 min-h-[150px]"> {/* 최소 높이 설정 */}
            {loadingSearch ? (
              <div className="text-center text-gray-600 py-4">도서관 검색 중...</div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                {searchQuery.trim() ? '검색 결과가 없습니다.' : '도서관 이름을 검색해주세요.'}
              </div>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((lib) => (
                  <li
                    key={lib.libCode} // libCode를 key로 사용
                    onClick={() => handleAddFavorite(lib)} // 클릭 시 즐겨찾기 추가
                    className="p-3 bg-gray-50 hover:bg-purple-50 rounded-lg cursor-pointer transition flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-gray-800">{lib.libName}</div>
                      <div className="text-sm text-gray-600">{lib.address}</div>
                      {lib.homepageUrl && (
                        <a
                          href={lib.homepageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                          onClick={(e) => e.stopPropagation()} // 링크 클릭이 li 클릭 이벤트로 전파되지 않도록 방지
                        >
                          홈페이지 <i className="fas fa-external-link-alt"></i>
                        </a>
                      )}
                    </div>
                    {submittingFavorite === lib.libCode && (
                      <span className="text-purple-600 text-sm">추가 중...</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 하단 버튼 (이전 '추가하기' 버튼은 검색 결과 클릭으로 대체됨) */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={handleNotificationClose}
        message={notification.message}
        type={notification.type}
      />
    </>
  );
};

export default AddLibraryModal;