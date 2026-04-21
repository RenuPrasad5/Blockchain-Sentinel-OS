import { useEffect, useRef } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { provider } from '../services/BlockchainProvider';
import { ethers } from 'ethers';

export const useMonitor = () => {
    const { watchlist, addAlert } = useWatchlist();
    const activeListeners = useRef(new Set());
    const lastProcessedBlock = useRef(0);

    useEffect(() => {
        if (!watchlist || watchlist.length === 0) return;

        console.log(`📡 Initializing global QuickNode monitor for ${watchlist.length} nodes...`);

        const processBlock = async (blockNumber) => {
            if (blockNumber <= lastProcessedBlock.current) return;
            lastProcessedBlock.current = blockNumber;

            try {
                // Fetch block with transactions
                const block = await provider.getBlock(blockNumber, true);
                if (!block) return;

                block.prefetchedTransactions.forEach(tx => {
                    const from = tx.from?.toLowerCase();
                    const to = tx.to?.toLowerCase();

                    // Check if transaction involves any watched address
                    watchlist.forEach(watchedAddr => {
                        const addr = watchedAddr.toLowerCase();
                        if (from === addr || to === addr) {
                            handleTransaction(tx, from === addr ? 'Outgoing' : 'Incoming');
                        }
                    });
                });
            } catch (error) {
                console.error("Monitor Block Processing Error:", error);
            }
        };

        const handleTransaction = (tx, direction) => {
            const amount = parseFloat(ethers.formatEther(tx.value || "0"));
            console.log(`🚨 GLOBAL INTEL HIT: ${direction} transaction detected in block ${tx.blockNumber}`);

            // Alert Logic: High-risk transaction detected
            if (amount > 5 || isFlagged(tx.to) || isFlagged(tx.from)) {
                const alert = {
                    id: tx.hash,
                    title: 'Real-Time Threat Detected',
                    message: `${direction} transfer of ${amount.toFixed(2)} ETH detected on-chain.`,
                    type: amount > 20 ? 'Critical' : 'Warning',
                    amount: amount.toFixed(4),
                    from: tx.from,
                    to: tx.to,
                    hash: tx.hash,
                    timestamp: new Date().toISOString(),
                    riskSource: amount > 20 ? 'High Volume' : 'Heuristic Anomaly'
                };
                
                addAlert(alert);
            }
        };

        const isFlagged = (address) => {
            const flagged = ['0x123', '0x456'];
            return flagged.includes(address?.toLowerCase());
        };

        // Standard Ethers block listener (uses polling internally for JsonRpcProvider)
        provider.on("block", processBlock);

        return () => {
            provider.off("block", processBlock);
        };
    }, [watchlist, addAlert]);
};
