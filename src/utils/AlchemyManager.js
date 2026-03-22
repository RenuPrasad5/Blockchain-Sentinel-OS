import { Alchemy, Network, Utils } from "alchemy-sdk";
import { ethers } from "ethers";

const getAlchemyConfig = () => ({
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || 'demo',
    network: Network.ETH_MAINNET,
});

let alchemy;
let provider; // Ethers provider for fallback
const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || 'demo';

try {
    alchemy = new Alchemy(getAlchemyConfig());
    // Create a fallback ethers provider for data integrity
    provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`);
} catch (err) {
    console.warn("Alchemy SDK initialization postponed or failed. Using public fallback.");
    provider = new ethers.JsonRpcProvider('https://eth.publicnode.com');
}

class AlchemyManager {
    constructor() {
        this.status = "DISCONNECTED";
        this.init();
    }

    init() {
        try {
            this.status = "CONNECTED";
            console.log("Alchemy SDK initialized.");
        } catch (err) {
            console.error("Alchemy init error:", err);
            this.status = "ERROR";
        }
    }

    onPendingTransaction(callback) {
        try {
            alchemy.ws.on("pendingTransactions", callback);
            return () => {
                alchemy.ws.off("pendingTransactions", callback);
            };
        } catch (err) {
            console.error("Error setting up alchemy listener:", err);
            return () => { };
        }
    }

    onSwap(callback) {
        const WETH_USDC_POOL = "0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640";
        const SWAP_TOPIC = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67";

        const filter = {
            address: WETH_USDC_POOL,
            topics: [SWAP_TOPIC]
        };

        try {
            alchemy.ws.on(filter, (log) => {
                // Decode price from sqrtPriceX96 in Swap event
                // data: [amount0, amount1, sqrtPriceX96, liquidity, tick]
                const data = log.data;
                const sqrtPriceX96 = BigInt("0x" + data.slice(130, 194));
                const price = Number((sqrtPriceX96 * sqrtPriceX96 * BigInt(1e12)) / (BigInt(2) ** BigInt(192)));
                const ethPrice = 1 / (price / 1e12); // Simple conversion for demonstration
                callback(ethPrice);
            });
            return () => alchemy.ws.off(filter);
        } catch (err) {
            console.error("Error setting up swap listener:", err);
            return () => { };
        }
    }

    async getTransactionDetails(hash) {
        try {
            return await alchemy.core.getTransaction(hash);
        } catch (error) {
            return null;
        }
    }

    getStatus() {
        return this.status;
    }
}

export const alchemyManager = new AlchemyManager();
export { provider };
export default alchemy;
