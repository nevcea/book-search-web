'use client';

import { useCallback, useState, useEffect } from "react";
import Image from 'next/image';
import './globals.css';

function Modal({ book, onClose }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
  };

  useEffect(() => {
    if (closing) {
      const timer = setTimeout(() => {
        onClose();
        setClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [closing, onClose]);

  if (!book) return null;

  function formatPubdate(pubdate) {
    if (!pubdate || pubdate.length !== 8) return "정보 없음";

    const year = pubdate.substring(0, 4);
    const month = pubdate.substring(4, 6);
    const day = pubdate.substring(6, 8);

    return `${year}년 ${month}월 ${day}일`;
  }

  return (
    <div className={`modal-overlay ${closing ? 'fade-out' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>x</button>
        <Image src={book.image} alt={book.title} width={150} height={220}></Image>

        <h2 dangerouslySetInnerHTML={{ __html: book.title }}/>

        <p><strong>저자 : </strong> {book.author ? book.author.replace(/\^/g, ', ') : '정보 없음'}</p>
        <p><strong>출판사 : </strong> {book.publisher}</p>
        <p><strong>ISBN : </strong> {book.isbn}</p>
        <p><strong>가격 : </strong> 
          {book.discount && !isNaN(book.discount) && book.discount != 0
            ? `${Number(book.discount).toLocaleString()}원`
            : '정보 없음'}
        </p>
        <p><strong>출판일 : </strong> {formatPubdate(book.pubdate)}</p>
        <p><strong>설명 : </strong> <span dangerouslySetInnerHTML={{ __html: book.description }}/></p>
        <a href={book.link} target="_blank" rel="noopener noreferrer">책 상세보기</a>
      </div>
    </div>
  )
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("sim"); 

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      if (!query.trim()) {
        setError("검색어를 입력해주세요");
        setBooks([]);
        return;
      }
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&sort=${sort}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setBooks(data.items);
      } else {
        return;
      }
    } catch (error) {
      setError("검색 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [query, sort]);

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      return;  
    }

    handleSearch();
  }, [sort, handleSearch, query]);

  return (
    <div className="container">
      <div className="logo">
        <Image
          src="/logo.png"
          alt="사이트 로고"
          width={160}
          height={60}
        />
      </div>

      <input
        placeholder="검색할 책의 제목"
        type="text"
        className="input"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="select">
        <option value="sim">정확도순</option>
        <option value="date">출간일순</option>
      </select>
      <button onClick={handleSearch}>검색</button>

      {loading && <p>검색 중...</p>}
      {error && <p className="error">{error}</p>}

      {!query.trim() && books.length === 0 && !loading && !error && (<p className="info">검색어를 입력하세요</p>)}

      <div className="book-list">
        {books.map((book, idx) => (
          <div key={idx} className="book-card" onClick={() => setSelectedBook(book)}>
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

      {selectedBook && <Modal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}