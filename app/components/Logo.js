import React from 'react';
import styles from '../modules/Logo.module.css';
import Image from 'next/image';

function Logo() {
  return (
    <div className={styles.logo}>
      <Image
        src="/logo.png"
        alt="사이트 로고"
        width={160}
        height={60}
      />
    </div>
  );
}

export default Logo;