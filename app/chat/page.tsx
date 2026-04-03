'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Sprout, Send, RotateCcw, ArrowDown, Leaf, Droplets, Bug, Coins, Moon, Sun, ImagePlus, X, Camera } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AuthButtons from '@/components/AuthButtons';
import HistorySidebar from '@/components/HistorySidebar';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    imageUrl?: string;
}

interface ApiResponse {
    success: boolean;
    question: string;
    answer: string;
    timestamp: string;
    source: string;
    imageAnalyzed?: boolean;
}

function ChatContent() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const { dark, toggleTheme, mounted } = useTheme();
    const { t, language } = useLanguage();
    const { isSignedIn, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const conversationIdRef = useRef<string>(Date.now().toString(36) + Math.random().toString(36).slice(2));

    const handleSelectChat = (chat: any) => {
        setMessages(chat.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
        })));
        conversationIdRef.current = chat.conversationId;
    };

    const handleNewChat = () => {
        setMessages([]);
        conversationIdRef.current = Date.now().toString(36) + Math.random().toString(36).slice(2);
        router.push('/chat');
    };

    const saveConversation = useCallback(async (msgs: ChatMessage[]) => {
        if (!isSignedIn || msgs.length < 2) return;
        try {
            await fetch('/api/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'conversation',
                    data: {
                        conversationId: conversationIdRef.current,
                        title: msgs[0]?.content?.slice(0, 60) || 'Untitled Chat',
                        messages: msgs.map(m => ({
                            type: m.type,
                            content: m.content,
                            timestamp: m.timestamp.toISOString(),
                            imageUrl: m.imageUrl || undefined,
                        })),
                    },
                }),
            });
        } catch (err) {
            console.error('Failed to save conversation:', err);
        }
    }, [isSignedIn]);

    const SUGGESTIONS = [
        { icon: <Leaf className="w-4 h-4" />, title: t.features.location.title, desc: t.prevCropPlaceholder },
        { icon: <Droplets className="w-4 h-4" />, title: t.waterSource, desc: t.features.weather.desc },
        { icon: <Bug className="w-4 h-4" />, title: t.pestManagement || "Pest management", desc: t.pestManagementDesc || "Organic methods to control aphids on tomato plants?" },
        { icon: <Coins className="w-4 h-4" />, title: t.govSchemes || "Government schemes", desc: t.govSchemesDesc || "What subsidies are available for small farmers in India?" },
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('Image must be less than 10MB');
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setImagePreview(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            
            const data = await res.json();
            if (data.success) {
                return data.url;
            }
            console.error('Upload failed:', data.error);
            return null;
        } catch (err) {
            console.error('Upload error:', err);
            return null;
        } finally {
            setUploadingImage(false);
        }
    };

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
        const hasImage = !!imageFile;
        
        if (!messageContent.trim() && !hasImage) return;

        let uploadedImageUrl: string | null = null;

        // Upload image first if present
        if (imageFile) {
            uploadedImageUrl = await uploadImage(imageFile);
            if (!uploadedImageUrl) {
                alert('Failed to upload image. Please try again.');
                return;
            }
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: messageContent || '📷 Uploaded an image for analysis',
            timestamp: new Date(),
            imageUrl: uploadedImageUrl || undefined,
        };

        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setInput('');
        removeImage();
        setLoading(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const response = await fetch('/api/agriculture-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: messageContent || '',
                    language: language,
                    imageUrl: uploadedImageUrl || undefined,
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
                const finalMessages = [...currentMessages, assistantMessage];
                setMessages(finalMessages);
                saveConversation(finalMessages);
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

    if (!mounted) return null;

    return (
        <div className={`h-screen flex overflow-hidden transition-colors duration-300 ${theme.bg}`}>
            <HistorySidebar 
                type="chat" 
                dark={dark} 
                t={t}
                onSelectChat={handleSelectChat}
                onSelectAnalysis={(a) => {
                    window.location.href = `/graph?id=${a._id}`;
                }}
                onNew={handleNewChat}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className={`flex-shrink-0 border-b ${theme.headerBorder} ${theme.headerBg} z-20 transition-colors duration-300`}>
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
                            >
                                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                            <AuthButtons dark={dark} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col min-h-0 relative">
                    <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pt-4 pb-32">
                        <div className="max-w-3xl mx-auto w-full px-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/10">
                                        <Sprout className="w-8 h-8 text-white" />
                                    </div>
                                    <h1 className={`text-3xl font-bold mb-3 ${theme.textPrimary}`}>{t.howCanIHelp}</h1>
                                    <p className={`text-sm max-w-sm mb-4 ${theme.textSecondary}`}>{t.chatDesc}</p>
                                    
                                    {/* Image Upload Prompt */}
                                    <div className={`flex items-center gap-2 mb-8 px-4 py-2.5 rounded-xl border transition-all ${dark ? 'bg-[#252636] border-[#33344a] text-gray-400' : 'bg-green-50 border-green-200 text-green-700'}`}>
                                        <Camera className="w-4 h-4" />
                                        <span className="text-xs font-medium">📷 {t.uploadPrompt || 'Upload crop images for instant disease analysis'}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
                                        {SUGGESTIONS.map((s, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => sendMessage(s.desc)}
                                                className={`p-4 rounded-xl border transition-all ${theme.suggestionBg} ${theme.suggestionBorder} ${theme.suggestionHover}`}
                                            >
                                                <div className={`flex items-center gap-2 mb-1 text-sm font-bold ${theme.suggestionTitle}`}>
                                                    <span className={theme.suggestionIcon}>{s.icon}</span>
                                                    {s.title}
                                                </div>
                                                <p className={`text-xs ${theme.suggestionDesc}`}>{s.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {messages.map((m) => (
                                        <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] ${m.type === 'assistant' ? 'flex gap-3' : ''}`}>
                                                {m.type === 'assistant' && (
                                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mt-1">
                                                        <Sprout className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                <div>
                                                    {/* User Image Display */}
                                                    {m.imageUrl && m.type === 'user' && (
                                                        <div className="mb-2">
                                                            <div className="relative inline-block rounded-xl overflow-hidden border-2 border-green-400/30 shadow-lg">
                                                                <img 
                                                                    src={m.imageUrl} 
                                                                    alt="Uploaded crop image" 
                                                                    className="max-w-xs max-h-60 object-cover rounded-xl"
                                                                />
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                                                    <div className="flex items-center gap-1.5 text-white">
                                                                        <Camera className="w-3 h-3" />
                                                                        <span className="text-[10px] font-bold">Crop Image</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className={`px-4 py-3 rounded-2xl shadow-sm border ${
                                                        m.type === 'user' 
                                                            ? `${theme.userBubble} text-white border-transparent rounded-tr-sm` 
                                                            : `${theme.aiBubbleBg} ${theme.aiBubbleBorder} ${theme.textPrimary} rounded-tl-sm`
                                                    }`}>
                                                        {m.type === 'assistant' ? formatAnswer(m.content) : <p className="text-[13px] leading-relaxed">{m.content}</p>}
                                                    </div>
                                                    <div className={`text-[10px] mt-1 opacity-50 px-1 ${m.type === 'user' ? 'text-right' : 'text-left'}`}>
                                                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mt-1">
                                                <Sprout className="w-4 h-4 text-white" />
                                            </div>
                                            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${theme.aiBubbleBg} ${theme.aiBubbleBorder}`}>
                                                <div className="flex items-center gap-2 px-1">
                                                    {uploadingImage ? (
                                                        <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>📤 Uploading image...</span>
                                                    ) : (
                                                        <>
                                                            <div className="flex gap-1.5">
                                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                            </div>
                                                            {imageFile && <span className={`text-xs ml-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>🔍 Analyzing image...</span>}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </div>

                    {showScrollBtn && (
                        <button 
                            onClick={scrollToBottom}
                            className={`fixed bottom-24 right-8 w-10 h-10 rounded-full border shadow-lg flex items-center justify-center transition-all ${theme.scrollBtnBg} ${theme.scrollBtnIcon} hover:scale-110 active:scale-95`}
                        >
                            <ArrowDown className="w-5 h-5" />
                        </button>
                    )}

                    <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none">
                        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className={`mb-2 p-2 rounded-xl border flex items-start gap-3 ${dark ? 'bg-[#252636] border-[#33344a]' : 'bg-white border-gray-200 shadow-sm'}`}>
                                    <div className="relative group">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-20 h-20 object-cover rounded-lg border border-green-400/30"
                                        />
                                        <button 
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-bold ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                                            📷 Image attached
                                        </p>
                                        <p className={`text-[10px] mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {imageFile?.name} ({(imageFile?.size! / 1024).toFixed(0)} KB)
                                        </p>
                                        <p className={`text-[10px] mt-1 ${dark ? 'text-green-400' : 'text-green-600'}`}>
                                            AI will analyze this image for crop diseases, pests, or deficiencies
                                        </p>
                                    </div>
                                </div>
                            )}
                            
                            <form 
                                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                className={`flex items-end gap-2 p-2 rounded-2xl border shadow-xl transition-all duration-300 ${theme.headerBg} ${theme.headerBorder}`}
                            >
                                {/* Hidden File Input */}
                                <input 
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                
                                {/* Image Upload Button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                                        imagePreview 
                                            ? 'bg-green-500/20 text-green-500' 
                                            : dark 
                                                ? 'text-gray-400 hover:text-green-400 hover:bg-[#2e2f42]' 
                                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                    } disabled:opacity-30`}
                                    title="Upload crop image"
                                >
                                    <ImagePlus className="w-5 h-5" />
                                </button>
                                
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    rows={1}
                                    className={`flex-1 max-h-48 min-h-[44px] py-3 px-4 resize-none bg-transparent outline-none text-sm ${theme.inputText}`}
                                    placeholder={imagePreview ? (t.describeIssue || "Describe the issue or just send the image...") : (t.placeholder || "Message AgriSense AI...")}
                                />
                                <button 
                                    type="submit"
                                    disabled={loading || (!input.trim() && !imageFile)}
                                    className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-green-600"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                            <p className="text-[10px] text-center mt-2 opacity-40">AgriSense can make mistakes. Verify important information.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AgricultureChat() {
    return (
        <Suspense fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-[#1e1f2b]">
                <Sprout className="w-10 h-10 text-green-500 animate-pulse" />
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
