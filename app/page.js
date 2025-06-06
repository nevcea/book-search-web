'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';
import SearchBar from './components/SearchBar';
import Logo from './components/Logo';
import Navbar from './components/NavigationBar';

export default function Home() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&sort=sim`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        router.push(`/search-results?query=${encodeURIComponent(query)}&sort=sim`);
      } else {
        router.push(`/search-results?query=${encodeURIComponent(query)}&sort=sim&noResults=true`);
      }
    } catch {
      router.push(`/search-results?query=${encodeURIComponent(query)}&sort=sim&error=true`);
    } finally {
      setLoading(false);
    }
  }, [query, router]);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 1000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="container">
      <Logo />
      <Navbar />

      <div className="content">
        <SearchBar query={query} setQuery={setQuery} handleSearch={handleSearch} />

        {loading && <p>검색 중...</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
