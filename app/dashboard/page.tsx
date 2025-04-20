import { Layout } from "@/components/layout/layout";
import HeroSection from "@/components/dashboard/hero-section";
import { StockList } from "@/components/dashboard/stock-list";
import { Metadata } from "next";
import PerformanceChart from "@/components/dashboard/performance-chart";
import { StockTicker } from "@/components/stock-ticker";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";
import { TeamSection } from "@/components/team-section";
import Faq from "../FAQs";
import InfoCardSection from "@/components/InfoCard";
import QoinnExplainer from "../qoinn-detail/page";
import NewsSection from "../news/page";
import { SiteMetricsDashboard } from "../visitors/SiteMetricsDashboard";
import Contact from "@/components/contact";

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
          <PerformanceChart />
        </div>
        <QoinnExplainer />
        <div className="space-y-8">
          {/* <PortfolioSummary /> */}
          <InfoCardSection />
          <div>
            <StockList />
          </div>
        </div>
        {/* News Section */}
        <NewsSection />
        {/* Contact Section */}
        <Contact />

        {/* Team Section */}
        <TeamSection />
        <SiteMetricsDashboard />
        <Faq />

        {/* Newsletter Section */}
        <Newsletter />
        <Footer />
      </div>
    </Layout>
  );
}
