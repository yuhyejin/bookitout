import axiosInstance from './axiosInstance';

// 사용자 역할 정보를 저장하는 함수
export const saveUserRole = (role: string) => {
  localStorage.setItem('userRole', role);
};

// 사용자 역할 정보를 가져오는 함수
export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

// 사용자가 관리자인지 확인하는 함수
export const isAdmin = (): boolean => {
  const role = getUserRole();
  return role === 'ROLE_ADMIN';
};

// 로그인 시 사용자 역할 정보를 가져오는 함수
export const fetchUserRole = async (): Promise<string | null> => {
  try {
    const response = await axiosInstance.get('/api/v1/auth/me');
    const role = response.data.role;
    saveUserRole(role);
    return role;
  } catch (error) {
    console.error('사용자 역할 정보 조회 실패:', error);
    return null;
  }
};

// 로그아웃 시 사용자 역할 정보를 삭제하는 함수
export const clearUserRole = () => {
  localStorage.removeItem('userRole');
}; 