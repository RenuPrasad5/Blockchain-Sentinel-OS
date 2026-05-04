import { LiveSocket } from './BlockchainProvider';
import useModeStore from '../store/modeStore';

let buffer = [];
const FLUSH_INTERVAL = 500;
let flushInterval;

export const startMempoolStream = () => {
    const { setConnectionStatus, addLiveData } = useModeStore.getState();

    const onMessage = (data) => {
        try {
            const msg = JSON.parse(data);
            // Handle Alchemy full transaction objects
            if (msg.params && msg.params.result) {
                const tx = msg.params.result;
                
                if (typeof tx === 'object' && tx.hash) {
                    const ethValue = tx.value ? Number(tx.value) / 1e18 : 0;
                    const valueUsd = ethValue * 2700; // Mock current price

                    const payload = {
                        id: tx.hash,
                        type: 'TRANSACTION',
                        symbol: 'ETH',
                        valueEth: ethValue.toFixed(4),
                        valueUsd: valueUsd,
                        from: tx.from,
                        to: tx.to || 'Contract Creation',
                        timestamp: new Date(),
                        status: 'PENDING',
                        input: tx.input || '0x'
                    };
                    buffer.push(payload);
                }
            }
        } catch (e) {
            console.error("Mempool stream parse error:", e);
        }
    };

    const initialize = () => {
        setConnectionStatus('connecting');
        LiveSocket.connect(onMessage);
        
        const subscribe = () => {
            console.log("📡 Subscribing to Alchemy Real-Time Mempool Firehose...");
            LiveSocket.send({
                jsonrpc: "2.0",
                id: 1,
                method: "eth_subscribe",
                params: ["alchemy_pendingTransactions"]
            });
            setConnectionStatus('open');
        };

        // Ensure we subscribe once the socket is ready
        if (LiveSocket.socket && LiveSocket.socket.readyState === WebSocket.OPEN) {
            subscribe();
        } else {
            const check = setInterval(() => {
                if (LiveSocket.socket && LiveSocket.socket.readyState === WebSocket.OPEN) {
                    subscribe();
                    clearInterval(check);
                }
            }, 1000);
        }
    };

    initialize();

    flushInterval = setInterval(() => {
        if (buffer.length > 0) {
            // Sort by value to highlight "Actionable Intel"
            const sortedBatch = [...buffer].sort((a, b) => Number(b.valueEth) - Number(a.valueEth));
            sortedBatch.forEach(data => addLiveData(data));
            buffer = [];
        }
    }, FLUSH_INTERVAL);

    return () => {
        LiveSocket.disconnect(onMessage);
        if (flushInterval) clearInterval(flushInterval);
        setConnectionStatus('closed');
    };
};