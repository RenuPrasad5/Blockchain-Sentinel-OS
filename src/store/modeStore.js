import { create } from 'zustand';

const useModeStore = create((set, get) => ({
    mode: localStorage.getItem('researchMode') || 'Analyst',
    liveData: [],
    connectionStatus: 'connecting', // 'connecting', 'open', 'closed', 'error'
    alerts: [],
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setMode: (newMode) => {
        localStorage.setItem('researchMode', newMode);
        set({ mode: newMode });
    },
    addLiveData: (data) => {
        set((state) => ({
            liveData: [data, ...state.liveData].slice(0, 50) // Keep last 50
        }));

        // Whale Watch Siren: $50M+
        if (data.type === 'TRANSACTION' && data.valueUsd > 50000000) {
            get().triggerAlert({
                id: Date.now(),
                title: 'CRITICAL WHALE MOVEMENT',
                message: `Massive Liquidity Shift: $${(data.valueUsd / 1000000).toFixed(2)}M Detected.`,
                severity: 'SIREN',
                address: data.from,
                timestamp: new Date()
            });
        }
        // General High-Value: $1M+
        else if (data.type === 'TRANSACTION' && data.valueUsd > 1000000) {
            get().triggerAlert({
                id: Date.now(),
                title: 'High-Value Transaction',
                message: `${data.symbol || 'ETH'} Transfer: $${(data.valueUsd / 1000000).toFixed(2)}M`,
                severity: 'CRITICAL',
                timestamp: new Date()
            });
        }
    },
    triggerAlert: (alert) => {
        set((state) => ({
            alerts: [alert, ...state.alerts].slice(0, 5) // Keep last 5 alerts
        }));
        // Auto-remove alert after 8 seconds
        setTimeout(() => {
            set((state) => ({
                alerts: state.alerts.filter(a => a.id !== alert.id)
            }));
        }, 8000);
    },
    removeAlert: (id) => {
        set((state) => ({
            alerts: state.alerts.filter(a => a.id !== id)
        }));
    },
    isScanning: false,
    setIsScanning: (val) => set({ isScanning: val }),
    isMobileOpen: false,
    setIsMobileOpen: (val) => set({ isMobileOpen: val }),
    isExpanded: false,
    setIsExpanded: (val) => set({ isExpanded: val }),
    riskAssessment: {}, // Stores { address: { score, level, details } }
    setRiskAssessment: (address, assessment) => {
        set((state) => ({
            riskAssessment: {
                ...state.riskAssessment,
                [address.toLowerCase()]: assessment
            }
        }));
    },
    regulatoryMode: false,
    setRegulatoryMode: (val) => set({ regulatoryMode: val }),
    activeMenu: 'Terminal',
    setActiveMenu: (val) => set({ activeMenu: val })
}));

export default useModeStore;
