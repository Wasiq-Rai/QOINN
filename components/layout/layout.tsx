import { Header } from './header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4">
<Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

