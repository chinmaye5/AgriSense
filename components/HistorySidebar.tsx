'use client';

import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, 
    BarChart3, 
    Clock, 
    Plus, 
    Search, 
    Trash2, 
    ChevronLeft, 
    Menu,
    Loader2
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface HistorySidebarProps {
    type: 'chat' | 'graph';
    dark: boolean;
    onSelectChat?: (chat: any) => void;
    onSelectAnalysis?: (analysis: any) => void;
    onNew?: () => void;
}

export default function HistorySidebar({ type, dark, onSelectChat, onSelectAnalysis, onNew }: HistorySidebarProps) {
    const { user, isLoaded, isSignedIn } = useUser();
    const [history, setHistory] = useState<{ conversations: any[], analyses: any[] }>({ conversations: [], analyses: [] });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchHistory();
        }
    }, [isLoaded, isSignedIn]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/history');
            const data = await res.json();
            if (data.success) {
                setHistory({
                    conversations: data.conversations || [],
                    analyses: data.analyses || []
                });
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (e: React.MouseEvent, id: string, itemType: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this?')) return;
        
        try {
            const res = await fetch(`/api/history?id=${id}&type=${itemType}`, { method: 'DELETE' });
            if (res.ok) {
                if (itemType === 'conversation') {
                    setHistory(prev => ({ ...prev, conversations: prev.conversations.filter(c => c._id !== id) }));
                } else {
                    setHistory(prev => ({ ...prev, analyses: prev.analyses.filter(a => a._id !== id) }));
                }
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const filteredConversations = history.conversations.filter(c => 
        c.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredAnalyses = history.analyses.filter(a => {
        const q = searchQuery.toLowerCase();
        return (
            a.title?.toLowerCase().includes(q) ||
            a.formData?.location?.toLowerCase().includes(q) ||
            a.recommendations?.[0]?.recommended_crop?.toLowerCase().includes(q)
        );
    });

    const sidebarBg = dark ? 'bg-[#1a1b26]' : 'bg-gray-50';
    const borderColor = dark ? 'border-[#2e2f42]' : 'border-gray-200';
    const textPrimary = dark ? 'text-gray-100' : 'text-gray-900';
    const textSecondary = dark ? 'text-gray-400' : 'text-gray-500';
    const hoverBg = dark ? 'hover:bg-[#252636]' : 'hover:bg-gray-200/50';
    const activeBg = dark ? 'bg-[#252636]' : 'bg-white shadow-sm';

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed left-4 top-20 z-40 p-2 rounded-lg border shadow-lg ${sidebarBg} ${borderColor} ${textSecondary} hover:text-green-500 transition-all`}
            >
                <Menu className="w-5 h-5" />
            </button>
        );
    }

    return (
        <aside className={`flex-shrink-0 w-72 h-full border-r ${sidebarBg} ${borderColor} flex flex-col z-40 relative transition-all duration-300`}>
            {/* Sidebar Header */}
            <div className="p-4 flex items-center justify-between">
                <button 
                    onClick={onNew}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-green-500/50 text-green-500 font-bold text-sm hover:bg-green-500/10 transition-all mr-2"
                >
                    <Plus className="w-4 h-4" />
                    New {type === 'chat' ? 'Chat' : 'Analysis'}
                </button>
                <button 
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-lg ${textSecondary} hover:bg-gray-500/10`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Search */}
            <div className="px-4 mb-4">
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textSecondary}`} />
                    <input 
                        type="text"
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none border transition-all ${dark ? 'bg-[#13141f] border-[#2e2f42] text-gray-200 focus:border-green-500' : 'bg-white border-gray-200 focus:border-green-400'}`}
                    />
                </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-4">
                {/* Conversations Section */}
                <div>
                    <div className={`px-3 mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>
                        <MessageSquare className="w-3 h-3" />
                        Conversations
                    </div>
                    <div className="space-y-0.5">
                        {loading && history.conversations.length === 0 ? (
                            <div className="px-3 py-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-green-500" /></div>
                        ) : filteredConversations.length === 0 ? (
                            <div className={`px-3 py-2 text-[11px] italic ${textSecondary}`}>No chats found</div>
                        ) : (
                            filteredConversations.map((convo) => (
                                <div 
                                    key={convo._id}
                                    onClick={() => onSelectChat?.(convo)}
                                    className={`group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all ${hoverBg} ${type === 'chat' ? 'border border-transparent' : ''}`}
                                >
                                    <div className={`text-xs font-semibold truncate pr-6 ${textPrimary}`}>
                                        {convo.title || 'Untitled Chat'}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-2.5 h-2.5 opacity-40" />
                                        <span className="text-[10px] opacity-40">{new Date(convo.updatedAt || convo.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => deleteItem(e, convo._id, 'conversation')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Analyses Section */}
                <div>
                    <div className={`px-3 mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>
                        <BarChart3 className="w-3 h-3" />
                        Crop Analyses
                    </div>
                    <div className="space-y-0.5">
                        {loading && history.analyses.length === 0 ? (
                            <div className="px-3 py-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-green-500" /></div>
                        ) : filteredAnalyses.length === 0 ? (
                            <div className={`px-3 py-2 text-[11px] italic ${textSecondary}`}>No analyses found</div>
                        ) : (
                            filteredAnalyses.map((analysis) => (
                                <div 
                                    key={analysis._id}
                                    onClick={() => onSelectAnalysis?.(analysis)}
                                    className={`group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all ${hoverBg}`}
                                >
                                    <div className={`text-xs font-semibold truncate pr-6 ${textPrimary}`}>
                                        {analysis.title || `${analysis.formData?.location || 'Unknown'}: ${analysis.recommendations?.[0]?.recommended_crop || 'Analysis'}`}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                        <span className={`text-[9px] px-1 py-0.5 rounded ${dark ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                                            {analysis.formData?.size || analysis.input?.size || '?'} acres
                                        </span>
                                        {analysis.formData?.season && (
                                            <>
                                                <span className="text-[10px] opacity-40">•</span>
                                                <span className={`text-[9px] px-1 py-0.5 rounded ${dark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                                                    {analysis.formData.season}
                                                </span>
                                            </>
                                        )}
                                        <span className="text-[10px] opacity-40">•</span>
                                        <span className="text-[10px] opacity-40 whitespace-nowrap">{new Date(analysis.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => deleteItem(e, analysis._id, 'analysis')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Footer User Info */}
            {!isSignedIn && (
                <div className={`p-4 border-t ${borderColor}`}>
                    <p className={`text-[10px] text-center italic ${textSecondary}`}>Sign in to sync your history across devices</p>
                </div>
            )}
        </aside>
    );
}
