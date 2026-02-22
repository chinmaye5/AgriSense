import React from 'react';
import { Sprout, Brain, Database, MapPin, TrendingUp, FileText, ArrowRight, Leaf, CloudRain, Mountain } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Multi-Source Data Integration",
      description: "Combines soil, weather, remote sensing, and topography data for accurate recommendations"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "RAG + LLM Powered",
      description: "Retrieves relevant research papers and agronomy guides to provide evidence-based suggestions"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location-Based Analysis",
      description: "Get hyper-localized crop recommendations based on your exact field coordinates"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Yield Predictions",
      description: "AI-powered yield forecasts based on historical data and current conditions"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Explainable Recommendations",
      description: "Every suggestion backed by scientific research and confidence ratings"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Sustainable Practices",
      description: "Management practices aligned with ICAR/FAO guidelines for sustainable farming"
    }
  ];

  const dataPoints = [
    { icon: <Leaf className="w-5 h-5" />, label: "Soil Analysis", items: "pH, N, P, K, Organic Carbon" },
    { icon: <CloudRain className="w-5 h-5" />, label: "Weather Data", items: "Temperature, Rainfall, Humidity" },
    { icon: <Mountain className="w-5 h-5" />, label: "Topography", items: "DEM, Slope, Elevation" },
    { icon: <Database className="w-5 h-5" />, label: "Remote Sensing", items: "NDVI, Soil Moisture, LST" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              <a href="/">
                AgriSense AI
              </a>
            </span>
          </div>
          <a
            href="/chat"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            <span>Powered by RAG + LLM Technology</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Crop Recommendations
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              For Your Farm
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
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

        {/* Data Sources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {dataPoints.map((data, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  {data.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{data.label}</h3>
              </div>
              <p className="text-sm text-gray-600">{data.items}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-green-100 hover:border-green-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Input Your Location</h3>
              <p className="text-gray-600">Provide your field coordinates or location details</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our system analyzes multi-source data and retrieves relevant research</p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Recommendations</h3>
              <p className="text-gray-600">Receive evidence-based crop suggestions with confidence scores</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
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
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Sprout className="w-5 h-5 text-green-600" />
            <span>AgriSense AI - Powered by RAG + LLM Technology</span>
          </div>
        </div>
      </footer>
    </div>
  );
}