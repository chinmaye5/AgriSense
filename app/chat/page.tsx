'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sprout, Send, RotateCcw, ArrowDown, Leaf, Droplets, Bug, Coins, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ApiResponse {
    success: boolean;
    question: string;
    answer: string;
    timestamp: string;
    source: string;
}

export default function AgricultureChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const { dark, toggleTheme, mounted } = useTheme();
    const { t, language } = useLanguage();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const SUGGESTIONS = [
        { icon: <Leaf className="w-4 h-4" />, title: t.features.location.title, desc: t.prevCropPlaceholder },
        { icon: <Droplets className="w-4 h-4" />, title: t.waterSource, desc: "How to reduce water usage for sugarcane with drip irrigation?" },
        { icon: <Bug className="w-4 h-4" />, title: "Pest management", desc: "Organic methods to control aphids on tomato plants?" },
        { icon: <Coins className="w-4 h-4" />, title: "Government schemes", desc: "What subsidies are available for small farmers in India?" },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages, loading]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
        };
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [input]);

    const formatAnswer = (text: string) => {
        const lines = text.split('\n');
        const elements: React.JSX.Element[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();
            if (!line) { i++; continue; }
            if (line === '**' || line === '***') { i++; continue; }

            if (line.match(/^#{1,3}\s+/) || (line.match(/^\*\*[^*]+\*\*$/) && line.length < 80)) {
                const headingText = line.replace(/^#{1,3}\s+/, '').replace(/\*\*/g, '');
                elements.push(
                    <h3 key={i} className={`text-sm font-bold mt-4 mb-1.5 first:mt-0 ${dark ? 'text-gray-100' : 'text-gray-900'}`}>
                        {headingText}
                    </h3>
                );
                i++; continue;
            }

            if (line.match(/^\d+[.)]\s/)) {
                const listItems: { num: string; text: string }[] = [];
                while (i < lines.length && lines[i].trim().match(/^\d+[.)]\s/)) {
                    const match = lines[i].trim().match(/^(\d+)[.)]\s(.+)/);
                    if (match) listItems.push({ num: match[1], text: match[2].replace(/\*\*/g, '') });
                    i++;
                }
                elements.push(
                    <div key={`ol-${i}`} className="space-y-1.5 my-2">
                        {listItems.map((item, idx) => (
                            <div key={idx} className="flex gap-2.5 items-start">
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 ${dark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                                    {item.num}
                                </span>
                                <span className={`text-[13px] leading-relaxed flex-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{item.text}</span>
                            </div>
                        ))}
                    </div>
                );
                continue;
            }

            if (line.match(/^[-•]\s/) || (line.match(/^\*\s/) && !line.match(/^\*\*/))) {
                const listItems: string[] = [];
                while (i < lines.length) {
                    const l = lines[i].trim();
                    if (l.match(/^[-•]\s/) || (l.match(/^\*\s/) && !l.match(/^\*\*/))) {
                        listItems.push(l.replace(/^[-•*]\s+/, '').replace(/\*\*/g, ''));
                        i++;
                    } else break;
                }
                elements.push(
                    <div key={`ul-${i}`} className="space-y-1 my-2">
                        {listItems.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-[7px]"></span>
                                <span className={`text-[13px] leading-relaxed flex-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</span>
                            </div>
                        ))}
                    </div>
                );
                continue;
            }

            const paraText = line.replace(/\*\*/g, '');
            elements.push(
                <p key={i} className={`text-[13px] leading-relaxed my-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {paraText}
                </p>
            );
            i++;
        }
        return elements;
    };

    const sendMessage = async (question?: string) => {
        const messageContent = question || input;
        if (!messageContent.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: messageContent,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const response = await fetch('/api/agriculture-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: messageContent,
                    language: language // Pass language preference to AI
                }),
            });

            const data: ApiResponse = await response.json();

            if (data.success) {
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: data.answer,
                    timestamp: new Date(data.timestamp)
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                throw new Error('API returned unsuccessful');
            }
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => { setMessages([]); };
    const isNewChat = messages.length === 0;

    // ─── Theme tokens ───
    const theme = {
        bg: dark ? 'bg-[#1e1f2b]' : 'bg-white',
        headerBg: dark ? 'bg-[#252636]' : 'bg-white',
        headerBorder: dark ? 'border-[#2e2f42]' : 'border-gray-200/60',
        inputBg: dark ? 'bg-[#2a2b3d]' : 'bg-gray-50',
        inputBorder: dark ? 'border-[#3a3b50]' : 'border-gray-200',
        inputFocusBorder: dark ? 'focus:border-green-500' : 'focus:border-green-400',
        inputText: dark ? 'text-gray-200' : 'text-gray-800',
        inputPlaceholder: dark ? 'placeholder-gray-500' : 'placeholder-gray-400',
        textPrimary: dark ? 'text-gray-100' : 'text-gray-900',
        textSecondary: dark ? 'text-gray-400' : 'text-gray-500',
        textMuted: dark ? 'text-gray-500' : 'text-gray-400',
        userBubble: dark ? 'bg-green-700' : 'bg-green-600',
        aiBubbleBg: dark ? 'bg-[#282938]' : 'bg-gray-50',
        aiBubbleBorder: dark ? 'border-[#33344a]' : 'border-gray-100',
        aiLabel: dark ? 'text-green-400' : 'text-green-700',
        suggestionBg: dark ? 'bg-[#252636]' : 'bg-white',
        suggestionBorder: dark ? 'border-[#33344a]' : 'border-gray-200',
        suggestionHover: dark ? 'hover:bg-[#2e2f42] hover:border-[#444560]' : 'hover:bg-gray-50 hover:border-gray-300',
        suggestionTitle: dark ? 'text-gray-200' : 'text-gray-800',
        suggestionDesc: dark ? 'text-gray-500' : 'text-gray-400',
        suggestionIcon: dark ? 'text-green-400' : 'text-green-600',
        scrollBtnBg: dark ? 'bg-[#2e2f42] border-[#3a3b50]' : 'bg-white border-gray-200',
        scrollBtnIcon: dark ? 'text-gray-400' : 'text-gray-500',
        footerBorder: dark ? 'border-[#2e2f42]' : 'border-gray-100',
        footerText: dark ? 'text-gray-600' : 'text-gray-400',
        navActive: dark ? 'text-green-400 bg-green-900/30' : 'text-green-700 bg-green-50',
        navInactive: dark ? 'text-gray-400 hover:text-green-400 hover:bg-[#2e2f42]' : 'text-gray-500 hover:text-green-700 hover:bg-green-50',
        clearBtn: dark ? 'text-gray-500 hover:text-gray-300 hover:bg-[#2e2f42]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        brandText: dark ? 'from-green-400 to-emerald-400' : 'from-green-700 to-emerald-600',
        themeBtn: dark ? 'bg-[#2e2f42] text-yellow-400 hover:bg-[#3a3b50]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    };

    return (
        <div className={`h-screen flex flex-col ${theme.bg} transition-colors duration-300`}>
            {/* Header */}
            <header className={`flex-shrink-0 border-b ${theme.headerBorder} ${theme.headerBg} z-50 transition-colors duration-300`}>
                <div className="max-w-4xl mx-auto w-full px-4 h-14 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-1 rounded-md">
                            <Sprout className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-bold bg-gradient-to-r ${theme.brandText} bg-clip-text text-transparent`}>
                            {t.title}
                        </span>
                    </a>

                    <div className="flex items-center gap-2">
                        <LanguageSwitcher dark={dark} />
                        <button
                            onClick={toggleTheme}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme.themeBtn}`}
                            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {messages.length > 0 && (
                            <button
                                onClick={clearChat}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors ${theme.clearBtn}`}
                                title="New chat"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.newChat}</span>
                            </button>
                        )}

                        <nav className="hidden sm:flex items-center gap-0.5 ml-1">
                            <a href="/chat" className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg ${theme.navActive}`}>{t.chat}</a>
                            <a href="/graph" className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${theme.navInactive}`}>{t.analysis}</a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Chat */}
            <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full">
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                    {isNewChat ? (
                        <div className="h-full flex flex-col items-center justify-center px-4 py-8">
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Sprout className="w-7 h-7 text-white" />
                                </div>
                                <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${theme.textPrimary}`}>
                                    {t.howCanIHelp}
                                </h1>
                                <p className={`text-sm max-w-md ${theme.textSecondary}`}>
                                    {t.chatDesc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
                                {SUGGESTIONS.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => sendMessage(suggestion.desc)}
                                        className={`text-left p-3.5 border rounded-xl transition-all group ${theme.suggestionBg} ${theme.suggestionBorder} ${theme.suggestionHover}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`${theme.suggestionIcon} transition-colors`}>{suggestion.icon}</span>
                                            <span className={`text-sm font-semibold ${theme.suggestionTitle}`}>{suggestion.title}</span>
                                        </div>
                                        <p className={`text-xs leading-relaxed ${theme.suggestionDesc}`}>{suggestion.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="px-4 py-4 space-y-1">
                            {messages.map((message) => (
                                <div key={message.id}>
                                    {message.type === 'user' ? (
                                        <div className="flex justify-end mb-3">
                                            <div className="max-w-[85%] sm:max-w-[70%]">
                                                <div className={`${theme.userBubble} text-white rounded-2xl rounded-tr-md px-4 py-2.5 shadow-sm`}>
                                                    <p className="text-[13px] leading-relaxed">{message.content}</p>
                                                </div>
                                                <div className={`text-[10px] mt-1 text-right pr-1 ${theme.textMuted}`}>
                                                    {mounted && message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2.5 mb-4">
                                            <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mt-0.5">
                                                <Sprout className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-[11px] font-semibold mb-1 ${theme.aiLabel}`}>{t.title}</div>
                                                <div className={`rounded-2xl rounded-tl-md px-4 py-3 border ${theme.aiBubbleBg} ${theme.aiBubbleBorder} transition-colors duration-300`}>
                                                    {formatAnswer(message.content)}
                                                </div>
                                                <div className={`text-[10px] mt-1 pl-1 ${theme.textMuted}`}>
                                                    {mounted && message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {loading && (
                                <div className="flex gap-2.5 mb-4">
                                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                        <Sprout className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-[11px] font-semibold mb-1 ${theme.aiLabel}`}>{t.title}</div>
                                        <div className={`rounded-2xl rounded-tl-md px-4 py-3 border ${theme.aiBubbleBg} ${theme.aiBubbleBorder}`}>
                                            <div className="flex items-center gap-2">
                                                <div className="flex space-x-1">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                                </div>
                                                <span className={`text-xs ${theme.textMuted}`}>{t.thinking}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {showScrollBtn && (
                    <div className="flex justify-center -mt-10 mb-2 pointer-events-none relative z-10">
                        <button onClick={scrollToBottom} className={`pointer-events-auto w-8 h-8 border rounded-full shadow-md flex items-center justify-center transition-colors ${theme.scrollBtnBg}`}>
                            <ArrowDown className={`w-4 h-4 ${theme.scrollBtnIcon}`} />
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <div className={`flex-shrink-0 border-t ${theme.footerBorder} ${theme.headerBg} px-4 py-3 transition-colors duration-300`}>
                    <form onSubmit={handleSubmit} className="flex items-end gap-2">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about agriculture..."
                            rows={1}
                            className={`flex-1 resize-none px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 outline-none transition-all duration-300 ${theme.inputBg} ${theme.inputBorder} ${theme.inputFocusBorder} ${theme.inputText} ${theme.inputPlaceholder}`}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="flex-shrink-0 w-10 h-10 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 rounded-xl flex items-center justify-center text-white transition-all disabled:cursor-not-allowed shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className={`text-center text-[10px] mt-2 ${theme.footerText}`}>
                        {t.footerWarning}
                    </p>
                </div>
            </div>
        </div>
    );
}
