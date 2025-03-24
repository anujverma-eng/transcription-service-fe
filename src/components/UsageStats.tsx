// src/features/dashboard/components/UsageStats.tsx

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, BarChart2, BatteryCharging, Clock, Lightbulb } from "lucide-react";
import { Cursor, useTypewriter } from "react-simple-typewriter";

interface UsageStatsProps {
  usage: {
    totalLimit: number;
    totalUsedMinutes: number;
    remainingMinutes: number;
  } | null;
  status: string; // "idle" | "loading" | "succeeded" | "failed"
}

export function UsageStats({ usage, status }: UsageStatsProps) {
  // Initialize words array before using it
  const words = [
    `Usage resets daily at midnight. You have ${(usage?.remainingMinutes || 0).toFixed(2)} minutes remaining today.`,
    "Remember to proofread your transcriptions!",
    "Shortcuts help transcribe faster!",
    "Accuracy improves with regular practice.",
  ];

  const [text] = useTypewriter({
    words: words || [], // Provide fallback empty array
    loop: true,
    delaySpeed: 2500,
    deleteSpeed: 50,
  });

  // 1) Loading / no usage => Skeleton
  if (status === "loading" || !usage) {
    return <Skeleton className="w-full h-[140px] rounded-lg" />;
  }

  // 2) Calculate used / percentage
  const { totalLimit, totalUsedMinutes, remainingMinutes } = usage;
  const used = totalUsedMinutes;
  const percentageUsed = Math.min((used / totalLimit) * 100, 100);

  // 3) Badge color based on usage
  function getBadgeClass() {
    if (percentageUsed > 80) {
      return "bg-red-500 text-white";
    } else if (percentageUsed > 50) {
      return "bg-yellow-400 text-black";
    }
    return "bg-green-500 text-white";
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
      <Card className="w-full mb-2 overflow-hidden border-none shadow-lg bg-gradient-to-r from-[#8B5CF6]/10 to-[#3B82F6]/10 p-6">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="mr-2 text-[#8B5CF6]" size={24} />
              <h2 className="text-xl font-bold text-[#1F2937]">Usage Overview</h2>
            </div>
            <Badge className={cn("px-3 py-1", getBadgeClass())}>{percentageUsed.toFixed(1)}% Used</Badge>
          </div>

          {/* Three mini-cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Limit */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "bg-white rounded-xl p-4 shadow-sm flex items-center justify-between",
                "transition-all duration-200 cursor-pointer"
              )}
            >
              <div className="flex items-center">
                <div className="bg-[#8B5CF6]/10 p-3 rounded-full mr-4">
                  <Clock className="text-[#8B5CF6]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Limit</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{totalLimit}</p>
                  <p className="text-xs text-gray-500">minutes</p>
                </div>
              </div>
            </motion.div>

            {/* Total Used */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "bg-white rounded-xl p-4 shadow-sm flex items-center justify-between",
                "transition-all duration-200 cursor-pointer"
              )}
            >
              <div className="flex items-center">
                <div className="bg-[#3B82F6]/10 p-3 rounded-full mr-4">
                  <BarChart2 className="text-[#3B82F6]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Used</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{used.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">minutes</p>
                </div>
              </div>
              {/* <ChevronRight className="text-gray-400" /> */}
            </motion.div>

            {/* Remaining */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "bg-white rounded-xl p-4 shadow-sm flex items-center justify-between",
                "transition-all duration-200 cursor-pointer"
              )}
            >
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <BatteryCharging className="text-green-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Remaining</p>
                  <p className="text-2xl font-bold text-[#1F2937]">{remainingMinutes.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">minutes</p>
                </div>
              </div>
              {/* <ChevronRight className="text-gray-400" /> */}
            </motion.div>
          </div>

          {/* Hide progress bar & usage tip below md */}
          <div className="hidden md:block">
            {/* Progress Visualization */}
            <div className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">Usage Progress</span>
                <span className="text-sm font-medium text-gray-500">{percentageUsed.toFixed(1)}%</span>
              </div>

              <div className="relative">
                <Progress
                  value={percentageUsed}
                  className="h-3 bg-gray-200"
                  // indicatorClassName="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]"
                />

                {/* Markers */}
                <div className="absolute top-full left-0 right-0 flex justify-between mt-1">
                  {[0, 25, 50, 75, 100].map((mark) => (
                    <div key={mark} className="flex flex-col items-center">
                      <div className="w-1 h-2 bg-gray-400"></div>
                      <span className="text-xs text-gray-500">{mark}%</span>
                    </div>
                  ))}
                </div>

                {/* Current Position Indicator */}
                <div
                  className="absolute top-0 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform -translate-y-1/2"
                  style={{
                    left: `${Math.min(Math.max(percentageUsed, 0), 100)}%`,
                    transform: "translateX(-50%) translateY(20%)",
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                </div>
              </div>

              {/* Usage Tips */}
              <div className="mt-8 bg-white rounded-lg p-3 flex items-center group">
                <motion.div className="mr-2 flex-shrink-0" whileHover={{ scale: 1.1 }}>
                  <Lightbulb className="group-hover:text-yellow-500 transition-colors duration-200" />
                </motion.div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600">Pro Tip:</span> {text || ''} <Cursor cursorStyle="|" />
                </p>
              </div>
            </div>
          </div>
      </Card>
    </motion.div>
  );
}