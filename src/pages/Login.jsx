import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { getAuth, signInWithCustomToken, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';

import logo from '../assets/BL.logo.png';

const NetworkNodeLogo = () => (
    <motion.div
        animate={{ 
            opacity: [0.8, 1, 0.8],
            scale: [0.98, 1, 0.98]
        }}
        transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
        }}
        className="w-56 h-56 mb-8 flex items-center justify-center"
    >
        <div className="relative w-full h-full">
            {/* Soft outer glow */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse" />
            <img 
                src={logo} 
                alt="Network Node" 
                className="w-full h-full object-contain relative z-10 animate-pulse" 
            />
        </div>
    </motion.div>
);

const NetworkBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#f8fafc]">
        {/* Cyber Grid */}
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[0.05]">
            <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cyber-grid)" />
        </svg>
        
        {/* Floating Telemetry Labels */}
        <div className="absolute top-6 left-6 font-mono text-[10px] text-slate-400 tracking-widest uppercase">
            Latency: <span className="text-blue-500">24MS</span>
        </div>
        <div className="absolute top-6 right-6 font-mono text-[10px] text-slate-400 tracking-widest uppercase">
            Gateway: <span className="text-emerald-500">Verified</span>
        </div>
        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-slate-400 tracking-widest uppercase">
            Protocol: <span className="text-blue-500">OS-V2</span>
        </div>

        <motion.div
            animate={{ 
                x: [0, 50, 0], 
                y: [0, 30, 0],
                rotate: [0, 10, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[100px]"
        />
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, logout, signup } = useAuth();
    const auth = getAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        setGoogleLoading(true);
        setError('');
        try {
            // Since we use the custom hook useGoogleLogin, we get an access_token, not a JWT.
            // We fetch the user profile from Google's userinfo endpoint.
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            const userInfo = await userInfoResponse.json();
            
            const { name, email, sub } = userInfo; // sub is the unique ID
            
            // In a fully integrated app, if the user isn't in Firebase, we simulate registration/login
            // Here, Firebase lets us sign in with the credential directly, which auto-registers if new.
            const credential = GoogleAuthProvider.credential(null, tokenResponse.access_token);
            try {
                await signInWithCredential(auth, credential);
                const from = location.state?.from?.pathname || '/dashboard';
                navigate(from, { replace: true });
            } catch (fbError) {
                console.error("Firebase auth error:", fbError);
                setError("Failed to link Google account with Firebase.");
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
        onError: () => setError("Google Login was closed or failed.")
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await login(formData.email, formData.password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                setError("Access denied. Please verify your email first.");
                await logout();
                setLoading(false);
                return;
            }

            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } catch (error) {
            console.error(error);
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans overflow-hidden bg-white">
            {/* Left Side: Branding Panel (40%) */}
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex w-[40%] bg-[#020617] flex-col items-center justify-center p-12 relative overflow-hidden z-10 shadow-[20px_0_40px_rgba(0,0,0,0.1)]"
            >
                {/* Decorative background radials */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none"></div>
                
                <div className="flex flex-col items-center justify-center z-20">
                    <NetworkNodeLogo />
                    <h1 className="text-4xl font-black text-white mb-6 tracking-tight text-center leading-tight">
                        Blockchain<br />Intelligence <span className="text-blue-500">OS</span>
                    </h1>
                    <div className="h-1 w-20 bg-blue-500/50 rounded-full mb-6"></div>
                    <p className="text-slate-400 text-lg text-center max-w-sm font-medium leading-relaxed">
                        The Future of Sovereign<br />Digital Forensics.
                    </p>
                </div>
            </motion.div>

            {/* Right Side: Interaction Panel (60%) */}
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full lg:w-[60%] bg-[#f8fafc] flex flex-col items-center justify-center p-8 sm:p-12 overflow-y-auto relative"
            >
                <NetworkBackground />
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md my-auto p-10 bg-white/80 backdrop-blur-[10px] rounded-3xl border border-blue-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10"
                    style={{ 
                        borderImageSource: 'linear-gradient(to bottom right, rgba(59,130,246,0.3), transparent)',
                        borderImageSlice: 1
                    }}
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-extrabold text-[#020617] tracking-tight">Welcome Back</h2>
                        <p className="text-slate-500 mt-2 font-medium">Log in to your Sentinel-OS portal</p>
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
                                    className="w-full pl-10 pr-3 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] transition-all bg-white text-[#020617] font-medium"
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
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    placeholder="••••••••"
                                    required
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-10 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] transition-all bg-white text-[#020617] font-medium"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-[#020617] transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm pt-2">
                            <label className="flex items-center gap-2 text-slate-600 cursor-pointer hover:text-[#020617] transition-colors">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#020617] focus:ring-[#020617]" /> 
                                <span className="font-medium">Remember me</span>
                            </label>
                            <Link to="#" className="text-blue-600 font-bold hover:underline">Forgot Password?</Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full group relative bg-[#020617] text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 mt-4 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(2,6,23,0.15)] overflow-hidden"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" 
                                 style={{ animation: 'shimmer 3s infinite 1.5s' }} />
                            
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm text-slate-600 font-medium">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up now</Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
