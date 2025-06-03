'use client';

import BookRecommend from './BookRecommend';

const booksToSearch = [
  '신곡 : 천국편 (단테 알리기에리의 코메디아)',
  '12가지 인생의 법칙 조던 피터슨',
  '니체의 인생수업 프리드리히 니체',
  '생각을 바꾸는 생각들 비카스 샤',
  '데일 카네기 인간관계론 (무삭제 완역본) 데일 카네기',
];

export default function DeveloperBookRecommend() {
  return (
    <BookRecommend
      booksToSearch={booksToSearch}
      cacheKey="developerBookCache"
      title="개발자가 추천하는 책"
    />
  );
}