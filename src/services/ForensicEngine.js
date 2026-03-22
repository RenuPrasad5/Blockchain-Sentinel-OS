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
    let score = 15; // Base score (trusted until proven otherwise)
    const flags = [];

    // Pattern 1: High frequency small transactions (Structuring)
    const smallTxCount = activity.filter(tx => tx.value < 0.1).length;
    if (smallTxCount > 10) {
        score += 25;
        flags.push(AML_PATTERNS.STRUCTURING);
    }

    // Pattern 2: Known Mixer/Bridge interactions
    const hasMixer = activity.some(tx => tx.toLabel?.toLowerCase().includes('mixer') || tx.toLabel?.toLowerCase().includes('bridge'));
    if (hasMixer) {
        score += 45;
        flags.push(AML_PATTERNS.MIXER_INTERACTION);
    }

    // Pattern 3: Rapid Fund Movement (Layering)
    // Mock logic: if address has > 50 tx in last hour
    if (activity.length > 50) {
        score += 30;
        flags.push(AML_PATTERNS.LAYERING);
    }

    // Cap at 100
    const finalScore = Math.min(score, 100);
    
    let level = RISK_LEVELS.LOW;
    if (finalScore > 70) level = RISK_LEVELS.HIGH;
    else if (finalScore > 30) level = RISK_LEVELS.MEDIUM;

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
        timestamp: new Date().toISOString(),
        action,
        entity,
        details,
        checksum: Math.random().toString(16).substr(2, 32) // Mock immutable checksum
    };
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
