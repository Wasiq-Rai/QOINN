'use client'
import React, { useEffect, ReactElement } from 'react';
import Image from 'next/image';
import infoCards from '@/actions/InfoCards';
import { LucideIcon } from 'lucide-react';

const InfoCardSection = () => {
    
  useEffect(() => {
    const carousel = document.getElementById('carousel') as HTMLElement;
    const scrollBar = document.getElementById('scroll-bar') as HTMLElement;

    const updateScrollBar = () => {
      if (carousel && scrollBar) {
        const scrollPercentage = (carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth)) * 100;
        scrollBar.style.width = `${scrollPercentage}%`;
      }
    };

    if (carousel) {
      carousel.addEventListener('scroll', updateScrollBar);

      const interval = setInterval(() => {
        carousel.scrollBy({
          left: carousel.offsetWidth / 3, // Scroll by one card width
          behavior: 'smooth'
        });

        // If carousel is at the end, scroll back to start
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth) {
          setTimeout(() => {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
          }, 500); // Adjust delay as needed
        }
      }, 2000); // Adjust the interval as needed

      return () => {
        clearInterval(interval); // Clean up on unmount
        carousel.removeEventListener('scroll', updateScrollBar);
      };
    }
  }, []);

  return (
    <section id="about" className="text-white h-fit bg-black min-h-screen w-full flex relative items-center justify-center p-8">
      <div className='absolute h-full w-full overflow-hidden'>
        <Image src="/img/bg/whirl.svg" fill className="absolute object-cover w-full overflow-visible sm:rotate-90" alt="Background Whirl" />
      </div>
      <div className="w-full z-1  h-full flex items-center justify-center flex-col gap-8 max-w-7xl">
        <h3 className='text-4xl z-10 md:text-5xl font-bold'>No More Time Wasted!</h3>
        <div id="carousel" className="carousel w-full flex gap-4 overflow-hidden snap-x snap-mandatory relative">
          {infoCards.map((infoCard) => (
            <InfoCard key={infoCard.id} Icon={infoCard.icon} title={infoCard.title}>
              <p className="text-sm sm:text-base text-center md:text-left">{infoCard.bodyText}</p>
            </InfoCard>
          ))}
        </div>
        <div className="w-full flex justify-center mt-4">
          <ScrollIndicator />
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
        <h3 className='text-lg font-bold sm:text-xl'>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="relative w-full max-w-xl h-2 bg-gray-300 rounded overflow-hidden">
      <div id="scroll-bar" className="absolute top-0 left-0 h-full bg-blue-700 transition-all duration-300 ease-in-out"></div>
    </div>
  );
}

export default InfoCardSection;
