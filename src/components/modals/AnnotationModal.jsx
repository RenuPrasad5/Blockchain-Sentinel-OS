import React, { useState } from 'react';
import { X, Tag, ShieldCheck, AlertTriangle, Save } from 'lucide-react';

const AnnotationModal = ({ isOpen, onClose, onSave, entity }) => {
    const [label, setLabel] = useState('Suspicious');
    const [confidence, setConfidence] = useState(80);
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            label,
            confidence: parseInt(confidence, 10),
            notes,
            timestamp: new Date().toISOString()
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                            <Tag className="text-indigo-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Forensic Annotation</h3>
                            <p className="text-xs text-slate-400">Applying intelligence labels to node</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Entity Target</label>
                        <div className="font-mono text-xs text-blue-400 bg-white/5 p-3 rounded-xl border border-white/5 break-all">
                            {entity}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Classification Label</label>
                            <select 
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                            >
                                <option>Exchange</option>
                                <option>Scam/Phishing</option>
                                <option>Mixer/Mule</option>
                                <option>DeFi Contract</option>
                                <option>High Risk Entity</option>
                                <option>Suspicious</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Confidence: {confidence}%</label>
                            <div className="flex items-center h-full pt-1">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={confidence}
                                    onChange={e => setConfidence(e.target.value)}
                                    className="w-full accent-indigo-500 h-1.5 rounded-lg bg-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Analyst Commentary</label>
                        <textarea 
                            rows={3}
                            placeholder="Reasoning behind classification..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full bg-[#0b0f19] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="submit"
                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
                        >
                            <Save size={14} /> Commit Annotation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnotationModal;
