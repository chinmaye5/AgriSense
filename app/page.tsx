'use client';

import { Sprout, Brain, Database, MapPin, TrendingUp, Leaf, CloudRain, Mountain, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const features = [
    { icon: <Database className="w-6 h-6" />, title: t.features.dataIntegration.title, description: t.features.dataIntegration.desc },
    { icon: <Brain className="w-6 h-6" />, title: t.features.ragLlm.title, description: t.features.ragLlm.desc },
    { icon: <MapPin className="w-6 h-6" />, title: t.features.location.title, description: t.features.location.desc },
    { icon: <TrendingUp className="w-6 h-6" />, title: t.features.yield.title, description: t.features.yield.desc },
    { icon: <Leaf className="w-6 h-6" />, title: t.features.sustainable.title, description: t.features.sustainable.desc }
  ];

  const dataPoints = [
    { icon: <Leaf className="w-5 h-5" />, label: t.dataSources.soil, items: "pH, N, P, K, Organic Carbon" },
    { icon: <CloudRain className="w-5 h-5" />, label: t.dataSources.weather, items: "Temperature, Rainfall, Humidity" },
    { icon: <Mountain className="w-5 h-5" />, label: t.dataSources.topography, items: "DEM, Slope, Elevation" },
    { icon: <Database className="w-5 h-5" />, label: t.dataSources.remote, items: "NDVI, Soil Moisture, LST" }
  ];

  // Theme tokens
  const theme = {
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
    <div className={`min-h-screen ${theme.pageBg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`border-b ${theme.headerBorder} ${theme.headerBg} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold bg-gradient-to-r ${theme.brandText} bg-clip-text text-transparent`}>
              <a href="/">{t.title}</a>
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageSwitcher dark={dark} />
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${theme.themeBtn}`}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/chat" className={`font-medium transition-colors ${theme.navText}`}>{t.chat}</a>
              <a href="/graph" className={`font-medium transition-colors ${theme.navText}`}>{t.analysis}</a>
            </nav>
            <a
              href="/chat"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              {t.getStarted}
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${theme.badgeBg}`}>
            <Brain className="w-4 h-4" />
            <span>{t.poweredBy}</span>
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${theme.h1}`}>
            {t.heroTitle}
            <br />
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t.analysis}
            </span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${theme.subtitle}`}>
            {t.heroSubtitle}
          </p>
          <a
            href="/chat"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg"
          >
            {t.startAnalyzing}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {/* Data Sources */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {dataPoints.map((data, idx) => (
            <div key={idx} className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all border ${theme.cardBg} ${theme.cardBorder}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${theme.iconBg}`}>{data.icon}</div>
                <h3 className={`font-semibold ${theme.cardTitle}`}>{data.label}</h3>
              </div>
              <p className={`text-sm ${theme.cardDesc}`}>{data.items}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, idx) => (
            <div key={idx} className={`rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border ${theme.cardBg} ${theme.cardBorder}`}>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${theme.cardTitle}`}>{feature.title}</h3>
              <p className={theme.cardDesc}>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className={`${theme.sectionBg} rounded-3xl shadow-xl p-12 mb-20 transition-colors duration-300`}>
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme.cardTitle}`}>{t.howItWorks.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`${theme.stepBg1} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${theme.stepText1}`}>1</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${theme.stepTitle}`}>{t.howItWorks.step1.title}</h3>
              <p className={theme.stepDesc}>{t.howItWorks.step1.desc}</p>
            </div>
            <div className="text-center">
              <div className={`${theme.stepBg2} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${theme.stepText2}`}>2</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${theme.stepTitle}`}>{t.howItWorks.step2.title}</h3>
              <p className={theme.stepDesc}>{t.howItWorks.step2.desc}</p>
            </div>
            <div className="text-center">
              <div className={`${theme.stepBg3} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${theme.stepText3}`}>3</span>
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${theme.stepTitle}`}>{t.howItWorks.step3.title}</h3>
              <p className={theme.stepDesc}>{t.howItWorks.step3.desc}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
          <p className="text-lg mb-8 text-green-50">
            {t.cta.desc}
          </p>
          <a
            href="/chat"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-medium hover:bg-green-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg"
          >
            {t.cta.button}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t mt-20 transition-colors duration-300 ${theme.footerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`flex items-center justify-center gap-2 ${theme.footerText}`}>
            <Sprout className="w-5 h-5 text-green-600" />
            <span>{t.title} - {t.footerWarning}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
