'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Sprout, Send, RotateCcw, ArrowDown, Leaf, Droplets, Bug, Coins, Moon, Sun, ImagePlus, X, Camera, Mic, MicOff, Volume2, VolumeX, AudioLines, Menu } from 'lucide-react';
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

// Extend Window interface for SpeechRecognition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

function ChatContent() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [autoSpeak, setAutoSpeak] = useState(true);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [voiceMode, setVoiceMode] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
    const [voiceError, setVoiceError] = useState<string | null>(null);
    const { dark, toggleTheme, mounted } = useTheme();
    const { t, language } = useLanguage();
    const { isSignedIn, isLoaded } = useUser();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    const pendingTranscriptRef = useRef<string>('');
    const conversationIdRef = useRef<string>(Date.now().toString(36) + Math.random().toString(36).slice(2));

    const handleSelectChat = (chat: any) => {
        setMessages(chat.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
        })));
        conversationIdRef.current = chat.conversationId;
    };

    const stopSpeaking = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    const speak = useCallback((text: string, messageId?: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        // Clean text from markdown-like symbols for better TTS
        const cleanText = text
            .replace(/\*\*/g, '')
            .replace(/###?/g, '')
            .replace(/[-•]/g, '')
            .replace(/\n{2,}/g, '. ')
            .replace(/\n/g, '. ');

        stopSpeaking();

        // Split long text into chunks for better TTS handling (max ~200 chars per chunk)
        const sentences = cleanText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanText];
        const chunks: string[] = [];
        let current = '';
        for (const sentence of sentences) {
            if ((current + sentence).length > 250) {
                if (current) chunks.push(current.trim());
                current = sentence;
            } else {
                current += sentence;
            }
        }
        if (current.trim()) chunks.push(current.trim());

        if (messageId) setSpeakingMessageId(messageId);

        // Map app language to BCP47
        const langMap: Record<string, string> = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'kn': 'kn-IN',
            'te': 'te-IN',
            'ta': 'ta-IN',
            'mr': 'mr-IN',
            'pa': 'pa-IN',
            'bn': 'bn-IN',
            'gu': 'gu-IN'
        };

        chunks.forEach((chunk, idx) => {
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = langMap[language] || 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            if (idx === 0) {
                utterance.onstart = () => setIsSpeaking(true);
            }
            if (idx === chunks.length - 1) {
                utterance.onend = () => { setIsSpeaking(false); setSpeakingMessageId(null); };
                utterance.onerror = () => { setIsSpeaking(false); setSpeakingMessageId(null); };
            }

            window.speechSynthesis.speak(utterance);
        });
    }, [language, stopSpeaking]);

    // We need a ref to sendMessage since the recognition setup happens once
    const sendMessageRef = useRef<(q?: string) => void>(undefined);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    let interim = '';
                    let final = '';
                    for (let i = 0; i < event.results.length; i++) {
                        const result = event.results[i];
                        if (result.isFinal) {
                            final += result[0].transcript;
                        } else {
                            interim += result[0].transcript;
                        }
                    }
                    if (final) {
                        pendingTranscriptRef.current = final;
                        setInterimTranscript('');
                    } else {
                        setInterimTranscript(interim);
                    }
                };

                recognitionRef.current.onerror = (event: any) => {
                    // Graceful handling — we show a nice UI instead of a loud console error
                    let errorMsg = '';
                    switch (event.error) {
                        case 'audio-capture':
                            errorMsg = 'No microphone detected. Please check if it is plugged in or if microphone access is enabled in your Windows/Browser settings.';
                            break;
                        case 'not-allowed':
                            errorMsg = 'Microphone permission denied. Please click the lock icon in your browser address bar to allow access.';
                            break;
                        case 'no-speech':
                            errorMsg = 'I didn\'t hear anything. Please try speaking again.';
                            break;
                        default:
                            errorMsg = 'Speech recognition failed. Please check your connection and try again.';
                    }
                    setVoiceError(errorMsg);
                    setIsListening(false);
                    setInterimTranscript('');
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    setInterimTranscript('');
                    // Auto-send the transcript when recognition ends
                    const transcript = pendingTranscriptRef.current;
                    if (transcript.trim()) {
                        pendingTranscriptRef.current = '';
                        // Use the ref to send the message
                        if (sendMessageRef.current) {
                            sendMessageRef.current(transcript);
                        }
                    }
                };
            }
        }
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            stopSpeaking();
        };
    }, [stopSpeaking]);

    const startListening = async () => {
        if (!recognitionRef.current) {
             const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
             if (SpeechRecognition) {
                 recognitionRef.current = new SpeechRecognition();
                 recognitionRef.current.continuous = true;
                 recognitionRef.current.interimResults = true;
                 
                 // Re-bind handlers
                 recognitionRef.current.onresult = (event: any) => {
                    let interim = '';
                    let final = '';
                    for (let i = 0; i < event.results.length; i++) {
                        const result = event.results[i];
                        if (result.isFinal) final += result[0].transcript;
                        else interim += result[0].transcript;
                    }
                    if (final) { pendingTranscriptRef.current = final; setInterimTranscript(''); }
                    else setInterimTranscript(interim);
                };
                
                recognitionRef.current.onerror = (event: any) => {
                    let errorMsg = '';
                    switch (event.error) {
                        case 'audio-capture': errorMsg = 'No microphone detected. Please check your Windows/Browser privacy settings and ensure your mic is plugged in.'; break;
                        case 'not-allowed': errorMsg = 'Microphone permission denied. Please allow access in your browser.'; break;
                        case 'no-speech': errorMsg = 'I didn\'t hear anything. Try again?'; break;
                        default: errorMsg = 'Recognition failed. Please try again.';
                    }
                    setVoiceError(errorMsg);
                    setIsListening(false);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    const transcript = pendingTranscriptRef.current;
                    if (transcript.trim()) {
                        pendingTranscriptRef.current = '';
                        if (sendMessageRef.current) sendMessageRef.current(transcript);
                    }
                };
             }
        }

        if (recognitionRef.current) {
            // Check for Secure Context (HTTPS or Localhost)
            if (typeof window !== 'undefined' && !window.isSecureContext) {
                setVoiceError('Voice features require a secure connection (HTTPS or Localhost) to work. Please use https:// or test on localhost.');
                setIsListening(false);
                return;
            }

            setVoiceError(null);
            stopSpeaking();
            pendingTranscriptRef.current = '';
            setInterimTranscript('');

            const langMap: Record<string, string> = {
                'en': 'en-US', 'hi': 'hi-IN', 'kn': 'kn-IN', 'te': 'te-IN', 
                'ta': 'ta-IN', 'mr': 'mr-IN', 'pa': 'pa-IN', 'bn': 'bn-IN', 'gu': 'gu-IN'
            };
            recognitionRef.current.lang = langMap[language] || 'en-US';

            // Explicitly request mic access to "wake up" the hardware
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                // If we get here, the mic is definitely accessible
                stream.getTracks().forEach(track => track.stop()); // Stop immediately, we just wanted to check access
                
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err: any) {
                console.error('Mic check failed:', err);
                if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                    setVoiceError('No microphone detected. Is it plugged in?');
                } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setVoiceError('Microphone access denied. \n\nTo fix this: \n1. Click the Lock icon in your browser bar and select "Allow". \n2. Check Windows Settings > Privacy > Microphone and turn ON "Let desktop apps access your microphone".');
                } else {
                    setVoiceError('Could not start microphone. Another app might be using it, or permissions are blocked.');
                }
                setIsListening(false);
            }
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const speakMessage = (message: ChatMessage) => {
        if (speakingMessageId === message.id) {
            stopSpeaking();
            setSpeakingMessageId(null);
        } else {
            speak(message.content, message.id);
        }
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

    const sendMessage = useCallback(async (question?: string) => {
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
                const msgId = (Date.now() + 1).toString();
                const assistantMessage: ChatMessage = {
                    id: msgId,
                    type: 'assistant',
                    content: data.answer,
                    timestamp: new Date(data.timestamp)
                };
                const finalMessages = [...currentMessages, assistantMessage];
                setMessages(finalMessages);
                saveConversation(finalMessages);
                
                // Speak the answer if autoSpeak is on
                if (autoSpeak) {
                    speak(data.answer, msgId);
                }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [input, imageFile, messages, language, autoSpeak, speak, saveConversation]);

    // Keep sendMessageRef in sync
    useEffect(() => {
        sendMessageRef.current = sendMessage;
    }, [sendMessage]);

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
                externalIsOpen={sidebarOpen}
                setExternalIsOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className={`flex-shrink-0 border-b ${theme.headerBorder} ${theme.headerBg} z-20 transition-colors duration-300`}>
                    <div className="max-w-4xl mx-auto w-full px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className={`p-2 rounded-lg md:hidden ${dark ? 'text-gray-400 hover:bg-[#2e2f42]' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <a href="/" className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-1 rounded-md">
                                    <Sprout className="w-4 h-4 text-white" />
                                </div>
                                <span className={`text-sm font-bold bg-gradient-to-r ${theme.brandText} bg-clip-text text-transparent hidden xs:inline-block`}>
                                    {t.title}
                                </span>
                            </a>
                        </div>

                        <div className="flex items-center gap-2">
                            {isSpeaking && (
                                <button
                                    onClick={() => { stopSpeaking(); setSpeakingMessageId(null); }}
                                    className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${dark ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-red-50 text-red-600 border border-red-100'}`}
                                >
                                    <VolumeX className="w-3 h-3" />
                                    {t.stopSpeaking || 'Stop'}
                                </button>
                            )}
                            <LanguageSwitcher dark={dark} />
                            <button
                                onClick={() => setAutoSpeak(!autoSpeak)}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme.themeBtn} ${!autoSpeak ? 'opacity-50' : ''}`}
                                title={autoSpeak ? (t.stopSpeaking || 'Mute') : (t.speak || 'Unmute')}
                            >
                                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
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
                                                    <div className={`flex items-center gap-2 mt-1 px-1 ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <span className="text-[10px] opacity-50">
                                                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {m.type === 'assistant' && (
                                                            <button
                                                                onClick={() => speakMessage(m)}
                                                                className={`p-1 rounded-md transition-all ${
                                                                    speakingMessageId === m.id
                                                                        ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                                                                        : dark ? 'text-gray-500 hover:text-green-400 hover:bg-[#2e2f42]' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                                }`}
                                                                title={speakingMessageId === m.id ? (t.stopSpeaking || 'Stop') : (t.speak || 'Listen')}
                                                            >
                                                                {speakingMessageId === m.id ? (
                                                                    <AudioLines className="w-3.5 h-3.5 animate-pulse" />
                                                                ) : (
                                                                    <Volume2 className="w-3.5 h-3.5" />
                                                                )}
                                                            </button>
                                                        )}
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

                    {/* Voice Listening Overlay */}
                    {(isListening || voiceError) && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center p-4" style={{ background: dark ? 'rgba(30,31,43,0.92)' : 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}>
                            <div className="flex flex-col items-center gap-6 max-w-md w-full px-8 text-center">
                                {/* Animated mic with rings or Error Icon */}
                                <div className="relative">
                                    {isListening && !voiceError ? (
                                        <>
                                            <div className="absolute inset-0 w-28 h-28 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                                            <div className="absolute inset-2 w-24 h-24 rounded-full bg-green-500/15 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                                            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                                                <Mic className="w-12 h-12 text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-red-500/30">
                                            <X className="w-12 h-12 text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Waveform or Error Message */}
                                {isListening && !voiceError ? (
                                    <div className="flex items-center gap-1 h-10">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 rounded-full bg-gradient-to-t from-green-500 to-emerald-400"
                                                style={{
                                                    animation: 'voiceWave 1s ease-in-out infinite',
                                                    animationDelay: `${i * 0.08}s`,
                                                    height: '8px',
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`p-4 rounded-2xl ${dark ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'} border ${dark ? 'border-red-500/30' : 'border-red-200'} text-sm font-medium`}>
                                        {voiceError}
                                    </div>
                                )}

                                <div>
                                    <p className={`text-lg font-bold mb-1 ${dark ? 'text-gray-100' : 'text-gray-800'}`}>
                                        {isListening ? (t.listening || 'Listening...') : 'Oops! Something went wrong'}
                                    </p>
                                    {isListening && interimTranscript && (
                                        <p className={`text-sm italic max-w-xs ${dark ? 'text-green-400' : 'text-green-600'}`}>
                                            "{interimTranscript}"
                                        </p>
                                    )}
                                    {isListening && !interimTranscript && (
                                        <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {t.speakNow || 'Speak now — your message will be sent automatically'}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    {voiceError ? (
                                        <>
                                            <button
                                                onClick={() => { setVoiceError(null); startListening(); }}
                                                className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20 hover:scale-105"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Try Again
                                            </button>
                                            <button
                                                onClick={() => setVoiceError(null)}
                                                className={`px-6 py-2.5 rounded-xl border ${dark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-600'} text-sm font-bold transition-all hover:bg-gray-100 dark:hover:bg-gray-800`}
                                            >
                                                Close
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={stopListening}
                                            className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95"
                                        >
                                            <MicOff className="w-4 h-4" />
                                            {t.stopListening || 'Stop Listening'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
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
                                
                                {/* Big Voice Mic Button — prominent, easy to tap */}
                                <button
                                    type="button"
                                    onClick={startListening}
                                    disabled={loading}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                                        dark 
                                            ? 'text-gray-400 hover:text-green-400 hover:bg-green-900/30' 
                                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                    } disabled:opacity-30`}
                                    title={t.startListening || 'Speak'}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>

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
