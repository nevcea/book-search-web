'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import './globals.css';

function Modal({ book, onClose }) {
  const [closing, setClosing] = useState(false);

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

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("검색어를 입력해주세요")
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      console.log(data, data.items);
      if (data.items && data.items.length > 0) {
        setBooks(data.items);
      } else {
        setError("책을 찾을 수 없습니다.");
      }
    } catch (error) {
      setError("검색 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <input
        placeholder="검색할 책의 제목"
        type="text"
        name="text"
        className="input"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>

      {loading && <p>검색 중...</p>}
      {error && <p className="error">{error}</p>}

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