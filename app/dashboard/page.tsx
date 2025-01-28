import { Layout } from "@/components/layout/layout";
import HeroSection from "@/components/dashboard/hero-section";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { StockList } from "@/components/dashboard/stock-list";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { Metadata } from "next";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { StockTicker } from "@/components/stock-ticker";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { TeamSection } from "@/components/team-section";
import { ContactForm } from "@/components/contact-form";
import { Testimonials } from "@/components/testimonials";
import { NewsSection } from "@/components/news-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Faq from "../FAQs";
import InfoCardSection from "@/components/InfoCard";
import TradingViewWidget from "@/components/dashboard/Charts/TradingViewWidget";
import SiteMetricsDashboard from "../visitors/SiteMetricsDashboard";
import SubscriptionForm from "../subscription/subscription-form";
import { usePremium } from "@/context/PremiumContext";

export const metadata: Metadata = {
  title: "QOINN Dashboard",
  description: "View your portfolio performance and manage your investments.",
};

export default function DashboardPage() {
  return (
    <Layout>
      <HeroSection />
      <StockTicker />
      <div className="mx-auto">
        <div>
          <h1 className="mb-4 text-3xl text-center pt-2 font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            <span className="text-transparent text-3xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Performance Charts
            </span>
          </h1>

          <PerformanceChart />
        </div>
        <div className="space-y-8">
          {/* <PortfolioSummary /> */}
          <InfoCardSection />
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Top Stocks
            </h2>
            <StockList />
          </div>
          {/* <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              AI Insights
            </h2>
            <AIInsights />
          </div> */}
        </div>
        {/* Current Investments Section */}
        {/* <section id="investments" className="py-12 bg-secondary/10">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">
              Current QOINN Investments
            </h2>
            <p className="text-center mb-8 text-muted-foreground">
              Subscribe to see the full list and detailed scores
            </p>
            <StockList />
          </div>
        </section> */}

        {/* Subscription Section */}
        <section id="subscribe" className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-sm mx-auto">
              <Card>
                <CardContent className="pt-6 bg-white/50 border-2">
                  <div className="text-center space-y-4">
                    <div className="container mx-auto py-10 text-center">
                      <h1 className="text-3xl font-bold">
                        Welcome to Premium Stocks
                      </h1>
                      <SubscriptionForm />
                    </div>
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
              <img
                src="/logo-name.png"
                alt="QOINN Logo"
                className=" h-20 md:h-32 mb-4 md:mb-0"
              />
            </div>
            <div className="flex flex-wrap justify-center mb-8 flex-col">
              <h2 className="text-3xl font-bold text-center md:text-left md:ml-4 mb-4 md:mb-0">
                Invest with QOINN
              </h2>
              <p className="text-lg text-gray-600 text-center md:text-left md:ml-4 mb-4 md:mb-0">
                Unlock your financial potential with QOINN's innovative
                investment solutions.
              </p>
              <Link href="/invest">
                <button className="bg-[#3498db] hover:bg-[#2980b9] text-white font-bold py-2 px-4 rounded transition duration-300 md:ml-4">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <TeamSection />
        <SiteMetricsDashboard
          totalVisitors={5234}
          totalLogins={1876}
          totalInvestments={453}
        />
        <Faq />

        {/* Newsletter Section */}
        <Newsletter />
        <Footer />
      </div>
    </Layout>
  );
}
