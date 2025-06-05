'use client';

import BookRecommend from '../components/BookRecommend';

const booksToSearch = [
  "나의 투쟁 아돌프 히틀러",
  "만화가가 말하는 만화가 나예리",
  "나니아 연대기 C. S. 루이스",
  "미래의 물리학 미치오 카쿠",
  "삼국지 설민석"
];

export default function PublisherBookRecommend() {
  return (
    <BookRecommend
      booksToSearch={booksToSearch}
      cacheKey="publisherBookCache"
      title="발표자가 추천하는 책"
    />
  );
}
