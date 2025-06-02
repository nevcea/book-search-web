import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../modules/Modal.module.css';

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
    <div className={`${styles.modalOverlay} ${closing ? styles.fadeOut : ''}`} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>x</button>
        <Image src={book.image} alt={book.title} width={150} height={220} />
        <h2 dangerouslySetInnerHTML={{ __html: book.title }} />
        <p><strong>저자: </strong>{book.author ? book.author.replace(/\^/g, ', ') : '정보 없음'}</p>
        <p><strong>출판사: </strong>{book.publisher}</p>
        <p><strong>ISBN: </strong>{book.isbn}</p>
        <p><strong>가격: </strong>{book.discount && !isNaN(book.discount) && book.discount !== 0 ? `${Number(book.discount).toLocaleString()}원` : '정보 없음'}</p>
        <p><strong>출판일: </strong>{formatPubdate(book.pubdate)}</p>
        <p><strong>설명: </strong><span dangerouslySetInnerHTML={{ __html: book.description }} /></p>
        <a href={book.link} target="_blank" rel="noopener noreferrer">책 상세보기</a>
      </div>
    </div>
  );
}

export default Modal;