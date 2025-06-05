'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '../modules/BookRecommend.module.css';

const CACHE_EXPIRATION_MS = 1000 * 60 * 60;

const loadCache = (cacheKey) => {
  const raw = sessionStorage.getItem(cacheKey);
  if (!raw) return null;

  try {
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
      return data;
    }
    sessionStorage.removeItem(cacheKey);
  } catch {
    sessionStorage.removeItem(cacheKey);
  }
  return null;
};

const saveCache = (cacheKey, books) => {
  sessionStorage.setItem(
    cacheKey,
    JSON.stringify({
      data: books,
      timestamp: Date.now(),
    })
  );
};

const fetchBooksFromAPI = async (booksToSearch) => {
  const results = [];
  for (const query of booksToSearch) {
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) continue;

      const data = await res.json();
      if (data.items?.length > 0) results.push(data.items[0]);
    } catch (err) {
      console.error('API 에러:', err);
    }
  }
  return results;
};

const BookRecommend = ({ booksToSearch, cacheKey, title }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const cachedBooks = loadCache(cacheKey);
      if (cachedBooks) {
        setBooks(cachedBooks);
        setLoading(false);
        return;
      }

      const freshBooks = await fetchBooksFromAPI(booksToSearch);
      setBooks(freshBooks);
      saveCache(cacheKey, freshBooks);
      setLoading(false);
    };

    init();
  }, [booksToSearch, cacheKey]);

  const renderBookList = () => {
    if (loading) return <p>책 정보를 불러오는 중...</p>;
    if (!books.length) return <p>책 정보를 불러오지 못했습니다.</p>;

    return books.map((book, idx) => (
      <div
        key={`${book.title}-${book.author}-${idx}`}
        className={`${styles.bookItem} ${selectedBook?.title === book.title ? styles.active : ''}`}
        onClick={() => setSelectedBook(book)}
      >
        <Image
          src={book.image}
          alt={book.title}
          width={60}
          height={90}
          className={styles.thumbnail}
        />
        <div>
          <h3>
            <span className={styles.rank}>#{idx + 1}</span> {book.title}
          </h3>
          <p>{book.author ? book.author.replace(/\^/g, ', ') : '정보 없음'}</p>
        </div>
      </div>
    ));
  };

  const renderDetail = () => {
    if (!selectedBook) {
      return <p className={styles.selectPrompt}>책을 선택하면 상세정보가 여기에 표시됩니다.</p>;
    }

    return (
      <>
        <Image
          src={selectedBook.image}
          alt={selectedBook.title}
          width={150}
          height={220}
          className={styles.detailImage}
        />
        <h2>{selectedBook.title}</h2>
        <p><strong>저자:</strong> {selectedBook.author}</p>
        <p><strong>출판사:</strong> {selectedBook.publisher}</p>
        <p>{selectedBook.description}</p>
      </>
    );
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>

      <button
        className={styles.homeButton}
        onClick={() => router.push('/')}
        disabled={loading}
      >
        홈으로 돌아가기
      </button>

      <div className={styles.layout}>
        <div className={styles.list}>{renderBookList()}</div>
        <div className={styles.detail}>{renderDetail()}</div>
      </div>
    </div>
  );
};

export default BookRecommend;