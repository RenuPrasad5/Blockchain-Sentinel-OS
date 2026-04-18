import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import useOnboardingStore from '../../store/onboardingStore';

const steps = [
    {
        target: 'walkthrough-alerts',
        title: 'Critical Alerts',
        text: 'Live security threats and high-risk movements appear here in real-time.',
        position: 'bottom'
    },
    {
        target: 'walkthrough-activity',
        title: 'Recent Activity',
        text: 'A stream of the latest blockchain events analyzed by our neural engine.',
        position: 'left'
    },
    {
        target: 'walkthrough-summary',
        title: 'Investigation Summary',
        text: 'Detailed forensic narrative for the active case. Everything you need to know, in plain English.',
        position: 'top'
    }
];

const GuidedWalkthrough = () => {
    const { 
        showWalkthrough, 
        walkthroughStep, 
        setWalkthroughStep, 
        completeOnboarding 
    } = useOnboardingStore();

    const [targetRect, setTargetRect] = useState(null);

    useEffect(() => {
        if (showWalkthrough) {
            const step = steps[walkthroughStep];
            const element = document.getElementById(step.target);
            if (element) {
                setTargetRect(element.getBoundingClientRect());
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('walkthrough-highlight');
            }
        }
        return () => {
            const currentStep = steps[walkthroughStep];
            const element = document.getElementById(currentStep?.target);
            if (element) element.classList.remove('walkthrough-highlight');
        };
    }, [showWalkthrough, walkthroughStep]);

    if (!showWalkthrough || !targetRect) return null;

    const currentStep = steps[walkthroughStep];

    const getPositionStyles = () => {
        const padding = 20;
        switch (currentStep.position) {
            case 'bottom':
                return {
                    top: targetRect.bottom + padding + window.scrollY,
                    left: targetRect.left + (targetRect.width / 2) - 150,
                };
            case 'top':
                return {
                    top: targetRect.top - 200 + window.scrollY,
                    left: targetRect.left + (targetRect.width / 2) - 150,
                };
            case 'left':
                return {
                    top: targetRect.top + window.scrollY,
                    left: targetRect.left - 320,
                };
            default:
                return { top: 0, left: 0 };
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
            {/* Overlay with hole */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={walkthroughStep}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute z-10 w-80 pointer-events-auto"
                    style={getPositionStyles()}
                >
                    <div className="bg-[#1e293b] border border-blue-500/50 rounded-2xl p-6 shadow-2xl relative">
                        {/* Indicator pulse */}
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
                        
                        <div className="flex items-center gap-2 mb-3">
                            <Info size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                                Step {walkthroughStep + 1} of {steps.length}
                            </span>
                        </div>

                        <h3 className="text-white font-black text-lg mb-2">{currentStep.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {currentStep.text}
                        </p>

                        <div className="flex items-center justify-between">
                            <button 
                                onClick={completeOnboarding}
                                className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Skip Tour
                            </button>
                            
                            <button
                                onClick={() => {
                                    if (walkthroughStep < steps.length - 1) {
                                        setWalkthroughStep(walkthroughStep + 1);
                                    } else {
                                        completeOnboarding();
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg"
                            >
                                {walkthroughStep === steps.length - 1 ? 'Finish' : 'Next'} 
                                {walkthroughStep === steps.length - 1 ? <CheckCircle2 size={12} /> : <ArrowRight size={12} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default GuidedWalkthrough;
