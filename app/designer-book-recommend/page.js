'use client';

import BookRecommend from '../components/BookRecommend';

const booksToSearch = [
  '노인과 바다 어니스트 헤밍웨이',
  '해저 2만리 쥘 베른',
  '셜록 홈즈 코난 도일',
  '어린 왕자 생텍 쥐페리',
  '반지의 제왕 J.R.R 톨킨',
];

export default function DesignerBookRecommend() {
  return (
    <BookRecommend
      booksToSearch={booksToSearch}
      cacheKey="designerBookCache"
      title="디자이너가 추천하는 책"
    />
  );
}