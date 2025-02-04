import { Header } from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#e4edf1]">
      <Header />
      <main>{children}</main>
    </div>
  );
}
