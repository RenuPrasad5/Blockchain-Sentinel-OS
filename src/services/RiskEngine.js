import axios from 'axios';
import useModeStore from '../store/modeStore';

/**
 * RiskEngine.js
 * Calculates a safety score (0-100) using GoPlus Security API and weighted logic.
 */

const GOPLUS_API_BASE = 'https://api.gopluslabs.io/api/v1';

export const calculateRiskScore = async (address) => {
    if (!address || !address.startsWith('0x')) return null;

    let score = 0;
    const details = [];

    try {
        // 1. GoPlus Malicious Address API Check
        // Endpoint: /address_security/{address}?chain_id=1
        const response = await axios.get(`${GOPLUS_API_BASE}/address_security/${address}?chain_id=1`);
        const data = response.data?.result;

        if (data) {
            // Check if address is blacklisted in any major database
            if (data.data_source && Object.keys(data.data_source).length > 0) {
                score += 100;
                details.push('Blacklisted by security provider');
            }

            // Check for Mixer interaction (GoPlus labels honeypot/scam/mixer in many ways)
            if (data.is_contract === '1') {
                // In a production scenario, we'd check against known mixer contract signatures
                // For this engine, we use GoPlus tags if available
            }

            // Note: mixer interaction check often requires behavioral analysis or specific labels
            // We simulate the +50 logic based on detected risk tags
            if (data.phishing_activities === '1' || data.stealing_activities === '1') {
                score += 50;
                details.push('Suspicious Activity Detected');
            }
        }

        // 2. Wallet Age Check (Simulated for this implementation)
        // In production, this would involve fetching the first transaction timestamp from Etherscan/Alchemy
        const currentTime = Date.now();
        const mockCreationTime = currentTime - (Math.random() * 48 * 60 * 60 * 1000); // Mocked age
        const ageHours = (currentTime - mockCreationTime) / (1000 * 60 * 60);

        if (ageHours < 24) {
            score += 20;
            details.push('Wallet age < 24 hours');
        }

        // Cap score at 100
        const finalScore = Math.min(score, 100);

        // 3. Visual Mapping & Status
        let level = 'Safe';
        let color = '#60a5fa'; // Neon Blue

        if (finalScore > 70) {
            level = 'Danger';
            color = '#ef4444'; // Crimson Red
        } else if (finalScore > 30) {
            level = 'Suspicious';
            color = '#f59e0b'; // Warning Yellow
        }

        const assessment = {
            score: finalScore,
            level,
            color,
            details,
            timestamp: new Date()
        };

        // 4. State Sync with useModeStore
        useModeStore.getState().setRiskAssessment(address, assessment);

        return assessment;
    } catch (error) {
        console.error('RiskEngine Scan Failed:', error);
        return null;
    }
};

export default { calculateRiskScore };
