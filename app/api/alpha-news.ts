
  // /pages/api/alpha-news.ts
  export default async function handler(req: any, res: any) {
    const { tickers } = req.query;
    const ALPHA_API_KEY = process.env.ALPHA_VANTAGE_KEY;
    
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${tickers}&apikey=${ALPHA_API_KEY}`
      );
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch Alpha Vantage news' });
    }
  }