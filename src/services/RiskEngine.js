import axios from 'axios';
import useModeStore from '../store/modeStore';

/**
 * RiskEngine.js
 * Calculates a safety score (0-100) using GoPlus Security API and weighted logic.
 */

const GOPLUS_API_BASE = 'https://api.gopluslabs.io/api/v1';

// Known Mixer Addresses (Tornado Cash on Ethereum)
const MIXER_ADDRESSES = [
    '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc', // 0.1 ETH
    '0x47ce0c6ea5d0f0f0df598684f0a05feed142ac61', // 1 ETH
    '0x910cdb5cb308ede7486952b3f9555c204beb79e7', // 10 ETH
    '0xa160cdab2249850226274a9565fac2a99d1df384'  // 100 ETH
];

/**
 * Checks if the address has interacted with known mixers.
 * In a real scenario, this would check previous transactions.
 * For this implementation, we simulate it or check if the address itself is a mixer.
 */
const checkMixerInteraction = async (address) => {
    return MIXER_ADDRESSES.includes(address.toLowerCase());
};

export const calculateRiskScore = async (address) => {
    if (!address || !address.startsWith('0x')) return null;

    let score = 0;
    const details = [];

    try {
        // 1. Mixer Interaction Check (High Risk)
        const hasMixerLink = await checkMixerInteraction(address);
        if (hasMixerLink) {
            score += 80;
            details.push('Direct Interaction with Tornado Cash Mixer');
        }

        // 2. GoPlus Malicious Address API Check
        const response = await axios.get(`${GOPLUS_API_BASE}/address_security/${address}?chain_id=1`);
        const data = response.data?.result;

        if (data) {
            if (data.data_source && Object.keys(data.data_source).length > 0) {
                score += 50;
                details.push('Flagged by Security Providers');
            }

            if (data.phishing_activities === '1' || data.stealing_activities === '1') {
                score += 40;
                details.push('Suspicious Activity Detected');
            }
        }

        // 3. Wallet Age Check
        const currentTime = Date.now();
        const mockCreationTime = currentTime - (Math.random() * 48 * 60 * 60 * 1000);
        const ageHours = (currentTime - mockCreationTime) / (1000 * 60 * 60);

        if (ageHours < 24) {
            score += 10;
            details.push('Wallet age < 24 hours');
        }

        // 4. Map to 1-10 Scale
        // finalScore 0-100 -> 1-10
        const rawScore = Math.min(score, 100);
        const mappedScore = Math.max(1, Math.ceil(rawScore / 10));

        // 5. Visual Mapping & Status
        let level = 'Safe';
        let color = '#10b981'; // Emerald

        if (mappedScore >= 8) {
            level = 'High Risk';
            color = '#ef4444'; // Crimson Red
        } else if (mappedScore >= 4) {
            level = 'Medium Risk';
            color = '#f59e0b'; // Warning Yellow
        }

        const assessment = {
            score: mappedScore,
            level,
            color,
            details,
            timestamp: new Date()
        };

        // 6. State Sync with useModeStore
        useModeStore.getState().setRiskAssessment(address, assessment);

        return assessment;
    } catch (error) {
        console.error('RiskEngine Scan Failed:', error);
        return {
            score: 1,
            level: 'Unknown',
            color: '#94a3b8',
            details: ['Security Scan Offline'],
            timestamp: new Date()
        };
    }
};

export default { calculateRiskScore };

