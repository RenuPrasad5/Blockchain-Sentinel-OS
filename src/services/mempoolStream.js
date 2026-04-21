import { createPublicClient, webSocket } from 'viem';
import { mainnet } from 'viem/chains';
import useModeStore from '../store/modeStore';

// Switched to Alchemy WebSocket for real-time mempool ingestion
const ALCHEMY_WSS = "wss://eth-mainnet.g.alchemy.com/v2/vHM8AL13dp5XCpIMZE58N";

const client = createPublicClient({
    chain: mainnet,
    transport: webSocket(ALCHEMY_WSS)
});

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let buffer = [];
const FLUSH_INTERVAL = isMobile ? 1200 : 500;
const BATCH_SIZE = isMobile ? 5 : 25; // Significant increase for desktop ingestion
let retryCount = 0;
const MAX_RETRIES = 5;

export const startMempoolStream = () => {
    const { setConnectionStatus, addLiveData } = useModeStore.getState();
    let unwatch;
    let flushInterval;
    let isActive = true;

    const cleanup = () => {
        if (unwatch) {
            try { unwatch(); } catch (e) { console.warn("Unwatch failed", e); }
            unwatch = null;
        }
    };

    const connect = () => {
        if (!isActive) return;
        
        cleanup();
        console.log(`📡 QuickNode Stream: Initializing Uplink (Attempt ${retryCount})`);
        setConnectionStatus('connecting');

        try {
            unwatch = client.watchPendingTransactions({
                onTransactions: async (hashes) => {
                    if (!isActive) return;
                    retryCount = 0;
                    setConnectionStatus('open');

                    const batch = hashes.slice(0, BATCH_SIZE);
                    const txPromises = batch.map(hash =>
                        client.getTransaction({ hash }).catch(() => null)
                    );

                    const transactions = await Promise.all(txPromises);

                    transactions.forEach(tx => {
                        if (!tx || !tx.value || !isActive) return;

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
                            input: tx.input
                        };

                        buffer.push(data);
                    });
                },
                onError: (err) => {
                    console.error('QuickNode Stream Error:', err);
                    if (isActive) handleReconnect();
                }
            });
        } catch (e) {
            console.error('QuickNode Connection Error:', e);
            if (isActive) handleReconnect();
        }
    };

    const handleReconnect = () => {
        if (!isActive) return;
        setConnectionStatus('error');
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            const timeout = Math.pow(2, retryCount) * 1000;
            setTimeout(connect, timeout);
        } else {
            console.error('Max QuickNode reconnection attempts reached.');
            setConnectionStatus('failed');
            // Try one more time after 30 seconds
            setTimeout(() => {
                if (isActive) {
                    retryCount = 0;
                    connect();
                }
            }, 30000);
        }
    };

    connect();

    flushInterval = setInterval(() => {
        if (buffer.length > 0 && isActive) {
            buffer.forEach(data => addLiveData(data));
            buffer = [];
        }
    }, FLUSH_INTERVAL);

    return () => {
        isActive = false;
        cleanup();
        if (flushInterval) clearInterval(flushInterval);
        setConnectionStatus('closed');
    };
};