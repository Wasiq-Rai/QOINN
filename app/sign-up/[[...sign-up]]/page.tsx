'use client'
import { SignUp } from "@clerk/nextjs";;


const SignUpPage = () => {
  return (
    <main className="relative flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-8 overflow-hidden">
      {/* Text Section */}
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-snug">
          Create Your <br /> Qoinn Account
        </h1>
        <p className="my-4 sm:my-6 text-lg sm:text-xl font-semibold text-white">
          Join the Qoinn community and start trading smarter today.
        </p>

        <div className="space-y-3 text-white text-base sm:text-lg">
          <p>Sign up for free and discover a new way to trade</p>
          <p>Connect with online trading experts and stay ahead of the market</p>
          <p>Your Qoinn journey starts here</p>
          <p>Trade smarter, not harder, with Qoinn</p>
          <p>Don't miss out on opportunities. Register for Qoinn today</p>
        </div>
      </div>

      {/* Sign Up Form */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 shadow-lg">
        <SignUp />
      </div>
    </main>
  );
};

export default SignUpPage;
