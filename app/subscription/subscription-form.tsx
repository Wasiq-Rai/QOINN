"use client";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { usePremium } from "@/context/PremiumContext";

// Load your Stripe public key
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
          body: JSON.stringify({ email }),
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

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg">
      <h2 className="text-xl font-semibold">Subscribe to Premium</h2>
      <h3 className="text-2xl font-bold">$15.99/month</h3>
      <ul className="text-left space-y-2">
        <li>✓ Access to QOINN's current portfolio</li>
        <li>✓ Real-time investment scores</li>
        <li>✓ Daily portfolio updates</li>
        <li>✓ Performance analytics</li>
        <li>✓ Exclusive market insights</li>
      </ul>{" "}
      <form onSubmit={handleSubscribe} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe Now"}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default SubscriptionForm;
