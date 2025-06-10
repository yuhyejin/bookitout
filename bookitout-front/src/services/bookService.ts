// src/services/bookService.ts
import axiosInstance from '../utils/axiosInstance';

// 백엔드 응답 형식에 맞는 타입 정의
type BookSearchResponse = {
  title: string;
  loan: '대출가능' | '대출불가';
  author: string | null;
  publisher: string | null;
  shelf_loc: string | null;
  interlibrary: string;
  return_date: string;
  reservation: string;
  libraryName: string;
  image_url: string | null;
};

// 프론트엔드에서 사용할 DTO 타입
export type BookSearchDTO = {
  title: string;
  libraryName: string;
  status: '대출가능' | '대출불가';
  author: string | null;
  publisher: string | null;
  shelfLoc: string | null;
  interLibrary: string;
  returnDate: string;
  reservation: string;
  canReserve: boolean;
  isLargePrint: boolean;
  imageUrl: string | null;
};

// 응답 데이터를 프론트엔드 DTO 형식으로 변환하는 함수
const mapToBookSearchDTO = (response: BookSearchResponse): BookSearchDTO => {
  return {
    title: response.title,
    libraryName: response.libraryName,
    status: response.loan,
    author: response.author,
    publisher: response.publisher,
    shelfLoc: response.shelf_loc,
    interLibrary: response.interlibrary,
    returnDate: response.return_date,
    reservation: response.reservation,
    canReserve: response.reservation.includes('예약가능'),
    isLargePrint: response.title.includes('[큰글자도서]'),
    imageUrl: response.image_url
  };
};

export const searchBooks = async (title: string): Promise<BookSearchDTO[]> => {
  try {
    console.log('도서 검색 요청:', title);
    const response = await axiosInstance.get<BookSearchResponse[]>('/api/v1/book-search', {
      params: { title }
    });
    console.log('도서 검색 응답:', response.data);
    
    if (!response.data) {
      console.error('응답 데이터가 없습니다.');
      return [];
    }
    
    // 응답 데이터를 프론트엔드 DTO 형식으로 변환
    const mappedResults = response.data.map(mapToBookSearchDTO);
    console.log('변환된 검색 결과:', mappedResults);
    return mappedResults;
  } catch (error: any) {
    console.error('도서 검색 실패 상세:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw new Error(error.response?.data?.message || '도서 검색에 실패했습니다.');
  }
};