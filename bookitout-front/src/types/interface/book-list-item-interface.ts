export default interface BookListItem {
    bookNumber: number;
    title: string;
    author: string;
    collLibrary: string;
    isBookLoan: string;
    isBookReservation: string;
    returnDate: string | null;
    bookImage: string | null;
}