import { createPublicClient, webSocket } from 'viem'; // Switched to webSocket
import { mainnet } from 'viem/chains';
import useModeStore from '../store/modeStore';

// 1. Use WebSocket (WSS) instead of HTTP for real-time "Push" data
const client = createPublicClient({
    chain: mainnet,
    transport: webSocket(import.meta.env.VITE_ALCHEMY_RPC_URL || 'wss://eth-mainnet.g.alchemy.com/v2/ZJNf33Hk7Dj5Jm5b5wH5yKCfWKAPeUWG')
});

export const startMempoolStream = () => {
    console.log(' Real-Time OS: Mempool Stream Active');

    const unwatch = client.watchPendingTransactions({
        onTransactions: async (hashes) => {
            // Take the top 5 most recent hashes
            const batch = hashes.slice(0, 5);

            // 2. Fetch all transaction details AT THE SAME TIME (Parallel)
            // This prevents the UI from lagging
            const txPromises = batch.map(hash =>
                client.getTransaction({ hash }).catch(() => null)
            );

            const transactions = await Promise.all(txPromises);

            transactions.forEach(tx => {
                if (!tx || !tx.value) return; // Skip failed or empty txs

                const ethValue = Number(tx.value) / 1e18;
                const valueUsd = ethValue * 2700;

                const data = {
                    id: tx.hash,
                    type: 'TRANSACTION',
                    symbol: 'ETH',
                    valueEth: ethValue.toFixed(4),
                    valueUsd: valueUsd,
                    from: tx.from,
                    to: tx.to || 'Contract Creation',
                    timestamp: new Date(),
                    status: 'PENDING',
                    input: tx.input // HEX data for forensic decoding
                };

                // 3. Push to global state
                useModeStore.getState().addLiveData(data);
            });
        }
    });

    return unwatch;
};