import { Award, Sparkles } from "lucide-react"

export default function TransformationGallery() {
  const transformations = [
    {
      name: "Alex",
      period: "12 weeks",
      achievement: "Complete Body Recomposition",
      metric: "-35lbs",
      bonus: "+25lbs Muscle",
      color: "from-green-400 to-emerald-500",
    },
    {
      name: "Maria",
      period: "8 weeks",
      achievement: "Athletic Performance Breakthrough",
      metric: "15% Body Fat",
      bonus: "2x Strength",
      color: "from-emerald-400 to-teal-500",
    },
    {
      name: "James",
      period: "16 weeks",
      achievement: "Powerlifting Champion",
      metric: "+40% Strength",
      bonus: "500lb Deadlift",
      color: "from-teal-400 to-cyan-500",
    },
    {
      name: "Sophie",
      period: "10 weeks",
      achievement: "Lifestyle Revolution",
      metric: "90% Energy Boost",
      bonus: "Marathon Ready",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "David",
      period: "14 weeks",
      achievement: "Elite Athlete Status",
      metric: "2x Endurance",
      bonus: "Sub 6min Mile",
      color: "from-emerald-500 to-teal-600",
    },
    {
      name: "Lisa",
      period: "6 weeks",
      achievement: "Rapid Transformation",
      metric: "-20lbs",
      bonus: "Size 4 Dress",
      color: "from-teal-500 to-cyan-600",
    },
  ]

  return (
    <section className="px-4 py-24 bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400/10 to-emerald-400/5 animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-green-400/20 backdrop-blur-sm text-green-300 px-6 py-3 rounded-full text-sm font-medium mb-8 border border-green-400/30 animate-pulse">
            <Award className="w-5 h-5 fill-current animate-spin" />
            Real Results, Real People
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Epic Transformations
          </h2>
          <p className="text-2xl text-green-100 max-w-4xl mx-auto text-balance leading-relaxed">
            Discover how our community achieved <span className="font-bold text-green-400">impossible results</span>{" "}
            through personalized nutrition and cutting-edge training protocols
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {transformations.map((transformation, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/10 transition-all duration-700 hover:scale-110 hover:rotate-2 border border-green-400/20 relative overflow-hidden shadow-2xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${transformation.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
              ></div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>

              <div className="relative z-10">
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${transformation.color} rounded-full flex items-center justify-center text-white font-black text-3xl mb-8 mx-auto group-hover:scale-125 transition-transform duration-500 shadow-2xl border-4 border-white/20`}
                >
                  {transformation.name[0]}
                </div>

                <h3 className="text-3xl font-black mb-3 text-center bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                  {transformation.name}
                </h3>
                <div className="text-center mb-6">
                  <span className="text-green-300 font-bold text-lg bg-green-400/20 px-4 py-2 rounded-full border border-green-400/30">
                    {transformation.period}
                  </span>
                </div>

                <div className="text-center mb-6 space-y-3">
                  <div className="text-4xl font-black text-green-400 group-hover:animate-bounce">
                    {transformation.metric}
                  </div>
                  <div className="text-lg font-semibold text-emerald-300">+ {transformation.bonus}</div>
                  <p className="text-green-100 text-sm text-balance font-medium bg-white/5 rounded-lg p-3 border border-green-400/20">
                    {transformation.achievement}
                  </p>
                </div>

                <div className="flex justify-center items-center gap-2">
                  <Award className="w-7 h-7 text-yellow-400 group-hover:animate-spin" />
                  <span className="text-yellow-400 font-bold">Champion</span>
                  <Award className="w-7 h-7 text-yellow-400 group-hover:animate-spin" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-lg rounded-3xl px-12 py-6 border border-green-400/30 shadow-2xl">
            <Sparkles className="w-10 h-10 text-green-400 animate-pulse" />
            <span className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Your Epic Journey Starts Now
            </span>
            <Sparkles className="w-10 h-10 text-green-400 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
