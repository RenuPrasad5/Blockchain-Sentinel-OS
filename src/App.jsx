import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Market from './pages/Market';
import Tools from './pages/Tools';
import MarketIntel from './pages/tools/MarketIntel';
import ChainSignals from './pages/tools/ChainSignals';
import SecurityRisk from './pages/tools/SecurityRisk';
import Visualizer from './pages/tools/Visualizer';
import StrategicDiscussionHub from './pages/Community';
import Premium from './pages/Premium';
import Home from './pages/Home';
import Profile from './pages/Profile';
import TopicDetails from './pages/TopicDetails';
import Encyclopedia from './pages/Encyclopedia';
import ProtocolResearch from './pages/ProtocolResearch';
import AboutUs from './pages/AboutUs';
import News from './pages/News';
import Register from './pages/Register';
import Login from './pages/Login';
import HelpCenter from './pages/HelpCenter';
import BlockchainHub from './pages/BlockchainHub';
import BlockchainEcosystem from './pages/BlockchainEcosystem';
import Settings from './pages/Settings';
import GlobalAlert from './components/ui/GlobalAlert';
import MempoolHub from './pages/MempoolHub';
import { startMempoolStream } from './services/mempoolStream';
import useModeStore from './store/modeStore';
import CyberScanOverlay from './components/tools/CyberScanOverlay';
import WhaleWatch from './pages/tools/WhaleWatch';
import AISentinel from './pages/tools/AISentinel';
import Sidebar from './components/Sidebar.jsx';
import AISentinelAssistant from './components/AISentinelAssistant';
import { useAuth } from './context/AuthContext';
import Government from './pages/Government';
import UseCases from './pages/UseCases';
import CompliancePortal from './pages/CompliancePortal';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';
import ReactGA from 'react-ga4';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  React.useEffect(() => {
    const unwatch = startMempoolStream();
    return () => unwatch();
  }, []);

  const fullWidthPaths = ['/', '/news', '/encyclopedia', '/research', '/tools', '/market', '/intelligence', '/community', '/trust', '/dashboard', '/blockchain-hub', '/blockchain-ecosystem', '/mempool', '/government', '/use-cases', '/tools/market', '/tools/signals', '/tools/security', '/tools/visualizer', '/tools/whale-watch', '/tools/sentinel'];
  const isFullWidth = fullWidthPaths.includes(location.pathname);
  const isAuthPage = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/auth');

  const { user } = useAuth();
  const [showAssistant, setShowAssistant] = React.useState(false);

  React.useEffect(() => {
    // Only show assistant if authenticated AND not on auth pages
    if (user && !isAuthPage) {
      const timer = setTimeout(() => {
        setShowAssistant(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowAssistant(false);
    }
  }, [user, isAuthPage]);

  const { isScanning, isExpanded } = useModeStore();

  return (
    <div className="app-container" style={{ '--sidebar-width': isAuthPage ? '0px' : (isExpanded ? '260px' : '80px'), '--navbar-height': isAuthPage ? '0px' : '80px' }}>
      {isScanning && <CyberScanOverlay />}
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <Sidebar />}

      <div className="main-wrapper">
        <main className="main-content">
          <GlobalAlert />

          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/encyclopedia" element={<Encyclopedia />} />
              <Route path="/research" element={<ProtocolResearch />} />
              <Route path="/library/:topicId" element={<TopicDetails />} />
              <Route path="/market" element={<Market />} />
              <Route path="/intelligence" element={<Market />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/market" element={<MarketIntel />} />
              <Route path="/tools/signals" element={<ChainSignals />} />
              <Route path="/tools/security" element={<SecurityRisk />} />
              <Route path="/tools/visualizer" element={<Visualizer />} />
              <Route path="/tools/whale-watch" element={<WhaleWatch />} />
              <Route path="/tools/sentinel" element={<AISentinel />} />
              <Route path="/community" element={<StrategicDiscussionHub />} />
              <Route path="/trust" element={<Premium />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/news" element={<News />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/blockchain-hub" element={<BlockchainHub />} />
              <Route path="/blockchain-ecosystem" element={<BlockchainEcosystem />} />
              <Route path="/mempool" element={<MempoolHub />} />
              <Route path="/government" element={<Government />} />
              <Route path="/gov-ent" element={<Dashboard />} />
              <Route path="/use-cases" element={<UseCases />} />
              <Route path="/compliance" element={<CompliancePortal />} />
            </Routes>
            {showAssistant && <AISentinelAssistant />}
          </div>
        </main>
      </div>
      {!isAuthPage && <BottomNavigation />}
      <Analytics />
    </div>
  );
}

export default App;
