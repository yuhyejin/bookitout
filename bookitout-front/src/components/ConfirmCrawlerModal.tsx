import React from 'react';

interface ConfirmCrawlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  libraryName: string;
}

const ConfirmCrawlerModal: React.FC<ConfirmCrawlerModalProps> = ({ isOpen, onClose, onConfirm, libraryName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">크롤러 완료 확인</h2>
        <p className="mb-6"><strong>{libraryName}</strong> 도서관에 대한 크롤러 개발을 완료하셨습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCrawlerModal; 