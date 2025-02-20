import { Layout } from "@/components/layout/layout";
import HeroSection from "@/components/dashboard/hero-section";
import { StockList } from "@/components/dashboard/stock-list";
import { Metadata } from "next";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { StockTicker } from "@/components/stock-ticker";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { TeamSection } from "@/components/team-section";
import Link from "next/link";
import Faq from "../FAQs";
import InfoCardSection from "@/components/InfoCard";
import  { QoinnExplainer } from "../qoinn-detail/page";
import NewsSection from "../news/page";
import { SiteMetricsDashboard } from "../visitors/SiteMetricsDashboard";

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
            <span className="font-kigelia text-transparent text-3xl bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
              Performance Charts
            </span>
          </h1>

          <PerformanceChart />
        </div>
        <QoinnExplainer/>
        <div className="space-y-8">
          {/* <PortfolioSummary /> */}
          <InfoCardSection />
          <div>
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
        {/* News Section */}
        <NewsSection/>

        {/* Testimonials Section */}
        {/* <Testimonials /> */}

        {/* Contact Section */}
        <section className="py-12 bg-white" id="contact">
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap justify-center mb-8">
              <img
                src="/img/logo/logo-with-name.png"
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
        <SiteMetricsDashboard/>
        <Faq />

        {/* Newsletter Section */}
        <Newsletter />
        <Footer />
      </div>
    </Layout>
  );
}
