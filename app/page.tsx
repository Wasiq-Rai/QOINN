import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceChart } from "@/components/performance-chart"
import { ContactForm } from "@/components/contact-form"
import { TeamSection } from "@/components/team-section"
import { StockList } from "@/components/stock-list"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsSection } from "@/components/news-section"
import { Testimonials } from "@/components/testimonials"
import { StockTicker } from "@/components/stock-ticker"
import { Features } from "@/components/features"
import { Newsletter } from "@/components/newsletter"

export const metadata: Metadata = {
  title: 'QOINN - Quantitative Investment Model',
  description: 'QOINN is an innovative quantitative investment model delivering superior returns through advanced algorithms and data science.',
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Header />
      <StockTicker />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    Welcome to QOINN
                  </h1>
                  <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
                    Revolutionizing investing with AI-driven quantitative strategies. Outperform the market with QOINN.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="#contact">Start Investing</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#performance">View Performance</Link>
                  </Button>
                </div>
              </div>
              <Image
                alt="AI-powered Trading"
                className="aspect-[4/3] overflow-hidden rounded-xl object-cover object-center"
                height="400"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                width="600"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Performance Comparison Section */}
        <section id="performance" className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Performance</h2>
            <Tabs defaultValue="theoretical" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="theoretical">Theoretical Performance</TabsTrigger>
                <TabsTrigger value="real">Real Performance</TabsTrigger>
              </TabsList>
              <TabsContent value="theoretical">
                <Card>
                  <CardContent className="pt-6">
                    <PerformanceChart type="theoretical" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="real">
                <Card>
                  <CardContent className="pt-6">
                    <PerformanceChart type="real" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

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
                <CardContent className="pt-6">
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
        <section className="py-12 bg-secondary/10" id="contact">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Invest with QOINN</h2>
            <ContactForm />
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />

        {/* Newsletter Section */}
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}

