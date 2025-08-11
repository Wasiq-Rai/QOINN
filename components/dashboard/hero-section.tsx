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
  const [fadeState, setFadeState] = useState("fade-in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("fade-out");
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length);
        setFadeState("fade-in");
      }, 1000); // fade-out duration
    }, 5000); // 4 seconds per string
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
        <div className="text-center">
          <div className="relative inline-block px-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden glass-effect">
            <h1
              className={`relative z-10 font-kigelia text-4xl md:text-6xl font-bold text-white transition-opacity duration-500 ${
                fadeState === "fade-in" ? "opacity-100" : "opacity-0"
              }`}
            >
              {strings[currentIndex]}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
