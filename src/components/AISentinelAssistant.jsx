import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Terminal, ArrowRight, Shield, Zap, Search, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useModeStore from '../store/modeStore';
import logo from '../assets/logo.png';
import './AISentinelAssistant.css';

const TypewriterText = ({ text, delay = 30 }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return <span className="typewriter">{currentText}</span>;
};

const AISentinelAssistant = () => {
    const { liveData } = useModeStore();
    const [isOpen, setIsOpen] = useState(false);
    const [hasPopped, setHasPopped] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-pop logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasPopped) {
                // Play subtle ping (visual only if no audio asset, but let's try a standard URL)
                try {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
                    audio.volume = 0.2;
                    audio.play();
                } catch (e) { console.log('Audio blocked'); }

                setMessages([
                    {
                        id: 1,
                        role: 'ai',
                        content: 'I am the Sentinel. I am currently monitoring 1,840+ active nodes. How can I assist your investigation today?',
                        typed: false
                    }
                ]);
                setIsOpen(true);
                setHasPopped(true);
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, [hasPopped]);

    const handleSend = (text = inputValue) => {
        if (!text.trim()) return;

        const newUserMessage = { id: Date.now(), role: 'user', content: text };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        // Process intelligence logic
        setTimeout(() => {
            let response = "I'm processing that through the Neural Engine...";

            const lowerText = text.toLowerCase();

            if (lowerText.includes('biggest mover') || lowerText.includes('whale') || lowerText.includes('mempool')) {
                const whales = liveData.filter(tx => tx.valueUsd > 1000000);
                if (whales.length > 0) {
                    const topWhale = whales[0];
                    response = `PROTOCOL ENCRYPTED. I've detected a significant move: ${topWhale.from.slice(0, 10)}... moved $${(topWhale.valueUsd / 1000000).toFixed(2)}M. Investigation bridge is active.`;
                } else {
                    response = "Mempool state is currently nominal. No movements over $1M detected in the last buffer cycle.";
                }
            } else if (lowerText.includes('risk') || lowerText.includes('score')) {
                response = "Neural Risk Filter active. I am cross-referencing GoPlus and AML blacklists. Please provide a specific subject hash for a forensic scan.";
            } else if (lowerText.includes('sentinel')) {
                response = "Surveillance units are currently monitoring exchange gateways. You have 2 active sentinels positioned on high-volatility wallets.";
            } else {
                response = "Command not recognized within Intelligence Sector protocols. I can scan the mempool, verify risk scores, or check your active sentinels.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: response, typed: false }]);
            setIsTyping(false);
        }, 1200);
    };

    const QuickActions = () => (
        <div className="quick-actions">
            {[
                { label: 'Scan Mempool', icon: <Search size={10} /> },
                { label: 'Check Risk Score', icon: <Shield size={10} /> },
                { label: 'View My Sentinels', icon: <Activity size={10} /> }
            ].map((action, idx) => (
                <button
                    key={idx}
                    className="action-chip"
                    onClick={() => handleSend(action.label)}
                >
                    <span className="flex items-center gap-1.5">{action.icon} {action.label}</span>
                </button>
            ))}
        </div>
    );

    return (
        <div className="sentinel-assistant-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="sentinel-chat-window"
                    >
                        <div className="chat-header">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-indigo-400" />
                                <span className="chat-header-title">Neural Sentinel Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg, idx) => (
                                <div key={msg.id} className={`message ${msg.role}`}>
                                    {msg.role === 'ai' ? (
                                        <TypewriterText text={msg.content} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message ai">
                                    <span className="typewriter">Interpreting network noise...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input-area">
                            <QuickActions />
                            <div className="input-container">
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder="Execute command..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className="send-btn" onClick={() => handleSend()}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative">
                {!isOpen && hasPopped && (
                    <div className="auto-pop-badge">1</div>
                )}
                <div
                    className="sentinel-trigger"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="neural-pulse"></div>
                    <img src={logo} alt="Sentinel" className="sentinel-logo-mini" />
                </div>
            </div>
        </div>
    );
};

export default AISentinelAssistant;
