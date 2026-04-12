import { createPublicClient, webSocket } from 'viem'; // Switched to webSocket
import { mainnet } from 'viem/chains';
import useModeStore from '../store/modeStore';

// 1. Use WebSocket (WSS) instead of HTTP for real-time "Push" data
const client = createPublicClient({
    chain: mainnet,
    transport: webSocket(import.meta.env.VITE_ALCHEMY_RPC_URL)
});

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let buffer = [];
const FLUSH_INTERVAL = isMobile ? 1500 : 800; // Slower updates on mobile to save CPU
const BATCH_SIZE = isMobile ? 3 : 6; // Process fewer transactions per tick on mobile
let retryCount = 0;
const MAX_RETRIES = 5;

export const startMempoolStream = () => {
    const { setConnectionStatus, addLiveData } = useModeStore.getState();
    let unwatch;
    let flushInterval;

    const connect = () => {
        console.log(`📡 Real-Time OS: Attempting Connection (Retry: ${retryCount})`);
        setConnectionStatus('connecting');

        try {
            unwatch = client.watchPendingTransactions({
                onTransactions: async (hashes) => {
                    retryCount = 0; // Reset on success
                    setConnectionStatus('open');

                    // Take the top 5 most recent hashes
                    const batch = hashes.slice(0, BATCH_SIZE);

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
                        buffer.push(data);
                    });
                },
                onError: (err) => {
                    console.error('Mempool Stream Error:', err);
                    handleReconnect();
                }
            });
        } catch (e) {
            console.error('Mempool Stream Connection Error:', e);
            handleReconnect();
        }
    };

    const handleReconnect = () => {
        setConnectionStatus('error');
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            const timeout = Math.pow(2, retryCount) * 1000;
            console.log(`🔄 Reconnecting in ${timeout}ms...`);
            setTimeout(connect, timeout);
        } else {
            console.error('Max reconnection attempts reached. Please check your connection.');
            setConnectionStatus('failed');
        }
    };

    // Initial connection
    connect();

    // Flush buffer periodically
    flushInterval = setInterval(() => {
        if (buffer.length > 0) {
            // Sort by timestamp or just push
            buffer.forEach(data => addLiveData(data));
            buffer = [];
        }
    }, FLUSH_INTERVAL);

    return () => {
        if (unwatch) unwatch();
        if (flushInterval) clearInterval(flushInterval);
        setConnectionStatus('closed');
    };
};