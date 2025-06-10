import React from "react";

type BookCardProps = {
  title: string;
  library: string;
  status: "대출불가" | "대출가능";
  author: string | null;
  publisher: string | null;
  shelfLoc: string | null;
  reservation: string;
  returnDate: string;
  interLibrary: string;
  isLargePrint?: boolean;
  canReserve: boolean;
  imageUrl: string | null;
};

const BookCard = ({
  title,
  library,
  status,
  author,
  publisher,
  shelfLoc,
  reservation,
  returnDate,
  interLibrary,
  isLargePrint,
  canReserve,
  imageUrl,
}: BookCardProps) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden flex p-5">
    {imageUrl && (
      <div className="w-40 h-48 flex-shrink-0 overflow-hidden rounded-md mr-4">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    )}

    <span className={`absolute top-5 right-5 text-xs px-2 py-1 rounded-full ${status === "대출불가" ? "bg-green-100 text-green-800" : "bg-green-100 text-green-800"}`}>
      {status}
    </span>

    <div className="flex-grow">
      <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
      {isLargePrint && (
        <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded inline-block mb-3">
          큰글자도서
        </div>
      )}
      
      <h4 className="font-medium mb-3 inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">{library}</h4>

      <div className="text-sm text-gray-600 mb-3 space-y-1">
        {author && <div><span className="font-bold">저자:</span> {author}</div>}
        {publisher && <div><span className="font-bold">출판사:</span> {publisher}</div>}
        {shelfLoc && <div><span className="font-bold">서가위치:</span> {shelfLoc}</div>}
        <div><span className="font-bold">상호대차:</span> {interLibrary || '정보미제공'}</div>
        <div><span className="font-bold">반납예정일:</span> {returnDate || '정보미제공'}</div>
        <div><span className="font-bold">예약:</span> {reservation || '정보미제공'}</div>
      </div>
    </div>
  </div>
);

export default BookCard;