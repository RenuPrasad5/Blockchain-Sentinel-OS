import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Briefcase, 
    Trash2, 
    ExternalLink, 
    Search,
    Filter,
    Shield,
    Loader2,
    Calendar,
    Tag,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';

const Cases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (!user) {
                setError("Security Protocol: You must be authenticated to view forensic cases.");
                setLoading(false);
                return;
            }

            const q = query(
                collection(db, 'cases'),
                where('userId', '==', user.uid),
                orderBy('timestamp', 'desc')
            );

            const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                const caseList = snapshot.docs.map(doc => ({
                    _id: doc.id,
                    ...doc.data()
                }));
                setCases(caseList);
                setLoading(false);
                setError(null);
            }, (err) => {
                setError(err.message);
                setLoading(false);
            });

            return () => unsubscribeSnapshot();
        });

        return () => unsubscribeAuth();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this case?")) return;
        
        try {
            await deleteDoc(doc(db, 'cases', id));
        } catch (err) {
            alert("Error deleting case: " + err.message);
        }
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = (c.wallet || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = filterRisk === 'All' || c.riskLevel === filterRisk;
        return matchesSearch && matchesRisk;
    });

    return (
        <div className="min-h-screen bg-[#050505] text-slate-200 p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <Briefcase className="text-blue-500" size={32} />
                            <h1 className="text-4xl font-black text-white tracking-tight">My Cases</h1>
                        </div>
                        {auth.currentUser && (
                            <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl text-blue-400 text-sm font-medium font-mono hidden md:block">
                                {auth.currentUser.email}
                            </div>
                        )}
                    </div>
                    <p className="text-slate-400">Manage your private forensic wallet investigations and traces.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by wallet address..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0f0f0f] border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 transition-all font-mono text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'High', 'Medium', 'Low'].map(risk => (
                            <button
                                key={risk}
                                onClick={() => setFilterRisk(risk)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                                    filterRisk === risk 
                                        ? 'bg-blue-600 text-white border-blue-500' 
                                        : 'bg-[#0f0f0f] text-slate-400 border-white/5 hover:border-white/20'
                                }`}
                            >
                                {risk} Risk
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                        {error}
                    </div>
                ) : filteredCases.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-3xl bg-[#0f0f0f]">
                        <Briefcase className="mx-auto text-slate-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-white mb-2">No Cases Found</h3>
                        <p className="text-slate-500">You haven't saved any wallet investigations yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredCases.map(c => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={c._id} 
                                className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all flex flex-col md:flex-row items-center gap-6"
                            >
                                <div className={`p-4 rounded-2xl ${
                                    c.riskLevel === 'High' ? 'bg-red-500/10 text-red-500' :
                                    c.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-emerald-500/10 text-emerald-500'
                                }`}>
                                    <Shield size={24} />
                                </div>
                                
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-mono text-sm text-white bg-black/50 px-3 py-1 rounded-lg border border-white/5">
                                            {c.wallet}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                            c.riskLevel === 'High' ? 'text-red-500 border-red-500/20' :
                                            c.riskLevel === 'Medium' ? 'text-amber-500 border-amber-500/20' :
                                            'text-emerald-500 border-emerald-500/20'
                                        }`}>
                                            {c.riskLevel} Risk
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border text-purple-400 border-purple-500/20 bg-purple-500/10">
                                            {c.mode}
                                        </span>
                                    </div>
                                    <div className="flex gap-6 text-xs text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {c.createdAt?.toDate ? new Date(c.createdAt.toDate()).toLocaleDateString() : 'Saving...'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {c.createdAt?.toDate ? new Date(c.createdAt.toDate()).toLocaleTimeString() : ''}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Tag size={14} />
                                            Score: {c.riskScore}%
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => navigate(`/tools/analyzer?wallet=${c.wallet}&mode=${c.mode}`)}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600/10 text-blue-500 hover:bg-blue-600/20 px-6 py-3 rounded-xl text-xs font-bold transition-all"
                                    >
                                        <ExternalLink size={16} /> Open
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(c._id)}
                                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cases;
