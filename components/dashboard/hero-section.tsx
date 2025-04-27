'use client'
import { useTheme } from '@/context/ThemeContext';
import Image from 'next/image';
import Typewriter from 'typewriter-effect';

const HeroSection = () => {
  const { theme } = useTheme();
  return (
    <section className="relative h-[70vh] overflow-hidden">
      {/* <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    <Image unoptimized  quality={100}width={0} height={0} src="/img/hero-bg.jpg" alt="QOINN" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-kigelia text-4xl md:text-6xl font-bold text-white bg-black p-1  mb-4">
            <Typewriter
              options={{
              strings: [theme.strings.welcomeMessage, theme.strings.welcomeMessage2],
                autoStart: true,
                loop: true,
              }}
            />
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;