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
    Loader2,
    X
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface HistorySidebarProps {
    type: 'chat' | 'graph';
    dark: boolean;
    t: any;
    onSelectChat?: (chat: any) => void;
    onSelectAnalysis?: (analysis: any) => void;
    onNew?: () => void;
    externalIsOpen?: boolean;
    setExternalIsOpen?: (open: boolean) => void;
}

export default function HistorySidebar({ type, dark, t, onSelectChat, onSelectAnalysis, onNew, externalIsOpen, setExternalIsOpen }: HistorySidebarProps) {
    const { user, isLoaded, isSignedIn } = useUser();
    const [history, setHistory] = useState<{ conversations: any[], analyses: any[] }>({ conversations: [], analyses: [] });
    const [loading, setLoading] = useState(false);
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    
    // Use external state if provided, otherwise internal
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
    const setIsOpen = setExternalIsOpen !== undefined ? setExternalIsOpen : setInternalIsOpen;
    
    const [searchQuery, setSearchQuery] = useState('');

    // Auto-open on desktop, closed on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            }
        };
        handleResize(); // Check on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const handleItemClick = (callback?: (item: any) => void, item?: any) => {
        callback?.(item);
        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            setIsOpen(false);
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

    // Toggle button when sidebar is closed - only show if not controlled externally
    if (!isOpen && externalIsOpen === undefined) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className={`fixed left-3 top-[70px] z-40 p-2.5 rounded-xl border shadow-lg ${sidebarBg} ${borderColor} ${textSecondary} hover:text-green-500 transition-all`}
                title={t.sidebar?.openHistory || "Open history"}
            >
                <Menu className="w-5 h-5" />
            </button>
        );
    }

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 md:z-30
                w-72 h-screen max-h-screen
                border-r ${sidebarBg} ${borderColor}
                flex flex-col
                transition-transform duration-300
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Sidebar Header */}
                <div className="flex-shrink-0 p-4 flex items-center justify-between">
                    <button 
                        onClick={() => {
                            onNew?.();
                            if (window.innerWidth < 768) setIsOpen(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-green-500/50 text-green-500 font-bold text-sm hover:bg-green-500/10 transition-all mr-2"
                    >
                        <Plus className="w-4 h-4" />
                        {type === 'chat' ? (t.sidebar?.newChat || 'New Chat') : (t.sidebar?.newAnalysis || 'New Analysis')}
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className={`p-2 rounded-lg ${textSecondary} hover:bg-gray-500/10 transition-colors`}
                    >
                        <X className="w-5 h-5 md:hidden" />
                        <ChevronLeft className="w-5 h-5 hidden md:block" />
                    </button>
                </div>

                {/* Search */}
                <div className="flex-shrink-0 px-4 mb-3">
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${textSecondary}`} />
                        <input 
                            type="text"
                            placeholder={t.sidebar?.searchPlaceholder || "Search history..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none border transition-all ${dark ? 'bg-[#13141f] border-[#2e2f42] text-gray-200 focus:border-green-500' : 'bg-white border-gray-200 focus:border-green-400'}`}
                        />
                    </div>
                </div>

                {/* Content List — this is the only scrollable region */}
                <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-4 min-h-0">
                    {/* Conversations Section */}
                    <div>
                        <div className={`px-3 mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>
                            <MessageSquare className="w-3 h-3" />
                            {t.sidebar?.conversations || "Conversations"}
                        </div>
                        <div className="space-y-0.5">
                            {loading && history.conversations.length === 0 ? (
                                <div className="px-3 py-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-green-500" /></div>
                            ) : filteredConversations.length === 0 ? (
                                <div className={`px-3 py-2 text-[11px] italic ${textSecondary}`}>{t.sidebar?.noChats || "No chats found"}</div>
                            ) : (
                                filteredConversations.map((convo) => (
                                    <div 
                                        key={convo._id}
                                        onClick={() => handleItemClick(onSelectChat, convo)}
                                        className={`group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all ${hoverBg} ${type === 'chat' ? 'border border-transparent' : ''}`}
                                    >
                                        <div className={`text-xs font-semibold truncate pr-6 ${textPrimary}`}>
                                            {convo.title || (t.history?.untitled || 'Untitled Chat')}
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
                            {t.sidebar?.analyses || "Crop Analyses"}
                        </div>
                        <div className="space-y-0.5">
                            {loading && history.analyses.length === 0 ? (
                                <div className="px-3 py-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-green-500" /></div>
                            ) : filteredAnalyses.length === 0 ? (
                                <div className={`px-3 py-2 text-[11px] italic ${textSecondary}`}>{t.sidebar?.noAnalyses || "No analyses found"}</div>
                            ) : (
                                filteredAnalyses.map((analysis) => (
                                    <div 
                                        key={analysis._id}
                                        onClick={() => handleItemClick(onSelectAnalysis, analysis)}
                                        className={`group relative px-3 py-2.5 rounded-lg cursor-pointer transition-all ${hoverBg}`}
                                    >
                                        <div className={`text-xs font-semibold truncate pr-6 ${textPrimary}`}>
                                            {analysis.title || `${analysis.formData?.location || 'Unknown'}: ${analysis.recommendations?.[0]?.recommended_crop || 'Analysis'}`}
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                            <span className={`text-[9px] px-1 py-0.5 rounded ${dark ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                                                {analysis.formData?.size || analysis.input?.size || '?'} {t.history?.acres || 'acres'}
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
                    <div className={`flex-shrink-0 p-4 border-t ${borderColor}`}>
                        <p className={`text-[10px] text-center italic ${textSecondary}`}>{t.sidebar?.signInToSync || "Sign in to sync your history across devices"}</p>
                    </div>
                )}
            </aside>
        </>
    );
}
