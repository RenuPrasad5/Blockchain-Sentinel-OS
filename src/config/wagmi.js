import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Blockchain Intelligence Terminal',
    projectId: import.meta.env.VITE_WALLET_CONNECT_ID || 'b9a67e8104adb742b781ce5b5a266a8a', // Using a default or env
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: false,
});
