import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css';

import { Buffer } from 'buffer'

// Polyfills for Blockchain SDKs (Alchemy, Wagmi, etc)
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
  window.process = { env: {} };
}

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmi.js';
import '@rainbow-me/rainbowkit/styles.css';

import { AuthProvider } from './context/AuthContext.jsx';
import { WebSocketProvider } from './context/WebSocketContext.jsx';
import { WatchlistProvider } from './context/WatchlistContext.jsx';

const queryClient = new QueryClient();

// Simple Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#6366f1', background: '#0D1117', height: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>âš ï¸ Interface Correlation Error</h1>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>A critical error occurred while rendering this module.</p>
          <div style={{ background: 'rgba(255,0,0,0.1)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)', marginBottom: '20px' }}>
            <pre style={{ overflowX: 'auto', whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Return to Command Center
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactGA from 'react-ga4';

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (measurementId) {
  ReactGA.initialize(measurementId);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()}>
              <BrowserRouter>
                <WebSocketProvider>
                  <AuthProvider>
                    <WatchlistProvider>
                      <App />
                    </WatchlistProvider>
                  </AuthProvider>
                </WebSocketProvider>
              </BrowserRouter>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

