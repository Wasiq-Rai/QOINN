
import { Layout } from '@/components/layout/layout'
import { HeroSection } from '@/components/dashboard/hero-section'
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary'
import { StockList } from '@/components/dashboard/stock-list'
import { AIInsights } from '@/components/dashboard/ai-insights'
import { Metadata } from 'next'
import { PerformanceChart } from '@/components/performance-chart'

export const metadata: Metadata = {
  title: 'QOINN Dashboard',
  description: 'View your portfolio performance and manage your investments.',
}

export default function DashboardPage() {

  return (
    <Layout>
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-yale-blue">Your Dashboard</h1>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-yale-blue">Performance Charts</h2>
            <PerformanceChart/>
          </div>
        <div className="space-y-8">
          <PortfolioSummary/>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-yale-blue">Top Stocks</h2>
            <StockList/>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-yale-blue">AI Insights</h2>
            <AIInsights/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

