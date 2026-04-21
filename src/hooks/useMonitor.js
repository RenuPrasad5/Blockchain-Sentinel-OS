import { useEffect, useRef } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { Alchemy, Network } from 'alchemy-sdk';

const config = {
    apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(config);

export const useMonitor = () => {
    const { watchlist, addAlert } = useWatchlist();
    const activeListeners = useRef(new Set());

    useEffect(() => {
        if (!watchlist || watchlist.length === 0) return;

        // Process only new addresses in watchlist
        watchlist.forEach(address => {
            if (!activeListeners.current.has(address)) {
                console.log(`📡 Initializing background listener for: ${address}`);
                
                // Monitor Incoming/Outgoing Transactions via Alchemy Websockets
                // Note: In real production, this would be a backend webhook. 
                // For this platform, we use browser-side SDK listeners.
                
                try {
                    // Monitor pending transactions (Mempool)
                    alchemy.ws.on(
                        {
                            method: "alchemy_pendingTransactions",
                            fromAddress: address,
                        },
                        (tx) => handleTransaction(tx, 'Outgoing')
                    );

                    alchemy.ws.on(
                        {
                            method: "alchemy_pendingTransactions",
                            toAddress: address,
                        },
                        (tx) => handleTransaction(tx, 'Incoming')
                    );

                    activeListeners.current.add(address);
                } catch (error) {
                    console.error(`Monitor Error for ${address}:`, error);
                }
            }
        });

        const handleTransaction = (tx, direction) => {
            const amount = parseFloat(tx.value || "0") / 1e18;
            console.log(`🚨 REAL-TIME HIT: ${direction} transaction detected for ${tx.from} -> ${tx.to}`);

            // Alert Logic: High-risk transaction detected
            if (amount > 10 || isFlagged(tx.to) || isFlagged(tx.from)) {
                const alert = {
                    title: 'Strategic Threat Detected',
                    message: `${direction} transaction: ${amount.toFixed(2)} ETH from ${tx.from.substring(0, 8)}...`,
                    type: amount > 50 ? 'Critical' : 'Warning',
                    amount: amount.toFixed(4),
                    from: tx.from,
                    to: tx.to,
                    hash: tx.hash,
                    riskSource: amount > 50 ? 'Large Transaction' : 'Sanctioned Linkage'
                };
                
                addAlert(alert);
            }
        };

        const isFlagged = (address) => {
            // Mock list of flagged addresses for demonstration
            const flagged = ['0x123', '0x456'];
            return flagged.includes(address?.toLowerCase());
        };

        // Clean up listeners on unmount (Alchemy SDK specific cleanup would go here)
        return () => {
            // alchemy.ws.removeAllListeners() would clear everything
        };
    }, [watchlist, addAlert]);
};
