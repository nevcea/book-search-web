'use client';

import BookRecommend from './BookRecommend';

const booksToSearch = [];

export default function PublisherBookRecommend() {
  return (
    <BookRecommend
      booksToSearch={booksToSearch}
      cacheKey="publisherBookCache"
      title="발표자가 추천하는 책"
    />
  );
}