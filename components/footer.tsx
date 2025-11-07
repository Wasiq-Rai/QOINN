'use client';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link'

export function Footer() {
  const {theme } = useTheme();
  return (
    <footer className="text-primary-foreground bg-black p-2">
      <div className="container py-2">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center">{theme.strings.footerText || "© 2025 QOINN. All Rights Reserved."}
          </span>
        </div>
      </div>
    </footer>
  )
}

