import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, X, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { db, auth } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './SaveToCaseModal.css';

const SaveToCaseModal = ({ isOpen, onClose, walletAddress, riskScore, onSave }) => {
    const [caseName, setCaseName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSave = async () => {
        if (!caseName.trim() || !auth.currentUser) return;
        setIsSaving(true);
        
        try {
            const newCase = {
                uid: auth.currentUser.uid,
                id: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
                name: caseName,
                wallet: walletAddress,
                riskLevel: riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low',
                dateCreated: new Date().toISOString(),
                createdAt: serverTimestamp(),
                status: 'Active'
            };
            
            // Persist to Firestore
            await addDoc(collection(db, 'cases'), newCase);
            
            onSave(newCase);
            setIsSaving(false);
            setIsSuccess(true);
            
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setCaseName('');
            }, 1500);
        } catch (error) {
            console.error("Legal Archiving Failed:", error);
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="save-case-modal"
                >
                    <div className="modal-header">
                        <div className="flex items-center gap-3">
                            <div className="icon-box">
                                <Briefcase className="text-blue-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Assign to Case</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Forensic Workstation Unit</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="wallet-preview">
                            <span className="label">SUBJECT WALLET</span>
                            <span className="value font-mono">{walletAddress}</span>
                        </div>

                        <div className="input-group">
                            <label>Case Identification Name</label>
                            <div className="input-wrapper">
                                <Plus size={16} className="input-icon" />
                                <input 
                                    type="text" 
                                    placeholder="e.g. Operation Cyber-Shield"
                                    value={caseName}
                                    onChange={(e) => setCaseName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <p className="helper-text">Cases group multiple wallet analyses for unified reporting.</p>
                        </div>

                        <div className="risk-indicator">
                            <AlertCircle size={14} className={riskScore > 70 ? 'text-rose-500' : 'text-amber-500'} />
                            <span>This wallet will be tagged as <strong>{riskScore > 70 ? 'CRITICAL' : 'SUSPICIOUS'}</strong> risk.</span>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={onClose}>Discard</button>
                        <button 
                            className={`save-btn ${isSaving ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                            onClick={handleSave}
                            disabled={isSaving || !caseName.trim()}
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <div className="loading-dots"><span>.</span><span>.</span><span>.</span></div>
                                    ARCHIVING
                                </span>
                            ) : isSuccess ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 size={16} />
                                    SAVED TO BUREAU
                                </span>
                            ) : (
                                "INITIALIZE CASE"
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SaveToCaseModal;
