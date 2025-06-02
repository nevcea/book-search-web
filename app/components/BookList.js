import React from 'react';
import Image from 'next/image';
import styles from '../modules/BookList.module.css';

function BookList({ books, setSelectedBook }) {
  return (
    <div className={styles.bookList}>
      {books.map((book, idx) => (
        <div key={idx} className={styles.bookCard} onClick={() => setSelectedBook(book)}>
          <Image
            src={book.image}
            alt={book.title}
            width={120}
            height={180}
          />
          <p dangerouslySetInnerHTML={{ __html: book.title }} />
        </div>
      ))}
    </div>
  );
}

export default BookList;