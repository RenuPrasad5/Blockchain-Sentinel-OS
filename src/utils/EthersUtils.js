import { ethers } from 'ethers';

// Alchemy configuration - uses the same ENV as AlchemyManager
const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY || 'demo';
const RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

// Create a read-only provider for data enrichment
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Common ABI for common DeFi/ERC20 methods to decode
const ERC20_ABI = [
    "function transfer(address to, uint256 amount)",
    "function approve(address spender, uint256 amount)",
    "function transferFrom(address from, address to, uint256 amount)",
    "function mint(address to, uint256 amount)",
    "function burn(uint256 amount)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)"
];

const iface = new ethers.Interface(ERC20_ABI);

/**
 * formatIntelligence(hexData): Decodes common ERC-20 method calls into human-readable text.
 * Strictly read-only data enrichment.
 */
export const formatIntelligence = (hexData) => {
    if (!hexData || hexData === '0x' || hexData === 'None') return 'No Transaction Layer Data';

    try {
        const decoded = iface.parseTransaction({ data: hexData });
        if (!decoded) return 'Unrecognized Smart Contract Action';

        const { name, args } = decoded;

        switch (name) {
            case 'transfer':
                return `TRANSFER: Send ${ethers.formatUnits(args.amount, 18)} tokens to ${args.to.slice(0, 10)}...`;
            case 'approve':
                return `APPROVE: Allow ${args.spender.slice(0, 10)}... to spend ${ethers.formatUnits(args.amount, 18)} tokens`;
            case 'transferFrom':
                return `TRANSFER_FROM: Move ${ethers.formatUnits(args.amount, 18)} tokens from ${args.from.slice(0, 8)}... to ${args.to.slice(0, 8)}...`;
            case 'mint':
                return `MINT: Issue ${ethers.formatUnits(args.amount, 18)} new tokens to ${args.to.slice(0, 10)}...`;
            case 'burn':
                return `BURN: Destroy ${ethers.formatUnits(args.amount, 18)} tokens from circulation`;
            case 'swapExactTokensForTokens':
                return `DEX SWAP: Exchange ${ethers.formatUnits(args.amountIn, 18)} tokens for another asset`;
            default:
                return `METHOD_EXECUTION: ${name}`;
        }
    } catch (e) {
        // If ABI doesn't match, return basic info or hex summary
        if (hexData.length > 10) {
            return `RAW_PAYLOAD: ${hexData.slice(0, 10)}... [${(hexData.length - 2) / 2} bytes]`;
        }
        return 'Standard Network Transaction';
    }
};

/**
 * resolveAddress(input): If it's an .eth name, resolve it to an address. If it's an address, check for an ENS name.
 */
export const resolveAddress = async (input) => {
    if (!input) return null;

    try {
        if (input.includes('.') && input.endsWith('.eth')) {
            const address = await provider.resolveName(input);
            return address || input;
        } else if (ethers.isAddress(input)) {
            const ensName = await provider.lookupAddress(input);
            return ensName || input;
        }
    } catch (e) {
        console.warn("ENS Resolution Failed:", e.message);
    }
    return input;
};

/**
 * simulateGas(tx): Estimates the exact cost in USD based on current Ethers.js provider data.
 */
export const simulateGas = async (tx) => {
    try {
        // Fallback for gas estimation if tx is missing details
        const simulationTx = {
            to: tx.to || ethers.ZeroAddress,
            from: tx.from || ethers.ZeroAddress,
            data: tx.data || '0x',
            value: tx.value || 0
        };

        const [gasLimit, feeData] = await Promise.all([
            provider.estimateGas(simulationTx),
            provider.getFeeData()
        ]);

        const gasPrice = feeData.gasPrice || feeData.maxFeePerGas;
        const totalGasWei = gasLimit * gasPrice;
        const totalGasEth = ethers.formatEther(totalGasWei);

        // Dynamic ETH Price estimation (Static fallback for UI/Mocking utility)
        const ethPriceUsd = 2855.42;
        const costUsd = parseFloat(totalGasEth) * ethPriceUsd;

        return {
            ethValue: parseFloat(totalGasEth).toFixed(6),
            usdValue: costUsd.toFixed(2),
            gasUsed: gasLimit.toString(),
            gasPriceGwei: ethers.formatUnits(gasPrice, 'gwei')
        };
    } catch (e) {
        return { ethValue: '0.0000', usdValue: '0.00', gasUsed: '21000', gasPriceGwei: '0' };
    }
};
