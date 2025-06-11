// src/services/libraryService.ts
import axiosInstance from '../utils/axiosInstance'; // JWT가 포함된 axios 인스턴스

// 도서관 검색 API
export const searchLibraries = async (libName: string) => {
    try {
      const response = await axiosInstance.get('/api/v1/libraries/search', {
        params: { libName }, // @RequestParam("libName")에 맞춰 params로 보냄
      });
      return response.data; // List<Library> 반환
    } catch (error) {
      console.error('도서관 검색 실패:', error);
      throw error;
    }
  };

// 도서관 즐겨찾기 조회 API
export const getFavoriteLibraries = async () => {
  try {
    const response = await axiosInstance.get('/api/v1/library-favorite/favorite');
    return response.data; // List<LibraryFavoriteResponseVO>
  } catch (error) {
    console.error('즐겨찾는 도서관 조회 실패:', error);
    throw error;
  }
};

// 도서관 즐겨찾기 등록 API
export const addFavoriteLibrary = async (libName: string, libUrl: string) => {
  try {
    const response = await axiosInstance.post<{
      message: string;
      existsInLibrary: boolean;
    }>('/api/v1/library-favorite/favorite', {
      libName,
      libUrl,
    });
    return response.data;
  } catch (error) {
    console.error('도서관 즐겨찾기 등록 실패:', error);
    throw error;
  }
};

// 도서관 즐겨찾기 삭제 API
export const deleteFavoriteLibrary = async (libId: number) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/library-favorite/favorite/${libId}`);
    return response.data;
  } catch (error) {
    console.error('도서관 즐겨찾기 삭제 실패:', error);
    throw error;
  }
};

// 도서관 동기화 API
export const syncLibraryData = async () => {
  try {
    const response = await axiosInstance.post('/api/v1/admin/library/sync');
    return response.data;
  } catch (error) {
    console.error('도서관 동기화 실패:', error);
    throw error;
  }
};