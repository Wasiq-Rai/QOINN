import Link from "next/link";
import Image from "next/image"; // Import the Image component for the logo
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
<header className="sticky top-0 z-50 w-full border-b bg-[#3498db]/95 backdrop-blur-lg supports-[backdrop-filter]:bg-[#3498db]/80">      <div className="container flex h-16 items-center">
        {/* Logo and Navigation */}
        <div className="mr-4 flex items-center space-x-6">
          <Link className="flex items-center space-x-2" href="/">
            <Image
              src="/logo-name.png"
              alt="QOINN Logo"
              width={200}
              height={200}
              className="rounded-full"
            />
          </Link>
        </div>
        <div className="flex flex-2 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link
              href="/#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#performance"
              className="hover:text-blue-600 transition-colors"
            >
              Performance
            </Link>
            <Link
              href="/#investments"
              className="hover:text-blue-600 transition-colors"
            >
              Investments
            </Link>
            <Link
              href="/#subscribe"
              className="hover:text-blue-600 transition-colors"
            >
              Subscribe
            </Link>
            <Link
              href="/#team"
              className="hover:text-blue-600 transition-colors"
            >
              Team
            </Link>
          </nav>
        </div>

        {/* Login, Signup, and Mode Toggle */}
        <div className="flex flex-1 items-center justify-end space-x-4 pr-4">
          <nav className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </nav>
        </div>
      </div>
    </header>
  );
}
