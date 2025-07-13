import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  // const response = await fetch(`http://localhost:8080/api/user/${userId}`);
  const response = await fetch(`https://web-production-9b972.up.railway.app/api/user/${userId}`);
  const data = await response.json();
  res.status(200).json(data);
}