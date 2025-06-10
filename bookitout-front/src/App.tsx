<<<<<<< HEAD
import React from 'react';
import './App.css';

function App() {
  return (
    <></>
  );
}

export default App;
=======
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 라우팅 관련 컴포넌트 임포트
import Home from './pages/Home';
import Login from './pages/Login'; // Login 컴포넌트 임포트
import Register from './pages/Register';
import './index.css'; // Tailwind CSS를 임포트

function App() {
  return (
    <BrowserRouter> {/* 앱 전체를 BrowserRouter로 감싸줍니다. */}
      <div className="min-h-screen">
        <Routes> {/* 여러 라우트를 정의하는 컨테이너 */}
          <Route path="/" element={<Login />} /> {/* 기본 경로(/)는 로그인 페이지 */}
          <Route path="/home" element={<Home />} /> {/* /home 경로는 홈 페이지 */}
          <Route path="/register" element={<Register />} />
          {/* 추가 페이지가 있다면 여기에 Route를 추가합니다. */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
>>>>>>> dev
