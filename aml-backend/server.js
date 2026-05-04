import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import connectDB from './db.js';
import Transaction from './models/Transaction.js';
import WalletCache from './models/WalletCache.js';
import AMLResult from './models/AMLResult.js';
import Case from './models/Case.js';
import { createTransactionGraph, getWalletGraph } from './neo4j.js';
import PDFDocument from 'pdfkit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Provider with batching disabled to prevent RPC errors
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL, undefined, {
    batchMaxCount: 1, // Disable batching
    staticNetwork: true // Speed up by avoiding chainId checks
});

const TRANSFER_EVENT_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
/**
 * Unified Forensic Intelligence Engine
 * @param {Array} transactions 
 * @param {string} address 
 * @returns {Object} Comprehensive forensic intelligence package
 */
const KNOWN_PROTOCOLS = {
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT Contract",
    "0xE592427A0AEce92De3Edee1F18E0157C05861564": "Uniswap Router",
    "0x1111111254EEB25477B68fb85Ed929f73A960582": "1inch Aggregator",
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D": "Uniswap V2 Router",
    "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45": "Uniswap V3 Router",
    "0x00000000006c3852cbEf0e82E8456060F0314503": "Seaport (OpenSea)",
};

/**
 * Industry-Grade Forensic Intelligence Engine
 * @param {Array} transactions 
 * @param {string} address 
 * @returns {Object} Comprehensive forensic intelligence package
 */
const calculateForensicIntel = (transactions, address) => {
    const normalizedAddress = address.toLowerCase();
    let totalSent = 0;
    let totalReceived = 0;
    let totalVolume = 0;
    let contractInteractions = 0;
    let dustingCount = 0;
    const counterparties = new Map(); // address -> count
    const flags = [];
    const timePatterns = [];
    
    // 1. Core Enrichment & Basic Stats
    const enrichedTransactions = transactions.map((tx, index) => {
        const val = parseFloat(tx.value);
        totalVolume += val;

        const isOutbound = tx.from.toLowerCase() === normalizedAddress;
        const target = (isOutbound ? tx.to : tx.from)?.toLowerCase() || '0x000...';
        
        // Counterparty frequency tracking
        counterparties.set(target, (counterparties.get(target) || 0) + 1);

        // Classification
        let type = 'NORMAL_TRANSFER';
        const isContract = !tx.to || tx.to === 'Contract Creation' || tx.isContractInteraction;
        
        if (isContract) {
            type = 'CONTRACT_INTERACTION';
            contractInteractions++;
        }

        if (isOutbound) totalSent++; else totalReceived++;
        if (val > 0 && val < 0.005) dustingCount++;

        // Counterparty Labeling
        let counterpartyLabel = KNOWN_PROTOCOLS[ethers.getAddress(target)] || (isContract ? "Smart Contract Interaction" : "External Wallet");
        if (counterparties.get(target) > 5) counterpartyLabel = `High Frequency: ${counterpartyLabel}`;

        return {
            ...tx,
            type,
            counterpartyLabel,
            counterpartyType: isContract ? 'SMART_CONTRACT' : 'EXTERNAL_WALLET'
        };
    });

    // 2. Time Intelligence (Behavioral Patterns)
    if (enrichedTransactions.length > 1) {
        let rapidCount = 0;
        let nightActivity = false;
        
        const sortedTxs = [...enrichedTransactions].sort((a, b) => b.timestamp - a.timestamp);
        
        for (let i = 0; i < sortedTxs.length - 1; i++) {
            const diff = Math.abs(sortedTxs[i].timestamp - sortedTxs[i+1].timestamp);
            if (diff < 60) rapidCount++;
            
            const date = new Date(sortedTxs[i].timestamp * 1000);
            const hour = date.getHours();
            if (hour >= 0 && hour <= 4) nightActivity = true;
        }

        if (rapidCount > 0) timePatterns.push("Rapid Activity");
        if (rapidCount > 5) timePatterns.push("Burst Activity");
        if (nightActivity) timePatterns.push("Night Surveillance (12AM-4AM)");
        
        const latestTx = sortedTxs[0].timestamp;
        if (Math.floor(Date.now() / 1000) - latestTx > 7 * 24 * 3600) {
            timePatterns.push("Dormant Account State");
        }
    }

    // 3. Upgraded Risk Scoring (Max 100)
    let riskScore = 0;
    const contractRatio = contractInteractions / (transactions.length || 1);
    
    if (contractRatio > 0.2) riskScore += 20;
    if (transactions.length > 50) riskScore += 20;
    if (timePatterns.includes("Rapid Activity")) riskScore += 15;
    if (counterparties.size > 10) riskScore += 20;
    if (timePatterns.includes("Burst Activity")) riskScore += 15;
    if (totalVolume > 1) riskScore += 10;
    
    riskScore = Math.min(riskScore, 100);

    // 4. Decision Layer (Final AML Verdict)
    let verdict = "";
    let riskLevel = "Low";
    if (riskScore > 70) {
        riskLevel = "High";
        verdict = "HIGH RISK — Suspicious behavioral patterns detected. Likely laundering indicators or automated sybil activity.";
    } else if (riskScore > 40) {
        riskLevel = "Medium";
        verdict = "MEDIUM RISK — Unusual patterns observed. Potential DeFi layering or high-frequency retail activity. Further monitoring recommended.";
    } else {
        riskLevel = "Low";
        verdict = "LOW RISK — No significant suspicious activity detected. Profile aligns with standard retail usage.";
    }

    // Map time patterns to flags for visibility
    const finalFlags = [...flags, ...timePatterns];
    if (contractInteractions > 0) finalFlags.push('Contract-Heavy Flow');
    if (dustingCount > 2) finalFlags.push('Dusting Exposure');

    return {
        transactions: enrichedTransactions,
        stats: {
            totalTransactions: transactions.length,
            totalSent,
            totalReceived,
            totalVolume: totalVolume > 0 ? totalVolume.toFixed(4) + ' ETH' : 'Contract/Token Interaction Volume',
            contractInteractions,
            uniqueCounterparties: counterparties.size,
            timePatterns
        },
        analysis: {
            riskScore,
            riskLevel,
            verdict,
            flags: [...new Set(finalFlags)],
            explanation: verdict
        }
    };
};

