'use client'
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import infoCards from '@/actions/InfoCards';
import { LucideIcon } from 'lucide-react';

const InfoCardSection = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);

  const startAutoScroll = () => {
    if (!carouselRef.current) return;
    
    intervalRef.current = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, offsetWidth, scrollWidth } = carouselRef.current;
        const maxScroll = scrollWidth - offsetWidth;
        
        if (scrollLeft >= maxScroll - 1) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({
            left: offsetWidth / 3,
            behavior: 'smooth'
          });
        }
      }
    }, 3000);
  };

  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    if (carouselRef.current) {
      setStartX(clientX);
      setStartScrollLeft(carouselRef.current.scrollLeft);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const walk = (clientX - startX) * 2;
    carouselRef.current.scrollLeft = startScrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    const scrollBar = scrollBarRef.current;

    const updateScrollBar = () => {
      if (carousel && scrollBar) {
        const scrollPercentage = (carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth)) * 100;
        scrollBar.style.width = `${scrollPercentage}%`;
      }
    };

    startAutoScroll();

    if (carousel) {
      carousel.addEventListener('scroll', updateScrollBar);
    }

    return () => {
      stopAutoScroll();
      if (carousel) {
        carousel.removeEventListener('scroll', updateScrollBar);
      }
    };
  }, []);

  return (
    <section id="about" className="text-white h-fit bg-black min-h-screen w-full flex relative items-center justify-center p-8">
      <div className='absolute h-full w-full overflow-hidden'>
        <Image src="/img/bg/whirl.svg" fill className="absolute object-cover w-full overflow-visible sm:rotate-90" alt="Background Whirl" />
      </div>
      <div className="w-full z-1 h-full flex items-center justify-center flex-col gap-8 max-w-7xl">
        <h3 className='font-kigelia text-4xl z-10 md:text-5xl font-bold'>No More Time Wasted!</h3>
        <div 
          ref={carouselRef}
          id="carousel"
          className="carousel w-full flex gap-4 overflow-hidden snap-x snap-mandatory relative cursor-grab"
          onMouseEnter={stopAutoScroll}
          onMouseLeave={startAutoScroll}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseMove={handleDragMove}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onTouchMove={handleDragMove}
          style={{ userSelect: isDragging ? 'none' : 'auto' }}
        >
          {infoCards.map((infoCard) => (
            <InfoCard key={infoCard.id} Icon={infoCard.icon} title={infoCard.title}>
              <p className="font-kigelia text-sm sm:text-base text-center">{infoCard.bodyText}</p>
            </InfoCard>
          ))}
        </div>
        <div className="w-full flex justify-center mt-4">
          <ScrollIndicator scrollBarRef={scrollBarRef} />
        </div>
      </div>
    </section>
  );
}

interface IInfoCardProps {
  title: string;
  Icon: LucideIcon;
  children: ReactElement<any, any>;
}

function InfoCard({ title, Icon, children }: IInfoCardProps) {
  return (
    <div className='snap-start w-full max-w-xs flex-shrink-0 h-80 rounded flex flex-col justify-around items-center p-8 bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20'>
      <div className="p-4 bg-blue-700 rounded-full">
        <Icon className="text-white" />
      </div>
      <div>
        <h3 className='font-kigelia text-xl font-bold sm:text-xl'>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ScrollIndicator({ scrollBarRef }: { scrollBarRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="relative w-full max-w-xl h-2 bg-gray-300 rounded overflow-hidden">
      <div ref={scrollBarRef} className="absolute top-0 left-0 h-full bg-blue-700 transition-all duration-300 ease-in-out"></div>
    </div>
  );
}

export default InfoCardSection;
