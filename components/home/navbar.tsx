"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50
          ? "bg-white/95 backdrop-blur-lg shadow-xl border-b border-green-100/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Gym Nutrition
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-slate-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-slate-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Success Stories
            </a>
            <a
              href="#pricing"
              className="text-slate-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Pricing
            </a>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 bg-transparent cursor-pointer"
              >
                Login
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              Register
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-100 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100/50 mt-2 p-6 space-y-4">
            <a
              href="#features"
              className="block text-slate-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block text-slate-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Success Stories
            </a>
            <a
              href="#pricing"
              className="block text-slate-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Pricing
            </a>
            <div className="flex flex-col space-y-3 pt-4 border-t border-green-100">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent"
              >
                Login
              </Button>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                Register
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
