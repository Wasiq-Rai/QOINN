"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { usePremium } from "@/context/PremiumContext";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { getEquityStocks } from "@/utils/api";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Stock {
  name: string;
  symbol: string;
  equity: number;
}

interface EquityStocks {
  statement_id: number;
  equity_percentage: string;
  stocks: Stock[];
}

const stripePromise = loadStripe(
  "pk_test_51P4DUoP5nyObn6wEnx2sGeloDWGwi4jkAdeksSbl635IE2qkPkMn0X1kwiRhmf2VHTFGoFOcZzR35lnCoFscETm100n6VgZvzW"
);

const SubscriptionForm = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { checkPremiumStatus } = usePremium();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubscriptionSuccess = () => {
    localStorage.setItem("isPremium", "true");
    checkPremiumStatus(); // Call the function from context to re-evaluate
  };
  const { isSignedIn, user, isLoaded } = useUser();
    const [chartData, setChartData] = useState<{
      series: number[];
      labels: string[];
      stocks: Stock[];
    } | null>(null);
  
    // Get colors from Tailwind palette
    const colors = [
      '#3B82F6', // blue-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#8B5CF6', // purple-500
      '#06B6D4', // cyan-500
      '#F97316', // orange-500
      '#EC4899', // pink-500
    ];


  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8000/api/create-subscription/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: user?.primaryEmailAddress?.toString(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage("Subscription successful! Customer ID: " + data.customer_id);
        handleSubscriptionSuccess();
      } else {
        setMessage("Subscription failed. Please try again.");
      }
    } catch (error) {
      setMessage("Error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await getEquityStocks();
          console.log(response)
          const data: EquityStocks =  response.data;
          
          const totalEquity = data.stocks.reduce((sum, stock) => sum + stock.equity, 0);
          const series = data.stocks.map(stock => (stock.equity / totalEquity) * 100);
          const labels = data.stocks.map(stock => stock.symbol);
  
          setChartData({
            series,
            labels,
            stocks: data.stocks
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    if (!chartData) return <div className="text-center py-8">Loading chart...</div>;
  

  const chartOptions: ApexOptions = {
      chart: {
        type: 'donut',
        toolbar: { show: true },
        animations: { enabled: true },
      },
      series: chartData.series,
      labels: chartData.labels,
      colors: colors,
      plotOptions: {
        pie: {
          donut: {
            size: '60%',
          }
        }
      },
      tooltip: {
        y: {
          formatter: (value: number, { seriesIndex }) => {
            const stock = chartData.stocks[seriesIndex];
            return `${stock.name}\n${value.toFixed(2)}%`;
          }
        }
      },
      responsive: [{
        breakpoint: 640,
        options: {
          chart: { width: '100%' },
          legend: { position: 'bottom' }
        }
      }]
    };
  

  return (
    <div className=" mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 max-h-[50%]">

        {/* Subscription Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Premium Membership
              </h2>
              <p className="text-gray-600">
                Unlock advanced analytics and premium features
              </p>
              <Chart
                options={chartOptions}
                series={chartData.series}
                type="donut"
                width="100%"
                height="200px"
              />
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-blue-600">$15.99</span>
                <span className="text-gray-600">/month</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {[
                  "✓ Full portfolio breakdowns",
                  "✓ Real-time investment scores",
                  "✓ Daily portfolio updates",
                  "✓ Advanced analytics",
                  "✓ Exclusive market insights"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-2">✅</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <form onSubmit={handleSubscribe} className="space-y-4">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all
                    ${loading 
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"}
                  `}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Start Premium Trial"}
                </button>
              </form>
            </div>

            {message && (
              <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-red-600">{message}</p>
              </div>
            )}

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            )}
          </div>
        </div>
      </div>
  );
};

export default SubscriptionForm;
