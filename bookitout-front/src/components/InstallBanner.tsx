import React, { useState, useEffect } from 'react';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true); // PWA 설치 가능 시 배너 표시
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 이미 설치되었거나 설치할 수 없는 경우를 대비한 클린업
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // 프롬프트 실행
      (deferredPrompt as any).prompt();
      // 사용자의 선택을 기다립니다.
      (deferredPrompt as any).userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false); // 설치 후 배너 숨김
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="install-banner fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4">
      <div className="bg-white p-4 rounded-xl shadow-xl flex items-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
          <i className="fas fa-bookmark"></i>
        </div>
        <div className="mr-4">
          <p className="font-bold">BookItOut 앱 설치</p>
          <p className="text-sm text-gray-500">홈 화면에 추가하여 편리하게 이용하세요</p>
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-600 transition"
        >
          설치
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;