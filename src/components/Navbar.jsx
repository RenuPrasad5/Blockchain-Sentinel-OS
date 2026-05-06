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
    Scale,
    Eye
} from 'lucide-react';
import logo from '../assets/BL.logo.png';
import { useAuth } from '../context/AuthContext';
import useModeStore from '../store/modeStore';
import { useWatchlist } from '../context/WatchlistContext';
import './Navbar.css';

const Navbar = () => {
    const { user, userData, logout } = useAuth();
    const { isMobileOpen, setIsMobileOpen, isExpanded, regulatoryMode, setRegulatoryMode } = useModeStore();
    const { alerts } = useWatchlist();
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isInvestigationsOpen, setIsInvestigationsOpen] = useState(false);
    const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);
    const [isComplianceOpen, setIsComplianceOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);

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
        { title: 'Intelligence Portal', icon: <Shield size={18} />, path: '/gov-ent' },
        { title: 'Enforcement', icon: <ShieldAlert size={18} />, path: '/government' },
        { title: 'Agency Solutions', icon: <Briefcase size={18} />, path: '/use-cases' },
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
        { id: 1, title: 'Security Alert', message: 'New login detected', time: '2m ago', icon: <AlertCircle size={16} className="text-rose-500" /> },
        { id: 2, title: 'Watchlist Activity', message: 'Watched address 0x742... added 420 ETH', time: '15m ago', icon: <Eye size={16} className="text-emerald-500" /> },
        { id: 3, title: 'Case Update', message: 'Operation Cyber-Shield integrity verified', time: '1h ago', icon: <ShieldCheck size={16} className="text-blue-500" /> },
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
                    <img src={logo} alt="Blockchain Sentinel Logo" className="logo-circular-nav" />
                    <span className="brand-text-nav">Blockchain Sentinel</span>
                </Link>
            </div>


            <div className="navbar-right">
                <nav className="nav-links-desktop lg:flex hidden">
                    <Link to="/command-center" className="nav-link-btn">Command Center</Link>
                    {/* 1. INVESTIGATIONS */}
                    <div
                        className="tools-dropdown-container"
                        onMouseEnter={() => setIsInvestigationsOpen(true)}
                        onMouseLeave={() => setIsInvestigationsOpen(false)}
                    >
                        <span className={`nav-link-btn ${isInvestigationsOpen ? 'active' : ''}`}>
                            <span>Investigations</span>
                            <ChevronDown size={14} className={`dropdown-arrow ms-1 ${isInvestigationsOpen ? 'rotate' : ''}`} />
                        </span>
                        {isInvestigationsOpen && (
                            <div className="tools-dropdown-menu glass">
                                <Link to="/tools/analyzer" className="tools-dropdown-item" onClick={() => setIsInvestigationsOpen(false)}>
                                    <FileSearch size={16} className="text-blue-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Wallet Analyzer</span>
                                        <span className="tools-item-desc">Forensic intelligence & risk scoring</span>
                                    </div>
                                </Link>
                                <Link to="/tools/visualizer" className="tools-dropdown-item" onClick={() => setIsInvestigationsOpen(false)}>
                                    <Share2 size={16} className="text-indigo-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Multi-Hop Visualizer</span>
                                        <span className="tools-item-desc">Advanced relationship mapping</span>
                                    </div>
                                </Link>
                                <Link to="/cases" className="tools-dropdown-item" onClick={() => setIsInvestigationsOpen(false)}>
                                    <Briefcase size={16} className="text-emerald-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Case Management</span>
                                        <span className="tools-item-desc">Investigation workspaces & evidence</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 2. INTELLIGENCE */}
                    <div
                        className="tools-dropdown-container"
                        onMouseEnter={() => setIsIntelligenceOpen(true)}
                        onMouseLeave={() => setIsIntelligenceOpen(false)}
                    >
                        <span className={`nav-link-btn ${isIntelligenceOpen ? 'active' : ''}`}>
                            <span>Intelligence</span>
                            <ChevronDown size={14} className={`dropdown-arrow ms-1 ${isIntelligenceOpen ? 'rotate' : ''}`} />
                        </span>
                        {isIntelligenceOpen && (
                            <div className="tools-dropdown-menu glass">
                                <Link to="/tools/signals" className="tools-dropdown-item" onClick={() => setIsIntelligenceOpen(false)}>
                                    <Activity size={16} className="text-emerald-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Behavioral Intelligence</span>
                                        <span className="tools-item-desc">Anomaly & cluster tracking</span>
                                    </div>
                                </Link>
                                <Link to="/tools/market" className="tools-dropdown-item" onClick={() => setIsIntelligenceOpen(false)}>
                                    <TrendingUp size={16} className="text-indigo-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Risk Engine</span>
                                        <span className="tools-item-desc">Financial risk scoring</span>
                                    </div>
                                </Link>
                                <Link to="/mempool" className="tools-dropdown-item" onClick={() => setIsIntelligenceOpen(false)}>
                                    <Radar size={16} className="text-blue-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Monitoring Layer</span>
                                        <span className="tools-item-desc">Real-time mempool tracking</span>
                                    </div>
                                </Link>
                                <Link to="/tools/sentinel" className="tools-dropdown-item" onClick={() => setIsIntelligenceOpen(false)}>
                                    <ShieldCheck size={16} className="text-rose-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Threat Detection</span>
                                        <span className="tools-item-desc">Autonomous node surveillance</span>
                                    </div>
                                </Link>
                                <Link to="/tools/whale-watch" className="tools-dropdown-item" onClick={() => setIsIntelligenceOpen(false)}>
                                    <LineChart size={16} className="text-emerald-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Temporal Intelligence</span>
                                        <span className="tools-item-desc">High-value time-based analysis</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 3. COMPLIANCE */}
                    <div
                        className="tools-dropdown-container"
                        onMouseEnter={() => setIsComplianceOpen(true)}
                        onMouseLeave={() => setIsComplianceOpen(false)}
                    >
                        <span className={`nav-link-btn ${isComplianceOpen ? 'active' : ''}`}>
                            <span>Compliance</span>
                            <ChevronDown size={14} className={`dropdown-arrow ms-1 ${isComplianceOpen ? 'rotate' : ''}`} />
                        </span>
                        {isComplianceOpen && (
                            <div className="tools-dropdown-menu glass">
                                <Link to="/tools/security?appMode=ca" className="tools-dropdown-item" onClick={() => setIsComplianceOpen(false)}>
                                    <Scale size={16} className="text-blue-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Tax Intelligence</span>
                                        <span className="tools-item-desc">Indian CA Firm audit workflows</span>
                                    </div>
                                </Link>
                                <Link to="/tools/security" className="tools-dropdown-item" onClick={() => setIsComplianceOpen(false)}>
                                    <Shield size={16} className="text-emerald-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">AML Reports</span>
                                        <span className="tools-item-desc">Anti-money laundering reporting</span>
                                    </div>
                                </Link>
                                <Link to="/cases" className="tools-dropdown-item" onClick={() => setIsComplianceOpen(false)}>
                                    <FileSearch size={16} className="text-indigo-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Audit Export</span>
                                        <span className="tools-item-desc">Download immutable evidence</span>
                                    </div>
                                </Link>
                                <Link to="/gov-ent" className="tools-dropdown-item" onClick={() => setIsComplianceOpen(false)}>
                                    <Database size={16} className="text-rose-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Compliance Monitoring</span>
                                        <span className="tools-item-desc">Continuous wallet tracking</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* 4. SOLUTIONS */}
                    <div
                        className="tools-dropdown-container"
                        onMouseEnter={() => setIsSolutionsOpen(true)}
                        onMouseLeave={() => setIsSolutionsOpen(false)}
                    >
                        <span className={`nav-link-btn ${isSolutionsOpen ? 'active' : ''}`}>
                            <span>Solutions</span>
                            <ChevronDown size={14} className={`dropdown-arrow ms-1 ${isSolutionsOpen ? 'rotate' : ''}`} />
                        </span>
                        {isSolutionsOpen && (
                            <div className="tools-dropdown-menu glass">
                                <Link to="/solutions/government" className="tools-dropdown-item" onClick={() => setIsSolutionsOpen(false)}>
                                    <ShieldAlert size={16} className="text-emerald-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Government Agencies</span>
                                        <span className="tools-item-desc">National security & oversight</span>
                                    </div>
                                </Link>
                                <Link to="/solutions/law-enforcement" className="tools-dropdown-item" onClick={() => setIsSolutionsOpen(false)}>
                                    <ShieldCheck size={16} className="text-blue-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Law Enforcement</span>
                                        <span className="tools-item-desc">Cybercrime investigation tools</span>
                                    </div>
                                </Link>
                                <Link to="/solutions/ca-firms" className="tools-dropdown-item" onClick={() => setIsSolutionsOpen(false)}>
                                    <Briefcase size={16} className="text-indigo-500" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">CA Firms</span>
                                        <span className="tools-item-desc">Crypto taxation & compliance</span>
                                    </div>
                                </Link>
                                <Link to="/solutions/financial" className="tools-dropdown-item" onClick={() => setIsSolutionsOpen(false)}>
                                    <LineChart size={16} className="text-emerald-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Financial Institutions</span>
                                        <span className="tools-item-desc">VASP integration & risk mitigation</span>
                                    </div>
                                </Link>
                                <Link to="/solutions/enterprise" className="tools-dropdown-item" onClick={() => setIsSolutionsOpen(false)}>
                                    <Cpu size={16} className="text-rose-400" />
                                    <div className="tools-item-text">
                                        <span className="tools-item-title">Enterprise Security</span>
                                        <span className="tools-item-desc">Internal treasury monitoring</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    <NavLink to="/about" className="nav-link-btn">About</NavLink>
                </nav>
                <div className="icon-group">

                    <div className="notification-container" ref={notificationRef}>
                        <button className="icon-btn" onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
                            <Bell size={20} />
                            {alerts.length > 0 && <span className="notification-dot"></span>}
                        </button>
                        {isNotificationOpen && (
                            <div className="notification-dropdown glass active">
                                <div className="dropdown-header">
                                    <h3>Notifications</h3>
                                    <span className="mark-read">Mark all as read</span>
                                </div>
                                <div className="notification-list">
                                    {alerts.length === 0 ? (
                                        <div className="empty-alerts">
                                            <ShieldAlert size={24} className="text-slate-700 mb-2" />
                                            <p>No real-time threats detected</p>
                                        </div>
                                    ) : (
                                        alerts.slice().reverse().map(note => (
                                            <div key={note.id} className={`notification-item ${note.type === 'Critical' ? 'critical-bg' : ''}`}>
                                                <div className="note-icon-wrap">
                                                    {note.type === 'Critical' ? <ShieldAlert size={16} className="text-rose-500" /> : <Activity size={16} className="text-emerald-500" />}
                                                </div>
                                                <div className="note-content">
                                                    <p className="note-title">{note.title}</p>
                                                    <p className="note-msg">{note.message}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="note-time">{new Date(note.timestamp).toLocaleTimeString()}</span>
                                                        {note.amount && <span className="alert-amount">{note.amount} ETH</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                        <button className="dropdown-item" onClick={() => handleNavigate('/cases')}>
                                            <Briefcase size={16} /> Forensic Command
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
