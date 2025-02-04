import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const response = await fetch(`http://localhost:8000/api/user/${userId}`);
  const data = await response.json();
  res.status(200).json(data);
}