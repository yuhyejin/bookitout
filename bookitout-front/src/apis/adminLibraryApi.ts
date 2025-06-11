import axiosInstance from '../utils/axiosInstance';

interface Library {
  libCode: string;
  libName: string;
  address: string;
  homepageUrl: string;
  hasCrawler: boolean;
}

// 크롤러가 없는 도서관 목록을 가져오는 API
export const getRequestedLibraries = async (): Promise<Library[]> => {
  try {
    const response = await axiosInstance.get<Library[]>('/api/v1/admin/library/requestedLibraries');
    return response.data;
  } catch (error) {
    console.error('크롤러 요청 도서관 목록 조회 실패:', error);
    throw error;
  }
};

// 특정 도서관의 크롤러 상태를 업데이트하는 API
export const updateLibraryCrawlerStatus = async (libName: string, hasCrawler: boolean): Promise<string> => {
  try {
    const response = await axiosInstance.patch<string>(`/api/v1/admin/library/updateCrawlerStatus?libName=${libName}&hasCrawler=${hasCrawler}`);
    return response.data;
  } catch (error) {
    console.error(`도서관 ${libName}의 크롤러 상태 업데이트 실패:`, error);
    throw error;
  }
}; 