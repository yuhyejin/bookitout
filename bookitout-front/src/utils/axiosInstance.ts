// src/utils/axiosInstance.ts
import axios from 'axios';

// const API_BASE_URL = 'http://13.124.211.28:8000';
// const API_BASE_URL = 'http://backend:8000';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API 요청:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers,
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('API 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API 응답:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('API 응답 에러:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        params: error.config?.params
      }
    });

    if (error.response) {
      // 401 Unauthorized 에러 처리 (토큰 만료 등)
      if (error.response.status === 401) {
        // 로컬 스토리지 클리어
        localStorage.clear();
        // 로그인 페이지로 리다이렉트
        window.location.href = '/';
      }
    }

    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;