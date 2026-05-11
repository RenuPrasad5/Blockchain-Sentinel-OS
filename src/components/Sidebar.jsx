import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    Globe,
    Cpu,
    Database,
    FileSearch,
    Layers,
    Activity,
    Wrench,
    Users2,
    ShieldCheck,
    Newspaper,
    Info,
    Settings,
    LogOut,
    User,
    ChevronRight,
    TrendingUp,
    Radar,
    Shield,
    Share2,
    Zap,
    Briefcase,
    ShieldAlert,
    Scale,
    Microscope,
    LineChart,
    Eye,
    Flag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useModeStore from '../store/modeStore';
import './Sidebar.css';

const Sidebar = () => {
    const { user, userData, logout } = useAuth();
    const { isMobileOpen, setIsMobileOpen, isExpanded, setIsExpanded } = useModeStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [openSubMenus, setOpenSubMenus] = useState({});

    // Close sidebar on mobile when navigating
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname, setIsMobileOpen]);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleSubMenu = (id) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navItems = [
        { id: 'terminal', title: 'Home', icon: <Globe size={20} />, path: '/' },
        { id: 'command_center', title: 'Command Center', icon: <Cpu size={20} />, path: '/command-center' },
        {
            id: 'investigations',
            title: 'Investigations',
            icon: <Microscope size={20} />,
            path: '/investigations',
            subItems: [
                { title: 'Wallet Analyzer', icon: <FileSearch size={18} />, path: '/tools/analyzer' },
                { title: 'Watchlist Monitoring', icon: <Eye size={18} />, path: '/watchlist' },
                { title: 'Multi-Hop Visualizer', icon: <Share2 size={18} />, path: '/tools/visualizer' },
                { title: 'Case Management', icon: <Briefcase size={18} />, path: '/cases' },
            ]
        },
        {
            id: 'intelligence',
            title: 'Intelligence',
            icon: <Activity size={20} />,
            path: '/intelligence',
            subItems: [
                { title: 'Behavioral Intelligence', icon: <Activity size={18} />, path: '/tools/signals' },
                { title: 'Risk Engine', icon: <TrendingUp size={18} />, path: '/tools/market' },
                { title: 'Monitoring Layer', icon: <Radar size={18} />, path: '/mempool' },
                { title: 'Threat Detection', icon: <ShieldCheck size={18} />, path: '/tools/sentinel' },
                { title: 'Temporal Intelligence', icon: <LineChart size={18} />, path: '/tools/whale-watch' },
            ]
        },
        {
            id: 'compliance',
            title: 'Compliance',
            icon: <Scale size={20} />,
            path: '/compliance',
            subItems: [
                { title: 'India Compliance', icon: <Flag size={18} />, path: '/india-compliance' },
                { title: 'Tax Intelligence', icon: <Scale size={18} />, path: '/tools/security?appMode=ca' },
                { title: 'AML Reports', icon: <Shield size={18} />, path: '/tools/security' },
                { title: 'Audit Export', icon: <FileSearch size={18} />, path: '/cases' },
                { title: 'Compliance Monitoring', icon: <Database size={18} />, path: '/gov-ent' },
            ]
        },
        {
            id: 'solutions',
            title: 'Solutions',
            icon: <Briefcase size={20} />,
            path: '/solutions',
            subItems: [
                { title: 'Government Agencies', icon: <ShieldAlert size={18} />, path: '/solutions/government' },
                { title: 'Law Enforcement', icon: <ShieldCheck size={18} />, path: '/solutions/law-enforcement' },
                { title: 'CA Firms', icon: <Briefcase size={18} />, path: '/solutions/ca-firms' },
                { title: 'Financial Institutions', icon: <LineChart size={18} />, path: '/solutions/financial' },
                { title: 'Enterprise Security', icon: <Cpu size={18} />, path: '/solutions/enterprise' },
            ]
        },
        { id: 'news', title: 'News Feed', icon: <Newspaper size={20} />, path: '/news' },
        { id: 'about', title: 'About Us', icon: <Info size={20} />, path: '/about' },
    ];

    const sidebarVariants = {
        expanded: { opacity: 1 },
        collapsed: { opacity: 1 }
    };

    return (
        <>
            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        className="sidebar-overlay lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className={`sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
                initial={false}
                animate={isExpanded ? 'expanded' : 'collapsed'}
                variants={sidebarVariants}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Header / Toggle */}
                <div className="sidebar-header">
                    <button className="expand-toggle-btn" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    {isExpanded && (
                        <motion.span
                            className="brand-text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            Blockchain Intelligence
                        </motion.span>
                    )}
                </div>

                {/* Nav Links */}
                <nav className="sidebar-nav scrollbar-hide">
                    {navItems.map((item) => (
                        <div key={item.id} className="nav-group">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                                onClick={(e) => {
                                    if (item.subItems) {
                                        e.preventDefault();
                                        toggleSubMenu(item.id);
                                    }
                                }}
                            >
                                <div className="item-icon">{item.icon}</div>
                                {isExpanded && (
                                    <motion.span
                                        className="item-label"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {item.title}
                                    </motion.span>
                                )}
                                {item.subItems && isExpanded && (
                                    <ChevronRight
                                        size={14}
                                        className={`submenu-arrow ${openSubMenus[item.id] ? 'rotate-90' : ''}`}
                                    />
                                )}
                            </NavLink>

                            {/* Submenu */}
                            <AnimatePresence>
                                {item.subItems && (openSubMenus[item.id] || !isExpanded) && isExpanded && (
                                    <motion.div
                                        className="submenu-container"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        {item.subItems.map((sub) => (
                                            <NavLink
                                                key={sub.path}
                                                to={sub.path}
                                                className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                                            >
                                                <div className="sub-icon">{sub.icon}</div>
                                                <span className="sub-label">{sub.title}</span>
                                            </NavLink>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="sidebar-footer">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                    >
                        <div className="item-icon"><Settings size={20} /></div>
                        {isExpanded && <span className="item-label">Settings</span>}
                    </NavLink>

                    {user ? (
                        <div className="user-profile-trigger">
                            <NavLink to="/profile" className="sidebar-item user-card">
                                <div className="item-icon user-avatar">
                                    {userData?.photoURL ? (
                                        <img src={userData.photoURL} alt="Avatar" />
                                    ) : (
                                        <span>{userData?.name?.[0] || user?.email?.[0] || 'U'}</span>
                                    )}
                                </div>
                                {isExpanded && (
                                    <div className="user-info-text">
                                        <span className="user-name">{userData?.name?.split(' ')[0] || 'User'}</span>
                                        <span className="user-status">Online</span>
                                    </div>
                                )}
                            </NavLink>
                            <button className="logout-btn-sidebar" onClick={handleLogout} title="Logout">
                                <LogOut size={18} />
                                {isExpanded && <span>Exit System</span>}
                            </button>
                        </div>
                    ) : (
                        <button className="sidebar-item connect-btn" onClick={() => navigate('/login')}>
                            <div className="item-icon"><Zap size={20} /></div>
                            {isExpanded && <span className="item-label">Connect Node</span>}
                        </button>
                    )}
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
