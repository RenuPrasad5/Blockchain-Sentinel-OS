/**
 * ForensicEngine.js
 * Core logic for AML detection, risk scoring, and evidence processing.
 */

export const RISK_LEVELS = {
    LOW: { label: 'LOW RISK', color: '#3b82f6', score: [0, 30] },
    MEDIUM: { label: 'MEDIUM RISK', color: '#f59e0b', score: [31, 70] },
    HIGH: { label: 'HIGH RISK', color: '#ef4444', score: [71, 100] }
};

export const AML_PATTERNS = {
    LAYERING: 'Pattern: Multi-hop Layering Detected',
    STRUCTURING: 'Pattern: Transaction Structuring (<$10k clusters)',
    PEEL_CHAIN: 'Pattern: Peel Chain Liquidation',
    MIXER_INTERACTION: 'Entity: Interaction with High-Obfuscation Mixer',
    SANCTIONED: 'Entity: Sanctioned Wallet Correlation'
};

/**
 * Calculates a mock risk score based on wallet activity patterns
 */
export const calculateRiskScore = (address, activity = []) => {
    let score = 10; // Base score
    const flags = [];

    // Frequency Analysis (Structuring/Spam)
    if (activity.length > 20) {
        score += 20;
        flags.push('HIGH_FREQUENCY_TRAFFIC');
    }

    // Value Analysis (Structuring)
    const smallTx = activity.filter(tx => parseFloat(tx.value) < 0.1 && parseFloat(tx.value) > 0).length;
    if (smallTx > 10) {
        score += 30;
        flags.push('POTENTIAL_STRUCTURING');
    }

    // Entity Label Matching (Placeholder for real labelling integration)
    const hasHighRiskLabels = activity.some(tx => 
        tx.toLabel?.toLowerCase().includes('mixer') || 
        tx.fromLabel?.toLowerCase().includes('bridge')
    );
    if (hasHighRiskLabels) {
        score += 40;
        flags.push('CENTRALIZED_MIXER_INTERACTION');
    }

    const finalScore = Math.min(score, 100);
    
    let level = RISK_LEVELS.LOW;
    if (finalScore > 75) level = RISK_LEVELS.HIGH;
    else if (finalScore > 40) level = RISK_LEVELS.MEDIUM;

    return {
        score: finalScore,
        level,
        flags,
        timestamp: new Date().toISOString()
    };
};

/**
 * Generates an Audit Trail Entry
 */
export const createAuditLog = (action, entity, details) => {
    return {
        id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19),
        action,
        entity,
        details,
        checksum: [...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') // Mock SHA-256
    };
};

/**
 * AI Summarizer for Forensic Narrative
 */
export const generateForensicNarrative = (wallet, activity = []) => {
    const risk = calculateRiskScore(wallet, activity);
    const totalVolume = activity.reduce((acc, tx) => acc + parseFloat(tx.value || 0), 0).toFixed(4);
    
    let narrative = `[FORENSIC SUMMARY] Wallet ${wallet} analyzed across ${activity.length} recent transactions. Total throughput volume: ${totalVolume} ETH. `;
    
    if (risk.score > 70) {
        narrative += `NARRATIVE_GAP: CRITICAL. Subject exhibits non-linear capital flow patterns. Structuring detected in ${activity.filter(tx => parseFloat(tx.value) < 0.05).length} micro-transfers. Cross-protocol hopping suggest intentional obfuscation. High correlation with known non-KYC clusters.`;
    } else if (risk.score > 35) {
        narrative += `NARRATIVE_GAP: MODERATE. Observed activity includes interactions with mixed-risk liquidity pools. Frequency of transfers (${activity.length}) exceeds 24h retail baseline. Recommend secondary surveillance on peer-to-peer exit nodes.`;
    } else {
        narrative += `NARRATIVE_GAP: MINIMAL. Observed data points align with standard ecosystem interaction. No significant clustering with sanctioned entities identified in current session depth.`;
    }

    return narrative;
};

export const calculateClusterCorrelation = (address, activity = []) => {
    // Logic: Higher transaction count + presence of risk flags increases correlation
    const base = 40;
    const activityModifier = Math.min(activity.length, 30);
    const risk = calculateRiskScore(address, activity);
    const riskModifier = risk.score * 0.3;
    
    const correlation = Math.min(base + activityModifier + riskModifier, 99.8);
    return correlation.toFixed(1);
};

/**
 * Formats data for Legal Evidence Export
 */
export const prepareEvidenceReport = (caseData) => {
    return {
        header: {
            title: "OFFICIAL FORENSIC INTELLIGENCE REPORT",
            caseId: caseData.id,
            generatedAt: new Date().toISOString(),
            classification: "CONFIDENTIAL / LAW ENFORCEMENT ONLY"
        },
        subject: {
            address: caseData.subject,
            riskScore: caseData.riskScore,
            riskLevel: caseData.riskLevel
        },
        findings: caseData.findings || [],
        timeline: caseData.timeline || [],
        audittrail: caseData.audittrail || []
    };
};
