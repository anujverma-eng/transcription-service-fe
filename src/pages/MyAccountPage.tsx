/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getProfile } from "@/features/auth/authSlice";
import { paymentHistory } from "@/features/payment/paymentSlice";
import { fetchUsage, fetchUsageStats, fetchJobs } from "@/features/transcription/transcriptionSlice";
import { getMyFeedbackThunk, createFeedbackThunk, deleteFeedbackThunk } from "@/features/feedback/feedbackSlice";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, CreditCard, MessageSquare, PieChart, Star, Trash2, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import SupportForm from "@/components/SupportForm";

export default function MyAccountPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [_activeTab, setActiveTab] = useState("overview");

  // Default rating is now 0 (unselected).
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const usage = useAppSelector((state) => state.transcription.usage);
  const { history, status: paymentStatus } = useAppSelector((state) => state.payment);
  const { user: userDetails, status: authStatus } = useAppSelector((state) => state.auth);
  const { feedback, status: _feedbackStatus, error: feedbackError } = useAppSelector((state) => state.feedback);
  const transcriptionStatus = useAppSelector((state) => state.transcription.status);

  // Example pagination/search parameters
  const page = 1,
    limit = 10,
    searchQuery = "";

  useEffect(() => {
    dispatch(getProfile());
    dispatch(paymentHistory());
    dispatch(fetchUsage());
    dispatch(fetchUsageStats());
    dispatch(fetchJobs({ page, limit, query: searchQuery }));
    dispatch(getMyFeedbackThunk());
  }, [dispatch, page, limit, searchQuery]);

  const isPaid = userDetails?.isPaid;
  const isLoading = authStatus === "loading" || transcriptionStatus === "loading" || paymentStatus === "loading";

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || review.trim() === "") {
      return;
    }
    dispatch(createFeedbackThunk({ rating, review }));
  };

  const handleDeleteFeedback = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your feedback? This action cannot be undone."
    );
    if (confirmDelete) {
      dispatch(deleteFeedbackThunk());
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg" />
            ))}
          </div>
        )}
        {!isLoading && (
          <Tabs defaultValue="overview" onValueChange={(val) => setActiveTab(val)} className="w-full">
            <TabsList className="mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg shadow-sm rounded-2xl p-2">
              <TabsTrigger
                value="overview"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white px-6 py-3"
              >
                <PieChart className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white px-6 py-3"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedback
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white px-6 py-3"
              >
                <User className="mr-2 h-4 w-4" />
                Support
              </TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Account Overview
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      Manage your account settings and view usage statistics.
                    </p>
                  </div>
                  {!isPaid && (
                    <Button
                      onClick={() => navigate("/plans")}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                        <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Profile Information</h2>
                    </div>
                    <div className="grid grid-cols-[auto,1fr] gap-y-4 gap-x-2 text-gray-600 dark:text-gray-300">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100">{userDetails?.name || "--"}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                      <span className="font-medium text-gray-800 dark:text-gray-100 break-all">
                        {userDetails?.email || "--"}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Plan</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 font-medium",
                          isPaid ? "text-green-600 dark:text-green-400" : "text-orange-500"
                        )}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Pro Plan
                          </>
                        ) : (
                          "Free Plan"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                        <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Usage Statistics</h2>
                    </div>
                    {usage ? (
                      <div className="space-y-4">
                        <div className="flex flex-col p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 dark:text-gray-400">Daily Limit</span>
                            <span className="font-medium text-purple-600 dark:text-purple-400">
                              {usage.totalLimit} min
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                              style={{ width: `${(usage.totalUsedMinutes / usage.totalLimit) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                              {Number(usage.remainingMinutes).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
                          </div>
                          <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                              {Number(usage.totalUsedMinutes).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Used</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">No usage data available</div>
                    )}
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                      <CreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Payment History</h2>
                  </div>
                  {history?.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Date</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Amount</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {history.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">
                                {(item.amount / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                    item.status === "paid"
                                      ? "text-green-600 bg-green-100 dark:bg-green-900/20"
                                      : "text-red-600 bg-red-100 dark:bg-red-900/20"
                                  )}
                                >
                                  {item.status === "paid" ? <CheckCircle2 className="h-3 w-3" /> : "⚠️"}
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 break-all">
                                {item.razorpayOrderId}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">No payment history found</div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* FEEDBACK TAB */}
            <TabsContent value="feedback">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                      <Star className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Feedback</h2>
                  </div>
                  {feedback ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(feedback.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{feedback.review}</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteFeedback}
                        className="w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Feedback
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setRating(num)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                rating >= num
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                              )}
                            >
                              <Star className="h-5 w-5" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Review
                        </label>
                        <textarea
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          rows={4}
                          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={rating === 0 || review.trim() === ""}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20"
                      >
                        Submit Feedback
                      </Button>
                      {feedbackError && (
                        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                          {feedbackError}
                        </div>
                      )}
                    </form>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* SUPPORT TAB */}
            <TabsContent value="support">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Contact Us / Support</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Please fill out the form below and we'll connect with you soon. Allow some time for us to respond.
                  </p>
                  <div>
                    <SupportForm />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
