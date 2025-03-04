'use client'
import { useEffect, useState } from 'react';
import { NewsCarousel } from '@/components/NewsCarousel';
import { getStockNews } from '@/utils/api';
import { News } from '@/utils/types';

export default function NewsSection() {
  const [articles, setArticles] = useState<News[]>([]);

  // Fetch data from your Django API
  useEffect(() => {
    const fetchNews = async () => {
      const news = await getStockNews();
      setArticles(news);
    }

    fetchNews();
  }, []);

  return (
    <section className="mx-auto max-w-[95rem] px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Market News & Analysis</h2>
      <NewsCarousel articles={articles} />
    </section>
  );
}