import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    console.log("Hello")
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 15, // Amount in cents ($9.99)
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err:any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
