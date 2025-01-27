import { Header } from './header'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
<div className="min-h-screen bg-[#cee3fa]">
<Header />
      <main>
        {children}
      </main>
    </div>
  )
}

