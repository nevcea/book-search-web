'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../modules/NavigationBar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-center']}>
        <ul className={styles['navbar-menu']}>
          <li><Link href="/developer-book-recommend" className={styles['navbar-link']}>개발자의 책 추천</Link></li>
          <li><Link href="/designer-book-recommend" className={styles['navbar-link']}>디자이너의 책 추천</Link></li>
          <li><Link href="/publisher-book-recommend" className={styles['navbar-link']}>발표자의 책 추천</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;