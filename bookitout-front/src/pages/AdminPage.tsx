import React, { useEffect, useState } from 'react';
import { getRequestedLibraries, updateLibraryCrawlerStatus } from '../apis/adminLibraryApi'; // API 임포트
import ConfirmCrawlerModal from '../components/ConfirmCrawlerModal'; // 모달 컴포넌트 임포트

interface LibraryRequest {
  libCode: string;
  libName: string;
  address: string;
  homepageUrl: string;
  hasCrawler: boolean;
}

const AdminPage: React.FC = () => {
  const [requestedLibraries, setRequestedLibraries] = useState<LibraryRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedLibrary, setSelectedLibrary] = useState<LibraryRequest | null>(null);

  const fetchLibraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequestedLibraries();
      setRequestedLibraries(data);
    } catch (err) {
      setError('도서관 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries();
  }, []);

  const handleMarkAsCompleted = (library: LibraryRequest) => {
    setSelectedLibrary(library);
    setIsModalOpen(true);
  };

  const handleConfirmCompletion = async () => {
    if (selectedLibrary) {
      try {
        await updateLibraryCrawlerStatus(selectedLibrary.libName, true);
        alert(`${selectedLibrary.libName} 도서관의 크롤러 상태가 완료로 업데이트되었습니다.`);
        setIsModalOpen(false);
        setSelectedLibrary(null);
        fetchLibraries(); // 목록 새로고침
      } catch (err: any) {
        alert(`도서관 ${selectedLibrary.libName}의 크롤러 상태 업데이트 실패: ${err.message}`);
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLibrary(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">크롤러 요청 도서관 관리</h2>
      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-500">에러: {error}</p>}
      {!loading && !error && requestedLibraries.length === 0 && (
        <p>크롤러 요청이 들어온 도서관이 없습니다.</p>
      )}
      {!loading && !error && requestedLibraries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requestedLibraries.map((lib) => (
            <div key={lib.libCode} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{lib.libName}</h3>
              <p className="text-gray-600">주소: {lib.address}</p>
              <p className="text-gray-600">홈페이지: <a href={lib.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{lib.homepageUrl}</a></p>
              <p className="text-gray-600">크롤러 유무: {lib.hasCrawler ? '있음' : '없음'}</p>
              <button
                onClick={() => handleMarkAsCompleted(lib)}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                크롤러 완료로 표시
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedLibrary && (
        <ConfirmCrawlerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmCompletion}
          libraryName={selectedLibrary.libName}
        />
      )}
    </div>
  );
};

export default AdminPage; 