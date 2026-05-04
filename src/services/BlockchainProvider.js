import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || "vHM8AL13dp5XCpIMZE58N";
const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

const settings = {
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);
const provider = new ethers.JsonRpcProvider(ALCHEMY_URL);

// Simple In-Memory Cache
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

/**
 * Safely executes a provider call with error handling.
 */
const safeProviderCall = async (callFn) => {
    try {
        return await callFn(provider);
    } catch (error) {
        console.error("Alchemy Provider Error:", error);
        throw new Error("NETWORK_CONGESTION");
    }
};

/**
 * Fetches recent ETH transfers for a given wallet using Alchemy's Advanced API.
 * Optimized for high-speed retrieval by limiting scan range and enabling parallel data streams.
 */
export const getWalletTransactionHistory = async (address) => {
    const cacheKey = `history_${address}`;
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
    }

    try {
        console.log(`⚡ Optimized Alchemy Retrieval for: ${address}`);

        // Fetch only most recent 20 assets with a focused block range to maximize response speed
        const response = await alchemy.core.getAssetTransfers({
            fromBlock: "0x1100000", // Start from a relatively recent block to speed up scan
            fromAddress: address,
            category: ["external", "internal", "erc20"],
            maxCount: 20,
            order: "desc",
            withMetadata: true,
            excludeZeroValue: true
        });

        const history = response.transfers.map(tx => ({
            id: tx.hash,
            timestamp: tx.metadata.blockTimestamp || new Date().toISOString(),
            action: tx.category.toUpperCase(),
            entity: tx.to || 'Protocol Interaction',
            value: tx.value ? tx.value.toFixed(4) : '0.00',
            asset: tx.asset || 'ETH',
            checksum: tx.hash
        }));

        cache.set(cacheKey, { data: history, timestamp: Date.now() });
        return history;
    } catch (error) {
        console.error("Alchemy History Error:", error);
        return [];
    }
};

/**
 * Perform a deep forensic analysis of a wallet using Alchemy.
 */
export const getWalletAnalysis = async (address) => {
    const cacheKey = `analysis_${address}`;
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
    }

    try {
        const [txCount, ethBalance, history] = await Promise.all([
            provider.getTransactionCount(address),
            provider.getBalance(address),
            getWalletTransactionHistory(address)
        ]);

        const analysis = {
            txCount: Number(txCount),
            balance: parseFloat(ethers.formatEther(ethBalance)),
            history
        };

        cache.set(cacheKey, { data: analysis, timestamp: Date.now() });
        return analysis;
    } catch (error) {
        console.error("Alchemy Forensic Analysis Error:", error);
        throw error;
    }
};


export const LiveSocket = {
    socket: null,
    listeners: new Set(),
    connect: function(onMessage) {
        if (onMessage) this.listeners.add(onMessage);
        
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        const wssUrl = import.meta.env.VITE_RPC_WSS_LIVE || "wss://eth-mainnet.g.alchemy.com/v2/ZJNf33Hk7Dj5Jm5b5wH5yKCfWKAPeUWG";
        this.socket = new WebSocket(wssUrl);
        
        this.socket.onopen = () => {
            console.log("LiveSocket Connected.");
        };
        
        this.socket.onmessage = (event) => {
            this.listeners.forEach(listener => {
                try {
                    listener(event.data);
                } catch (err) {
                    console.error("LiveSocket listener error:", err);
                }
            });
        };
        
        this.socket.onclose = () => {
            console.warn("LiveSocket dropped. Reconnecting in 3 seconds...");
            setTimeout(() => this.connect(), 3000);
        };
        
        this.socket.onerror = (err) => {
            console.error("LiveSocket error:", err);
            this.socket.close();
        };
    },
    send: function(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn("LiveSocket not open. Cannot send message.");
        }
    },
    disconnect: function(onMessage) {
        if (onMessage) {
            this.listeners.delete(onMessage);
        }
        
        // Only close the actual socket if no listeners left
        if (this.listeners.size === 0 && this.socket) {
            this.socket.onclose = null;
            this.socket.close();
            this.socket = null;
        }
    }
};

export const fetchForensicData = async (walletAddress) => {
    // 1. Check Firebase first (Persistence)
    try {
        const docRef = doc(db, "forensic_reports", walletAddress);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Returned from Firebase cache");
            return { data: docSnap.data(), providerLevel: 'CACHE' };
        }
    } catch (e) {
        console.warn("Firebase cache read error", e);
    }

    const providers = [
        { url: import.meta.env.VITE_RPC_HTTPS_PRIMARY, level: 'PRIMARY' },
        { url: import.meta.env.VITE_RPC_HTTPS_SECONDARY, level: 'SECONDARY' },
        { url: import.meta.env.VITE_RPC_HTTPS_TERTIARY, level: 'TERTIARY' }
    ];

    let lastError = null;

    // 2. Retry Loop
    for (let i = 0; i < providers.length; i++) {
        const { url, level } = providers[i];
        if (!url) continue;

        try {
            console.log(`Attempting fetch with ${level} provider...`);
            const fallbackProvider = new ethers.JsonRpcProvider(url);
            const [txCount, ethBalance, history] = await Promise.all([
                fallbackProvider.getTransactionCount(walletAddress),
                fallbackProvider.getBalance(walletAddress),
                getWalletTransactionHistory(walletAddress) // Alchemy history
            ]);
            
            const analysis = {
                txCount: Number(txCount),
                balance: parseFloat(ethers.formatEther(ethBalance)),
                history
            };

            // Save to Firebase on successful fetch
            try {
                await setDoc(doc(db, "forensic_reports", walletAddress), analysis);
            } catch (e) {
                console.warn("Failed to persist to Firebase", e);
            }

            return { data: analysis, providerLevel: level };
        } catch (error) {
            console.warn(`Provider ${level} failed:`, error);
            // Check if error is 429 Too Many Requests
            if (error.info?.error?.code === 429 || (error.message && error.message.includes("429"))) {
                lastError = error;
                continue; // Switch to next provider
            } else {
                lastError = error;
                continue;
            }
        }
    }

    throw lastError || new Error("All RPC providers failed");
};

export { provider, alchemy };
