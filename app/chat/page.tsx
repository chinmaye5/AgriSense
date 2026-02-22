// app/agriculture-chat/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Sprout } from 'lucide-react';

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
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'assistant',
            content: '🌱 Welcome! I\'m AgriSense AI, your agricultural expert. Ask me anything about crops, farming techniques, soil management, pests, or government schemes. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState([
        "How to increase tomato yield in sandy soil?",
        "Best crops for low rainfall areas?",
        "Organic pest control methods?",
        "When to harvest wheat for maximum yield?",
        "Government subsidies for drip irrigation?"
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const cleanText = (text: string) => {
        return text
            .replace(/##\s*/g, '') // Remove markdown headers
            .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.*?)\*/g, '$1') // Remove italics
            .replace(/`(.*?)`/g, '$1') // Remove code blocks
            .replace(/#\s/g, '') // Remove numbered headers
            .trim();
    };

    const formatAnswer = (text: string) => {
        // Clean the text first
        const cleanContent = cleanText(text);

        // Split by common section indicators
        const lines = cleanContent.split('\n').filter(line => line.trim());
        const sections = [];
        let currentSection: string[] = [];

        lines.forEach(line => {
            const trimmedLine = line.trim();

            // Check if this line starts a new section
            if (
                trimmedLine.match(/^\d+\./) || // Numbered items
                trimmedLine.match(/^[•\-]\s/) || // Bullet points
                trimmedLine.match(/^[A-Z][^a-z]*:$/) || // Headers like "SOIL PREPARATION:"
                trimmedLine.toLowerCase().includes('key takeaway') ||
                trimmedLine.toLowerCase().includes('summary')
            ) {
                if (currentSection.length > 0) {
                    sections.push(currentSection.join('\n'));
                    currentSection = [];
                }
            }
            currentSection.push(trimmedLine);
        });

        if (currentSection.length > 0) {
            sections.push(currentSection.join('\n'));
        }

        // If no clear sections found, return as single paragraph
        if (sections.length === 0) {
            return (
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {cleanContent}
                </p>
            );
        }

        return sections.map((section, index) => {
            const sectionText = section.trim();

            // Numbered list section
            if (sectionText.match(/^\d+\./)) {
                const items = sectionText.split(/\d+\./).filter(item => item.trim());
                return (
                    <div key={index} className="space-y-3 mb-4">
                        {items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                                    {itemIndex + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-800 leading-relaxed">
                                        {item.trim()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }

            // Bullet points section
            else if (sectionText.match(/^[•\-]\s/)) {
                const items = sectionText.split(/[•\-]\s/).filter(item => item.trim());
                return (
                    <div key={index} className="space-y-2 mb-4">
                        {items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-3">
                                <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-3"></div>
                                <div className="flex-1">
                                    <p className="text-gray-800 leading-relaxed">
                                        {item.trim()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            }

            // Key takeaways section
            else if (sectionText.toLowerCase().includes('key takeaway') || sectionText.toLowerCase().includes('summary')) {
                const content = sectionText.replace(/key takeaway|summary/gi, '').trim();
                return (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <strong className="text-yellow-800 text-sm uppercase tracking-wide">
                                Key Insight
                            </strong>
                        </div>
                        <p className="text-yellow-900 leading-relaxed whitespace-pre-line">
                            {content}
                        </p>
                    </div>
                );
            }

            // Section headers (lines ending with colon or all caps)
            else if (sectionText.match(/:$/) || sectionText === sectionText.toUpperCase()) {
                return (
                    <h4 key={index} className="text-lg font-semibold text-green-800 mt-6 mb-3 pb-2 border-b border-green-200">
                        {sectionText.replace(/:$/, '')}
                    </h4>
                );
            }

            // Regular paragraph
            else {
                return (
                    <p key={index} className="text-gray-800 leading-relaxed mb-4 whitespace-pre-line">
                        {sectionText}
                    </p>
                );
            }
        });
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

        try {
            const response = await fetch('/api/agriculture-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: messageContent
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
            }
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: 'Sorry, I encountered an error while processing your question. Please try again.',
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

    const handleSuggestionClick = (question: string) => {
        sendMessage(question);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
            {/* Header */}
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
                        href="/graph"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Get Detailed Crop Analysis
                    </a>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Suggested Questions */}
                {messages.length <= 1 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            Quick Questions to Get Started
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {suggestedQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(question)}
                                    className="bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl p-4 text-left hover:bg-green-50 hover:border-green-300 transition-all duration-200 group shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                            <span className="text-green-600 text-sm">💡</span>
                                        </div>
                                        <span className="text-gray-700 text-sm leading-relaxed">{question}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chat Container */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-6">
                    {/* Messages Area */}
                    <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${message.type === 'user'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                    }`}>
                                    <span className="text-white text-sm">
                                        {message.type === 'user' ? '👤' : '🌱'}
                                    </span>
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block rounded-3xl p-5 shadow-sm ${message.type === 'user'
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                        : 'bg-gray-50 border border-green-100 text-gray-800'
                                        }`}>
                                        {message.type === 'assistant' ? (
                                            <div className="space-y-3">
                                                {formatAnswer(message.content)}
                                            </div>
                                        ) : (
                                            <p className="leading-relaxed">{message.content}</p>
                                        )}
                                    </div>

                                    {/* Timestamp */}
                                    <div className={`text-xs text-gray-500 mt-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                                    <span className="text-white text-sm">🌱</span>
                                </div>
                                <div className="flex-1 max-w-[80%]">
                                    <div className="bg-gray-50 border border-green-100 rounded-3xl p-5 shadow-sm">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-sm font-medium">AgriSense AI is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-green-100 bg-white/60 p-6">
                        <form onSubmit={handleSubmit} className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about crops, soil, pests, irrigation, subsidies..."
                                    className="w-full px-6 py-4 bg-white border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm pr-24 text-gray-800 placeholder-gray-500"
                                    disabled={loading}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setInput('')}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                    <div className="w-px h-6 bg-gray-300"></div>
                                    <button
                                        type="submit"
                                        disabled={loading || !input.trim()}
                                        className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2 mt-4 justify-center">
                            {['Soil Testing', 'Pest Control', 'Irrigation', 'Organic Farming'].map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => setInput(`Tell me about ${topic.toLowerCase()}...`)}
                                    className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors border border-green-200"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { icon: '🔬', label: 'Scientific Accuracy' },
                        { icon: '💧', label: 'Water Management' },
                        { icon: '🌾', label: 'Crop Science' },
                        { icon: '💰', label: 'Cost Analysis' }
                    ].map((feature, index) => (
                        <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-green-100 shadow-sm">
                            <div className="text-2xl mb-2">{feature.icon}</div>
                            <div className="text-sm text-gray-700 font-medium">{feature.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}