import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Fitness Enthusiast",
      text: "Transformed my body composition in 12 weeks. The nutrition insights are game-changing!",
      rating: 5,
      avatar: "SM",
    },
    {
      name: "Mike R.",
      role: "Professional Athlete",
      text: "The most sophisticated training platform I've used. Results speak for themselves.",
      rating: 5,
      avatar: "MR",
    },
    {
      name: "Emma L.",
      role: "Busy Professional",
      text: "Finally, an app that fits my lifestyle. Smart, efficient, and incredibly effective.",
      rating: 5,
      avatar: "EL",
    },
  ]

  return (
    <section id="testimonials" className="px-4 py-20 bg-gradient-to-r from-white/50 to-green-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-slate-800">Success Stories</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-balance">
            Real transformations from our community of champions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-xl bg-white/90 backdrop-blur-sm"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{testimonial.name}</h4>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-slate-600 italic text-balance leading-relaxed">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
