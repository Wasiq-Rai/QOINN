import { Header } from './header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-yale-white">
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

