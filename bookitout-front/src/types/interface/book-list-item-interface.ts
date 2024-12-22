export default interface BookListItem {
    bookNumber: number;
    title: string;
    author: string;
    collLibrary: string;
    isBookLoan: string;
    returnDate: string | null;
}