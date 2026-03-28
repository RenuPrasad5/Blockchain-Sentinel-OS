import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate, Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import {
    Bell,
    Menu,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Zap,
    BarChart3,
    Code2,
    Wallet2,
    Globe,
    Cpu,
    Database,
    FileSearch,
    LineChart,
    Wrench,
    Users2,
    Shield,
    ShieldCheck,
    ArrowLeft,
    AlertCircle,
    Info,
    Activity,
    Newspaper,
    HelpCircle,
    Layers as LayersIcon,
    Share2,
    TrendingUp,
    Radar,
    ToggleLeft,
    ToggleRight,
    ShieldAlert,
    Briefcase,
    Scale
} from 'lucide-react';
import logo from '../assets/BL_logo.png';
import { useAuth } from '../context/AuthContext';
import useModeStore from '../store/modeStore';
import './Navbar.css';

const Navbar = () => {
    const { user, userData, logout } = useAuth();
    const { isMobileOpen, setIsMobileOpen, isExpanded, regulatoryMode, setRegulatoryMode } = useModeStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
                setIsHamburgerOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const modes = [
        { name: 'Beginner', icon: <Zap size={14} /> },
        { name: 'Analyst', icon: <BarChart3 size={14} /> },
        { name: 'Developer', icon: <Code2 size={14} /> },
        { name: 'Investor', icon: <Wallet2 size={14} /> }
    ];

    const navItems = [
        { title: 'Home', icon: <Globe size={18} />, path: '/' },
        { title: 'Dashboard', icon: <Cpu size={18} />, path: '/dashboard' },
        { title: 'Gov & Enterprise', icon: <Shield size={18} />, path: '/gov-ent' },
        { title: 'Enforcement', icon: <ShieldAlert size={18} />, path: '/government' },
        { title: 'Compliance & Legal', icon: <Scale size={18} />, path: '/compliance' },
        { title: 'Use Cases', icon: <Briefcase size={18} />, path: '/use-cases' },
        { title: 'Encyclopedia', icon: <Database size={18} />, path: '/encyclopedia' },
        { title: 'Research', icon: <FileSearch size={18} />, path: '/research' },
        { title: 'Monitoring Layer', icon: <Activity size={18} />, path: '/mempool' },
        { title: 'Tools', icon: <Wrench size={18} />, path: '/tools' },
        { title: 'Community', icon: <Users2 size={18} />, path: '/community' },
        { title: 'Trust Center', icon: <ShieldCheck size={18} />, path: '/trust' },
        { title: 'News Feed', icon: <Newspaper size={18} />, path: '/news' },
        { title: 'About Us', icon: <Info size={18} />, path: '/about' },
        { title: 'Settings', icon: <Settings size={18} />, path: '/settings' },
    ];

    const notifications = [
        { id: 1, title: 'Security Alert', message: 'New login detected', time: '2m ago', icon: <AlertCircle size={16} className="text-red" /> },
        { id: 2, title: 'Research Node', message: 'Solana v1.18 update verified', time: '1h ago', icon: <Info size={16} className="text-blue" /> },
        { id: 3, title: 'Network Pulse', message: 'Congestion detected on Ethereum', time: '3h ago', icon: <Activity size={16} className="text-amber" /> },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            setIsDropdownOpen(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
        setIsDropdownOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <button
                    className="menu-btn lg:hidden"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="nav-brand">
                    <img src={logo} alt="Blockchain Intelligence Logo" className="logo-circular-nav" />
                    <span className="brand-text-nav">Blockchain Intelligence</span>
                </Link>
            </div>


            <div className="navbar-right">
                <nav className="nav-links-desktop lg:flex hidden">
                    <NavLink to="/mempool" className="nav-link-btn">Monitoring Layer</NavLink>
                    <NavLink to="/gov-ent" className="nav-link-btn flex items-center gap-2">
                        <Shield size={16} className="text-blue-400" />
                        <span>Gov & Enterprise</span>
                    </NavLink>
                    <NavLink to="/government" className="nav-link-btn flex items-center gap-2">
                        <ShieldAlert size={16} className="text-emerald-500" />
                        <span>Enforcement</span>
                    </NavLink>
                    <NavLink to="/compliance" className="nav-link-btn flex items-center gap-2">
                        <Scale size={16} className="text-blue-500" />
                        <span>Compliance & Legal</span>
                    </NavLink>
                    <NavLink to="/use-cases" className="nav-link-btn">Use Cases</NavLink>

                    <div
                        className="tools-dropdown-container"
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <NavLink
                            to="/tools"
                            className={({ isActive }) =>
                                `nav-link-btn ${isActive || location.pathname.startsWith('/tools') ? 'active' : ''}`
                            }
                        >
                            <span>Tools</span>
                            <ChevronDown size={14} className={`dropdown-arrow ms-1 ${isToolsOpen ? 'rotate' : ''}`} />
                        </NavLink>

                        {isToolsOpen && (
                            <div className="tools-dropdown-menu glass">
                                <Link to="/tools/sentinel" className="tools-dropdown-item" onClick={() => setIsToolsOpen(false)}>
                                    <ShieldCheck size={16} className="text-emerald-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">AI Sentinel</span>
                                        <span className="tools-item-desc">Autonomous node & liquidity surveillance</span>
                                    </div>
                                </Link>
                                <Link to="/tools/whale-watch" className="tools-dropdown-item" onClick={() => setIsToolsOpen(false)}>
                                    <Radar size={16} className="text-rose-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Surveillance</span>
                                        <span className="tools-item-desc">High-value transaction surveillance systems</span>
                                    </div>
                                </Link>
                                <Link to="/tools/market" className="tools-dropdown-item" onClick={() => setIsToolsOpen(false)}>
                                    <TrendingUp size={16} className="text-indigo-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Risk Intel</span>
                                        <span className="tools-item-desc">Aggregate financial risk intelligence data</span>
                                    </div>
                                </Link>
                                <Link to="/tools/signals" className="tools-dropdown-item" onClick={() => setIsToolsOpen(false)}>
                                    <Activity size={16} className="text-emerald-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Suspicious Indicators</span>
                                        <span className="tools-item-desc">Real-time anomaly & cluster tracking</span>
                                    </div>
                                </Link>
                                <Link to="/tools/security" className="tools-dropdown-item" onClick={() => setIsToolsOpen(false)}>
                                    <Shield size={16} className="text-rose-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Compliance & AML</span>
                                        <span className="tools-item-desc">Automated anti-money laundering triage</span>
                                    </div>
                                </Link>
                                <Link to="/tools/visualizer" className="tools-dropdown-item" onClick={() => setIsToolsOpen(false)}>
                                    <Share2 size={16} className="text-indigo-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Forensic Visualizer</span>
                                        <span className="tools-item-desc">Advanced wallet relationship mapping</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    <NavLink to="/news" className="nav-link-btn">News</NavLink>
                    <NavLink to="/about" className="nav-link-btn">About Us</NavLink>
                </nav>
                <div className="icon-group">

                    <div className="notification-container" ref={notificationRef}>
                        <button className="icon-btn" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                            <Bell size={20} />
                            <span className="notification-dot"></span>
                        </button>
                        {isNotificationOpen && (
                            <div className="notification-dropdown glass active">
                                <div className="dropdown-header">
                                    <h3>Notifications</h3>
                                    <span className="mark-read">Mark all as read</span>
                                </div>
                                <div className="notification-list">
                                    {notifications.map(note => (
                                        <div key={note.id} className="notification-item">
                                            <div className="note-icon-wrap">
                                                {note.icon}
                                            </div>
                                            <div className="note-content">
                                                <p className="note-title">{note.title}</p>
                                                <p className="note-msg">{note.message}</p>
                                                <span className="note-time">{note.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-footer">
                                    <button className="view-all">View All Activity</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-container-nav" ref={dropdownRef}>
                        {user ? (
                            <>
                                <button
                                    className="profile-trigger-new"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="profile-avatar-circle premium-avatar">
                                        {userData?.photoURL ? (
                                            <img src={userData.photoURL} alt="Profile" className="nav-avatar-img" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <span className="text-[12px] font-bold">{userData?.name?.[0] || user?.email?.[0] || 'U'}</span>
                                        )}
                                    </div>
                                    <div className="profile-info-nav">
                                        <span className="profile-name-nav">{userData?.name?.split(' ')[0] || 'User'}</span>
                                        <ChevronDown size={14} className={`dropdown-arrow ${isDropdownOpen ? 'rotate' : ''}`} />
                                    </div>
                                </button>

                                {isDropdownOpen && (
                                    <div className="profile-dropdown glass active">
                                        <div className="dropdown-header">
                                            <p className="user-name">{userData?.name || 'User Profile'}</p>
                                            <p className="user-email">{user?.email}</p>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" onClick={() => handleNavigate('/dashboard')}>
                                            <Cpu size={16} /> Command Center
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleNavigate('/profile')}>
                                            <User size={16} /> Profile
                                        </button>
                                        <button className="dropdown-item" onClick={() => handleNavigate('/settings')}>
                                            <Settings size={16} /> Settings
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item logout" onClick={handleLogout}>
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <button className="btn-primary-nav" onClick={() => navigate('/login')}>
                                <Zap size={14} /> Connect
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
