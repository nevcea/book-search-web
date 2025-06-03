import React from 'react';
import Image from 'next/image';
import styles from '../modules/BookList.module.css';

function BookList({ books, setSelectedBook }) {
  return (
    <div className={styles.bookList}>
      {books.map((book, idx) => (
        <div key={book.id || idx} className={styles.bookCard} onClick={() => setSelectedBook(book)}>
          <Image
            src={book.image}
            alt={book.title}
            width={120}
            height={180}
            className={styles.bookImage}
          />
          <p className={styles.bookTitle}>{book.title}</p>
        </div>
      ))}
    </div>
  );
}

export default BookList;