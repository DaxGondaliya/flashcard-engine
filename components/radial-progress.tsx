"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface RadialProgressProps {
  value: number
  size?: number
  thickness?: number
  color?: string
  bgColor?: string
  children?: React.ReactNode
  className?: string
}

export function RadialProgress({
  value,
  size = 120,
  thickness = 8,
  color,
  bgColor,
  children,
  className,
}: RadialProgressProps) {
  const radius = size / 2 - thickness / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor || "var(--primary-10, hsl(var(--primary) / 0.1))"}
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || "hsl(var(--primary))"}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}
