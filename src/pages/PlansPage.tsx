// src/pages/PlansPage.tsx

declare global {
  interface Window {
    Razorpay: new (options: any) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { initiatePayment, verifyPayment } from "@/features/payment/paymentSlice";
import { fetchPublicPlans } from "@/features/public/publicSlice";
import { loadRazorpayScript } from "@/lib/loadRazorpay";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { motion } from "framer-motion";
import { Check, Clock, Gem, Rocket, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlansPage() {
  // return (
  //   <div>
  //     <PaymentSuccessModal
  //       open={true}
  //       onClose={() => {
  //         // setShowSuccessDialog(false);
  //         navigate("/dashboard");
  //       }}
  //       payment={{
  //         _id: "67d3e462741e0aebad1e4d12",
  //         razorpayOrderId: "order_Q6bEQTEGQk9I0p",
  //         amount: 140000,
  //         status: "paid",
  //         userId: "67c2c9f09fe9ddde82076cb6",
  //         planId: "67cf2423ef65b819dc5db92d",
  //         createdAt: "2025-03-14T08:10:10.053Z",
  //         updatedAt: "2025-03-14T08:10:24.764Z",
  //         __v: 0,
  //         razorpayPaymentId: "pay_Q6bEaO1GTtxG86",
  //         razorpaySignature: "f34402b4a1d7ccf199ac22a783e8ab9b87636f86f85fd44f4f7899531eb588d9",
  //       }}
  //       plan={{
  //         _id: "67cf2423ef65b819dc5db92d",
  //         name: "Essential Plan",
  //         description: "Ideal for personal projects with up to 200 daily minutes.",
  //         totalLimit: 200,
  //         price: 140000,
  //         currency: "INR",
  //         isActive: true,
  //         isPaid: true,
  //         slug: "essential",
  //         sortOrder: 2,
  //         features: ["200 minutes per day", "Faster processing", "Standard Support"],
  //         createdAt: "2025-03-10T17:40:51.267Z",
  //         updatedAt: "2025-03-10T17:40:51.267Z",
  //         __v: 0,
  //       }}
  //     />
  //   </div>
  // );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { plans, status, error } = useAppSelector((state) => state.public);
  const { user: userDetails, status: authStatus } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (plans.length === 0) dispatch(fetchPublicPlans());
    if (authStatus === "succeeded" && (!userDetails || userDetails.isPaid)) {
      navigate("/dashboard");
    }
  }, [dispatch, plans.length, userDetails, navigate, authStatus]);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState<{
    _id: string;
    name: string;
    description: string;
    totalLimit: number;
    price: number;
    currency: string;
    isActive: boolean;
    isPaid: boolean;
    slug: string;
    sortOrder: number;
    features: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  } | null>(null);

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  }, [plans]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(price / 100);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "pro":
        return <Rocket className="h-6 w-6 text-purple-600 dark:text-purple-400" />;
      case "premium":
        return <Gem className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case "business":
        return <Sparkles className="h-6 w-6 text-pink-600 dark:text-pink-400" />;
      default:
        return <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />;
    }
  };

  const handleBuyPlan = async (planId: string) => {
    if (!userDetails) {
      navigate("/auth?mode=signup");
      return;
    }
    try {
      const plan = sortedPlans.find((p: any) => p._id === planId);
      setSelectedPlan(plan as any);
      await loadRazorpayScript();
      const { data: paymentData } = await dispatch(initiatePayment(planId)).unwrap();
      console.log({ paymentData });

      const options = {
        key: paymentData.key,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "AudioLekh",
        description: "Upgrade to Pro plan",
        order_id: paymentData.orderId,
        handler: verifyHandler,
        prefill: {
          name: userDetails.name || "",
          email: userDetails.email || "",
        },
        theme: {
          color: "#6366f1",
          backdrop_color: "#1a1a1a1a",
          hide_topbar: false,
        },
        modal: {
          ondismiss: () => {
            console.log("Payment popup closed");
          },
        },
        notes: {
          planId: planId,
        },
      };

      // Add error handling for Razorpay initialization
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert(err.message || "Failed to initiate payment. Please try again later.");
    }
  };

  const verifyHandler = async (response: any) => {
    console.log("Payment Response: ", response);
    try {
      const verifyResponse = await dispatch(
        verifyPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })
      ).unwrap();
      console.log({ verifyResponse });
      setPaymentData(verifyResponse.payment);
      setShowSuccessDialog(true);
    } catch (err) {
      console.log(err);
      alert("Payment verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Transcribe Without Limits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start with free basic transcription, unlock powerful features with our Pro plan.
          </p>
        </motion.div>
        {status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        )}
        {status === "failed" && <div className="text-center text-red-500 text-xl">{error}</div>}
        {status === "succeeded" && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {sortedPlans.map((plan: any, index: number) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  "relative w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border hover:border-purple-200 dark:hover:border-purple-800",
                  index === 1
                    ? "scale-110 z-10 border-2 border-purple-500 bg-gradient-to-b from-purple-50/80 to-white dark:from-purple-900/30 dark:to-gray-800"
                    : "border dark:border-gray-700"
                )}
              >
                {index === 1 && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Most Popular</span>
                  </motion.div>
                )}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        "p-3 rounded-xl bg-gradient-to-br",
                        index === 1
                          ? "from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50"
                          : "from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50"
                      )}
                    >
                      {getPlanIcon(plan.name)}
                    </div>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <p className="text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {plan.isPaid ? formatPrice(plan.price, plan.currency) : "Free"}
                    </span>
                    {plan.isPaid && plan.currency && (
                      <span className="text-lg text-gray-500 dark:text-gray-400">/{plan.currency}/mo</span>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2 mb-6 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <span className="text-gray-600 dark:text-gray-300">{plan.totalLimit} minutes/month</span>
                  </motion.div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <Check className="h-5 w-5 text-purple-500 shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
                  <Button
                    onClick={() => {
                      if (!plan.isPaid) {
                        navigate("/dashboard");
                      } else {
                        handleBuyPlan(plan._id);
                      }
                    }}
                    className={cn(
                      "w-full group relative overflow-hidden border-2 font-bold",
                      index === 1
                        ? "border-transparent bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/30"
                        : "border-purple-500 bg-transparent text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-gray-700"
                    )}
                    size="lg"
                  >
                    <div className="flex items-center justify-center gap-2 transition-all">
                      <Rocket className="h-5 w-5 -translate-x-4 group-hover:translate-x-0 transition-transform" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {plan.isPaid ? "Get Started" : "Current Plan"}
                      </span>
                    </div>
                  </Button>
                </motion.div>
                {!plan.isPaid && (
                  <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">No credit card required</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <PaymentSuccessModal
        open={showSuccessDialog}
        onClose={() => {
          setShowSuccessDialog(false);
          navigate("/dashboard");
        }}
        payment={paymentData}
        plan={selectedPlan}
      />
    </div>
  );
}
