import { API_URL } from '@/utils/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  const response = await fetch(`${API_URL}/user/${userId}`);
  const data = await response.json();
  res.status(200).json(data);
}