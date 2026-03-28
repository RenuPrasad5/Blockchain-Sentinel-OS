import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export const startLiveEngine = (onBlock, onTx) => {
  console.log("SENTINEL-OS: INITIALIZING HIGH-FREQUENCY ENGINE...");

  // 1. Force the UI to show 'OPTIMAL' immediately
  const updateUI = () => {
    document.querySelectorAll('.status-text').forEach(el => {
      el.innerText = "NODE SYNC: OPTIMAL";
      el.style.color = "#00ce46";
    });
  };

  // 2. High-Frequency Polling (Every 2 seconds)
  // This simulates the 'Real-Time' flow without the WSS handshake error
  const fetchPulse = async () => {
    try {
      const block = await alchemy.core.getBlockNumber();
      const txs = await alchemy.core.getBlockWithTransactions(block);

      onBlock(block);
      updateUI();

      // Feed the 'Live Transaction Feed' with the latest transactions
      if (txs && txs.transactions) {
        txs.transactions.slice(0, 10).forEach(tx => onTx(tx));
      }
    } catch (err) {
      console.error("Pulse Sync Error:", err);
    }
  };

  // Run immediately and then every 2 seconds
  fetchPulse();
  const interval = setInterval(fetchPulse, 2000);

  return () => clearInterval(interval);
};