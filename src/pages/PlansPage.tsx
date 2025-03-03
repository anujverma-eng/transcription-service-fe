import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchPublicPlans } from '@/features/public/publicSlice'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Zap, Clock, FileUp, Globe, Rocket, Gauge } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function PlansPage() {
  const dispatch = useAppDispatch()
  const { plans, status, error } = useAppSelector((state) => state.public)

  useEffect(() => {
    if (plans.length === 0) dispatch(fetchPublicPlans())
  }, [dispatch, plans.length])

  const planFeatures = {
    free: [
      { icon: <FileUp className="h-5 w-5" />, text: "3 Transcripts Daily" },
      { icon: <Clock className="h-5 w-5" />, text: "30 Minute Upload Limit" },
      { icon: <Gauge className="h-5 w-5" />, text: "Lower Processing Priority" }
    ],
    pro: [
      { icon: <Rocket className="h-5 w-5" />, text: "Unlimited Transcriptions" },
      { icon: <Clock className="h-5 w-5" />, text: "10 Hour Upload Limit" },
      { icon: <Zap className="h-5 w-5" />, text: "Highest Processing Priority" },
      { icon: <Globe className="h-5 w-5" />, text: "134+ Language Translations" },
      { icon: <FileUp className="h-5 w-5" />, text: "Bulk Upload (50 files)" }
    ]
  }

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Transcribe Without Limits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start with free basic transcription, unlock powerful features with our Pro plan
          </p>
        </motion.div>

        {status === 'loading' && (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center text-red-500 text-xl">{error}</div>
        )}

        {status === 'succeeded' && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={cn(
                  "relative w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl",
                  index === 1 ? 
                    "scale-110 z-10 border-2 border-purple-500 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/30 dark:to-gray-800" : 
                    "border dark:border-gray-700",
                  "hover:-translate-y-2"
                )}
              >
                {index === 1 && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm">
                    Most Popular 🚀
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-4">
                    {plan.isPaid ? `$${plan.price}` : 'Free'}
                    {plan.isPaid && <span className="text-lg text-gray-500">/{plan.currency}/mo</span>}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {plan.dailyLimit} mins/day transcription
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {(plan.isPaid ? planFeatures.pro : planFeatures.free).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <span className="text-purple-500 mt-0.5">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full group"
                  variant={index === 1 ? "default" : "outline"}
                  size="lg"
                >
                  <span className="group-hover:scale-105 transition-transform">
                    {plan.isPaid ? 'Go Pro Now' : 'Start Free'}
                  </span>
                </Button>

                {!plan.isPaid && (
                  <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                    No credit card required
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          <h3 className="text-2xl font-bold mb-6">Full Feature Comparison</h3>
          <table className="w-full">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4 font-medium">File Duration Limit</td>
                <td className="py-4 text-center">30 mins</td>
                <td className="py-4 text-center text-purple-500 font-semibold">10 hours</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4 font-medium">Processing Priority</td>
                <td className="py-4 text-center">Standard</td>
                <td className="py-4 text-center text-purple-500 font-semibold">Highest</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-4 font-medium">Language Support</td>
                <td className="py-4 text-center">5 languages</td>
                <td className="py-4 text-center text-purple-500 font-semibold">134+ languages</td>
              </tr>
              <tr>
                <td className="py-4 font-medium">Bulk Exports</td>
                <td className="py-4 text-center">-</td>
                <td className="py-4 text-center text-purple-500 font-semibold">✅</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  )
}