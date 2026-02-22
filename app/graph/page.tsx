'use client';

import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart
} from 'recharts';
import { Sprout, Droplets, TrendingUp, DollarSign, Package, AlertCircle, Info, Leaf, Sun, CloudRain } from 'lucide-react';


interface Recommendation {
    recommended_crop: string;
    why: string;
    requirements: {
        water_liters_per_day: number;
        nitrogen_kg: number;
        phosphorus_kg: number;
        potassium_kg: number;
        fertilizers: { name: string; amount_kg: number }[];
    };
    expected_output_kg: number;
    expected_profit_range_rs: [number, number];
    estimated_budget_needed_rs: number;
    top_similar_crops: string[];
}

interface ApiResponse {
    success: boolean;
    recommendations: Recommendation[];
    rag_used?: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function CropAnalyzerDashboard() {
    const [formData, setFormData] = useState({
        location: '',
        size: '',
        previously_grown: '',
        budget: ''
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState('');
    const [selectedCrop, setSelectedCrop] = useState<number>(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                    budget: parseFloat(formData.budget)
                }),
            });

            const data = await response.json();

            if (data.success) {
                setResult(data);
                setSelectedCrop(0);
            } else {
                setError(data.error || 'Failed to get recommendations');
            }
        } catch (err) {
            setError('Failed to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Data preparation for visualizations
    const profitComparisonData = result?.recommendations.map(rec => ({
        name: rec.recommended_crop,
        'Minimum Profit': rec.expected_profit_range_rs[0],
        'Maximum Profit': rec.expected_profit_range_rs[1],
        'Average Profit': (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2
    })) || [];

    const nutrientComparisonData = result?.recommendations.map(rec => ({
        crop: rec.recommended_crop,
        Nitrogen: rec.requirements.nitrogen_kg,
        Phosphorus: rec.requirements.phosphorus_kg,
        Potassium: rec.requirements.potassium_kg,
    })) || [];

    const waterRequirementData = result?.recommendations.map(rec => ({
        crop: rec.recommended_crop,
        'Daily Water (Liters)': rec.requirements.water_liters_per_day,
    })) || [];

    const roiAnalysisData = result?.recommendations.map(rec => {
        const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
        const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;
        return {
            crop: rec.recommended_crop,
            'Investment (₹)': rec.estimated_budget_needed_rs,
            'Expected Profit (₹)': avgProfit,
            'ROI %': parseFloat(roi.toFixed(1))
        };
    }) || [];

    const selectedCropData = result?.recommendations[selectedCrop];

    const nutrientRadarData = selectedCropData ? [
        { nutrient: 'Nitrogen', value: selectedCropData.requirements.nitrogen_kg, fullMark: 50 },
        { nutrient: 'Phosphorus', value: selectedCropData.requirements.phosphorus_kg, fullMark: 50 },
        { nutrient: 'Potassium', value: selectedCropData.requirements.potassium_kg, fullMark: 50 },
        { nutrient: 'Water (L/10)', value: selectedCropData.requirements.water_liters_per_day / 10, fullMark: 50 },
    ] : [];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {typeof entry.value === 'number' ?
                                (entry.name.includes('₹') || entry.name.includes('Profit') || entry.name.includes('Investment') ?
                                    `₹${entry.value.toLocaleString()}` :
                                    entry.name.includes('%') ?
                                        `${entry.value}%` :
                                        entry.value.toLocaleString())
                                : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
            {/* Hero Section */}
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
                        Chat
                    </a>
                </div>
            </header>
            <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white py-16 px-4 shadow-2xl overflow-hidden">
                {/* Internal CSS Styles */}
                <style jsx>{`
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        * {
            transition-property: transform, background-color, border-color;
            transition-duration: 300ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
    `}</style>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
                    <div className="absolute top-1/2 right-20 w-32 h-32 bg-teal-300 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-emerald-300 rounded-full blur-xl"></div>
                </div>

                {/* Floating Icons */}
                <div className="absolute top-4 left-1/4 opacity-20 text-2xl animate-float">
                    🌾
                </div>
                <div className="absolute top-8 right-1/3 opacity-20 text-2xl animate-float" style={{ animationDelay: '2s' }}>
                    🌱
                </div>
                <div className="absolute bottom-8 left-1/3 opacity-20 text-2xl animate-float" style={{ animationDelay: '4s' }}>
                    💧
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Main Header with Enhanced Styling */}
                    <div className="flex flex-col items-center justify-center text-center">
                        {/* Icon with Glow Effect */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30 animate-pulse"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-white to-green-100 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105">
                                <div className="text-3xl">🌱</div>
                            </div>
                        </div>

                        {/* Main Heading with Gradient Text */}
                        <h1 className="text-6xl font-black mb-6 tracking-tight">
                            <span className="bg-gradient-to-r from-white via-green-100 to-emerald-200 bg-clip-text text-transparent">
                                AgriSense
                            </span>
                            <span className="block text-3xl font-light text-green-100 mt-2 tracking-wider">
                                INTELLIGENCE PLATFORM
                            </span>
                        </h1>

                        {/* Enhanced Tagline */}
                        <div className="relative">
                            <p className="text-xl font-light text-green-50 max-w-4xl mx-auto leading-relaxed mb-4">
                                Advanced AI-Powered Agricultural Analytics &
                                <span className="font-semibold text-white"> Precision Farming Insights</span>
                            </p>

                            {/* Feature Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                                {['Machine Learning', 'Real-time Analytics', 'Climate Smart', 'Data Driven'].map((feature, index) => (
                                    <span
                                        key={feature}
                                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 hover:scale-105"
                                        style={{
                                            animationDelay: `${index * 0.5}s`
                                        }}
                                    >
                                        ✨ {feature}
                                    </span>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>

                {/* Bottom Wave Decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 text-green-700" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Enhanced Input Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Info className="w-6 h-6 text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-800">Farm Information</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Sun className="w-4 h-4 text-orange-500" />
                                    Location / Region
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g., Karnataka, Punjab, Maharashtra"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500">Enter your farming region for climate-specific recommendations</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Package className="w-4 h-4 text-blue-500" />
                                    Land Size (acres)
                                </label>
                                <input
                                    type="number"
                                    name="size"
                                    step="0.1"
                                    value={formData.size}
                                    onChange={handleChange}
                                    placeholder="e.g., 5.0"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500">Total cultivable land area available for farming</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Leaf className="w-4 h-4 text-green-500" />
                                    Previously Grown Crop
                                </label>
                                <input
                                    type="text"
                                    name="previously_grown"
                                    value={formData.previously_grown}
                                    onChange={handleChange}
                                    placeholder="e.g., rice, wheat, cotton"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                                <p className="text-xs text-gray-500">Last crop grown for crop rotation analysis (optional)</p>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <DollarSign className="w-4 h-4 text-yellow-500" />
                                    Available Budget (₹)
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="e.g., 50000"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500">Total investment capacity for seeds, fertilizers & resources</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Analyzing Farm Data...
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5" />
                                    Generate AI Recommendations
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {result && result.recommendations.length > 0 && (
                    <div className="space-y-8">
                        {/* Top Recommendations Cards */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Sprout className="w-7 h-7 text-green-600" />
                                Top 3 Recommended Crops
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {result.recommendations.map((rec, index) => {
                                    const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
                                    const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedCrop(index)}
                                            className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${selectedCrop === index
                                                ? 'border-green-500 ring-2 ring-green-200'
                                                : 'border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-2xl font-bold text-gray-800">
                                                    {rec.recommended_crop}
                                                </h3>
                                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    #{index + 1}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{rec.why}</p>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                                    <span className="text-gray-600 text-sm flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-blue-600" />
                                                        Expected Yield
                                                    </span>
                                                    <span className="font-bold text-blue-700">{rec.expected_output_kg.toLocaleString()} kg</span>
                                                </div>

                                                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                                    <span className="text-gray-600 text-sm flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-yellow-600" />
                                                        Investment
                                                    </span>
                                                    <span className="font-bold text-yellow-700">₹{rec.estimated_budget_needed_rs.toLocaleString()}</span>
                                                </div>

                                                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                                    <span className="text-gray-600 text-sm flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                                        Profit Range
                                                    </span>
                                                    <span className="font-bold text-green-700 text-right">
                                                        ₹{rec.expected_profit_range_rs[0].toLocaleString()}<br />
                                                        to ₹{rec.expected_profit_range_rs[1].toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                                                    <span className="text-gray-600 text-sm flex items-center gap-2">
                                                        <TrendingUp className="w-4 h-4 text-purple-600" />
                                                        Est. ROI
                                                    </span>
                                                    <span className="font-bold text-purple-700">{roi.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Detailed Analytics Section */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-7 h-7 text-blue-600" />
                                Comparative Analytics Dashboard
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Profit Analysis */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        💰 Profit Potential Analysis
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Comparison of minimum, maximum, and average expected profits across recommended crops
                                    </p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={profitComparisonData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="Minimum Profit" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="Maximum Profit" fill="#10b981" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* ROI Comparison */}
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        📊 Return on Investment (ROI) Comparison
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Investment vs expected profit with ROI percentage for each crop option
                                    </p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={roiAnalysisData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="Investment (₹)" stroke="#f59e0b" strokeWidth={3} />
                                            <Line yAxisId="left" type="monotone" dataKey="Expected Profit (₹)" stroke="#10b981" strokeWidth={3} />
                                            <Line yAxisId="right" type="monotone" dataKey="ROI %" stroke="#8b5cf6" strokeWidth={3} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* NPK Nutrients */}
                                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        🧪 NPK Nutrient Requirements
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Nitrogen, Phosphorus, and Potassium needs (kg) for each recommended crop
                                    </p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={nutrientComparisonData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="Nitrogen" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="Phosphorus" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="Potassium" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Water Requirements */}
                                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        💧 Daily Water Requirements
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Daily water consumption (liters per day) needed for optimal crop growth
                                    </p>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={waterRequirementData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                            <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Area type="monotone" dataKey="Daily Water (Liters)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Selected Crop Deep Dive */}
                        {selectedCropData && (
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Leaf className="w-7 h-7 text-green-600" />
                                    Detailed Analysis: {selectedCropData.recommended_crop}
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Nutrient Radar */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            🎯 Resource Requirements Profile
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Comprehensive view of all nutrient and water requirements for this crop
                                        </p>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <RadarChart data={nutrientRadarData}>
                                                <PolarGrid stroke="#d1d5db" />
                                                <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 12 }} />
                                                <PolarRadiusAxis angle={90} domain={[0, 50]} tick={{ fontSize: 10 }} />
                                                <Radar name="Requirements" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                                <Tooltip />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Fertilizer Breakdown */}
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            🌿 Fertilizer Distribution
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Exact quantity (kg) of each fertilizer type required for optimal growth
                                        </p>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={selectedCropData.requirements.fertilizers}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry: any) => `${entry.name}: ${entry.amount_kg}kg`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="amount_kg"
                                                >
                                                    {selectedCropData.requirements.fertilizers.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} kg`, 'Amount']} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Detailed Requirements */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            📋 Complete Resource Checklist
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    <Droplets className="w-4 h-4 text-blue-600" />
                                                    Water & Nutrients
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between p-2 bg-white rounded">
                                                        <span className="text-gray-600">Daily Water</span>
                                                        <span className="font-semibold">{selectedCropData.requirements.water_liters_per_day} L/day</span>
                                                    </div>
                                                    <div className="flex justify-between p-2 bg-white rounded">
                                                        <span className="text-gray-600">Nitrogen (N)</span>
                                                        <span className="font-semibold">{selectedCropData.requirements.nitrogen_kg} kg</span>
                                                    </div>
                                                    <div className="flex justify-between p-2 bg-white rounded">
                                                        <span className="text-gray-600">Phosphorus (P)</span>
                                                        <span className="font-semibold">{selectedCropData.requirements.phosphorus_kg} kg</span>
                                                    </div>
                                                    <div className="flex justify-between p-2 bg-white rounded">
                                                        <span className="text-gray-600">Potassium (K)</span>
                                                        <span className="font-semibold">{selectedCropData.requirements.potassium_kg} kg</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-700 mb-2">
                                                    🧪 Fertilizer Mix
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    {selectedCropData.requirements.fertilizers.map((fert, index) => (
                                                        <div key={index} className="flex justify-between p-2 bg-white rounded">
                                                            <span className="text-gray-600">{fert.name}</span>
                                                            <span className="font-semibold">{fert.amount_kg} kg</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Alternative Crops */}
                                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                            🌾 Similar Alternative Crops
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Other crops with similar growing conditions that you might consider
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {selectedCropData.top_similar_crops.map((crop, index) => (
                                                <div key={index} className="bg-white px-4 py-3 rounded-xl shadow-sm border-2 border-pink-200 hover:border-pink-400 transition-all">
                                                    <span className="font-semibold text-gray-700">{crop}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 p-4 bg-white rounded-xl">
                                            <h4 className="font-semibold text-gray-700 mb-2">Why consider alternatives?</h4>
                                            <p className="text-sm text-gray-600">
                                                These crops have similar resource requirements and can be planted in case of seed
                                                unavailability or if you want to diversify your farm portfolio for risk management.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Financial Summary */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-2xl p-8 text-white">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <DollarSign className="w-7 h-7" />
                                Financial Summary & Investment Overview
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {result.recommendations.map((rec, index) => {
                                    const avgProfit = (rec.expected_profit_range_rs[0] + rec.expected_profit_range_rs[1]) / 2;
                                    const roi = ((avgProfit - rec.estimated_budget_needed_rs) / rec.estimated_budget_needed_rs) * 100;
                                    const profitMargin = ((avgProfit / rec.estimated_budget_needed_rs) * 100);

                                    return (
                                        <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                            <h3 className="text-xl font-bold mb-4">{rec.recommended_crop}</h3>

                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                                                    <span className="text-green-100">Total Investment</span>
                                                    <span className="font-bold text-lg">₹{rec.estimated_budget_needed_rs.toLocaleString()}</span>
                                                </div>

                                                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                                                    <span className="text-green-100">Expected Yield</span>
                                                    <span className="font-bold">{rec.expected_output_kg.toLocaleString()} kg</span>
                                                </div>

                                                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                                                    <span className="text-green-100">Profit Range</span>
                                                    <span className="font-bold">
                                                        ₹{rec.expected_profit_range_rs[0].toLocaleString()} - ₹{rec.expected_profit_range_rs[1].toLocaleString()}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center pb-2 border-b border-white/20">
                                                    <span className="text-green-100">Average Profit</span>
                                                    <span className="font-bold text-lg">₹{avgProfit.toLocaleString()}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-green-100">Return on Investment</span>
                                                    <span className="font-bold text-xl text-yellow-300">{roi.toFixed(1)}%</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-3 bg-white/10 rounded-lg">
                                                <div className="text-xs text-green-100 mb-1">Profit Margin</div>
                                                <div className="w-full bg-white/20 rounded-full h-2">
                                                    <div
                                                        className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min(profitMargin, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-right text-xs mt-1">{profitMargin.toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                                <p className="text-sm text-green-50">
                                    <strong>Note:</strong> All profit calculations are estimates based on current market conditions,
                                    historical data, and optimal growing conditions. Actual results may vary based on weather,
                                    market fluctuations, crop management practices, and other factors.
                                </p>
                            </div>
                        </div>

                        {/* Data Source Information */}
                        {result.rag_used && result.rag_used.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Info className="w-7 h-7 text-blue-600" />
                                    Historical Data Reference
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    These recommendations are powered by historical agricultural data from your region.
                                    Here's a sample of the data used for analysis:
                                </p>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 border-b-2 border-gray-300">
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Crop</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Season</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Area (ha)</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Production (tons)</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Yield</th>
                                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Rainfall (mm)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.rag_used.slice(0, 5).map((data, index) => (
                                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-800">{data.Crop}</td>
                                                    <td className="px-4 py-3 text-gray-600">{data.Crop_Year}</td>
                                                    <td className="px-4 py-3 text-gray-600">{data.Season?.trim()}</td>
                                                    <td className="px-4 py-3 text-gray-600">{data.Area?.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-gray-600">{data.Production?.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-gray-600">{data.Yield?.toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-gray-600">{data.Annual_Rainfall}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-sm text-gray-700">
                                        <strong>About the data:</strong> This analysis uses {result.rag_used.length} historical
                                        records from the {result.rag_used[0]?.State} region to provide accurate, data-driven
                                        recommendations tailored to your local conditions.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Items */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl p-8 border border-indigo-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <AlertCircle className="w-7 h-7 text-indigo-600" />
                                Next Steps & Action Plan
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
                                        Soil Testing
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Get your soil tested to verify NPK levels and pH balance before purchasing fertilizers.
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Contact local agricultural department</li>
                                        <li>Collect soil samples from multiple spots</li>
                                        <li>Wait 7-10 days for results</li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
                                        Seed Procurement
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Source high-quality certified seeds from authorized dealers or government seed corporations.
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Verify seed certification</li>
                                        <li>Check germination rate (85%+)</li>
                                        <li>Buy 10% extra for contingency</li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
                                        Water Management
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Plan irrigation based on the recommended daily water requirements shown above.
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Install drip irrigation for efficiency</li>
                                        <li>Check water table levels</li>
                                        <li>Plan for monsoon/dry season</li>
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">4</span>
                                        Budget Planning
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Allocate funds for seeds, fertilizers, labor, irrigation, and contingency expenses.
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Keep 20% buffer for emergencies</li>
                                        <li>Explore agricultural loans if needed</li>
                                        <li>Consider crop insurance options</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border-l-4 border-indigo-500">
                                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <CloudRain className="w-5 h-5 text-blue-600" />
                                    Weather Monitoring
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Keep track of weather forecasts and rainfall predictions. Plant timing is crucial for optimal
                                    crop performance. Consider subscribing to agricultural weather services or mobile apps for
                                    real-time updates and alerts.
                                </p>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2">Important Disclaimer</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        These recommendations are generated using AI and historical data analysis. While we strive
                                        for accuracy, actual results may vary based on multiple factors including weather conditions,
                                        soil quality, pest management, market prices, and farming practices. Always consult with
                                        local agricultural experts and consider getting soil testing done before making final decisions.
                                        The profit estimates are indicative and should be used as general guidance rather than guaranteed returns.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-white py-8 px-4 mt-12">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-sm text-gray-400">
                        Powered by AI & Historical Agricultural Data | Data-Driven Farming Solutions
                    </p>
                </div>
            </div>
        </div>
    );
}