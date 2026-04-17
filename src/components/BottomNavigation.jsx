import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    Home, 
    Cpu, 
    Shield, 
    Newspaper, 
    User,
    Activity
} from 'lucide-react';

const BottomNavigation = () => {
    const navItems = [
        { title: 'Home', icon: <Home size={20} />, path: '/' },
        { title: 'Dashboard', icon: <Cpu size={20} />, path: '/dashboard' },
        { title: 'Monitor', icon: <Activity size={20} />, path: '/mempool' },
        { title: 'Security', icon: <Shield size={20} />, path: '/gov-ent' },
        { title: 'News', icon: <Newspaper size={20} />, path: '/news' },
        { title: 'Profile', icon: <User size={20} />, path: '/profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-4 z-[1000] md:hidden">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                        flex flex-col items-center justify-center gap-1 transition-all duration-300
                        ${isActive ? 'text-emerald-500 scale-110' : 'text-slate-400 hover:text-white'}
                    `}
                >
                    {item.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.title}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNavigation;
