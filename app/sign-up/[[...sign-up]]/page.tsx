'use client'
import { SignUp } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

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

const SignUpPage = () => {
  return (
    <main className="flex items-center justify-evenly h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <Stars />
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-12">
        <div className="text-4xl font-bold text-white">
          <span>Create Your</span>
          <br />
          <span>Qoinn Account</span>
        </div>
        <div className="my-8 text-xl font-semibold text-white">
          Join the Qoinn community and start trading smarter today.
        </div>
        <div>
          <h3 className="my-5 text-white">
            Sign up for free and discover a new way to trade
          </h3>
          <h3 className="my-5 text-white">
            Connect with online trading experts and stay ahead of the market
          </h3>
          <h3 className="my-5 text-white">Your Qoinn journey starts here</h3>
          <h3 className="my-5 text-white">Trade smarter, not harder, with Qoinn</h3>
          <h3 className="my-5 text-white">
            Don't miss out on opportunities. Register for Qoinn today
          </h3>
        </div>
      </div>
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-12">
        <div className=" rounded-lg  p-6">
          <SignUp />
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;