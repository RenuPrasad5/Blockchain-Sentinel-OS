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
import Sidebar from './components/Sidebar';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const unwatch = startMempoolStream();
    return () => unwatch();
  }, []);

  const fullWidthPaths = ['/', '/news', '/encyclopedia', '/research', '/tools', '/market', '/intelligence', '/community', '/trust', '/dashboard', '/blockchain-hub', '/blockchain-ecosystem', '/mempool', '/tools/market', '/tools/signals', '/tools/security', '/tools/visualizer', '/tools/whale-watch', '/tools/sentinel'];
  const isFullWidth = fullWidthPaths.includes(location.pathname);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const { isScanning } = useModeStore();

  return (
    <div className="app-container">
      {isScanning && <CyberScanOverlay />}
      {!isAuthPage && <Sidebar />}
      <main className="main-content">
        {!isAuthPage && <Navbar />}
        <GlobalAlert />

        <div className={isFullWidth ? 'full-width-layout' : 'page-wrapper container'}>
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
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
