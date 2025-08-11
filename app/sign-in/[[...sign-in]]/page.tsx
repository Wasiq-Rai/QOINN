'use client'
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

const SignInPage = () => {
  return (
    <main className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-8">
      {/* Logo Section */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
        <Image
          src="/img/logo/logo-with-name.png"
          alt="QOINN Logo"
          width={220}
          height={220}
          className="w-40 sm:w-48 md:w-56 lg:w-72 h-auto"
        />

        <div className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-snug">
          <span>Sign In</span>
          <br />
          <span>to Your Qoinn Account</span>
        </div>

        <div className="my-4 sm:my-6 text-lg sm:text-xl font-semibold text-white max-w-sm">
          Enter your email and password to access your Qoinn account.
        </div>

        <h3 className="text-white text-base sm:text-lg">
          Don't have an account?{" "}
          <span className="font-bold underline">Sign up for free today!</span>
        </h3>
      </div>

      {/* Sign In Form */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg">
        <SignIn />
      </div>
    </main>
  );
};

export default SignInPage;
