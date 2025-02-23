import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import { Inter } from "next/font/google"
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { PremiumProvider } from '@/context/PremiumContext'
import { EquityProvider } from '@/context/EquityContext'
import { AdminProvider } from '@/context/AdminContext'

export const metadata: Metadata = {
  title: 'Qoinn',
  description: 'Qoinn vs SPY/VOO',
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <ClerkProvider>
    <AdminProvider>
    <PremiumProvider>
    <EquityProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
    </EquityProvider>
    </PremiumProvider>
    </AdminProvider>
    </ClerkProvider>
  )
}