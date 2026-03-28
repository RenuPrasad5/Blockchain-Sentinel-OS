import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

const ALCHEMY_KEY = 'ZJNf33Hk7Dj5Jm5b5wH5yKCfWKAPeUWG';

const getAlchemyConfig = () => ({
    apiKey: ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
});

let alchemy;
let provider; // Ethers provider for fallback

class AlchemyManager {
    constructor() {
        this.status = "DISCONNECTED";
        this.statusListeners = [];
        this.init();
    }

    setStatus(newStatus) {
        this.status = newStatus;
        this.statusListeners.forEach(cb => cb(newStatus));
    }

    onStatusChange(callback) {
        this.statusListeners.push(callback);
        callback(this.status);
        return () => {
            this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
        };
    }

    initProvider() {
        try {
            this.setStatus("Reconnecting...");
            const wsUrl = `wss://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
            provider = new ethers.WebSocketProvider(wsUrl);

            // Wait for internal websocket to be available
            setTimeout(() => {
                if (provider && provider.websocket) {
                    provider.websocket.onopen = () => {
                        this.setStatus("CONNECTED");
                    };
                    provider.websocket.onclose = () => {
                        this.setStatus("Reconnecting...");
                        setTimeout(() => this.initProvider(), 3000);
                    };
                    provider.websocket.onerror = () => {
                        this.setStatus("Failure");
                    };

                    // Initial state check
                    if (provider.websocket.readyState === 1) {
                        this.setStatus("CONNECTED");
                    }
                } else {
                    this.setStatus("CONNECTED"); // Assume connected if websocket property inaccessible
                }
            }, 500);
        } catch (err) {
            console.warn("WSS Provider initialization failed:", err);
            this.setStatus("Failure");
            provider = new ethers.JsonRpcProvider('https://eth.publicnode.com');
        }
    }

    init() {
        try {
            alchemy = new Alchemy(getAlchemyConfig());
            this.initProvider();
            console.log("Alchemy SDK initialized.");
        } catch (err) {
            console.error("Alchemy init error:", err);
            this.setStatus("Failure");
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

    onNewBlock(callback) {
        try {
            alchemy.ws.on("block", callback);
            return () => {
                alchemy.ws.off("block", callback);
            };
        } catch (err) {
            console.error("Error setting up block listener:", err);
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
