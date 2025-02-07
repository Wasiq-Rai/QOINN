import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(slug as string)}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
        );
        const data = await response.json();
        setArticle(data.articles[0]);
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-96 w-full mb-4" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/4 mb-8" />
        <div className="space-y-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!article) return <div>Article not found</div>;

  return (
    <article className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <div className="flex items-center gap-4 mb-8 text-gray-600">
        <span className="font-medium">{article.source.name}</span>
        <time className="text-sm">
          {format(new Date(article.publishedAt), 'MMMM dd, yyyy HH:mm')}
        </time>
      </div>
      <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
        <Image
          src={article.urlToImage || '/placeholder-news.jpg'}
          alt={article.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="prose max-w-none">
        <p className="text-xl text-gray-700 mb-8">{article.description}</p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Read Full Article at {article.source.name}
        </a>
      </div>
    </article>
  );
}