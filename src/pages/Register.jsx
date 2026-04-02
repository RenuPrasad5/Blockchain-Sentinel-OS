import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

const HexagonLogo = () => (
    <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-28 h-28 mb-8"
    >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <path d="M50 5L90 27.5V72.5L50 95L10 72.5V27.5L50 5Z" stroke="#3b82f6" strokeWidth="3" />
            <path d="M50 15L80 32.5V67.5L50 85L20 67.5V32.5L50 15Z" fill="url(#hexGradient)" opacity="0.8" />
            <defs>
                <linearGradient id="hexGradient" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3b82f6" stopOpacity="0.5" />
                    <stop offset="1" stopColor="#020617" stopOpacity="0" />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="10" fill="#ffffff" className="drop-shadow-[0_0_10px_#ffffff]" />
        </svg>
    </motion.div>
);

const Register = () => {
    const navigate = useNavigate();
    const { signup, logout } = useAuth();
    const auth = getAuth();
    
    const [userType, setUserType] = useState('Individual'); // 'Individual' or 'Organization'
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        setGoogleLoading(true);
        setError('');
        try {
            // Fetch the user profile from Google's userinfo endpoint
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await userInfoResponse.json();
            
            // In a fully integrated app, if the user doesn't exist we register them
            // Firebase handles automatic linking or creation with Google Auth credential
            const credential = GoogleAuthProvider.credential(null, tokenResponse.access_token);
            try {
                await signInWithCredential(auth, credential);
                // Optionally update profile with userType here if needed
                navigate('/dashboard', { replace: true });
            } catch (fbError) {
                console.error("Firebase auth error:", fbError);
                setError("Failed to link Google account. Try using standard sign-up.");
            }
        } catch (error) {
            console.error("Google Auth process failed:", error);
            setError("Google authentication failed.");
        } finally {
            setGoogleLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError("Google Sign-In was closed or failed.")
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setLoading(true);
        try {
            await signup(formData.email, formData.password, {
                name: formData.fullName,
                userType: userType
            });

            await logout();
            setSuccess(true);
            setTimeout(() => navigate('/login'), 5000);
        } catch (error) {
            console.error(error);
            const msg = error.code === 'auth/email-already-in-use'
                ? 'Email is already registered.'
                : error.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-sans p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl text-center p-10"
                >
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-black text-[#020617] mb-2 tracking-tight">Account Created</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                        Welcome to Sentinel-OS. Please check <span className="text-[#020617] font-bold">{formData.email}</span> for verification instructions.
                    </p>
                    <button onClick={() => navigate('/login')} className="w-full bg-[#020617] hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(2,6,23,0.1)]">
                        Proceed to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex font-sans overflow-hidden bg-white">
            {/* Left Side: Branding Panel (40%) */}
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex w-[40%] bg-[#020617] flex-col items-center justify-center p-12 relative overflow-hidden z-10 shadow-[20px_0_40px_rgba(0,0,0,0.1)]"
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none"></div>
                
                <HexagonLogo />
                
                <h1 className="text-4xl font-black text-white mb-4 tracking-tight text-center">
                    Blockchain<br />Intelligence OS
                </h1>
                <p className="text-slate-400 text-lg text-center max-w-sm font-medium">
                    The Future of Sovereign Digital Forensics.
                </p>
            </motion.div>

            {/* Right Side: Interaction Panel (60%) */}
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[60%] bg-white flex flex-col items-center justify-center p-8 sm:p-12 overflow-y-auto"
            >
                <div className="w-full max-w-md my-auto pb-8 pt-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-[#020617] tracking-tight">Create Account</h2>
                        <p className="text-slate-500 mt-2 font-medium">Join Sentinel-OS today</p>
                    </div>

                    <button 
                        type="button"
                        onClick={() => googleLogin()}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border border-slate-200 text-[#020617] font-bold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-70"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    <div className="flex items-center my-8">
                        <div className="flex-1 border-t border-slate-200"></div>
                        <span className="px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">Or</span>
                        <div className="flex-1 border-t border-slate-200"></div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start gap-3 rounded-r-md">
                            <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* User Type Toggle */}
                        <div className="flex p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
                            {[ 'Individual', 'Organization' ].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setUserType(type)}
                                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                                        userType === type 
                                        ? 'bg-white text-[#020617] shadow-sm' 
                                        : 'text-slate-500 hover:text-[#020617]'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#020617] mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-slate-400" size={18} />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    placeholder="Enter your name"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#020617] focus:border-transparent transition-all bg-white text-[#020617] font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#020617] mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="text-slate-400" size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    placeholder="Enter your email"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#020617] focus:border-transparent transition-all bg-white text-[#020617] font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#020617] mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-slate-400" size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    placeholder="••••••••"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#020617] focus:border-transparent transition-all bg-white text-[#020617] font-medium"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#020617] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 mt-2 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(2,6,23,0.15)]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-600 font-medium">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
