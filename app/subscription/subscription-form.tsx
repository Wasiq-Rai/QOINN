"use client";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { usePremium } from "@/context/PremiumContext";
import { useUser } from "@clerk/nextjs";
import { API_URL, getEquityStocks } from "@/utils/api";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";

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
  "pk_test_51Rk9CqP23l5zX1ntol76cE9Pq9E3OxnbvbPm9Kqpolfa8XqG4UYHqHfC3MTCNGO6PyRbXi4NbVlMGOunwVX8XlUR00OwUfLcam"
);

const SubscriptionForm = () => {
  const { checkPremiumStatus } = usePremium();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { theme } = useTheme();
  const { isSignedIn, user, isLoaded } = useUser();
  const [chartData, setChartData] = useState<{
    series: number[];
    labels: string[];
    stocks: Stock[];
  } | null>(null);

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 🚫 If user not signed in, redirect to Clerk sign-in page
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);
    const email = user.primaryEmailAddress?.emailAddress || "";
    if (!email) {
      setMessage("Email is missing from your account.");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/create-subscription/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ email }), // 👈 Send email
        }
      );

      const data = await res.json();
      const stripe = await stripePromise;

      const result = await stripe?.redirectToCheckout({ sessionId: data.id });

      if (result?.error) {
        setMessage(result.error.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Stripe error:", err);
      setMessage("Failed to initiate checkout.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEquityStocks();
        const data: EquityStocks = response.data;

        const totalEquity = data.stocks.reduce(
          (sum, stock) => sum + stock.equity,
          0
        );
        const series = data.stocks.map(
          (stock) => (stock.equity / totalEquity) * 100
        );
        const labels = data.stocks.map((stock) => stock.symbol);

        setChartData({
          series,
          labels,
          stocks: data.stocks,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData)
    return <div className="text-center py-8">Loading chart...</div>;

  return (
    <div className=" mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50 max-h-[50%]">
      {/* Subscription Form */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {theme.strings.premiumMembership}
            </h2>
            <p className="text-gray-600">
              {theme.strings.unlockFetauresOnSubscriptionCard}
            </p>
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
                "✓ Exclusive market insights",
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="mr-2">✅</span>
                  {feature}
                </li>
              ))}
            </ul>

            <form onSubmit={handleClick} className="space-y-4">
              <button
                type="submit"
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                    }
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
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
