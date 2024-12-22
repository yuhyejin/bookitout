import React from 'react'
import './style.css';
import type { BookListItem } from 'types/interface';
import { useNavigate } from 'react-router-dom';

interface Props {
    bookListItem: BookListItem
}

//          component: Book List Item 컴포넌트          //
export default function BookItem({ bookListItem }: Props) {

    //          properties          //
    const { bookNumber, title, author} = bookListItem;
    const { collLibrary, returnDate, isBookLoan } = bookListItem;
    const { isBookReservation, bookImage } = bookListItem;

    // const navigator = useNavigate();

    //          event handler: 게시물 아이템 클릭 이벤트 처리 함수          //
    const onClickHandler = () => {
        // navigator(bookNumber);
    }

    //          render: Book List Item 컴포넌트 렌더링        //
    return (
        <div className='book-list-item' onClick={onClickHandler}>
            <div className='book-list-item-number'>{bookNumber}</div>
            <div className='book-list-item-image-box'>
                <div className='book-list-item-image' style={{ backgroundImage: `url(${bookImage})`}}></div>
            </div>
            <div className='book-list-item-main-box'>
                <div className='book-list-item-top'>
                    <div className='book-list-item-title'>{title}</div>
                </div>
                <div className='book-list-item-middle'>
                    <div className='book-list-item-text-box'>
                        <div className='book-list-item-text'>저자 :</div>
                        <div className='book-list-item-text-value'>{author}</div>
                    </div>
                    <div className='book-list-item-text-box'>
                        <div className='book-list-item-text'>소장처 :</div>
                        <div className='book-list-item-text-value'>{collLibrary}</div>
                    </div>
                    <div className='book-list-item-text-box'>
                        <div className='book-list-item-text'>반납예정일 :</div>
                        <div className='book-list-item-text-value'>{returnDate}</div>
                    </div>
                    <div className='book-list-item-text-box'>
                        <div className='book-list-item-text'>대출 가능 여부 :</div>
                        <div className='book-list-item-text-value'>{isBookLoan}</div>
                    </div>
                    <div className='book-list-item-text-box'>
                        <div className='book-list-item-text'>예약 가능 여부 :</div>
                        <div className='book-list-item-text-value'>{isBookReservation}</div>
                    </div>
                    <div>
                        <button className='book-list-item-goLoanBook' onClick={onClickHandler}>대출 하러 가기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
