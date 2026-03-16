'use client';

import { useState, useEffect, Suspense } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart
} from 'recharts';
import { Sprout, Droplets, TrendingUp, DollarSign, Package, AlertCircle, Info, Leaf, Sun, CloudRain, ChevronRight, Zap, BarChart3, ArrowRight, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AuthButtons from '@/components/AuthButtons';
import HistorySidebar from '@/components/HistorySidebar';
import { translations } from '@/lib/translations';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';


interface Recommendation {
    recommended_crop: string;
    recommended_crop_localized?: string;
    why: string;
    requirements: {
        water_liters_per_day: number;
        nitrogen_kg: number;
        phosphorus_kg: number;
        potassium_kg: number;
        fertilizers: { name: string; name_localized?: string; amount_kg: number }[];
    };
    expected_output_kg: number;
    expected_profit_range_rs: [number, number];
    estimated_budget_needed_rs: number;
    top_similar_crops: string[];
    top_similar_crops_localized?: string[];
}

interface ApiResponse {
    success: boolean;
    recommendations: Recommendation[];
    rag_used?: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const CROP_EMOJIS: Record<string, string> = {
    rice: '🌾', wheat: '🌾', maize: '🌽', corn: '🌽', sugarcane: '🎋',
    cotton: '🧶', soybean: '🫘', groundnut: '🥜', mustard: '🌻', sunflower: '🌻',
    tomato: '🍅', potato: '🥔', onion: '🧅', chilli: '🌶️', turmeric: '✨',
    jowar: '🌾', bajra: '🌾', ragi: '🌾', pulses: '🫘', millet: '🌾',
};

function getCropEmoji(crop: string) {
    const key = crop.toLowerCase().trim();
    for (const [k, v] of Object.entries(CROP_EMOJIS)) {
        if (key.includes(k)) return v;
    }
    return '🌱';
}

function CropAnalyzerContent() {
    const { dark, toggleTheme } = useTheme();
    const { t, language } = useLanguage();
    const { isSignedIn } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const d = dark;
    const [formData, setFormData] = useState({
        location: '',
        size: '',
        previously_grown: '',
        budget: '',
        soil_type: '',
        water_source: '',
        season: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState('');
    const [selectedCrop, setSelectedCrop] = useState<number>(0);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [expandedCrops, setExpandedCrops] = useState<number[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [viewingHistoryTitle, setViewingHistoryTitle] = useState<string | null>(null);

    // Load analysis from URL param
    useEffect(() => {
        const analysisId = searchParams.get('id');
        if (analysisId) {
            loadAnalysisById(analysisId);
        }
    }, [searchParams]);

    const loadAnalysisById = async (id: string) => {
        setLoadingHistory(true);
        try {
            const res = await fetch('/api/history');
            const data = await res.json();
            if (data.success) {
                const analysis = data.analyses?.find((a: any) => a._id === id);
                if (analysis) {
                    loadAnalysisFromHistory(analysis);
                }
            }
        } catch (err) {
            console.error('Failed to load analysis:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    const loadAnalysisFromHistory = (analysis: any) => {
        // Restore form data
        if (analysis.formData) {
            setFormData(analysis.formData);
        }
        // Restore results
        if (analysis.recommendations) {
            setResult({
                success: true,
                recommendations: analysis.recommendations,
                rag_used: analysis.ragUsed || [],
            });
            setSelectedCrop(0);
        }
        const title = analysis.formData?.location 
            ? `${analysis.formData.location} - ${analysis.recommendations?.[0]?.recommended_crop || 'Analysis'}`
            : 'Saved Analysis';
        setViewingHistoryTitle(title);
    };

    const handleSelectAnalysis = (analysis: any) => {
        loadAnalysisFromHistory(analysis);
        router.push(`/graph?id=${analysis._id}`);
    };

    const handleNewAnalysis = () => {
        setResult(null);
        setFormData({
            location: '',
            size: '',
            previously_grown: '',
            budget: '',
            soil_type: '',
            water_source: '',
            season: ''
        });
        setError('');
        setViewingHistoryTitle(null);
        router.push('/graph');
    };

    const toggleExpand = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        setExpandedCrops(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const SOIL_TYPES = Object.keys(t.soils);
    const WATER_SOURCES = Object.keys(t.waterSources);
    const SEASONS = Object.keys(t.seasonsList);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.location.trim()) errors.location = t.errorMessages.location;
        if (!formData.size || parseFloat(formData.size) <= 0) errors.size = t.errorMessages.landSize;
        if (!formData.budget || parseFloat(formData.budget) <= 0) errors.budget = t.errorMessages.budget;
        if (!formData.soil_type) errors.soil_type = t.errorMessages.soil;
        if (!formData.water_source) errors.water_source = t.errorMessages.water;
        if (!formData.season) errors.season = t.errorMessages.season;

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: formData.location,
                    size: parseFloat(formData.size),
                    previously_grown: formData.previously_grown,
                    budget: parseFloat(formData.budget),
                    soil_type: formData.soil_type,
                    water_source: formData.water_source,
                    season: formData.season,
                    language: language
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
                setSelectedCrop(0);
                setValidationErrors({});
                setViewingHistoryTitle(null);

                // Auto-save full analysis to history (includes all data needed to rebuild charts)
                if (isSignedIn) {
                    try {
                        // Compute chart data to store alongside raw data
                        const profitData = data.recommendations.map((rec: any) => ({
                            name: rec.recommended_crop_localized || rec.recommended_crop,
                            'Min Profit': rec.expected_profit_range_rs[0],
                            'Max Profit': rec.expected_profit_range_rs[1],
                            'Avg Profit': (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2
                        }));

                        const nutrientData = data.recommendations.map((rec: any) => ({
                            crop: rec.recommended_crop_localized || rec.recommended_crop,
                            Nitrogen: rec.requirements.nitrogen_kg,
                            Phosphorus: rec.requirements.phosphorus_kg,
                            Potassium: rec.requirements.potassium_kg,
                        }));

                        const waterData = data.recommendations.map((rec: any) => ({
                            crop: rec.recommended_crop_localized || rec.recommended_crop,
                            'Daily Water (L)': rec.requirements.water_liters_per_day,
                        }));

                        const roiData = data.recommendations.map((rec: any) => {
                            const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
                            const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;
                            return {
                                crop: rec.recommended_crop_localized || rec.recommended_crop,
                                'Investment (₹)': rec.estimated_budget_needed_rs,
                                'Expected Profit (₹)': avgProfit,
                                'ROI %': parseFloat(roi.toFixed(1))
                            };
                        });

                        await fetch('/api/history', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'analysis',
                                data: {
                                    title: `${formData.location} - ${data.recommendations[0]?.recommended_crop || 'Analysis'}`,
                                    formData: formData,
                                    recommendations: data.recommendations,
                                    ragUsed: data.rag_used,
                                    // Store pre-computed chart data for full history restoration
                                    chartData: {
                                        profitComparison: profitData,
                                        nutrientComparison: nutrientData,
                                        waterRequirement: waterData,
                                        roiAnalysis: roiData,
                                    }
                                },
                            }),
                        });
                    } catch (saveErr) {
                        console.error('Failed to save analysis:', saveErr);
                    }
                }
            } else {
                setError(data.error || 'Failed to get recommendations');
            }
        } catch (err) {
            setError('Failed to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear validation error for this field when user types
        if (validationErrors[e.target.name]) {
            setValidationErrors(prev => {
                const copy = { ...prev };
                delete copy[e.target.name];
                return copy;
            });
        }
    };

    // Data preparation for visualizations
    const profitComparisonData = result?.recommendations.map(rec => ({
        name: rec.recommended_crop_localized || rec.recommended_crop,
        'Min Profit': rec.expected_profit_range_rs[0],
        'Max Profit': rec.expected_profit_range_rs[1],
        'Avg Profit': (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2
    })) || [];

    const nutrientComparisonData = result?.recommendations.map(rec => ({
        crop: rec.recommended_crop_localized || rec.recommended_crop,
        Nitrogen: rec.requirements.nitrogen_kg,
        Phosphorus: rec.requirements.phosphorus_kg,
        Potassium: rec.requirements.potassium_kg,
    })) || [];

    const waterRequirementData = result?.recommendations.map(rec => ({
        crop: rec.recommended_crop_localized || rec.recommended_crop,
        'Daily Water (L)': rec.requirements.water_liters_per_day,
    })) || [];

    const roiAnalysisData = result?.recommendations.map(rec => {
        const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
        const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;
        return {
            crop: rec.recommended_crop_localized || rec.recommended_crop,
            'Investment (₹)': rec.estimated_budget_needed_rs,
            'Expected Profit (₹)': avgProfit,
            'ROI %': parseFloat(roi.toFixed(1))
        };
    }) || [];

    const selectedCropData = result?.recommendations[selectedCrop];

    const nutrientRadarData = selectedCropData ? [
        { nutrient: 'Nitrogen', value: selectedCropData.requirements.nitrogen_kg, fullMark: Math.max(selectedCropData.requirements.nitrogen_kg * 1.5, 50) },
        { nutrient: 'Phosphorus', value: selectedCropData.requirements.phosphorus_kg, fullMark: Math.max(selectedCropData.requirements.phosphorus_kg * 1.5, 50) },
        { nutrient: 'Potassium', value: selectedCropData.requirements.potassium_kg, fullMark: Math.max(selectedCropData.requirements.potassium_kg * 1.5, 50) },
        { nutrient: 'Water (L/10)', value: selectedCropData.requirements.water_liters_per_day / 10, fullMark: Math.max(selectedCropData.requirements.water_liters_per_day / 10 * 1.5, 50) },
    ] : [];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`backdrop-blur-md p-3 rounded-xl shadow-2xl border transition-colors ${d ? 'bg-[#252636]/95 border-[#444560] text-gray-200' : 'bg-white/95 border-gray-100 text-gray-800'
                    }`}>
                    <p className="font-bold text-sm mb-1.5">{label}</p>
                    <div className="space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <p key={index} className="text-xs font-medium flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                <span className={d ? 'text-gray-400' : 'text-gray-500'}>{entry.name}:</span>
                                <span className="font-bold">
                                    {typeof entry.value === 'number' ?
                                        (entry.name.includes('₹') || entry.name.includes('Profit') || entry.name.includes('Investment') ?
                                            `₹${entry.value.toLocaleString()}` :
                                            entry.name.includes('%') ?
                                                `${entry.value}%` :
                                                entry.value.toLocaleString())
                                        : entry.value}
                                </span>
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${d ? 'bg-[#1e1f2b]' : 'bg-gray-50'}`}>
            <HistorySidebar 
                type="graph" 
                dark={d} 
                onSelectChat={(chat) => {
                    window.location.href = '/chat';
                }}
                onSelectAnalysis={handleSelectAnalysis}
                onNew={handleNewAnalysis}
            />
            <div className="flex-1 min-w-0 overflow-auto">
            {/* Sticky Header */}
            <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${d ? 'border-[#2e2f42] bg-[#252636]/90' : 'border-gray-200/60 bg-white/90'}`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2.5">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-1.5 rounded-lg shadow-sm">
                            <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <span className={`text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${d ? 'from-green-400 to-emerald-400' : 'from-green-700 to-emerald-600'}`}>
                            AgriSense AI
                        </span>
                    </a>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <LanguageSwitcher dark={d} />
                        <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${d ? 'bg-[#2e2f42] text-yellow-400 hover:bg-[#3a3b50]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} title={d ? 'Light mode' : 'Dark mode'}>
                            {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <nav className="hidden sm:flex items-center gap-1">
                            <a href="/chat" className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${d ? 'text-gray-400 hover:text-green-400 hover:bg-[#2e2f42]' : 'text-gray-600 hover:text-green-700 hover:bg-green-50'}`}>{t.chat}</a>
                            <a href="/graph" className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${d ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-50'}`}>{t.analysis}</a>
                        </nav>
                        <AuthButtons dark={d} />
                        <a href="/chat" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t.askAi}</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* History Loading Overlay */}
            {loadingHistory && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className={`p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 ${d ? 'bg-[#252636]' : 'bg-white'}`}>
                        <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className={`text-sm font-medium ${d ? 'text-gray-300' : 'text-gray-600'}`}>Loading analysis...</p>
                    </div>
                </div>
            )}

            {/* Viewing History Banner */}
            {viewingHistoryTitle && (
                <div className={`sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between border-b ${d ? 'bg-green-900/20 border-green-500/20' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex items-center gap-2">
                        <BarChart3 className={`w-4 h-4 ${d ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={`text-xs font-bold ${d ? 'text-green-400' : 'text-green-700'}`}>
                            📂 Viewing saved: {viewingHistoryTitle}
                        </span>
                    </div>
                    <button
                        onClick={handleNewAnalysis}
                        className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${d ? 'text-green-400 hover:bg-green-900/40' : 'text-green-700 hover:bg-green-100'}`}
                    >
                        ✕ New Analysis
                    </button>
                </div>
            )}

            {/* Hero Section — Modern & Cohesive */}
            <div className={`relative overflow-hidden transition-colors duration-500 ${d ? 'bg-[#1e1f2b] border-b border-[#2e2f42]' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-b border-green-100/50'}`}>
                <div className="absolute inset-0">
                    <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${d ? 'bg-green-500' : 'bg-green-300'}`}></div>
                    <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${d ? 'bg-emerald-500' : 'bg-emerald-300'}`}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6 border transition-all ${d ? 'bg-green-900/30 border-green-500/30 text-green-400' : 'bg-green-100 border-green-200 text-green-700'
                        }`}>
                        <BarChart3 className="w-3.5 h-3.5" />
                        {t.features.roi.title}
                    </div>

                    <h1 className={`text-4xl sm:text-6xl font-black tracking-tight mb-4 transition-colors ${d ? 'text-white' : 'text-gray-900'}`}>
                        {t.features.soil.title.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">{t.analysis}</span>
                    </h1>

                    <p className={`text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8 transition-colors ${d ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t.chatDesc}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {[t.features.weather.title, t.features.soil.title, t.features.roi.title, t.features.location.title].map((f) => (
                            <span key={f} className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${d ? 'bg-[#252636] border-[#33344a] text-gray-400' : 'bg-white border-green-100 text-green-700 shadow-sm'
                                }`}>
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
                {/* Input Form Card */}
                <div className={`rounded-2xl shadow-sm border p-5 sm:p-7 mb-6 sm:mb-8 transition-colors duration-300 ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-200/60'}`}>
                    <div className="flex items-center gap-2 mb-5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d ? 'bg-green-900/40' : 'bg-green-100'}`}>
                            <Info className={`w-4 h-4 ${d ? 'text-green-400' : 'text-green-700'}`} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>{t.farmDetails}</h2>
                            <p className={`text-xs ${d ? 'text-gray-500' : 'text-gray-500'}`}>{t.chatDesc}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Row 1 — Core Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Sun className="w-3.5 h-3.5 text-orange-500" />
                                    {t.location} <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder={t.locationPlaceholder}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200 placeholder-gray-500' : 'bg-gray-50/50 hover:bg-white'} ${validationErrors.location ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                        }`}
                                />
                                {validationErrors.location && <p className="text-[11px] text-red-500 font-medium">{validationErrors.location}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Package className="w-3.5 h-3.5 text-blue-500" />
                                    {t.landSize} <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="size"
                                    step="0.1"
                                    min="0.1"
                                    value={formData.size}
                                    onChange={handleChange}
                                    placeholder="e.g., 5.0"
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200 placeholder-gray-500' : 'bg-gray-50/50 hover:bg-white'} ${validationErrors.size ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                        }`}
                                />
                                {validationErrors.size && <p className="text-[11px] text-red-500 font-medium">{validationErrors.size}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <DollarSign className="w-3.5 h-3.5 text-yellow-500" />
                                    {t.budget} <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    min="1000"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g., 50000"
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200 placeholder-gray-500' : 'bg-gray-50/50 hover:bg-white'} ${validationErrors.budget ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                        }`}
                                />
                                {validationErrors.budget && <p className="text-[11px] text-red-500 font-medium">{validationErrors.budget}</p>}
                            </div>
                        </div>

                        {/* Row 2 — Smart Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    🪨 {t.soilType} <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="soil_type"
                                    value={formData.soil_type}
                                    onChange={handleChange}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200' : 'bg-gray-50/50 hover:bg-white'} ${validationErrors.soil_type ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                        }`}
                                >
                                    <option value="">{t.selectSoil}</option>
                                    {SOIL_TYPES.map(s => (
                                        <option key={s} value={translations.en.soils[s as keyof typeof translations.en.soils]}>
                                            {t.soils[s as keyof typeof t.soils]}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.soil_type && <p className="text-[11px] text-red-500 font-medium">{validationErrors.soil_type}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                                    {t.waterSource} <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="water_source"
                                    value={formData.water_source}
                                    onChange={handleChange}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200' : 'bg-gray-50/50 hover:bg-white'} ${validationErrors.water_source ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                        }`}
                                >
                                    <option value="">{t.selectWater}</option>
                                    {WATER_SOURCES.map(w => (
                                        <option key={w} value={translations.en.waterSources[w as keyof typeof translations.en.waterSources]}>
                                            {t.waterSources[w as keyof typeof t.waterSources]}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.water_source && <p className="text-[11px] text-red-500 font-medium">{validationErrors.water_source}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
                                    {t.season} <span className="text-red-400">*</span>
                                </label>
                                <select
                                    name="season"
                                    value={formData.season}
                                    onChange={handleChange}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200' : 'bg-gray-50/50 hover:bg-white'} ${validationErrors.season ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                        }`}
                                >
                                    <option value="">{t.selectSeason}</option>
                                    {SEASONS.map(s => (
                                        <option key={s} value={translations.en.seasonsList[s as keyof typeof translations.en.seasonsList]}>
                                            {t.seasonsList[s as keyof typeof t.seasonsList]}
                                        </option>
                                    ))}
                                </select>
                                {validationErrors.season && <p className="text-[11px] text-red-500 font-medium">{validationErrors.season}</p>}
                            </div>
                        </div>

                        {/* Row 3 — Optional */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={`flex items-center gap-1.5 text-sm font-semibold ${d ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <Leaf className="w-3.5 h-3.5 text-green-500" />
                                    {t.prevCrop} <span className="text-gray-400 text-xs font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="previously_grown"
                                    value={formData.previously_grown}
                                    onChange={handleChange}
                                    placeholder={t.prevCropPlaceholder}
                                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${d ? 'bg-[#2a2b3d] border-[#3a3b50] text-gray-200 placeholder-gray-500' : 'bg-gray-50/50 hover:bg-white border-gray-200'}`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {t.analyzing}
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-4 h-4" />
                                    {t.generate}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2.5">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Results */}
                {result && result.recommendations.length > 0 && (
                    <div className="space-y-6 sm:space-y-8">

                        {/* Recommendation Cards */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Sprout className={`w-5 h-5 ${d ? 'text-green-400' : 'text-green-600'}`} />
                                <h2 className={`text-lg sm:text-xl font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>{t.results}</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                {result.recommendations.map((rec, index) => {
                                    const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
                                    const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;
                                    const emoji = getCropEmoji(rec.recommended_crop);

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedCrop(index)}
                                            className={`rounded-xl p-4 border cursor-pointer transition-all duration-300 hover:shadow-lg group relative overflow-hidden ${selectedCrop === index
                                                ? d ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)] bg-[#2a2b3d]' : 'border-green-400 shadow-lg ring-1 ring-green-200 bg-white'
                                                : d ? 'border-[#33344a] border-opacity-50 hover:bg-[#2a2b3d] bg-[#252636]' : 'border-gray-200/80 hover:border-green-200 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-3 relative z-10">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="text-3xl filter drop-shadow-sm">{emoji}</span>
                                                    <h3 className={`text-base font-bold leading-tight ${d ? 'text-gray-100' : 'text-gray-900'}`}>
                                                        {rec.recommended_crop_localized || rec.recommended_crop}
                                                    </h3>
                                                </div>
                                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${selectedCrop === index ? 'bg-green-600 text-white' : d ? 'bg-[#33344a] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                                                    TOP {index + 1}
                                                </span>
                                            </div>

                                            <div className="relative">
                                                <p className={`text-xs mb-4 leading-relaxed italic transition-all duration-300 ${d ? 'text-gray-400' : 'text-gray-500'} ${expandedCrops.includes(index) ? '' : 'line-clamp-2'}`}>
                                                    {rec.why}
                                                </p>
                                                {rec.why && rec.why.length > 60 && (
                                                    <button
                                                        onClick={(e) => toggleExpand(e, index)}
                                                        className={`text-[10px] font-bold -mt-3 mb-3 block hover:underline ${d ? 'text-green-400' : 'text-green-600'}`}
                                                    >
                                                        {expandedCrops.includes(index) ? '↑ Show Less' : '↓ Read More'}
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 relative z-10">
                                                <div className={`p-2 rounded-xl border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-blue-500/10' : 'bg-blue-50/50 border-blue-100'}`}>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">{t.yield}</p>
                                                    <p className={`text-xs font-black ${d ? 'text-blue-400' : 'text-blue-700'}`}>{rec.expected_output_kg.toLocaleString()} kg</p>
                                                </div>
                                                <div className={`p-2 rounded-xl border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-amber-500/10' : 'bg-amber-50/50 border-amber-100'}`}>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">{t.budget}</p>
                                                    <p className={`text-xs font-black ${d ? 'text-amber-500' : 'text-amber-700'}`}>₹{rec.estimated_budget_needed_rs.toLocaleString()}</p>
                                                </div>
                                                <div className={`p-2 rounded-xl border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-green-500/10' : 'bg-green-50/50 border-green-100'}`}>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">{t.profit}</p>
                                                    <p className={`text-xs font-black ${d ? 'text-green-400' : 'text-green-700'}`}>₹{rec.expected_profit_range_rs[0].toLocaleString()}</p>
                                                </div>
                                                <div className={`p-2 rounded-xl border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-purple-500/10' : 'bg-purple-50/50 border-purple-100'}`}>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">ROI</p>
                                                    <p className={`text-xs font-black ${roi > 0 ? d ? 'text-purple-400' : 'text-purple-700' : 'text-red-500'}`}>{roi.toFixed(1)}%</p>
                                                </div>
                                            </div>

                                            {selectedCrop === index && (
                                                <div className={`mt-3 pt-3 border-t flex items-center justify-center gap-1.5 ${d ? 'border-green-500/20 text-green-400' : 'border-green-100 text-green-600'}`}>
                                                    <span className="text-[11px] font-black uppercase tracking-widest">{t.activeReport}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Charts Grid */}
                        <section className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-200/60'}`}>
                            <div className="flex items-center gap-2 mb-5">
                                <BarChart3 className={`w-5 h-5 ${d ? 'text-blue-400' : 'text-blue-600'}`} />
                                <h2 className={`text-lg sm:text-xl font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>{t.comparativeAnalytics}</h2>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                {/* Profit Analysis */}
                                <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border-blue-100/50'}`}>
                                    <h3 className={`text-sm font-bold mb-1 flex items-center gap-1.5 ${d ? 'text-gray-200' : 'text-gray-800'}`}>
                                        💰 {t.profitPotential}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mb-4">{t.profitPotential}</p>
                                    <div className="w-full">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={profitComparisonData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={d ? '#2e2f42' : '#e5e7eb'} />
                                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                                <Bar dataKey="Min Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Max Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* ROI Comparison */}
                                <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-green-50/80 to-emerald-50/50 border-green-100/50'}`}>
                                    <h3 className={`text-sm font-bold mb-1 flex items-center gap-1.5 ${d ? 'text-gray-200' : 'text-gray-800'}`}>
                                        📊 {t.roiComparison}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mb-4">Investment vs profit with ROI percentage</p>
                                    <div className="w-full">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={roiAnalysisData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={d ? '#2e2f42' : '#e5e7eb'} />
                                                <XAxis dataKey="crop" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                                <Line yAxisId="left" type="monotone" dataKey="Investment (₹)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                                                <Line yAxisId="left" type="monotone" dataKey="Expected Profit (₹)" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
                                                <Line yAxisId="right" type="monotone" dataKey="ROI %" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* NPK Nutrients */}
                                <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-amber-50/80 to-yellow-50/50 border-amber-100/50'}`}>
                                    <h3 className={`text-sm font-bold mb-1 flex items-center gap-1.5 ${d ? 'text-gray-200' : 'text-gray-800'}`}>
                                        🧪 {t.npkRequirements}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mb-4">Nitrogen, Phosphorus & Potassium needs (kg)</p>
                                    <div className="w-full">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={nutrientComparisonData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={d ? '#2e2f42' : '#e5e7eb'} />
                                                <XAxis dataKey="crop" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                                <Bar dataKey="Nitrogen" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Phosphorus" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="Potassium" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Water Requirements */}
                                <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-cyan-50/80 to-sky-50/50 border-cyan-100/50'}`}>
                                    <h3 className={`text-sm font-bold mb-1 flex items-center gap-1.5 ${d ? 'text-gray-200' : 'text-gray-800'}`}>
                                        💧 {t.waterRequirement}
                                    </h3>
                                    <p className="text-[11px] text-gray-500 mb-4">Daily water consumption (liters/day)</p>
                                    <div className="w-full">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <AreaChart data={waterRequirementData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={d ? '#2e2f42' : '#e5e7eb'} />
                                                <XAxis dataKey="crop" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} axisLine={false} tickLine={false} />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                                                <Area type="monotone" dataKey="Daily Water (L)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={d ? 0.2 : 0.4} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Selected Crop Deep Dive */}
                        {selectedCropData && (
                            <section className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-200/60'}`}>
                                <div className="flex items-center gap-2 mb-5">
                                    <span className="text-xl">{getCropEmoji(selectedCropData.recommended_crop)}</span>
                                    <div>
                                        <h2 className={`text-lg sm:text-xl font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>
                                            {selectedCropData.recommended_crop_localized || selectedCropData.recommended_crop} — {t.deepDive}
                                        </h2>
                                        <p className="text-xs text-gray-500">{t.activeReport}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Nutrient Radar */}
                                    <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-purple-50/80 to-violet-50/50 border-purple-100/50'}`}>
                                        <h3 className={`text-sm font-bold mb-1 ${d ? 'text-gray-200' : 'text-gray-800'}`}>🎯 {t.features.roi.title}</h3>
                                        <p className="text-[11px] text-gray-500 mb-3">Nutrient & water requirements radar</p>
                                        <div className="w-full">
                                            <ResponsiveContainer width="100%" height={260}>
                                                <RadarChart data={nutrientRadarData}>
                                                    <PolarGrid stroke={d ? '#2e2f42' : '#d1d5db'} />
                                                    <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 10, fill: d ? '#6b7280' : '#9ca3af' }} />
                                                    <PolarRadiusAxis angle={90} tick={{ fontSize: 9, fill: d ? '#6b7280' : '#9ca3af' }} stroke={d ? '#2e2f42' : '#d1d5db'} />
                                                    <Radar name="Requirements" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Fertilizer Pie */}
                                    <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-orange-50/80 to-amber-50/50 border-orange-100/50'}`}>
                                        <h3 className={`text-sm font-bold mb-1 ${d ? 'text-gray-200' : 'text-gray-800'}`}>🌿 {t.fertilizerMix}</h3>
                                        <p className="text-[11px] text-gray-500 mb-3">Quantity (kg) of each fertilizer type</p>
                                        <div className="w-full">
                                            <ResponsiveContainer width="100%" height={260}>
                                                <PieChart>
                                                    <Pie
                                                        data={selectedCropData.requirements.fertilizers}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={(entry: any) => `${entry.name_localized || entry.name}`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="amount_kg"
                                                        stroke={d ? '#1e1f2b' : '#fff'}
                                                    >
                                                        {selectedCropData.requirements.fertilizers.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => [`${value} kg`, 'Amount']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Resource Checklist */}
                                    <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-emerald-50/80 to-green-50/50 border-emerald-100/50'}`}>
                                        <h3 className={`text-sm font-bold mb-3 ${d ? 'text-gray-200' : 'text-gray-800'}`}>📋 Resource Checklist</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className={`text-[10px] font-black uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5 ${d ? 'text-blue-400' : 'text-blue-700'}`}>
                                                    <Droplets className="w-3 h-3" />
                                                    {t.waterRequirement}
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { label: 'Water', value: `${selectedCropData.requirements.water_liters_per_day.toLocaleString()} L/d` },
                                                        { label: 'Nitrogen', value: `${selectedCropData.requirements.nitrogen_kg} kg` },
                                                        { label: 'Phosphorus', value: `${selectedCropData.requirements.phosphorus_kg} kg` },
                                                        { label: 'Potassium', value: `${selectedCropData.requirements.potassium_kg} kg` },
                                                    ].map((item) => (
                                                        <div key={item.label} className={`flex flex-col p-2.5 rounded-xl border transition-colors ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-blue-100'}`}>
                                                            <span className="text-[10px] text-gray-500 font-bold mb-0.5">{item.label}</span>
                                                            <span className={`text-xs font-black ${d ? 'text-gray-100' : 'text-gray-900'}`}>{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className={`text-[10px] font-black uppercase tracking-[0.1em] mb-2 ${d ? 'text-emerald-400' : 'text-emerald-700'}`}>{t.fertilizers}</h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {selectedCropData.requirements.fertilizers.map((fert, index) => (
                                                        <div key={index} className={`flex flex-col p-2.5 rounded-xl border transition-colors ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-green-100'}`}>
                                                            <span className="text-[10px] text-gray-500 font-bold mb-0.5">{fert.name_localized || fert.name}</span>
                                                            <span className={`text-xs font-black ${d ? 'text-gray-100' : 'text-gray-900'}`}>{fert.amount_kg} kg</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alternative Crops */}
                                    <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gradient-to-br from-pink-50/80 to-rose-50/50 border-pink-100/50'}`}>
                                        <h3 className={`text-sm font-bold mb-1 ${d ? 'text-gray-200' : 'text-gray-800'}`}>🌾 {t.alternatives}</h3>
                                        <p className="text-[11px] text-gray-500 mb-4">{t.alternativeDesc}</p>
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {selectedCropData.top_similar_crops.map((crop, index) => (
                                                <span key={index} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${d ? 'bg-[#252636] border-pink-500/20 text-gray-200' : 'bg-white border-pink-100 text-gray-700 shadow-sm'
                                                    }`}>
                                                    {getCropEmoji(crop)} {selectedCropData.top_similar_crops_localized?.[index] || crop}
                                                </span>
                                            ))}
                                        </div>
                                        <div className={`p-4 rounded-xl border italic text-xs leading-relaxed ${d ? 'bg-pink-900/10 border-pink-500/20 text-gray-400' : 'bg-pink-50/50 border-pink-100 text-gray-600'
                                            }`}>
                                            <strong className={d ? 'text-pink-400' : 'text-pink-700'}>{t.expertTip}:</strong> {t.expertTipDesc}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Financial Summary */}
                        <section className={`rounded-3xl shadow-xl p-6 sm:p-8 text-white relative overflow-hidden transition-all ${d ? 'bg-[#252636] border border-[#33344a]' : 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700'
                            }`}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-black">{t.results}</h2>
                                        <p className="text-sm text-green-100/70">{t.footerWarning}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {result.recommendations.map((rec, index) => {
                                        const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
                                        const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;
                                        const profitMargin = ((avgProfit / rec.estimated_budget_needed_rs) * 100);

                                        return (
                                            <div key={index} className={`backdrop-blur-md rounded-2xl p-5 border transition-all hover:scale-[1.02] ${d ? 'bg-[#1e1f2b]/60 border-white/5' : 'bg-white/10 border-white/20 shadow-lg'
                                                }`}>
                                                <div className="flex items-center gap-2.5 mb-5">
                                                    <span className="text-2xl">{getCropEmoji(rec.recommended_crop)}</span>
                                                    <h3 className="font-bold text-sm tracking-tight">{rec.recommended_crop}</h3>
                                                </div>

                                                <div className="space-y-3.5 mb-5">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] text-green-100 font-bold uppercase tracking-widest leading-none">{t.budget}</span>
                                                        <span className="font-black text-sm leading-none">₹{rec.estimated_budget_needed_rs.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] text-green-100 font-bold uppercase tracking-widest leading-none">{t.profit}</span>
                                                        <span className="font-black text-sm text-yellow-300 leading-none">₹{avgProfit.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-[10px] text-green-100 font-bold uppercase tracking-widest leading-none">ROI</span>
                                                        <span className="font-black text-sm text-green-300 leading-none">{roi.toFixed(1)}%</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-[9px] mb-1.5 font-black uppercase tracking-[0.2em] text-green-200">
                                                        <span>{t.marginAnalysis}</span>
                                                        <span>{profitMargin.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${Math.min(profitMargin, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-8 p-4 bg-black/10 rounded-2xl border border-white/5 flex gap-3 items-start">
                                    <Info className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-green-50/70 leading-relaxed italic">
                                        {t.financialDisclaimer}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative background elements */}
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-green-400/10 rounded-full blur-3xl pointer-events-none"></div>
                        </section>

                        {/* Historical Data Reference */}
                        <section className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-200/60'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Info className="w-5 h-5 text-blue-600" />
                                    <h2 className={`text-lg sm:text-xl font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>{t.dataReference}</h2>
                                </div>
                                {(!result.rag_used || result.rag_used.length === 0) && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200 uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                        Offline
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mb-4">
                                {t.dataReferenceDesc}
                            </p>

                            {result.rag_used && result.rag_used.length > 0 ? (
                                <div className="overflow-x-auto -mx-4 sm:mx-0">
                                    <div className="min-w-[600px] px-4 sm:px-0">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className={`border-b transition-colors ${d ? 'bg-[#1e1f2b] border-[#33344a]' : 'bg-gray-50 border-gray-200'}`}>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.crop}</th>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.year}</th>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.season}</th>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.area}</th>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.production}</th>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.yield}</th>
                                                    <th className={`px-3 py-3 text-left font-bold uppercase tracking-wider ${d ? 'text-gray-400' : 'text-gray-600'}`}>{t.rainfall}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {result.rag_used.slice(0, 5).map((data, index) => (
                                                    <tr key={index} className={`border-b transition-colors ${d ? 'border-[#33344a] hover:bg-[#1e1f2b]' : 'border-gray-100 hover:bg-gray-50/50'}`}>
                                                        <td className={`px-3 py-3 font-bold ${d ? 'text-gray-200' : 'text-gray-800'}`}>{data.Crop}</td>
                                                        <td className={`px-3 py-3 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{data.Crop_Year}</td>
                                                        <td className={`px-3 py-3 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{data.Season?.trim()}</td>
                                                        <td className={`px-3 py-3 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{data.Area?.toLocaleString()}</td>
                                                        <td className={`px-3 py-3 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{data.Production?.toLocaleString()}</td>
                                                        <td className={`px-3 py-3 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{data.Yield?.toFixed(2)}</td>
                                                        <td className={`px-3 py-3 ${d ? 'text-gray-400' : 'text-gray-600'}`}>{data.Annual_Rainfall}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-gray-50/50 border-gray-200'}`}>
                                    <div className="mb-3 p-3 bg-gray-100 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <h4 className={`text-sm font-bold mb-1 ${d ? 'text-gray-300' : 'text-gray-700'}`}>Historical Data Unavailable</h4>
                                    <p className={`text-xs max-w-sm ${d ? 'text-gray-500' : 'text-gray-500'}`}>
                                        The AgriSense historical database is currently unreachable. Recommendations are being generated using AI expertise while we reconnect.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Action Plan */}
                        <section className={`rounded-2xl shadow-sm border p-4 sm:p-6 transition-colors duration-300 ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-200/60'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className={`w-5 h-5 ${d ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                <h2 className={`text-lg sm:text-xl font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>{t.dashboard.nextSteps}</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {t.dashboard.actions.map((step: any, idx: number) => (
                                    <div key={idx} className={`rounded-2xl p-4 border transition-colors ${d ? 'bg-[#1e1f2b] border-[#33344a]' : 'bg-gray-50 border-gray-100'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${d ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700'
                                                }`}>{idx + 1}</span>
                                            <span className="text-sm">{['🔬', '🌱', '💧', '💰'][idx]}</span>
                                            <h3 className={`text-sm font-bold ${d ? 'text-gray-200' : 'text-gray-800'}`}>{step.title}</h3>
                                        </div>
                                        <p className={`text-[11px] mb-3 leading-relaxed ${d ? 'text-gray-400' : 'text-gray-500'}`}>{step.desc}</p>
                                        <ul className={`text-[11px] space-y-1.5 list-none ${d ? 'text-gray-500' : 'text-gray-500'}`}>
                                            {step.steps.map((s: string, i: number) => (
                                                <li key={i} className="flex gap-2 items-start">
                                                    <div className="w-1 h-1 rounded-full bg-indigo-400 mt-[6px] shrink-0"></div>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-2">
                                <CloudRain className={`w-4 h-4 flex-shrink-0 mt-0.5 ${d ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                <div>
                                    <h4 className="text-xs font-bold text-gray-800">{t.dashboard.monitoring}</h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed">
                                        {t.dashboard.monitoringDesc}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Disclaimer */}
                        <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 flex items-start gap-2.5">
                            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${d ? 'text-amber-500/80' : 'text-amber-600'}`} />
                            <div>
                                <h3 className="text-xs font-bold text-gray-800 mb-1">{t.dashboard.disclaimerTitle}</h3>
                                <p className="text-[11px] text-gray-600 leading-relaxed">
                                    {t.dashboard.disclaimerDesc}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className={`border-t mt-8 transition-colors duration-300 ${d ? 'border-[#2e2f42] bg-[#252636]' : 'border-gray-200/60 bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 py-5 text-center">
                    <p className={`text-xs ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                        {t.dashboard.footerText}
                    </p>
                </div>
            </footer>
            </div>
        </div>
    );
}

export default function CropAnalyzerDashboard() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-[#1e1f2b]">
                <Sprout className="w-10 h-10 text-green-500 animate-pulse" />
            </div>
        }>
            <CropAnalyzerContent />
        </Suspense>
    );
}
