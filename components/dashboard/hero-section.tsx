"use client";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";
import Image from "next/image";

const HeroSection = () => {
  const { theme } = useTheme();
  const strings = [
    theme.strings.welcomeMessage,
    theme.strings.welcomeMessage2,
    theme.strings.welcomeMessage3,
    theme.strings.welcomeMessage4,
    theme.strings.welcomeMessage5,
    theme.strings.welcomeMessage6,
    theme.strings.welcomeMessage7,
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length);
        setIsTransitioning(false);
      }, 300); // Half the transition duration for crossfade effect
    }, 4000); // 4 seconds per string

    return () => clearInterval(interval);
  }, [strings.length]);

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <Image
        unoptimized
        quality={100}
        width={0}
        height={0}
        src="/img/hero-bg.jpg"
        alt="QOINN"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="relative inline-block">
            {/* Fixed-size container with flexible width */}
            <div className="relative px-8 py-6 rounded-xlshadow-lg overflow-hidden ">
              {/* All text elements positioned absolutely for smooth transitions */}
              <div className="relative min-w-[1000px] min-h-[80px] md:min-w-[1000px] md:min-h-[100px] flex items-center justify-center">
                {strings.map((string, index) => (
                  <h1
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center font-kigelia text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-all duration-600 ease-in-out transform text-center leading-tight ${
                      index === currentIndex
                        ? isTransitioning
                          ? "opacity-0 translate-y-3 scale-95"
                          : "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-6 scale-90"
                    }`}
                    style={{
                      transitionDelay: index === currentIndex && !isTransitioning ? '2000ms' : '0ms'
                    }}
                  >
                    {string}
                  </h1>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-effect {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        /* Custom scrollbar for better UX if content overflows */
        .glass-effect::-webkit-scrollbar {
          display: none;
        }
        
        /* Ensure smooth font rendering */
        .font-kigelia {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Add subtle animation to the glass container itself */
        .glass-effect {
          animation: subtle-pulse 8s ease-in-out infinite;
        }
        
        @keyframes subtle-pulse {
          0%, 100% { 
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
          }
          50% { 
            box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5);
          }
        }
        
        @media (max-width: 640px) {
          .font-kigelia {
            word-break: break-word;
            hyphens: auto;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;