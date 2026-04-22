import { Network, Alchemy } from "alchemy-sdk";
import { ethers } from "ethers";

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

export { provider, alchemy };
