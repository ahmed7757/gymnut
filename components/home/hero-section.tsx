"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Sparkles, Shield, Zap, Target, Utensils } from "lucide-react"
import React from "react"
import Link from "next/link"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const benefits = [
    { icon: Shield, text: "Science-Backed Methods" },
    { icon: Zap, text: "Instant Progress Sync" },
    { icon: Target, text: "Precision Goal Setting" },
    { icon: Utensils, text: "Smart Meal Planning" },
  ]

  return (
    <section className="relative px-4 pt-32 pb-24 text-center">
      <div
        className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100/80 backdrop-blur-sm text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-green-200/50 animate-pulse">
            <Star className="w-4 h-4 fill-current animate-spin" />
            Trusted by 50,000+ fitness enthusiasts
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-balance mb-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight animate-pulse">
            Gym Nutrition
          </h1>
          <p className="text-2xl md:text-3xl text-slate-600 text-balance max-w-3xl mx-auto font-light leading-relaxed">
            Where <span className="font-semibold text-green-600 animate-pulse">Science Meets Performance</span> in Your
            Fitness Journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 border border-green-100/50 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {React.createElement(benefit.icon, {
                className:
                  "w-8 h-8 text-green-600 mx-auto mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300",
              })}
              <p className="text-sm font-medium text-slate-700 text-balance">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href={"/login"}>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-rotate-1 border-0 relative overflow-hidden"
            >
              <span className="relative z-10">Login</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </Link>
          <Link href={"/register"}>
            <Button
              size="lg"
              variant="outline"
              className="group border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-1 bg-white/80 backdrop-blur-sm relative overflow-hidden"
            >
              <span className="relative z-10">Register</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 relative z-10" />
              <Sparkles className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-yellow-400" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
