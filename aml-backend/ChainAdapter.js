import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// In-Memory Cache for Tracing & RPC Data
const CacheLayer = new Map();
const CACHE_TTL = 1000 * 60 * 15; // 15 mins

// Request Throttling Queue
const requestQueue = [];
let isProcessingQueue = false;

const processQueue = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;
    while (requestQueue.length > 0) {
        const { reqFn, resolve, reject } = requestQueue.shift();
        try {
            const data = await reqFn();
            resolve(data);
        } catch (e) {
            reject(e);
        }
        await new Promise(r => setTimeout(r, 250)); // 250ms throttle between RPC calls
    }
    isProcessingQueue = false;
};

const executeWithThrottle = (reqFn) => {
    return new Promise((resolve, reject) => {
        requestQueue.push({ reqFn, resolve, reject });
        processQueue();
    });
};

class ChainAdapter {
    constructor() {
        this.chains = {
            ETH: {
                api: "https://api.etherscan.io/v2/api",
                key: process.env.ETHERSCAN_API_KEY,
                name: "Ethereum Mainnet",
                chainId: 1
            },
            BSC: {
                api: "https://api.bscscan.com/api",
                key: process.env.BSCSCAN_API_KEY || "demo",
                name: "BNB Smart Chain"
            },
            POLYGON: {
                api: "https://api.polygonscan.com/api",
                key: process.env.POLYGONSCAN_API_KEY || "demo",
                name: "Polygon"
            },
            BTC: {
                // Future BTC support mock
                name: "Bitcoin Network"
            }
        };
    }

    async fetchTransactions(wallet, chain = 'ETH') {
        const cacheKey = `${chain}_TXS_${wallet.toLowerCase()}`;
        if (CacheLayer.has(cacheKey)) {
            const cached = CacheLayer.get(cacheKey);
            if (Date.now() - cached.timestamp < CACHE_TTL) {
                return cached.data;
            }
        }

        const chainConfig = this.chains[chain];
        if (!chainConfig || !chainConfig.api) {
            throw new Error(`Chain ${chain} not fully supported yet.`);
        }

        return executeWithThrottle(async () => {
            let url = `${chainConfig.api}?module=account&action=txlist&address=${wallet}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${chainConfig.key}`;
            if (chainConfig.chainId) url += `&chainid=${chainConfig.chainId}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`RPC Request failed for ${chain}`);
            const data = await res.json();
            
            if (data.status === '1') {
                CacheLayer.set(cacheKey, {
                    timestamp: Date.now(),
                    data: data.result
                });
                return data.result;
            }
            return [];
        });
    }

    async getClassification(tx) {
        if (tx.input && tx.input !== "0x") return "Contract Interaction";
        if (parseFloat(ethers.formatEther(tx.value || '0')) > 10) return "High Value Transfer";
        return "Normal Transfer";
    }
}

export default new ChainAdapter();
