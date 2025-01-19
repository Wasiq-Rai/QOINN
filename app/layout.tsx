import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}