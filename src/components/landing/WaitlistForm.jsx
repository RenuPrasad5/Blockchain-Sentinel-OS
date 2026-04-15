import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

const WaitlistForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setStatus('loading');
        try {
            await addDoc(collection(db, 'waitlist'), {
                email,
                joinedAt: serverTimestamp(),
                source: 'landing_page'
            });
            setStatus('success');
            setEmail('');
        } catch (error) {
            console.error('Error joining waitlist:', error);
            setStatus('error');
        }
    };

    return (
        <section id="waitlist-section" className="py-24 px-4 relative overflow-hidden bg-transparent border-t border-white/5">
            {/* Glowing Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-3xl mx-auto text-center relative z-10 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Secure Your Early Access</h2>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">Join the exclusive waitlist for the Sovereign Blockchain Intelligence OS. Secure early access for your enterprise compliance and elite forensic teams.</p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row max-w-xl mx-auto gap-4">
                        <input 
                            type="email" 
                            placeholder="Enter your institutional email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={status === 'loading' || status === 'success'}
                            className="flex-1 bg-[#10141d] border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={status === 'loading' || status === 'success'}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
                        >
                            {status === 'loading' ? 'Processing...' : status === 'success' ? 'Joined Waitlist' : 'Join Waitlist'}
                            {status !== 'loading' && status !== 'success' && <Send size={20} />}
                        </button>
                    </form>
                    
                    {status === 'success' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 mt-6 font-medium bg-emerald-500/10 inline-block px-4 py-2 rounded-lg">
                            Thank you. You have been added to the sovereign waitlist.
                        </motion.p>
                    )}
                    {status === 'error' && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 mt-6 font-medium">
                            Failed to join waitlist. Please try again later.
                        </motion.p>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default WaitlistForm;
