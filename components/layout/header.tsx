"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function Header() {
  const { isSignedIn, user } = useUser();
  const { isAdmin } = useAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#c2d6df]">
      <div className="flex h-16 items-center justify-between pl-2 pr-6">
        {/* Logo */}
        <Link className="flex items-center space-x-2" href="/">
          <Image
            src="/img/logo/logo.png"
            alt="QOINN Logo"
            width={65}
            height={70}
            className="p-[10px]"
          />
          <Image
            src="/img/logo/logo-name.png"
            className="translate-y-[3px] translate-x-[-6px]"
            alt="QOINN Logo"
            width={150}
            height={150}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-[19px] font-medium text-gray-700 dark:text-gray-300">
          <Link href="/#features" className="hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="/#performance" className="hover:text-blue-600 transition-colors">
            Performance
          </Link>
          <Link href="/invest" className="hover:text-blue-600 transition-colors">
            Investments
          </Link>
          <Link href="/#subscribe" className="hover:text-blue-600 transition-colors">
            Subscribe
          </Link>
          <Link href="/#team" className="hover:text-blue-600 transition-colors">
            Team
          </Link>
          {isAdmin && (
            <Link href="/admin" className="hover:text-blue-600 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/dashboard" />
            {isSignedIn && (
              <Link href="/UserProfile">
                <span>{user.fullName}</span>
              </Link>
            )}
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-gray-200"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#c2d6df] border-t">
          <nav className="flex flex-col space-y-4 p-4 text-[18px] font-medium text-gray-700 dark:text-gray-300">
            <Link href="/#features" onClick={() => setMenuOpen(false)}>
              Features
            </Link>
            <Link href="/#performance" onClick={() => setMenuOpen(false)}>
              Performance
            </Link>
            <Link href="/invest" onClick={() => setMenuOpen(false)}>
              Investments
            </Link>
            <Link href="/#subscribe" onClick={() => setMenuOpen(false)}>
              Subscribe
            </Link>
            <Link href="/#team" onClick={() => setMenuOpen(false)}>
              Team
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}

            {/* Auth Buttons - Mobile */}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/dashboard" />
              {isSignedIn && (
                <Link href="/UserProfile" onClick={() => setMenuOpen(false)}>
                  <span>{user.fullName}</span>
                </Link>
              )}
            </SignedIn>
          </nav>
        </div>
      )}
    </header>
  );
}
