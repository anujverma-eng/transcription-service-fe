import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle2, Clock, CreditCard, Gem, InfinityIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

type Payment = {
  _id: string;
  razorpayOrderId: string;
  amount: number;
  status: string;
  userId: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

interface Plan {
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
}

interface PaymentSuccessModalProps {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
  plan?: Plan | null;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ open, onClose, payment, plan }) => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

  const formatPrice = (price: number | undefined, currency: string) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price);
  };

  const handleStartUsing = () => {
    // Close the modal, then navigate to dashboard
    onClose();
    navigate("/dashboard");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={800}
        recycle={false}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 10000 }}
      />
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the panel
        className="
          relative
          w-full
          max-w-4xl
          max-h-[90vh]
          overflow-auto
          rounded-2xl
          shadow-2xl
          bg-gradient-to-br
          from-blue-50
          to-purple-50
          dark:from-gray-900
          dark:to-gray-800
        "
      >
        <div className="p-4 sm:p-6 md:p-8">
          {/* Header icon */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              <BadgeCheck className="h-10 w-10 text-white" strokeWidth={2} />
            </motion.div>
            {/* Title and description */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2
                className="
                  text-center
                  text-2xl
                  sm:text-3xl
                  font-bold
                  bg-gradient-to-r
                  from-purple-600
                  to-blue-600
                  bg-clip-text
                  text-transparent
                "
              >
                Welcome to {plan?.name}!
              </h2>
              <p
                className="
                  text-center
                  mt-4
                  text-gray-600
                  dark:text-gray-300
                  text-base
                  sm:text-lg
                "
              >
                Your payment was successful! 🎉
                <br />
                We&apos;ve added your remaining minutes from your previous plan to your new allocation.
              </p>
            </motion.div>
          </div>

          {/* Content: Plan Benefits & Payment Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Plan Benefits */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Gem className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                Your New Plan Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features:</h4>
                  <ul className="space-y-3">
                    {plan?.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Usage Details:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">{plan?.totalLimit} minutes/day</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your new transcription limit</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <InfinityIcon className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-700 dark:text-gray-300">Unlimited Projects</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Create as many as you need</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                Payment Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Left column */}
                <div className="space-y-3">
                  <DetailItem label="Order ID" value={payment?.razorpayOrderId ?? "—"} />
                  <DetailItem label="Payment ID" value={payment?._id ?? "—"} />
                  <DetailItem
                    label="Date"
                    value={payment?.createdAt ? new Date(payment.createdAt).toLocaleString() : "—"}
                  />
                </div>
                {/* Right column */}
                <div className="space-y-3">
                  <DetailItem
                    label="Amount"
                    value={payment?.amount ? formatPrice(payment.amount / 100, plan?.currency || "USD") : "N/A"}
                  />
                  <DetailItem
                    label="Status"
                    value={
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </span>
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-8"
          >
            <Button
              onClick={handleStartUsing}
              className="
                relative
                overflow-hidden
                group
                bg-gradient-to-r
                from-purple-600
                to-blue-600
                hover:from-purple-700
                hover:to-blue-700
                text-white
                px-6
                py-3
                sm:px-8
                sm:py-4
                rounded-xl
                font-bold
                transition-all
                hover:shadow-lg
                hover:shadow-purple-500/30
                text-base
                sm:text-lg
              "
            >
              <Link to="/dashboard" className="relative z-10 flex items-center gap-1">
                Start Using {plan?.name}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}:</p>
    <p className="break-all text-sm font-medium text-gray-700 dark:text-gray-300">{value}</p>
  </div>
);

export default PaymentSuccessModal;
