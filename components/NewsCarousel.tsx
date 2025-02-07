'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronRight } from "lucide-react";
import { News } from '@/utils/types';

export function NewsCarousel({articles: news}:{articles: News[]}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news/carousel/');
        console.log(response)
        // setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  return (
    <div className="relative">
      <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
        {news.map((item, index) => (
          <div key={index} className="w-80 flex-shrink-0 group">
            <Link href={item.url} target="_blank">
              <Card className="h-full flex flex-col transition-transform hover:scale-[1.02]">
                <div className="relative h-48">
                  <Image
                    src={item.banner_image || '/stock-placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <Badge className="absolute top-2 left-2 bg-opacity-90">
                    {item.source}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-gray-500 justify-between">
                  <span>{item.time_published}</span>
                  <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardFooter>
              </Card>
            </Link>
          </div>
        ))}
        
        <div className="w-80 flex-shrink-0 flex items-center justify-center pr-6">
          <Link href="/news" className="w-full">
            <Card className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors">
              <CardContent className="flex flex-col items-center p-6">
                <Button variant="ghost" className="text-lg">
                  View All News
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 mt-2">
                  {news.length}+ market updates
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}