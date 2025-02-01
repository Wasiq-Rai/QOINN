'use client'
import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";

interface Star {
  x: number;
  y: number;
  z: number;
}

interface Line {
  x: number;
  y: number;
  z: number;
}

const Stars = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const stars: Star[] = [];
      for (let i = 0; i < 100; i++) {
        stars.push({
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          z: Math.random() * 200 - 100,
        });
      }
      setStars(stars);
    };

    const generateLines = () => {
      const lines: Line[] = [];
      for (let i = 0; i < 10; i++) {
        lines.push({
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          z: Math.random() * 200 - 100,
        });
      }
      setLines(lines);
    };

    generateStars();
    generateLines();
  }, []);

  const AnimatedStar = ({ position }: any) => {
    useFrame((state, delta) => {
      position.x += Math.sin(state.clock.elapsedTime) * 0.01;
      position.y += Math.cos(state.clock.elapsedTime) * 0.01;
      position.z += Math.sin(state.clock.elapsedTime) * 0.01;
    });

    return (
      <mesh position={position}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    );
  };

  const AnimatedLine = ({ position }: any) => {
    useFrame((state, delta) => {
      position.x += Math.sin(state.clock.elapsedTime) * 0.01;
      position.y += Math.cos(state.clock.elapsedTime) * 0.01;
      position.z += Math.sin(state.clock.elapsedTime) * 0.01;
    });

    return (
      <mesh position={position}>
        <cylinderGeometry args={[0.1, 0.1, 10, 32]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    );
  };

  return (
    <Canvas>
      {stars.map((star, index) => (
        <AnimatedStar key={index} position={[star.x, star.y, star.z]} />
      ))}
      {lines.map((line, index) => (
        <AnimatedLine key={index} position={[line.x, line.y, line.z]} />
      ))}
    </Canvas>
  );
};

const SignInPage = () => {
  return (
    <main className="flex items-center justify-evenly h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      {/* <Stars /> */}
      <Image
                    src="/img/logo/logo-with-name.png"
                    alt="QOINN Logo"
                    width={300}
                    height={300}
                  />
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-12">
        <div className="text-4xl font-bold text-white">
          <span>Sign In</span>
          <br />
          <span>to Your Qoinn Account</span>
        </div>
        <div className="my-8 text-xl font-semibold text-white">
          Enter your email and password to access your Qoinn account.
        </div>
        <div>
          <h3 className="my-5 text-white">
            Don't have an account? Sign up for free today!
          </h3>
        </div>
      </div>
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-12">
        <div className="rounded-lg p-6">
          <SignIn />
        </div>
      </div>
    </main>
  );
};

export default SignInPage;