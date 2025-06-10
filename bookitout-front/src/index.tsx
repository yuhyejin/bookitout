// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 전역 CSS (TailwindCSS) 임포트
import App from './App'; // App 컴포넌트 임포트
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App /> {/* App 컴포넌트를 렌더링합니다. */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export {};
