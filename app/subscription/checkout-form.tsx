import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if(cardElement){
    const result = await stripe.confirmCardPayment(process.env.STRIPE_SECRET_KEY || "", {
      payment_method: {
        card: cardElement,
      },
    });
    
    if (result.error) {
        console.error(result.error.message);
        setLoading(false);
    } else {
        if (result.paymentIntent.status === "succeeded") {
            alert("Payment successful! You are now subscribed.");
        }
    }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <CardElement className="border p-3 rounded-md" />
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        {loading ? "Processing..." : "Confirm Payment"}
      </button>
    </form>
  );
};

export default CheckoutForm;
