import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

/**
 * Fetches recent transaction history for a given wallet address.
 */
export const getWalletTransactionHistory = async (address) => {
    try {
        console.log(`🔍 Fetching historical data for: ${address}`);
        
        // Fetch asset transfers (ETH, ERC20, etc.)
        const transfers = await alchemy.core.getAssetTransfers({
            fromAddress: address,
            category: ["external", "erc20", "erc721", "erc1155"],
            maxCount: 50,
        });

        const history = transfers.transfers.map(tx => ({
            id: tx.hash,
            timestamp: tx.metadata?.blockTimestamp || new Date().toISOString(),
            action: tx.category === 'external' ? 'ETH_TRANSFER' : 'TOKEN_TRANSFER',
            entity: tx.to || 'Unknown',
            value: tx.value || 0,
            asset: tx.asset || 'ETH',
            checksum: tx.hash // Use hash as checksum placeholder
        }));

        return history;
    } catch (error) {
        console.error("Alchemy History Error:", error);
        return [];
    }
};

/**
 * Perform a deep forensic analysis of a wallet.
 */
export const getWalletAnalysis = async (address) => {
    try {
        const [txCount, ethBalance, history] = await Promise.all([
            alchemy.core.getTransactionCount(address),
            alchemy.core.getBalance(address),
            getWalletTransactionHistory(address)
        ]);

        return {
            txCount,
            balance: parseFloat(ethBalance.toString()) / 1e18,
            history
        };
    } catch (error) {
        console.error("Forensic Analysis Error:", error);
        throw error;
    }
};
