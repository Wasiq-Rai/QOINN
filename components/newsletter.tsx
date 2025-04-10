"use client";

import { Button } from "@/components/ui/button";
import { subscribeToNewsLetter, checkSubscriptionStatus, unsubscribeFromNewsLetter } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { MailCheck, Rocket, AlertCircle, MailX } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Newsletter() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const [email, setEmail] = useState(userEmail || "");
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isSubscribed: boolean;
    isActive: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Check subscription status when email changes
  useEffect(() => {
    const checkStatus = async () => {
      if (!email) return;
      
      setIsCheckingStatus(true);
      try {
        const status = await checkSubscriptionStatus(email);
        setSubscriptionStatus(status);
      } catch (error) {
        console.error("Error checking subscription status:", error);
        setSubscriptionStatus(null);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [email]);

  // Update email when user signs in/out or email changes
  useEffect(() => {
    setEmail(userEmail || "");
  }, [userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      router.push("/sign-in")
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await subscribeToNewsLetter(email);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data.is_active) {
        throw new Error("Your subscription is currently inactive");
      }

      setSubscriptionStatus({
        isSubscribed: true,
        isActive: response.data.is_active
      });
      
      toast.success("Successfully subscribed to our newsletter!😍", {
        description: "You'll receive our latest updates and insights."
      });
    } catch (error: any) {
      let errorMessage = error.message || "Failed to subscribe. Please try again.";
      
      if (errorMessage.includes("already subscribed")) {
        errorMessage = "You're already subscribed!";
      } else if (errorMessage.includes("inactive")) {
        errorMessage = "Your subscription is inactive. Please contact support.";
      }
      
      toast.error("Subscription Failed", {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await unsubscribeFromNewsLetter(email);
      
      if (response.error) {
        throw new Error(response.error);
      }

      setSubscriptionStatus({
        isSubscribed: false,
        isActive: false
      });
      
      toast.success("You've been unsubscribed", {
        description: "You won't receive further updates from our newsletter."
      });
    } catch (error: any) {
      toast.error("Unsubscribe Failed", {
        description: error.message || "Failed to unsubscribe. Please try again.",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (subscriptionStatus?.isSubscribed) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="py-16 px-4 mx-auto max-w-screen-xl text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full blur-lg animate-pulse" />
              <MailCheck className="h-16 w-16 text-green-600 relative z-10" />
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              You're subscribed!
            </h1>
            
            <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl max-w-2xl mx-auto dark:text-gray-300">
              You'll receive QOINN updates at{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>.
            </p>

            <div className="flex gap-4">
              <Button
                variant="destructive"
                className="gap-2"
                onClick={handleUnsubscribe}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <MailX className="h-4 w-4" />
                )}
                Unsubscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="py-16 px-4 mx-auto max-w-screen-xl text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 text-sm font-medium">
            <Rocket className="h-4 w-4" />
            QOINN is launching models M16 and M17 soon
          </span>
          
          <h1 className="mb-4 font-flek text-3xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Stay updated with QOINN
          </h1>
          
          <p className="mb-8 font-flek text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
            Subscribe to our newsletter for the latest insights, performance updates, and exclusive offers.
          </p>

          <Button
            onClick={handleSubmit}
            className={`h-12 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={isLoading || isCheckingStatus}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Subscribe Now"
            )}
          </Button>
          
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}