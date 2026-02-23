'use client';

import { Sprout, Brain, Database, MapPin, TrendingUp, Leaf, CloudRain, Mountain, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();

  const features = [
    { icon: <Database className="w-6 h-6" />, title: "Multi-Source Data Integration", description: "Combines soil, weather, remote sensing, and topography data for accurate recommendations" },
    { icon: <Brain className="w-6 h-6" />, title: "RAG + LLM Powered", description: "Retrieves relevant research papers and agronomy guides to provide evidence-based suggestions" },
    { icon: <MapPin className="w-6 h-6" />, title: "Location-Based Analysis", description: "Get hyper-localized crop recommendations based on your exact field coordinates" },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Yield Predictions", description: "AI-powered yield forecasts based on historical data and current conditions" },
    { icon: <Leaf className="w-6 h-6" />, title: "Sustainable Practices", description: "Management practices aligned with ICAR/FAO guidelines for sustainable farming" }
  ];

  const dataPoints = [
    { icon: <Leaf className="w-5 h-5" />, label: "Soil Analysis", items: "pH, N, P, K, Organic Carbon" },
    { icon: <CloudRain className="w-5 h-5" />, label: "Weather Data", items: "Temperature, Rainfall, Humidity" },
    { icon: <Mountain className="w-5 h-5" />, label: "Topography", items: "DEM, Slope, Elevation" },
    { icon: <Database className="w-5 h-5" />, label: "Remote Sensing", items: "NDVI, Soil Moisture, LST" }
  ];

  // Theme tokens
  const t = {
    pageBg: dark ? 'bg-[#1e1f2b]' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
    headerBg: dark ? 'bg-[#252636]/90 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm',
    headerBorder: dark ? 'border-[#2e2f42]' : 'border-gray-200/60',
    brandText: dark ? 'from-green-400 to-emerald-400' : 'from-green-600 to-emerald-600',
    navText: dark ? 'text-gray-400 hover:text-green-400' : 'text-gray-600 hover:text-green-600',
    themeBtn: dark ? 'bg-[#2e2f42] text-yellow-400 hover:bg-[#3a3b50]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    badgeBg: dark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700',
    h1: dark ? 'text-gray-100' : 'text-gray-900',
    subtitle: dark ? 'text-gray-400' : 'text-gray-600',
    cardBg: dark ? 'bg-[#252636]' : 'bg-white',
    cardBorder: dark ? 'border-[#33344a] hover:border-[#444560]' : 'border-green-100 hover:border-green-300',
    cardTitle: dark ? 'text-gray-100' : 'text-gray-900',
    cardDesc: dark ? 'text-gray-400' : 'text-gray-600',
    iconBg: dark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-600',
    sectionBg: dark ? 'bg-[#252636]' : 'bg-white',
    stepBg1: dark ? 'bg-green-900/40' : 'bg-green-100',
    stepText1: dark ? 'text-green-400' : 'text-green-600',
    stepBg2: dark ? 'bg-emerald-900/40' : 'bg-emerald-100',
    stepText2: dark ? 'text-emerald-400' : 'text-emerald-600',
    stepBg3: dark ? 'bg-teal-900/40' : 'bg-teal-100',
    stepText3: dark ? 'text-teal-400' : 'text-teal-600',
    stepTitle: dark ? 'text-gray-200' : 'text-gray-900',
    stepDesc: dark ? 'text-gray-400' : 'text-gray-600',
    footerBg: dark ? 'bg-[#252636] border-[#2e2f42]' : 'bg-white border-gray-200',
    footerText: dark ? 'text-gray-500' : 'text-gray-600',
  };

  return (
    <div className={`min-h-screen ${t.pageBg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`border-b ${t.headerBorder} ${t.headerBg} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${t.brandText} bg-clip-text text-transparent`}>
              <a href="/">AgriSense AI</a>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${t.themeBtn}`}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/chat" className={`font-medium transition-colors ${t.navText}`}>Chat</a>
              <a href="/graph" className={`font-medium transition-colors ${t.navText}`}>Analysis</a>
            </nav>
            <a
              href="/chat"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Started
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${t.badgeBg}`}>
            <Brain className="w-4 h-4" />
            <span>Powered by RAG + LLM Technology</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${t.h1}`}>
            Smart Crop Recommendations
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              For Your Farm
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${t.subtitle}`}>
            Get AI-powered crop suggestions based on comprehensive soil, weather, and satellite data.
            Backed by scientific research and proven agronomy practices.
          </p>
          <a
            href="/chat"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg"
          >
            Start Analyzing Your Farm
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Data Sources */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {dataPoints.map((data, idx) => (
            <div key={idx} className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all border ${t.cardBg} ${t.cardBorder}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${t.iconBg}`}>{data.icon}</div>
                <h3 className={`font-semibold ${t.cardTitle}`}>{data.label}</h3>
              </div>
              <p className={`text-sm ${t.cardDesc}`}>{data.items}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, idx) => (
            <div key={idx} className={`rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border ${t.cardBg} ${t.cardBorder}`}>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${t.cardTitle}`}>{feature.title}</h3>
              <p className={t.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className={`${t.sectionBg} rounded-3xl shadow-xl p-12 mb-20 transition-colors duration-300`}>
          <h2 className={`text-3xl font-bold text-center mb-12 ${t.cardTitle}`}>How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`${t.stepBg1} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${t.stepText1}`}>1</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${t.stepTitle}`}>Input Your Location</h3>
              <p className={t.stepDesc}>Provide your field coordinates or location details</p>
            </div>
            <div className="text-center">
              <div className={`${t.stepBg2} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${t.stepText2}`}>2</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${t.stepTitle}`}>AI Analysis</h3>
              <p className={t.stepDesc}>Our system analyzes multi-source data and retrieves relevant research</p>
            </div>
            <div className="text-center">
              <div className={`${t.stepBg3} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${t.stepText3}`}>3</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${t.stepTitle}`}>Get Recommendations</h3>
              <p className={t.stepDesc}>Receive evidence-based crop suggestions with confidence scores</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Crop Selection?</h2>
          <p className="text-lg mb-8 text-green-50">
            Join thousands of farmers making data-driven decisions
          </p>
          <a
            href="/chat"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-medium hover:bg-green-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg"
          >
            Start Your Free Analysis
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t mt-20 transition-colors duration-300 ${t.footerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`flex items-center justify-center gap-2 ${t.footerText}`}>
            <Sprout className="w-5 h-5 text-green-600" />
            <span>AgriSense AI - Powered by RAG + LLM Technology</span>
          </div>
        </div>
      </footer>
    </div>
  );
}