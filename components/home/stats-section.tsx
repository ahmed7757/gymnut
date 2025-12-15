import { Users, TrendingUp, Apple, Heart } from "lucide-react"

export default function StatsSection() {
  return (
    <section className="px-4 py-16 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl font-bold mb-12">Join Thousands of Success Stories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="group hover:scale-110 transition-transform duration-300">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-6 h-6 mr-2 group-hover:animate-bounce" />
              <span className="text-3xl font-bold">50K+</span>
            </div>
            <p className="text-green-100">Active Users</p>
          </div>
          <div className="group hover:scale-110 transition-transform duration-300">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 mr-2 group-hover:animate-bounce" />
              <span className="text-3xl font-bold">2M+</span>
            </div>
            <p className="text-green-100">Workouts Completed</p>
          </div>
          <div className="group hover:scale-110 transition-transform duration-300">
            <div className="flex items-center justify-center mb-2">
              <Apple className="w-6 h-6 mr-2 group-hover:animate-bounce" />
              <span className="text-3xl font-bold">500K+</span>
            </div>
            <p className="text-green-100">Meals Planned</p>
          </div>
          <div className="group hover:scale-110 transition-transform duration-300">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-6 h-6 mr-2 group-hover:animate-bounce" />
              <span className="text-3xl font-bold">98%</span>
            </div>
            <p className="text-green-100">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
