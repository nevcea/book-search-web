'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from '../modules/BookRecommend.module.css';

const booksToSearch = [
  '신곡 : 천국편 (단테 알리기에리의 코메디아)',
  '12가지 인생의 법칙 조던 피터슨',
  '니체의 인생수업 프리드리히 니체',
  '생각을 바꾸는 생각들 비카스 샤',
  '데일 카네기 인간관계론 (무삭제 완역본) 데일 카네기',
];

const CACHE_KEY = 'developerBookCache';
const CACHE_EXPIRATION_MS = 1000 * 60 * 60;

const loadCache = () => {
  const raw = sessionStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_EXPIRATION_MS) {
      return data;
    }
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    sessionStorage.removeItem(CACHE_KEY);
  }
  return null;
};

const saveCache = (books) => {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: books,
      timestamp: Date.now(),
    })
  );
};

const fetchBooksFromAPI = async () => {
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

export default function DesignerBookRecommend() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const cachedBooks = loadCache();
      if (cachedBooks) {
        setBooks(cachedBooks);
        setLoading(false);
        return;
      }

      const freshBooks = await fetchBooksFromAPI();
      setBooks(freshBooks);
      saveCache(freshBooks);
      setLoading(false);
    };

    init();
  }, []);

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
          <p>{book.author}</p>
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
      <h1 className={styles.title}>개발자가 추천하는 책</h1>

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
}