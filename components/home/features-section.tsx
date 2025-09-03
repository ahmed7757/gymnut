import { Card, CardContent } from "@/components/ui/card"
import { Apple, Dumbbell, BarChart3 } from "lucide-react"
import React from "react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Apple,
      title: "Smart Nutrition",
      description: "AI-powered meal planning with macro tracking and personalized recommendations",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      icon: Dumbbell,
      title: "Elite Workouts",
      description: "Science-backed training programs that evolve with your strength gains",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time progress tracking with predictive insights and goal optimization",
      gradient: "from-teal-500 to-cyan-600",
    },
  ]

  return (
    <section id="features" className="px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-slate-800">Revolutionary Features</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-balance">
            Advanced technology meets personalized fitness for unprecedented results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
              ></div>
              <CardContent className="p-10 text-center relative z-10">
                <div className="mb-8 flex justify-center">
                  <div
                    className={`p-6 bg-gradient-to-br ${feature.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                  >
                    {React.createElement(feature.icon, { className: "w-10 h-10 text-white" })}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 text-balance leading-relaxed text-lg">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
