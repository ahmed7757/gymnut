"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Apple, Zap, Target, Award, Sparkles } from "lucide-react"
import React from "react"

export default function BackgroundEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const floatingElements = [
    { icon: Dumbbell, delay: 0, x: 10, y: 20 },
    { icon: Apple, delay: 1000, x: 80, y: 60 },
    { icon: Zap, delay: 2000, x: 20, y: 80 },
    { icon: Target, delay: 1500, x: 90, y: 30 },
    { icon: Award, delay: 500, x: 70, y: 10 },
    { icon: Sparkles, delay: 2500, x: 40, y: 90 },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse"
        style={{
          left: mousePosition.x * 0.02 + "px",
          top: mousePosition.y * 0.02 + "px",
        }}
      ></div>
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-teal-200/15 to-cyan-300/15 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-200/10 to-green-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {floatingElements.map((element, index) => (
        <div
          key={index}
          className="absolute animate-bounce opacity-10"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            animationDelay: `${element.delay}ms`,
            animationDuration: `${3000 + index * 500}ms`,
          }}
        >
          {React.createElement(element.icon, { className: "w-8 h-8 text-green-600" })}
        </div>
      ))}
    </div>
  )
}
