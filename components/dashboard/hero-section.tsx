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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runCycle = () => {
      // Show text for 4 seconds
      setIsVisible(true);
      timeout = setTimeout(() => {
        // Start fade out (1 sec)
        setIsVisible(false);

        // After fade out, switch text
        timeout = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % strings.length);
          runCycle(); // start next cycle
        }, 1000); // fade duration
      }, 4000); // visible duration
    };

    runCycle();
    return () => clearTimeout(timeout);
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
            <div className="relative px-8 py-6 overflow-hidden">
              <div className="relative min-w-[1000px] min-h-[80px] md:min-w-[1000px] md:min-h-[100px] flex items-center justify-center">
                {strings.map((string, index) => (
                  <h1
                    key={index}
                    className={`absolute inset-0 flex items-center justify-center font-kigelia 
                      text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white 
                      text-center leading-tight transition-opacity duration-1000`}
                    style={{
                      opacity: index === currentIndex && isVisible ? 1 : 0,
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
    </section>
  );
};

export default HeroSection;
