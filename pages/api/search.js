export default async function handler(req, res) {
  const {query} = req.query;

  if (!query) {
    return res.status(400).json({error: '검색어가 필요합니다'});
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  const apiUrl = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&start=1&display=100&sort=sim`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: '네이버 API 호출 실패'});
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
}