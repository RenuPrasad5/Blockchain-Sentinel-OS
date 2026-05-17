import { auth } from '../firebase/config';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Track an investigation activity in the forensic audit trail.
 * @param {Object} data - Audit log payload
 * @param {string} data.eventType - 'WALLET_QUERIED', 'TRACE_STARTED', 'REPORT_GENERATED', 'RISK_FLAGGED', 'INVESTIGATION_CREATED', 'NOTES_ADDED', 'ENTITY_LABELED', 'EVIDENCE_EXPORTED'
 * @param {string} [data.walletAddress] - The target wallet
 * @param {string} [data.caseId] - Case reference
 * @param {string} data.actionSummary - Human readable summary of the action
 * @param {string} [data.riskLevel] - 'Low', 'Medium', 'High'
 */
export const logInvestigationActivity = async (data) => {
    try {
        const user = auth.currentUser;
        if (!user) return null;
        
        const payload = {
            investigatorId: user.uid,
            ...data
        };

        const response = await fetch(`${BACKEND_URL}/audit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error("Error logging audit activity:", error);
        return null;
    }
};

export const getInvestigationAuditTrail = async (investigatorId = 'all') => {
    try {
        const response = await fetch(`${BACKEND_URL}/audit/${investigatorId}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching audit trail:", error);
        return [];
    }
};

export const getCaseAuditTrail = async (caseId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/audit/case/${caseId}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching case audit trail:", error);
        return [];
    }
};
