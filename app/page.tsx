'use client';

import { Sprout, Brain, Database, MapPin, TrendingUp, Leaf, CloudRain, Mountain, ArrowRight, Moon, Sun, Sparkles, ChevronRight, Zap, Users, Phone } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AuthButtons from '@/components/AuthButtons';

export default function LandingPage() {
  const { dark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const d = dark;

  const features = [
    { icon: <Database className="w-6 h-6" />, title: t.features.dataIntegration.title, description: t.features.dataIntegration.desc, color: 'from-blue-500 to-cyan-500' },
    { icon: <Brain className="w-6 h-6" />, title: t.features.ragLlm.title, description: t.features.ragLlm.desc, color: 'from-purple-500 to-indigo-500' },
    { icon: <MapPin className="w-6 h-6" />, title: t.features.location.title, description: t.features.location.desc, color: 'from-orange-500 to-red-500' },
    { icon: <TrendingUp className="w-6 h-6" />, title: t.features.yield.title, description: t.features.yield.desc, color: 'from-green-500 to-emerald-500' },
    { icon: <Leaf className="w-6 h-6" />, title: t.features.sustainable.title, description: t.features.sustainable.desc, color: 'from-teal-500 to-emerald-500' },
    { icon: <TrendingUp className="w-6 h-6" />, title: t.features.roi.title, description: t.features.roi.desc, color: 'from-amber-500 to-yellow-500' }
  ];

  const dataPoints = [
    { icon: <Leaf className="w-5 h-5" />, label: t.dataSources.soil, items: "pH, N, P, K, O.C." },
    { icon: <CloudRain className="w-5 h-5" />, label: t.dataSources.weather, items: "Temp, Rain, Humid" },
    { icon: <Mountain className="w-5 h-5" />, label: t.dataSources.topography, items: "DEM, Slope, Elev" },
    { icon: <Database className="w-5 h-5" />, label: t.dataSources.remote, items: "NDVI, Soil Moist" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${d ? 'bg-[#1e1f2b] text-white' : 'bg-[#fafcfe] text-gray-900'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-green-500 animate-pulse`}></div>
        <div className={`absolute top-1/2 -left-24 w-80 h-80 rounded-full blur-[100px] opacity-15 bg-blue-500`}></div>
        <div className={`absolute -bottom-24 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10 bg-emerald-600`}></div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${d ? 'bg-[#1e1f2b]/80 border-[#2e2f42]' : 'bg-white/80 border-gray-100'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-black tracking-tight bg-gradient-to-r ${d ? 'from-green-400 to-emerald-400' : 'from-green-600 to-emerald-600'} bg-clip-text text-transparent`}>
              <a href="/">{t.title}</a>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <nav className="hidden lg:flex items-center gap-8 mr-4">
              <a href="/chat" className={`text-sm font-bold tracking-wide uppercase transition-colors ${d ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`}>{t.chat}</a>
              <a href="/graph" className={`text-sm font-bold tracking-wide uppercase transition-colors ${d ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'}`}>{t.analysis}</a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 bg-gray-500/5 p-1 rounded-2xl border border-gray-500/10">
              <LanguageSwitcher dark={d} />
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${d ? 'bg-[#2e2f42] text-yellow-400' : 'bg-white text-gray-600 shadow-sm'}`}
              >
                {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <AuthButtons dark={d} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-32 flex flex-col items-center">
          <div className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest mb-8 border transition-all ${d ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-100 text-green-700'}`}>
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{t.poweredBy}</span>
          </div>

          <h1 className={`text-3xl sm:text-7xl lg:text-8xl font-black text-center mb-8 leading-[1.2] sm:leading-[1.05] tracking-tight break-words max-w-[90vw] sm:max-w-none mx-auto ${d ? 'text-white' : 'text-gray-900'}`}>
            {t.heroTitle.split(' ').slice(0, -1).join(' ')}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 bg-clip-text text-transparent inline-block pb-2 sm:ml-0">
              {" "}{t.heroTitle.split(' ').slice(-1)}
            </span>
          </h1>

          <p className={`text-lg sm:text-xl text-center max-w-2xl mx-auto mb-12 leading-relaxed ${d ? 'text-gray-400' : 'text-gray-500 font-medium'}`}>
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="/chat"
              className="group relative px-10 py-5 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 text-white font-black text-lg shadow-2xl shadow-green-500/40 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3"
            >
              {t.startAnalyzing}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/graph"
              className={`px-10 py-5 rounded-2xl font-black text-lg border transition-all text-center flex items-center justify-center gap-3 ${d ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              {t.analysis}
            </a>
          </div>


        </section>

        {/* Features Section */}
        <section className={`py-24 sm:py-32 transition-colors ${d ? 'bg-[#1a1b26]' : 'bg-white border-y border-gray-100'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-sm font-black uppercase tracking-[0.25em] text-green-500 mb-4 italic">Next-Gen Farming</h2>
              <h3 className={`text-4xl sm:text-5xl font-black ${d ? 'text-white' : 'text-gray-900'}`}>Empowering Agriculture with AI</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((f, i) => (
                <div key={i} className={`group p-8 rounded-[2rem] border transition-all duration-300 flex flex-col ${d ? 'bg-[#252636] border-white/5 hover:border-green-500/30' : 'bg-gray-50 border-gray-100 hover:border-green-200'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-gradient-to-br transition-transform group-hover:scale-110 ${f.color} text-white`}>
                    {f.icon}
                  </div>
                  <h4 className={`text-xl font-bold mb-3 ${d ? 'text-white' : 'text-gray-900'}`}>{f.title}</h4>
                  <p className={`text-sm leading-relaxed mb-6 flex-grow ${d ? 'text-gray-400' : 'text-gray-600'}`}>{f.description}</p>
                  <div className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${d ? 'text-green-400/50 group-hover:text-green-400' : 'text-green-600/50 group-hover:text-green-600'}`}>
                    Learn More <ChevronRight className="w-3 h-3 translate-y-[-1px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`relative rounded-[3rem] overflow-hidden p-8 sm:p-20 border transition-colors ${d ? 'bg-[#252636] border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[80px]"></div>

              <h2 className={`text-3xl sm:text-4xl font-black text-center mb-20 ${d ? 'text-white' : 'text-gray-900'}`}>{t.howItWorks.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-20 relative">
                {/* Connector Lines (Desktop) */}
                <div className="hidden lg:block absolute top-10 left-[20%] right-[20%] h-0.5 border-t border-dashed border-green-500/20"></div>

                {[
                  { step: 1, ...t.howItWorks.step1, icon: <MapPin className="w-8 h-8" />, color: 'text-blue-500' },
                  { step: 2, ...t.howItWorks.step2, icon: <Brain className="w-8 h-8" />, color: 'text-purple-500' },
                  { step: 3, ...t.howItWorks.step3, icon: <Sparkles className="w-8 h-8" />, color: 'text-amber-500' }
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border-4 transition-all duration-500 ${d ? 'bg-[#1a1b26] border-[#33344a]' : 'bg-white border-gray-50 shadow-lg shadow-gray-200/30'}`}>
                      <div className={`text-2xl font-black ${s.color}`}>{s.step}</div>
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${d ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
                    <p className={`text-sm leading-relaxed ${d ? 'text-gray-400' : 'text-gray-600'}`}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data Points Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dataPoints.map((dp, i) => (
              <div key={i} className={`p-6 rounded-3xl border transition-all ${d ? 'bg-[#252636]/50 border-white/5 hover:bg-[#252636]' : 'bg-gray-50/50 border-gray-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${d ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-600'}`}>
                  {dp.icon}
                </div>
                <h5 className={`font-bold text-sm mb-1 ${d ? 'text-white' : 'text-gray-900'}`}>{dp.label}</h5>
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-500">{dp.items}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Voice Support Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className={`relative rounded-[3rem] overflow-hidden p-8 sm:p-20 border transition-all ${d ? 'bg-[#252636] border-white/5' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px]"></div>

            <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-20 relative z-10">
              <div className="flex-1 text-center lg:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 ${d ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  Live AI Agent on call without internet
                </div>
                <h2 className={`text-3xl sm:text-5xl font-black mb-6 ${d ? 'text-white' : 'text-gray-900'}`}>{t.voiceSupport?.title || '24/7 AI Voice Support'}</h2>
                <p className={`text-lg leading-relaxed mb-10 ${d ? 'text-gray-400' : 'text-gray-600'}`}>
                  {t.voiceSupport?.desc || 'Get instant assistance from our AI voice agent. Call us anytime for expert farming advice.'}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <a
                    href={`tel:${t.voiceSupport?.number || '+1 260-529-7403'}`}
                    className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-lg shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-3"
                  >
                    <Phone className="w-5 h-5 fill-current" />
                    {t.voiceSupport?.callNow || 'Call Now'}
                  </a>
                  <div className="flex flex-col items-center sm:items-start">
                    <span className={`text-xl font-black ${d ? 'text-white' : 'text-gray-900'}`}>{t.voiceSupport?.number || '+1 260-529-7403'}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${d ? 'text-gray-500' : 'text-gray-400'}`}>Toll-Free Support</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative flex justify-center">
                <div className={`w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center relative ${d ? 'bg-blue-500/5' : 'bg-blue-50'}`}>
                  {/* Decorative Rings */}
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed ${d ? 'border-blue-500/20' : 'border-blue-200'} animate-spin-slow`}></div>
                  <div className={`absolute inset-4 rounded-full border border-dashed ${d ? 'border-blue-500/10' : 'border-blue-100'} animate-reverse-spin`}></div>

                  {/* Voice Wave Animation */}
                  <div className="flex items-end gap-1.5 h-20">
                    {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((h, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-full animate-voice-wave"
                        style={{ height: `${20 + h * 15}%`, animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>

                  <div className={`absolute -bottom-4 bg-white dark:bg-[#1a1b26] p-4 rounded-2xl shadow-xl border ${d ? 'border-blue-500/20' : 'border-blue-100'} flex items-center gap-3`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white fill-current" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-500'}`}>Response Time</span>
                      <span className={`text-xs font-bold ${d ? 'text-white' : 'text-gray-900'}`}>Instant ( &lt; 1s )</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-12 sm:p-24 text-center text-white shadow-2xl shadow-green-900/40">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">{t.cta.title}</h2>
              <p className="text-lg sm:text-xl mb-12 text-green-50 max-w-2xl mx-auto opacity-90 leading-relaxed font-medium tracking-wide italic">
                "{t.cta.desc}"
              </p>
              <a
                href="/chat"
                className="bg-white text-green-700 px-12 py-5 rounded-2xl font-black text-xl hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 inline-flex items-center gap-3"
              >
                {t.cta.button}
                <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`py-16 sm:py-24 border-t transition-colors mt-20 ${d ? 'bg-[#1a1b26] border-white/5' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24 mb-16">
            {/* Column 1: Brand & Disclaimer */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl shadow-lg shadow-green-500/10">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-black tracking-tight ${d ? 'text-white' : 'text-gray-900'}`}>{t.title}</span>
              </div>
              <p className={`text-xs leading-relaxed font-medium italic ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                {t.footerWarning}
              </p>
              <div className="flex gap-4">
                {['Privacy', 'Terms', 'Science'].map(link => (
                  <a key={link} href="#" className={`text-[10px] font-black uppercase tracking-widest transition-colors ${d ? 'text-gray-600 hover:text-green-400' : 'text-gray-400 hover:text-green-600'}`}>
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links / Navigation */}
            <div className="flex flex-col gap-6">
              <h5 className={`text-xs font-black uppercase tracking-[0.2em] ${d ? 'text-gray-400' : 'text-gray-500'}`}>Navigation</h5>
              <div className="grid grid-cols-2 gap-4">
                <a href="/" className={`text-sm font-bold transition-colors ${d ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-green-600'}`}>Home</a>
                <a href="/chat" className={`text-sm font-bold transition-colors ${d ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-green-600'}`}>AI Advisor</a>
                <a href="/graph" className={`text-sm font-bold transition-colors ${d ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-green-600'}`}>Field Analysis</a>
                <a href="#" className={`text-sm font-bold transition-colors ${d ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-green-600'}`}>Resources</a>
              </div>
            </div>

            {/* Column 3: The Team */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${d ? 'text-green-400' : 'text-green-600'}`} />
                <h5 className={`text-xs font-black uppercase tracking-[0.2em] ${d ? 'text-gray-400' : 'text-gray-500'}`}>Development Team</h5>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  'Chinmaye HG', 'Hruthik Reddy',
                  'Chidurala Manikanta', 'Uma Shankar',
                  'Sarvolla Druva', 'Saaket Satvik'
                ].map(name => (
                  <span key={name} className={`text-sm font-bold tracking-tight ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${d ? 'border-white/5' : 'border-gray-200'}`}>
            <p className={`text-[11px] font-bold ${d ? 'text-gray-600' : 'text-gray-400'}`}>
              © 2026 AgriSense AI. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </div>
  );
}

