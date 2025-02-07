// /pages/api/news.ts
export default async function handler(req: any, res: any) {
    console.log("Hellooooooooooooooo")
    const { tickers } = req.query;
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${tickers}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch news' });
    }
  }
  