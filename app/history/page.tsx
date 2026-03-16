'use client';

import React, { useState, useEffect } from 'react';
import { Sprout, MessageSquare, BarChart3, Clock, Trash2, ChevronRight, Moon, Sun, ArrowLeft, Search, Loader2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useUser } from '@clerk/nextjs';

interface ConversationHistory {
    _id: string;
    conversationId: string;
    title: string;
    messages: { type: string; content: string; timestamp: string }[];
    createdAt: string;
    updatedAt: string;
}

interface AnalysisHistory {
    _id: string;
    input: {
        location: string;
        size: string;
        soil_type: string;
        water_source: string;
        season: string;
        budget: string;
        previously_grown: string;
    };
    recommendations: {
        recommended_crop: string;
        recommended_crop_localized?: string;
        expected_profit_range_rs: [number, number];
        expected_output_kg: number;
    }[];
    createdAt: string;
}

export default function HistoryPage() {
    const { dark, toggleTheme } = useTheme();
    const { t } = useLanguage();
    const { user, isLoaded } = useUser();
    const d = dark;

    const [activeTab, setActiveTab] = useState<'conversations' | 'analyses'>('conversations');
    const [conversations, setConversations] = useState<ConversationHistory[]>([]);
    const [analyses, setAnalyses] = useState<AnalysisHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && user) {
            fetchHistory();
        }
    }, [isLoaded, user]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/history');
            const data = await res.json();
            if (data.success) {
                setConversations(data.conversations || []);
                setAnalyses(data.analyses || []);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: string, type: string) => {
        setDeleting(id);
        try {
            await fetch(`/api/history?id=${id}&type=${type}`, { method: 'DELETE' });
            if (type === 'conversation') {
                setConversations(prev => prev.filter(c => c._id !== id));
            } else {
                setAnalyses(prev => prev.filter(a => a._id !== id));
            }
        } catch (err) {
            console.error('Failed to delete:', err);
        } finally {
            setDeleting(null);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages?.some(m => m.content?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredAnalyses = analyses.filter(a =>
        a.input?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.recommendations?.some(r => r.recommended_crop?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (!isLoaded) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${d ? 'bg-[#1e1f2b]' : 'bg-gray-50'}`}>
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${d ? 'bg-[#1e1f2b]' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-300 ${d ? 'border-[#2e2f42] bg-[#252636]/90' : 'border-gray-200/60 bg-white/90'}`}>
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-1.5 rounded-lg shadow-sm">
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <span className={`text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent ${d ? 'from-green-400 to-emerald-400' : 'from-green-700 to-emerald-600'}`}>
                                AgriSense AI
                            </span>
                        </a>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${d ? 'bg-[#2e2f42] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            History
                        </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <LanguageSwitcher dark={d} />
                        <button onClick={toggleTheme} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${d ? 'bg-[#2e2f42] text-yellow-400 hover:bg-[#3a3b50]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {d ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>
                        <nav className="hidden sm:flex items-center gap-1">
                            <a href="/chat" className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${d ? 'text-gray-400 hover:text-green-400 hover:bg-[#2e2f42]' : 'text-gray-600 hover:text-green-700 hover:bg-green-50'}`}>{t.chat}</a>
                            <a href="/graph" className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${d ? 'text-gray-400 hover:text-green-400 hover:bg-[#2e2f42]' : 'text-gray-600 hover:text-green-700 hover:bg-green-50'}`}>{t.analysis}</a>
                            <a href="/history" className={`px-3 py-1.5 text-sm font-semibold rounded-lg ${d ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-50'}`}>History</a>
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${d ? 'text-white' : 'text-gray-900'}`}>
                            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">History</span>
                        </h1>
                        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
                            Past conversations and crop analyses saved to your account
                        </p>
                    </div>
                    <a href="/chat" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm">
                        <MessageSquare className="w-4 h-4" />
                        New Chat
                    </a>
                </div>

                {/* Search & Tabs */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${d ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Search history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all ${d ? 'bg-[#252636] border-[#33344a] text-gray-200 placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'}`}
                        />
                    </div>
                    <div className={`flex rounded-xl border overflow-hidden ${d ? 'border-[#33344a]' : 'border-gray-200'}`}>
                        <button
                            onClick={() => setActiveTab('conversations')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'conversations'
                                ? d ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'
                                : d ? 'bg-[#252636] text-gray-400 hover:text-gray-200' : 'bg-white text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Chats
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'conversations' ? d ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700' : d ? 'bg-[#33344a] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                {conversations.length}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('analyses')}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all ${activeTab === 'analyses'
                                ? d ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'
                                : d ? 'bg-[#252636] text-gray-400 hover:text-gray-200' : 'bg-white text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Analyses
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'analyses' ? d ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700' : d ? 'bg-[#33344a] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                {analyses.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                        <p className={`text-sm ${d ? 'text-gray-500' : 'text-gray-400'}`}>Loading your history...</p>
                    </div>
                )}

                {/* Conversations Tab */}
                {!loading && activeTab === 'conversations' && (
                    <div className="space-y-3">
                        {filteredConversations.length === 0 ? (
                            <div className={`text-center py-20 rounded-2xl border ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-100'}`}>
                                <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${d ? 'text-gray-600' : 'text-gray-300'}`} />
                                <h3 className={`text-lg font-bold mb-2 ${d ? 'text-gray-300' : 'text-gray-700'}`}>No conversations yet</h3>
                                <p className={`text-sm mb-6 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Start chatting with AgriSense AI to see your history here</p>
                                <a href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all">
                                    Start a Chat <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        ) : (
                            filteredConversations.map((convo) => (
                                <div
                                    key={convo._id}
                                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${d ? 'bg-[#252636] border-[#33344a] hover:border-green-500/30' : 'bg-white border-gray-100 hover:border-green-200 hover:shadow-md'
                                        }`}
                                >
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === convo._id ? null : convo._id)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${d ? 'bg-green-900/30' : 'bg-green-50'}`}>
                                                <MessageSquare className={`w-5 h-5 ${d ? 'text-green-400' : 'text-green-600'}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className={`text-sm font-bold truncate ${d ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    {convo.title || 'Untitled Chat'}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className={`w-3 h-3 ${d ? 'text-gray-600' : 'text-gray-400'}`} />
                                                    <span className={`text-[11px] ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {formatDate(convo.updatedAt || convo.createdAt)}
                                                    </span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${d ? 'bg-[#33344a] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                                                        {convo.messages?.length || 0} msgs
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteItem(convo._id, 'conversation'); }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${d ? 'text-gray-600 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}
                                                disabled={deleting === convo._id}
                                            >
                                                {deleting === convo._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedId === convo._id ? 'rotate-90' : ''} ${d ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Chat Preview */}
                                    {expandedId === convo._id && convo.messages && (
                                        <div className={`px-4 pb-4 border-t ${d ? 'border-[#33344a]' : 'border-gray-100'}`}>
                                            <div className="pt-3 space-y-2 max-h-80 overflow-y-auto">
                                                {convo.messages.slice(0, 10).map((msg, idx) => (
                                                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.type === 'user'
                                                            ? d ? 'bg-green-700 text-white' : 'bg-green-600 text-white'
                                                            : d ? 'bg-[#1e1f2b] border border-[#33344a] text-gray-300' : 'bg-gray-50 border border-gray-100 text-gray-700'
                                                            }`}>
                                                            {msg.content?.slice(0, 200)}{msg.content?.length > 200 ? '...' : ''}
                                                        </div>
                                                    </div>
                                                ))}
                                                {convo.messages.length > 10 && (
                                                    <p className={`text-center text-[11px] py-2 ${d ? 'text-gray-600' : 'text-gray-400'}`}>
                                                        +{convo.messages.length - 10} more messages
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Analyses Tab */}
                {!loading && activeTab === 'analyses' && (
                    <div className="space-y-3">
                        {filteredAnalyses.length === 0 ? (
                            <div className={`text-center py-20 rounded-2xl border ${d ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-100'}`}>
                                <BarChart3 className={`w-12 h-12 mx-auto mb-4 ${d ? 'text-gray-600' : 'text-gray-300'}`} />
                                <h3 className={`text-lg font-bold mb-2 ${d ? 'text-gray-300' : 'text-gray-700'}`}>No analyses yet</h3>
                                <p className={`text-sm mb-6 ${d ? 'text-gray-500' : 'text-gray-400'}`}>Run a crop analysis to see your saved results here</p>
                                <a href="/graph" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all">
                                    Run Analysis <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        ) : (
                            filteredAnalyses.map((analysis) => (
                                <div
                                    key={analysis._id}
                                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${d ? 'bg-[#252636] border-[#33344a] hover:border-green-500/30' : 'bg-white border-gray-100 hover:border-green-200 hover:shadow-md'
                                        }`}
                                >
                                    <div
                                        className="flex items-center justify-between p-4 cursor-pointer"
                                        onClick={() => setExpandedId(expandedId === analysis._id ? null : analysis._id)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${d ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                                                <BarChart3 className={`w-5 h-5 ${d ? 'text-blue-400' : 'text-blue-600'}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className={`text-sm font-bold truncate ${d ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    📍 {analysis.input?.location || 'Unknown Location'} — {analysis.input?.size || '?'} acres
                                                </h3>
                                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                    <Clock className={`w-3 h-3 ${d ? 'text-gray-600' : 'text-gray-400'}`} />
                                                    <span className={`text-[11px] ${d ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {formatDate(analysis.createdAt)}
                                                    </span>
                                                    {analysis.recommendations?.slice(0, 3).map((rec, idx) => (
                                                        <span key={idx} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${d ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'}`}>
                                                            {rec.recommended_crop_localized || rec.recommended_crop}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteItem(analysis._id, 'analysis'); }}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${d ? 'text-gray-600 hover:text-red-400 hover:bg-red-900/20' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}
                                                disabled={deleting === analysis._id}
                                            >
                                                {deleting === analysis._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedId === analysis._id ? 'rotate-90' : ''} ${d ? 'text-gray-500' : 'text-gray-400'}`} />
                                        </div>
                                    </div>

                                    {/* Expanded Analysis Preview */}
                                    {expandedId === analysis._id && (
                                        <div className={`px-4 pb-4 border-t ${d ? 'border-[#33344a]' : 'border-gray-100'}`}>
                                            <div className="pt-3">
                                                {/* Input details */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                                    {[
                                                        { label: 'Location', value: analysis.input?.location },
                                                        { label: 'Land Size', value: `${analysis.input?.size} acres` },
                                                        { label: 'Soil', value: analysis.input?.soil_type },
                                                        { label: 'Season', value: analysis.input?.season },
                                                        { label: 'Water', value: analysis.input?.water_source },
                                                        { label: 'Budget', value: `₹${Number(analysis.input?.budget || 0).toLocaleString()}` },
                                                    ].filter(item => item.value).map((item, idx) => (
                                                        <div key={idx} className={`p-2.5 rounded-xl border ${d ? 'bg-[#1e1f2b] border-[#33344a]' : 'bg-gray-50 border-gray-100'}`}>
                                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{item.label}</span>
                                                            <span className={`text-xs font-bold ${d ? 'text-gray-200' : 'text-gray-800'}`}>{item.value}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Recommendations */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {analysis.recommendations?.map((rec, idx) => {
                                                        const avgProfit = ((rec.expected_profit_range_rs?.[0] || 0) + (rec.expected_profit_range_rs?.[1] || 0)) / 2;
                                                        return (
                                                            <div key={idx} className={`p-3 rounded-xl border ${d ? 'bg-[#1e1f2b]/50 border-[#33344a]' : 'bg-white border-gray-100'}`}>
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${d ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>TOP {idx + 1}</span>
                                                                    <span className={`text-sm font-bold ${d ? 'text-gray-100' : 'text-gray-900'}`}>
                                                                        {rec.recommended_crop_localized || rec.recommended_crop}
                                                                    </span>
                                                                </div>
                                                                <div className="flex gap-3 text-[11px]">
                                                                    <span className={d ? 'text-blue-400' : 'text-blue-600'}>Yield: {(rec.expected_output_kg || 0).toLocaleString()} kg</span>
                                                                    <span className={d ? 'text-green-400' : 'text-green-600'}>Profit: ₹{avgProfit.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
