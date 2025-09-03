import { Button } from "@/components/ui/button"
import { Target, Zap, ArrowRight, Award, Sparkles } from "lucide-react"
import Link from "next/link"
export default function CTASection() {
  return (
    <section className="px-4 py-32 text-center bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-bold mb-8 border border-white/30 animate-pulse">
            <Target className="w-6 h-6 animate-spin" />
            Limited Time: Transform in 30 Days
            <Target className="w-6 h-6 animate-spin" />
          </div>
        </div>

        <h2 className="text-6xl md:text-8xl font-black mb-8 text-white text-balance leading-tight">
          Ready to{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
            Dominate
          </span>
          ?
        </h2>

        <p className="text-3xl text-green-100 mb-8 text-balance max-w-4xl mx-auto leading-relaxed font-light">
          Stop dreaming. Start <span className="font-black text-white">dominating</span>.
        </p>

        <p className="text-xl text-green-200 mb-16 text-balance max-w-3xl mx-auto leading-relaxed">
          Join the elite community of champions who refuse to settle for average. Transform your body, mind, and life
          through our revolutionary science-backed system.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          <Link href={"/login"}>
            <Button
              size="lg"
              className="group bg-white text-green-600 hover:bg-green-50 px-16 py-10 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:-rotate-2 border-0 relative overflow-hidden min-w-[300px]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Zap className="w-8 h-8 group-hover:animate-bounce" />
                Start Dominating - Login
              </span>
              <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-3 group-hover:scale-125 transition-all duration-500 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </Button>
          </Link>
          <Link href={"/register"}>
            <Button
              size="lg"
              variant="outline"
              className="group border-4 border-white text-white hover:bg-white hover:text-green-600 px-16 py-10 text-2xl font-black rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:rotate-2 bg-transparent relative overflow-hidden min-w-[300px]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Award className="w-8 h-8 group-hover:animate-spin" />
                Join the Elite - Register
              </span>
              <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-3 group-hover:scale-125 transition-all duration-500 relative z-10" />
              <Sparkles className="absolute top-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-yellow-400 animate-pulse" />
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-black text-yellow-400 mb-2">30 Days</div>
            <p className="text-green-200">To Transform</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-yellow-400 mb-2">24/7</div>
            <p className="text-green-200">Expert Support</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black text-yellow-400 mb-2">100%</div>
            <p className="text-green-200">Results Guaranteed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
