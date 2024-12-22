import React from 'react';
import './App.css';
import BookItem from 'components/BookItem';
import { searchBookListMock } from 'mocks';

function App() {
  return (
    <>
      {searchBookListMock.map(bookListItem => <BookItem bookListItem={bookListItem} />)}
    </>
  );
}

export default App;
