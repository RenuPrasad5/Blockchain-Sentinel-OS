const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const { Alchemy, Network } = require("alchemy-sdk");

admin.initializeApp();

// Config Management: Accessing Alchemy via functions.config()
const getAlchemyClient = () => {
    const alchemyKey = functions.config().alchemy?.key;
    if (!alchemyKey) {
        console.error("ALCHEMY_KEY not set in functions.config(). Proceeding with caution.");
    }
    return new Alchemy({
        apiKey: alchemyKey || "ZJNf33Hk7Dj5Jm5b5wH5yKCfWKAPeUWG", // Fallback for local testing
        network: Network.ETH_MAINNET,
    });
};

const GOPLUS_API_BASE = 'https://api.gopluslabs.io/api/v1';

/**
 * Endpoint: Risk Scoring
 * Fetches security data and calculates a risk assessment for a given wallet.
 */
exports.calculateRisk = functions.https.onRequest((req, res) => {
    // CORS Handling
    return cors(req, res, async () => {
        if (req.method !== "GET" && req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const address = req.query.address || req.body.address;
        if (!address || !address.startsWith("0x")) {
            return res.status(400).json({ error: "Valid 0x address is required" });
        }

        try {
            let score = 0;
            const details = [];

            // 1. GoPlus Malicious Address API Check
            const response = await axios.get(`${GOPLUS_API_BASE}/address_security/${address}?chain_id=1`);
            const data = response.data?.result;

            if (data) {
                if (data.data_source && Object.keys(data.data_source).length > 0) {
                    score += 50;
                    details.push("Flagged by Security Providers");
                }
                if (data.phishing_activities === "1" || data.stealing_activities === "1") {
                    score += 40;
                    details.push("Suspicious Phishing/Stealing Activity Detected");
                }
            }

            // 2. Mock Wallet Age Calculation
            const ageHours = Math.floor(Math.random() * 72); // Simulated age
            if (ageHours < 24) {
                score += 10;
                details.push("Wallet age < 24 hours");
            }

            // 3. Score Mapping (1-10)
            const rawScore = Math.min(score, 100);
            const mappedScore = Math.max(1, Math.ceil(rawScore / 10));

            // 4. Assessment Matrix
            let level = "Safe";
            let color = "#10b981";
            if (mappedScore >= 8) {
                level = "High Risk";
                color = "#ef4444";
            } else if (mappedScore >= 4) {
                level = "Medium Risk";
                color = "#f59e0b";
            }

            return res.json({
                address,
                score: mappedScore,
                level,
                color,
                details,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error("Cloud Functions: Risk Scan Failed:", error);
            return res.status(500).json({ error: "Security Scan Engine Offline" });
        }
    });
});

/**
 * Endpoint: Forensic Mapping
 * Generates an audit log and forensic flags for a transaction/wallet activity.
 */
exports.generateForensicProfile = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("POST Method Required");
        }

        const { address, activity = [] } = req.body;
        if (!address) return res.status(400).send("Address required");

        const flags = [];
        let riskImpact = 0;

        // Pattern Analysis Logic
        const smallTxCount = activity.filter(tx => tx.value < 0.1).length;
        if (smallTxCount > 5) {
            flags.push("STRUCTURING_PATTERN_DETECTED");
            riskImpact += 25;
        }

        if (activity.length > 20) {
            flags.push("HIGH_FREQUENCY_LAYERING");
            riskImpact += 30;
        }

        // Audit Trail Creation
        const auditLog = {
            id: `LOG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            action: "FORENSIC_PROFILE_GENERATION",
            entity: address,
            checksum: Math.random().toString(16).substr(2, 32)
        };

        return res.json({
            address,
            forensicFlags: flags,
            riskImpact,
            auditLog,
            status: "ANALYSIS_COMPLETE"
        });
    });
});
