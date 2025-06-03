import React from 'react';
import styles from '../modules/SearchBar.module.css';

function SearchBar({ query, setQuery, handleSearch }) {
  return (
    <div className={styles.searchBarContainer}>
      <input
        placeholder="검색할 책의 제목"
        type="text"
        className={styles.input}
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
  );
}

export default SearchBar;