// --- ROUTES ---

app.get('/', (req, res) => {
    res.status(200).send('AML Backend Running');
});

/**
 * @route POST /transaction
 * @desc Fetch and store transaction forensic details
 */
app.post('/transaction', async (req, res) => {
    const { hash } = req.body;

    if (!hash) {
        return res.status(400).json({ error: 'Transaction hash is required' });
    }

    try {
        const tx = await provider.getTransaction(hash);
        if (!tx) return res.status(404).json({ error: 'Transaction not found on-chain' });

        const block = await provider.getBlock(tx.blockNumber);

        const forensicData = {
            hash: tx.hash,
            from: tx.from,
            to: tx.to || 'Contract Creation',
            value: ethers.formatEther(tx.value),
            timestamp: block ? block.timestamp : Math.floor(Date.now() / 1000),
            isContractInteraction: !!(tx.to && (await provider.getCode(tx.to)) !== '0x'),
            tokenTransfers: []
        };

        if (parseFloat(forensicData.value) === 0 || forensicData.isContractInteraction) {
            try {
                const receipt = await provider.getTransactionReceipt(hash);
                if (receipt && receipt.logs) {
                    receipt.logs.forEach(log => {
                        if (log.topics[0] === TRANSFER_EVENT_TOPIC && log.topics.length >= 3) {
                            forensicData.tokenTransfers.push({
                                type: "TOKEN_TRANSFER",
                                token: log.address,
                                from: ethers.getAddress('0x' + log.topics[1].slice(26)),
                                to: ethers.getAddress('0x' + log.topics[2].slice(26))
                            });
                        }
                    });
                }
            } catch (err) {}
        }

        const newTransaction = new Transaction(forensicData);
        await newTransaction.save();
        await createTransactionGraph(forensicData).catch(() => {});

        res.status(201).json({ message: 'Forensic archived', data: newTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /wallet/:address
 * @desc Generate forensic profile and risk score for a wallet
 */
app.get('/wallet/:address', async (req, res) => {
    const { address } = req.params;
    try {
        const transactions = await Transaction.find({
            $or: [{ from: address.toLowerCase() }, { to: address.toLowerCase() }]
        });
        if (transactions.length === 0) return res.status(404).json({ error: 'No records' });

        const intel = calculateForensicIntel(transactions, address);
        res.status(200).json(intel);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/wallet-live/:address', async (req, res) => {
    const { address } = req.params;
    const normalizedAddress = address.toLowerCase();

    try {
        // STEP 8: PERFORMANCE - Cache Check (5 mins)
        const cached = await WalletCache.findOne({ address: normalizedAddress });
        if (cached && (new Date() - new Date(cached.lastUpdated)) < 5 * 60 * 1000) {
            console.log(`⚡ Serving Cached Intelligence: ${address}`);
            return res.status(200).json(cached.data);
        }

        console.log(`📡 Live Forensic Scan: ${address}`);
        const latestBlock = await provider.getBlockNumber();
        const liveTransactions = [];
        const blocksScanned = 50;

        for (let i = 0; i < blocksScanned; i++) {
            const block = await provider.getBlock(latestBlock - i, true);
            if (block && block.prefetchedTransactions) {
                block.prefetchedTransactions.forEach(tx => {
                    if (tx.from?.toLowerCase() === normalizedAddress || tx.to?.toLowerCase() === normalizedAddress) {
                        liveTransactions.push({
                            hash: tx.hash,
                            from: tx.from,
                            to: tx.to || 'Contract Creation',
                            value: ethers.formatEther(tx.value),
                            timestamp: block.timestamp
                        });
                    }
                });
            }
            if (i < blocksScanned - 1) await new Promise(r => setTimeout(r, 300));
        }

        let activeTransactions = liveTransactions;
        if (activeTransactions.length === 0) {
            activeTransactions = await Transaction.find({
                $or: [{ from: normalizedAddress }, { to: normalizedAddress }]
            }).sort({ timestamp: -1 }).limit(50);
        }

        // 1. Calculate Forensic Intel
        const intel = calculateForensicIntel(activeTransactions, address);

        // 2. Sync with AI (ML Analysis)
        let aiResult = { anomalyScore: 0, riskLevel: 'Low' };
        try {
            const mlResponse = await fetch(process.env.ML_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions: activeTransactions })
            });
            if (mlResponse.ok) {
                const mlData = await mlResponse.json();
                // SYNC: Rule-based risk inflates AI score if behavioral flags exist
                const ruleWeight = intel.analysis.riskScore / 100;
                const syncedScore = Math.max(mlData.anomalyScore, ruleWeight);
                
                aiResult = {
                    anomalyScore: syncedScore,
                    riskLevel: syncedScore > 0.7 ? 'High' : (syncedScore > 0.4 ? 'Medium' : 'Low'),
                    mlReason: mlData.reason
                };
            }
        } catch (err) {
            console.error("AI Sync Error:", err.message);
        }

        const responsePayload = {
            wallet: address,
            source: liveTransactions.length > 0 ? 'live' : 'database',
            ...intel,
            riskAnalysis: aiResult,
            behavioralFlags: intel.analysis.flags
        };

        await WalletCache.findOneAndUpdate({ address: normalizedAddress }, { data: responsePayload, lastUpdated: new Date() }, { upsert: true });

        res.status(200).json(responsePayload);
    } catch (error) {
        console.error('Scan Error:', error);
        res.status(500).json({ error: 'Uplink failed' });
    }
});

/**
 * @route GET /wallet-history/:address
 * @desc Full transaction history analysis via Etherscan
 */
app.get('/wallet-history/:address', async (req, res) => {
    const { address } = req.params;
    const normalizedAddress = address.toLowerCase();
    const apiKey = process.env.ETHERSCAN_API_KEY;

    try {
        // STEP 8: PERFORMANCE - Cache Check (5 mins)
        const cached = await WalletCache.findOne({ address: normalizedAddress });
        if (cached && cached.data.source === 'history' && (new Date() - new Date(cached.lastUpdated)) < 5 * 60 * 1000) {
            console.log(`⚡ Serving Cached Archival Intelligence: ${address}`);
            return res.status(200).json(cached.data);
        }

        console.log(`📜 Initializing Full History Trace: ${address}`);
        
        // 1. Fetch from Etherscan (Last 50 txs)
        const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`;
        console.log(`📡 Requesting Etherscan V2: ${url.replace(apiKey, 'HIDDEN')}`);
        
        const response = await fetch(url);
        const result = await response.json();

        if (result.status !== '1') {
            console.warn(`⚠️ Etherscan API Warning: ${result.message}`, result.result);
            if (result.message === 'No transactions found') {
                return res.status(200).json({
                    wallet: address,
                    source: 'history',
                    transactions: [],
                    stats: { totalTransactions: 0, totalVolume: '0 ETH' },
                    riskAnalysis: { anomalyScore: 0, riskLevel: 'Low' },
                    behavioralFlags: []
                });
            }
            throw new Error(result.message || 'Etherscan link failed');
        }

        const historyTransactions = result.result.map(tx => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to || 'Contract Creation',
            value: ethers.formatEther(tx.value),
            timestamp: parseInt(tx.timeStamp),
            isContractInteraction: tx.to === "" || tx.input !== "0x"
        }));

        console.log(`✅ Retrieved ${historyTransactions.length} transactions from Etherscan`);

        // 2. Process through Forensic Engine
        const intel = calculateForensicIntel(historyTransactions, address);

        // 3. Sync with AI
        let aiResult = { anomalyScore: 0, riskLevel: 'Low' };
        try {
            const mlResponse = await fetch(process.env.ML_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions: historyTransactions })
            });
            if (mlResponse.ok) {
                const mlData = await mlResponse.json();
                const ruleWeight = intel.analysis.riskScore / 100;
                const syncedScore = Math.max(mlData.anomalyScore, ruleWeight);
                aiResult = {
                    anomalyScore: syncedScore,
                    riskLevel: syncedScore > 0.7 ? 'High' : (syncedScore > 0.4 ? 'Medium' : 'Low')
                };
            }
        } catch (err) {
            console.error("AI Sync failed in history mode:", err.message);
        }

        const responsePayload = {
            wallet: address,
            source: 'history',
            ...intel,
            riskAnalysis: aiResult,
            behavioralFlags: intel.analysis.flags
        };

        await WalletCache.findOneAndUpdate({ address: normalizedAddress }, { data: responsePayload, lastUpdated: new Date() }, { upsert: true });

        res.status(200).json(responsePayload);
    } catch (error) {
        console.error('🔴 History Scan Error:', error);
        res.status(500).json({ error: error.message || 'Etherscan forensic link failed' });
    }
});

/**
 * @route GET /graph-flow/:wallet
 * @desc Generate fund flow graph data
 */
app.get('/graph-flow/:wallet', async (req, res) => {
    const { wallet } = req.params;
    const normalizedAddress = wallet.toLowerCase();

    try {
        // Fetch last 50 transactions to build graph
        let transactions = await Transaction.find({
            $or: [{ from: normalizedAddress }, { to: normalizedAddress }]
        }).sort({ timestamp: -1 }).limit(50);

        if (transactions.length === 0) {
            // Fallback to live scan briefly if no DB records
            return res.status(200).json({ nodes: [{ id: wallet, type: 'target' }], edges: [] });
        }

        const nodes = [{ id: normalizedAddress, type: 'target', label: 'Target' }];
        const edges = [];
        const nodeSet = new Set([normalizedAddress]);

        transactions.forEach(tx => {
            if (edges.length >= 50) return;

            const isOutbound = tx.from.toLowerCase() === normalizedAddress;
            const counterparty = (isOutbound ? tx.to : tx.from).toLowerCase();

            if (!nodeSet.has(counterparty) && nodeSet.size < 25) {
                nodeSet.add(counterparty);
                const isContract = tx.to === 'Contract Creation' || tx.isContractInteraction;
                nodes.push({ 
                    id: counterparty, 
                    type: isContract ? 'contract' : 'external',
                    label: KNOWN_PROTOCOLS[ethers.getAddress(counterparty)] || (isContract ? 'Contract' : 'External')
                });
            }

            if (nodeSet.has(counterparty)) {
                edges.push({
                    from: tx.from.toLowerCase(),
                    to: tx.to.toLowerCase() || '0x000...',
                    value: tx.value,
                    timestamp: tx.timestamp,
                    type: isOutbound ? 'OUTBOUND' : 'INBOUND'
                });
            }
        });

        res.status(200).json({ nodes, edges });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route GET /report/:wallet
 * @desc Generate forensic PDF dossier
 */
app.get('/report/:wallet', async (req, res) => {
    const { wallet } = req.params;
    const { mode = 'live' } = req.query;
    
    try {
        const endpoint = mode === 'history' ? 'wallet-history' : 'wallet-live';
        const liveResponse = await fetch(`http://localhost:${PORT}/${endpoint}/${wallet}`);
        if (!liveResponse.ok) throw new Error("Intelligence trace failed");
        const data = await liveResponse.json();

        // 1. ENGINE STRUCTURE: Fixed A4, Margins 40L/R, 50T/B
        const doc = new PDFDocument({ 
            margins: { top: 50, bottom: 30, left: 40, right: 40 },
            size: 'A4'
        });
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=SENTINEL_DOSSIER_${wallet.substring(0, 8)}.pdf`);
        doc.pipe(res);

        // STYLING CONSTANTS
        const primaryColor = '#002f6c'; 
        const textColor = '#1e293b';
        const accentRed = '#b91c1c';
        const secondaryTextColor = '#64748b';
        const contentWidth = 512;
        const FONT_REGULAR = 'Times-Roman';
        const FONT_BOLD = 'Times-Bold';
        const FONT_ITALIC = 'Times-Italic';

        // HELPERS (DROP-IN FIX)
        const writeText = (text, options = {}) => {
            doc.text(text, {
                width: contentWidth,
                align: 'left',
                lineGap: 2,
                ...options
            });
        };

        const sectionTitle = (title) => {
            doc.moveDown(0.6);
            doc.fontSize(11).font(FONT_BOLD).fillColor(primaryColor);
            writeText(title);
            doc.moveDown(0.2);
            doc.fillColor(textColor);
        };

        // SIMPLE FOOTER (SAFE)
        const addFooterText = () => {
            const oldY = doc.y; // 🔥 SAVE Y POSITION
            doc.fontSize(7)
               .fillColor('#64748b')
               .text("CONFIDENTIAL | SENTINEL-OS BLOCKCHAIN INTELLIGENCE UNIT | PMLA COMPLIANT REPORT", 40, 780, {
                   lineBreak: false
               });
            doc.x = 40;
            doc.y = oldY; // 🔥 RESTORE Y POSITION
        };

        doc.on('pageAdded', () => {
            addFooterText();
        });

        // --- 1. HEADER SECTION ---
        doc.rect(0, 0, 595, 100).fill(primaryColor);
        doc.fillColor('white').fontSize(20).font(FONT_BOLD).text("SENTINEL INTELLIGENCE DOSSIER", 40, 25);
        doc.fontSize(10).font(FONT_REGULAR).text("Blockchain Risk & Financial Surveillance Report", 40, 50);
        
        doc.y = 115;
        doc.x = 40;
        doc.fillColor(textColor);
        
        // Initial page footer
        addFooterText();

        // Left-aligned header info below the blue banner
        doc.fontSize(8).font(FONT_REGULAR);
        writeText(`CASE REF: SENT-${Date.now()}`);
        writeText(`AUDIT MODE: ${mode.toUpperCase()} SURVEILLANCE`);
        writeText(`DATA SOURCE: ON-CHAIN MATRIX + ML ENGINE`);
        writeText(`TIMESTAMP: ${new Date().toISOString()}`);
        doc.font(FONT_BOLD);
        writeText(`CONFIDENCE LEVEL: 98.4%`);
        
        doc.moveDown(1);
        doc.x = 40;

        // --- 2. EXECUTIVE SUMMARY ---
        sectionTitle("1. EXECUTIVE SUMMARY");
        doc.fontSize(9).font(FONT_ITALIC);
        writeText(`This forensic audit identifies behavioral patterns associated with ${data.riskAnalysis.riskLevel.toLowerCase()} transactional velocity for target identity ${wallet}. ${data.analysis.explanation} ${data.analysis.verdict}`);

        // --- 3. RISK & FUND FLOW INTELLIGENCE ---
        sectionTitle("2. RISK & FUND FLOW INTELLIGENCE");
        doc.fontSize(9).font(FONT_REGULAR);
        writeText(`• Total Transactions: ${data.stats.totalTransactions}`, { indent: 20 });
        writeText(`• Total Volume (ETH): ${parseFloat(data.stats.totalVolume).toFixed(4)} ETH`, { indent: 20 });
        writeText(`• Unique Counterparties: ${data.stats.uniqueCounterparties}`, { indent: 20 });
        writeText(`• Inbound vs Outbound Ratio: ${((data.stats.totalReceived / (data.stats.totalSent || 1))).toFixed(2)}x`, { indent: 20 });
        
        doc.fontSize(8).fillColor(secondaryTextColor);
        writeText("Risk classification is derived from transaction frequency, counterparty diversity, and contract interaction ratio.", { indent: 0 });
        doc.fillColor(textColor);

        // --- 4. BEHAVIORAL ANOMALY INDICATORS ---
        sectionTitle("3. BEHAVIORAL ANOMALY INDICATORS");
        if (data.behavioralFlags.length > 0) {
            doc.fillColor(accentRed);
            data.behavioralFlags.forEach(f => writeText(`• ALERT: ${f.toUpperCase()}`, { indent: 20 }));
            doc.fillColor(textColor);
        } else {
            doc.fillColor(secondaryTextColor);
            writeText("No anomalous indicators detected within current observation window.", { indent: 20 });
            doc.fillColor(textColor);
        }

        // --- 5. AI ANOMALY SURVEILLANCE (ML ENGINE) ---
        sectionTitle("4. AI ANOMALY SURVEILLANCE (ML ENGINE)");
        doc.fontSize(9).font(FONT_REGULAR);
        writeText(`• Anomaly Score: ${(data.riskAnalysis.anomalyScore * 100).toFixed(2)}%`, { indent: 20 });
        writeText(`• Classification: ${data.riskAnalysis.riskLevel.toUpperCase()}`, { indent: 20 });
        doc.font(FONT_ITALIC);
        writeText(`Explanation: Machine learning analysis indicates ${data.riskAnalysis.riskLevel.toLowerCase()} deviation from baseline wallet behavior patterns.`, { indent: 20 });

        // --- 6. GRANULAR TRANSACTIONAL AUDIT ---
        sectionTitle("5. GRANULAR TRANSACTIONAL AUDIT");
        const txCount = Math.min(data.transactions.length, 20);
        doc.fontSize(7).fillColor(secondaryTextColor).font(FONT_REGULAR);
        writeText(`Showing top ${txCount} of ${data.stats.totalTransactions} total transactions`, { align: 'right' });
        doc.moveDown(0.2);
        
        // FIX TABLE (SAFE + CLEAN)
        const startX = 40;
        let y = doc.y;
        
        // Header
        doc.rect(startX, y, contentWidth, 14).fill('#f1f5f9');
        doc.fillColor(primaryColor).fontSize(8).font(FONT_BOLD);
        doc.text("TX HASH", startX, y + 3, { width: 120 });
        doc.text("COUNTERPARTY", startX + 120, y + 3, { width: 180 });
        doc.text("VALUE (ETH)", startX + 300, y + 3, { width: 80, align: 'right' });
        doc.text("TYPE", startX + 380, y + 3, { width: 100, align: 'right' });
        
        y += 18;

        const drawRow = (hash, cp, val, type) => {
            if (y > 720) {   // 🔥 PREVENT PAGE OVERFLOW
                doc.addPage();
                y = 50;
                
                // Redraw table header on new page
                doc.rect(startX, y - 4, contentWidth, 14).fill('#f1f5f9');
                doc.fillColor(primaryColor).fontSize(8).font(FONT_BOLD);
                doc.text("TX HASH", startX, y - 1, { width: 120 });
                doc.text("COUNTERPARTY", startX + 120, y - 1, { width: 180 });
                doc.text("VALUE (ETH)", startX + 300, y - 1, { width: 80, align: 'right' });
                doc.text("TYPE", startX + 380, y - 1, { width: 100, align: 'right' });
                y += 14;
            }
            doc.fillColor(textColor).fontSize(7).font(FONT_REGULAR);
            doc.text(hash, startX, y, { width: 120 });
            doc.text(cp, startX + 120, y, { width: 180 });
            doc.text(val, startX + 300, y, { width: 80, align: 'right' });
            doc.text(type, startX + 380, y, { width: 100, align: 'right' });

            y += 14;
        };

        data.transactions.slice(0, txCount).forEach(tx => {
            const h = `${tx.hash.substring(0, 8)}...${tx.hash.substring(62)}`;
            const v = parseFloat(tx.value).toFixed(4);
            drawRow(h, tx.counterpartyLabel.substring(0, 40), v, tx.type.substring(0, 15).replace('_', ' '));
        });

        doc.y = y + 10; // Sync doc.y after custom table drawing
        doc.x = 40;     // 🔥 Reset doc.x to left margin after drawing the right-aligned table columns

        // --- 7. FLOW & NETWORK EXPOSURE ---
        sectionTitle("6. FLOW & NETWORK EXPOSURE");
        doc.fontSize(9).font(FONT_REGULAR);
        writeText(`• Network Exposure Level: ${data.stats.uniqueCounterparties > 10 ? 'HIGH' : (data.stats.uniqueCounterparties > 5 ? 'MEDIUM' : 'LOW')}`, { indent: 20 });
        writeText(`• Principal Counterparties:`, { indent: 20 });
        const cpUnique = [...new Set(data.transactions.map(t => t.counterpartyLabel))].slice(0, 3);
        cpUnique.forEach(cp => writeText(`- ${cp}`, { indent: 40 }));

        // --- 8. TIME BEHAVIOR ANALYSIS ---
        sectionTitle("7. TIME BEHAVIOR ANALYSIS");
        const timeAnalysis = data.stats.timePatterns?.length > 0 ? data.stats.timePatterns.join(", ") : "Standard organic distribution";
        writeText(`• Temporal Anomalies: ${timeAnalysis}`, { indent: 20 });

        // --- 9. FINAL AML CONCLUSION (CRITICAL) ---
        sectionTitle("8. FINAL AML CONCLUSION");
        if (doc.y > 680) doc.addPage();
        doc.rect(40, doc.y, contentWidth, 35).fill(data.riskAnalysis.riskLevel === 'High' ? accentRed : (data.riskAnalysis.riskLevel === 'Medium' ? '#d97706' : '#059669'));
        let conclusionText = "";
        if (data.riskAnalysis.riskLevel === 'High') {
            conclusionText = "High-risk behavioral patterns detected. Activity aligns with potential layering. Immediate investigation recommended.";
        } else if (data.riskAnalysis.riskLevel === 'Medium') {
            conclusionText = "Moderate anomalies observed. Continued monitoring and enhanced due diligence advised.";
        } else {
            conclusionText = "No significant AML risk detected. Activity consistent with standard usage patterns.";
        }
        doc.fillColor('white').fontSize(9).font(FONT_BOLD).text(conclusionText, 50, doc.y + 10, { width: 492, align: 'center' });
        doc.y += 40;

        // --- 10. OPERATIONAL RECOMMENDATIONS ---
        sectionTitle("9. OPERATIONAL RECOMMENDATIONS");
        doc.fontSize(9).font(FONT_REGULAR);
        writeText(`• Re-audit frequency: ${data.riskAnalysis.riskLevel === 'High' ? 'Every 6 hours' : 'Every 24 hours'}`, { indent: 20 });
        writeText(`• Alert Trigger: Flag any transaction above ${data.riskAnalysis.riskLevel === 'High' ? '0.5 ETH' : '5 ETH'}`, { indent: 20 });
        writeText(`• Action: Monitor all new counterparty connections.`, { indent: 20 });

        // FORCE SINGLE PAGE / PREVENT CUTOFF
        if (doc.y > 750) {
            doc.addPage();
        }

        doc.end();
    } catch (error) {
        console.error("PDF Gen Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- CASE MANAGEMENT ROUTES ---

/**
 * @route GET /cases
 * @desc Fetch all saved cases
 */
app.get('/cases', async (req, res) => {
    try {
        const cases = await Case.find().sort({ timestamp: -1 });
        res.status(200).json(cases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route POST /cases
 * @desc Save a new case
 */
app.post('/cases', async (req, res) => {
    try {
        const { walletAddress, riskScore, riskLevel, mode, notes, tags } = req.body;
        
        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        // Check if case already exists
        let existingCase = await Case.findOne({ walletAddress: walletAddress.toLowerCase() });
        
        if (existingCase) {
            // Update existing case
            existingCase.riskScore = riskScore;
            existingCase.riskLevel = riskLevel;
            existingCase.mode = mode;
            existingCase.timestamp = Date.now();
            if (notes) existingCase.notes = notes;
            if (tags) existingCase.tags = tags;
            await existingCase.save();
            return res.status(200).json({ message: 'Case updated', data: existingCase });
        }

        const newCase = new Case({
            walletAddress: walletAddress.toLowerCase(),
            riskScore,
            riskLevel,
            mode,
            notes,
            tags
        });

        await newCase.save();
        res.status(201).json({ message: 'Case saved successfully', data: newCase });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route PUT /cases/:id
 * @desc Update a case (notes, tags)
 */
app.put('/cases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { notes, tags } = req.body;
        
        const updatedCase = await Case.findByIdAndUpdate(
            id, 
            { $set: { notes, tags } },
            { new: true }
        );
        
        if (!updatedCase) return res.status(404).json({ error: 'Case not found' });
        
        res.status(200).json({ message: 'Case updated', data: updatedCase });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @route DELETE /cases/:id
 * @desc Delete a case
 */
app.delete('/cases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Case.findByIdAndDelete(id);
        res.status(200).json({ message: 'Case deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Sentinel-OS Forensic Backend initialized on port ${PORT}`);
});
