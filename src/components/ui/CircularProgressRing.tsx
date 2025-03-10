// CircularProgressRing.tsx

import { FileAudio2 } from "lucide-react"

interface CircularProgressRingProps {
  progress: number // from 0 to 100
}

export function CircularProgressRing({ progress }: CircularProgressRingProps) {
  // Adjust these values as desired:
  const size = 80         // overall <svg> width/height
  const strokeWidth = 4   // thickness of the ring
  const radius = (size / 2) - strokeWidth
  const circumference = 2 * Math.PI * radius

  // Compute how much of the circle is “filled”
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* SVG is rotated -90deg so the circle starts at the top */}
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background Circle (track) */}
        <circle
          className="text-purple-200"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Foreground Circle (progress) */}
        <circle
          className="text-purple-600 transition-all duration-300 ease-linear"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Icon in the center */}
      <div className="absolute inset-0 flex items-center justify-center rotate-90">
        <FileAudio2 className="text-purple-600 w-8 h-8" />
      </div>
    </div>
  )
}
