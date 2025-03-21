// src/components/ui/UsageStatsTable.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface UsageData {
  totalJobs: number
  completedJobs: number
  failedJobs: number
  minutesDeducted: number
  minutesRefunded: number
  date: string
}

interface UsageStatsTableProps {
  usageStats: UsageData[]
}

export function UsageStatsTable({ usageStats }: UsageStatsTableProps) {
  console.log(usageStats)
  // 1) Aggregate Totals
  const totals = usageStats.reduce(
    (acc, curr) => ({
      totalJobs: acc.totalJobs + curr.totalJobs,
      completedJobs: acc.completedJobs + curr.completedJobs,
      failedJobs: acc.failedJobs + curr.failedJobs,
      minutesDeducted: acc.minutesDeducted + curr.minutesDeducted,
      minutesRefunded: acc.minutesRefunded + curr.minutesRefunded,
    }),
    {
      totalJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      minutesDeducted: 0,
      minutesRefunded: 0,
    }
  )

  // 2) Derived Metrics
  const successRate = totals.totalJobs
    ? (totals.completedJobs / totals.totalJobs) * 100
    : 0

  // For the ratio, avoid dividing by zero
  const successFailRatio = totals.failedJobs === 0
    ? totals.completedJobs
    : totals.completedJobs / totals.failedJobs

  // 3) Data for Pie Chart
  const pieData = [
    { name: "Completed", value: totals.completedJobs, color: "#22C55E" }, // green
    { name: "Failed", value: totals.failedJobs, color: "#EF4444" }, // red
  ]

  // 4) Data for Area Chart
  //    Transform each item => { date: 'Mar 06', minutes: <deducted>, refunded: <refunded> }
  const chartData = usageStats.map((item) => ({
    date: format(new Date(item.date), "MMM dd"),
    minutes: item.minutesDeducted,
    refunded: item.minutesRefunded,
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Jobs */}
        <Card className="border-none bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totals.totalJobs}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                {/* Icon (e.g., lucide-react’s FileAudio2) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M10 3v16.5a.5.5 0 00.8.4l5-3.5a.5.5 0 000-.8l-5-3.5a.5.5 0 00-.8.4V18" />
                </svg>
              </div>
            </div>
            <Progress value={successRate} className="mt-4" />
            <p className="text-xs text-gray-500 mt-2">
              {successRate.toFixed(1)}% Success Rate
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Minutes Used */}
        <Card className="border-none bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Minutes Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totals.minutesDeducted.toFixed(2)}
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                {/* Icon (e.g., lucide-react’s Clock) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 6v6l4 2" />
                  <path d="M20.88 9.46a9 9 0 11-1.66-2.48" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Refunded</span>
                <span className="text-green-600 font-medium">
                  {totals.minutesRefunded.toFixed(2)} min
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Success/Fail Ratio */}
        <Card className="border-none bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">
              Success/Fail Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {successFailRatio.toFixed(1)}x
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                {/* Icon (e.g., lucide-react’s TrendingUp) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                <span>{totals.completedJobs} Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                <span>{totals.failedJobs} Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Timeline (Area Chart) */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Usage Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRefunded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke="#8B5CF6"
                    fill="url(#colorMinutes)"
                  />
                  <Area
                    type="monotone"
                    dataKey="refunded"
                    stroke="#22C55E"
                    fill="url(#colorRefunded)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Job Distribution (Pie Chart) */}
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Job Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
