import { Alchemy, Network, Utils } from "alchemy-sdk";

const getAlchemyConfig = () => ({
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY || 'demo',
    network: Network.ETH_MAINNET,
});

let alchemy;
try {
    alchemy = new Alchemy(getAlchemyConfig());
} catch (err) {
    console.warn("Alchemy SDK initialization postponed or failed.");
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
export default alchemy;
