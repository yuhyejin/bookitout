import React from 'react';

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'info' | 'warning';
};

const NotificationModal = ({ isOpen, onClose, message, type = 'info' }: NotificationModalProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle text-green-500"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-circle text-yellow-500"></i>;
      default:
        return <i className="fas fa-info-circle text-blue-500"></i>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-center mb-4">
          <div className="text-2xl mr-3">
            {getIcon()}
          </div>
          <h3 className="text-lg font-bold text-gray-800">알림</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 