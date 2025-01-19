
import { Layout } from '@/components/layout/layout'
import  HeroSection from '@/components/dashboard/hero-section'
import { PortfolioSummary } from '@/components/dashboard/portfolio-summary'
import { StockList } from '@/components/dashboard/stock-list'
import { AIInsights } from '@/components/dashboard/ai-insights'
import { Metadata } from 'next'
import { PerformanceChart } from '@/components/dashboard/performance-chart'
import { StockTicker } from '@/components/stock-ticker'
import { Footer } from '@/components/footer'
import { Newsletter } from '@/components/newsletter'
import { TeamSection } from '@/components/team-section'
import { ContactForm } from '@/components/contact-form'
import { Testimonials } from '@/components/testimonials'
import { NewsSection } from '@/components/news-section'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'QOINN Dashboard',
  description: 'View your portfolio performance and manage your investments.',
}

export default function DashboardPage() {

  return (
    <Layout>
      <HeroSection />
      <StockTicker />
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
        {/* Current Investments Section */}
        <section id="investments" className="py-12 bg-secondary/10">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Current QOINN Investments</h2>
            <p className="text-center mb-8 text-muted-foreground">
              Subscribe to see the full list and detailed scores
            </p>
            <StockList />
          </div>
        </section>

        {/* Subscription Section */}
        <section id="subscribe" className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Subscribe to QOINN Insights</h2>
            <div className="max-w-sm mx-auto">
              <Card>
                <CardContent className="pt-6 bg-white/50 border-2">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold">$15.99/month</h3>
                    <ul className="text-left space-y-2">
                      <li>✓ Access to QOINN's current portfolio</li>
                      <li>✓ Real-time investment scores</li>
                      <li>✓ Daily portfolio updates</li>
                      <li>✓ Performance analytics</li>
                      <li>✓ Exclusive market insights</li>
                    </ul>
                    <Button className="w-full">Subscribe Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* News Section */}
        <NewsSection />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Contact Section */}
        <section className="py-12 bg-white" id="contact">
  <div className="container px-4 md:px-6">
    <div className="flex flex-wrap justify-center mb-8">
      <img src="/logo-name.png" alt="QOINN Logo" className=" h-20 md:h-32 mb-4 md:mb-0" />
    </div>
    <div className="flex flex-wrap justify-center mb-8 flex-col">
      <h2 className="text-3xl font-bold text-center md:text-left md:ml-4 mb-4 md:mb-0">Invest with QOINN</h2>
      <p className="text-lg text-gray-600 text-center md:text-left md:ml-4 mb-4 md:mb-0">Unlock your financial potential with QOINN's innovative investment solutions.</p>
      <Link href="/invest">
        <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-2 px-4 rounded transition duration-300 md:ml-4">Learn More</button>
      </Link>
    </div>
  </div>
</section>

        {/* Team Section */}
        <TeamSection />

        {/* Newsletter Section */}
        <Newsletter />
      <Footer />
      </div>
    </Layout>
  )
}

