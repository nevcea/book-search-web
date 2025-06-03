'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import BookList from '../components/BookList';
import Modal from '../components/Modal';
import styles from '../modules/SearchResults.module.css';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('sim');
  const [selectedBook, setSelectedBook] = useState(null);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const queryParam = searchParams.get('query');
    const sortParam = searchParams.get('sort') || 'sim';
    const noResultsParam = searchParams.get('noResults') === 'true';
    const errorParam = searchParams.get('error') === 'true';

    if (queryParam) {
      setQuery(queryParam);
      setSort(sortParam);
      setNoResults(noResultsParam);
      if (errorParam) {
        setError('검색 중 오류가 발생했습니다.');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!query || !sort || noResults) {
      setLoading(false);
      return;
    }

    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      setBooks([]);

      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&sort=${sort}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          setBooks(data.items);
        } else {
          setNoResults(true);
        }
      } catch (err) {
        setError('데이터를 가져오는 중에 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query, sort, noResults]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    router.push(`/search-results?query=${encodeURIComponent(query)}&sort=${newSort}`);
  };

  return (
    <div className="container">
      <h1>{'"'}{query}{'"'}에 대한 검색 결과</h1>

      <button 
        className={styles.homeButton} 
        onClick={() => router.push('/')}
      >
        홈으로 돌아가기
      </button>

      <select 
        value={sort} 
        onChange={(e) => handleSortChange(e.target.value)} 
        className={styles.select}
      >
        <option value="sim">정확도순</option>
        <option value="date">출간일순</option>
      </select>

      {error && <p>{error}</p>}
      {noResults && !loading && <p>검색 결과가 없습니다.</p>}

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <BookList books={books} setSelectedBook={setSelectedBook} />
      )}

      {selectedBook && <Modal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}