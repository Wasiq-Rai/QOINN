'use client'
import { SignUp } from "@clerk/nextjs";
import Typewriter from 'typewriter-effect';

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-flek text-4xl md:text-6xl font-bold text-white bg-black p-1  mb-4">
            <Typewriter
              options={{
                strings: ['Welcome to QOINN', 'Your AI-powered investment platform'],
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