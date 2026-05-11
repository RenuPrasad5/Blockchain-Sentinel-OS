import useModeStore from '../store/modeStore';

const ENTITY_MAP = {
    '0x71c7656ec7ab88b098defb751b7401b5f6d8976f': { type: 'Exchange', name: 'Binance: Cold Wallet', risk: 'Low', color: '#10b981' },
    '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8': { type: 'Exchange', name: 'Binance: Hot Wallet', risk: 'Low', color: '#10b981' },
    '0xab5c66752a9e8167967585f61c7843d3849b3b33': { type: 'Contract', name: 'Uniswap V2: Router', risk: 'Low', color: '#10b981' },
    '0xdac17f958d2ee523a2206206994597c13d831ec7': { type: 'Contract', name: 'Tether USD (USDT)', risk: 'Low', color: '#10b981' },
    '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc': { type: 'Mixer', name: 'Tornado.Cash: 0.1 ETH', risk: 'High', color: '#ef4444' },
    '0x47ce0c6ea5d0f0f0df598684f0a05feed142ac61': { type: 'Mixer', name: 'Tornado.Cash: 1 ETH', risk: 'High', color: '#ef4444' },
    '0x910cdb5cb308ede7486952b3f9555c204beb79e7': { type: 'Mixer', name: 'Tornado.Cash: 10 ETH', risk: 'High', color: '#ef4444' },
    '0xa160cdab2249850226274a9565fac2a99d1df384': { type: 'Mixer', name: 'Tornado.Cash: 100 ETH', risk: 'High', color: '#ef4444' }
};

const SUSPICIOUS_PATTERNS = [
    '0x28c6c06298d514db089934071355e5743bf21d60', // Hypothetical scam
];

export const identifyEntity = (address) => {
    if (!address) return null;
    const normalizedAddr = address.toLowerCase();
    
    // 1. Check manual labels from store first
    const { entityLabels } = useModeStore.getState();
    if (entityLabels && entityLabels[normalizedAddr]) {
        return {
            type: entityLabels[normalizedAddr].type || 'Custom',
            name: entityLabels[normalizedAddr].name || 'User Labeled',
            risk: entityLabels[normalizedAddr].risk || 'Unknown',
            color: '#5865F2',
            manual: true
        };
    }
    
    // 2. Check known maps
    if (ENTITY_MAP[normalizedAddr]) {
        return ENTITY_MAP[normalizedAddr];
    }
    
    // 3. Check patterns
    if (SUSPICIOUS_PATTERNS.includes(normalizedAddr)) {
        return { type: 'Scam', name: 'Phishing Wallet Flag', risk: 'High', color: '#ef4444' };
    }
    
    // 4. Generic Identification
    return {
        type: 'Unknown',
        name: 'Unidentified Entity',
        risk: 'Needs Review',
        color: '#94a3b8'
    };
};

export const ENTITY_TYPES = ['Exchange', 'Wallet', 'Contract', 'Mixer', 'Bridge', 'DeFi', 'Scam', 'Unknown'];
export const RISK_LEVELS = ['Low', 'Medium', 'High', 'Suspicious'];

export default { identifyEntity, ENTITY_TYPES, RISK_LEVELS };
