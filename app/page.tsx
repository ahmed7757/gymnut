import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home//features-section";
import StatsSection from "@/components/home//stats-section";
import TransformationGallery from "@/components/home//transformation-gallery";
import CTASection from "@/components/home//cta-section";
import TestimonialsSection from "@/components/home//testimonials-section";
import Footer from "@/components/home//footer";
import BackgroundEffects from "@/components/home//background-effects";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50 relative overflow-hidden">
      <BackgroundEffects />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <TransformationGallery />
      <CTASection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
