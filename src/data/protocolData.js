export const protocolData = [
    {
        id: 'ethereum',
        name: "Ethereum",
        type: "L1 Network / Platform",
        category: "Infrastructure",
        icon: "Hexagon",
        color: "#627EEA",
        innovations: "Smart Contracts, Proof of Stake (The Merge), Proto-Danksharding",
        upgrades: "Dencun Upgrade (EIP-4844), Pectra (Upcoming)",
        risks: "Centralization of builders/relays, Liquid staking dominance (Lido), Regulatory scrutiny",
        Beginner: {
            overview: "Ethereum is a global, decentralized computer that runs smart contracts—programs that run exactly as programmed without any possibility of downtime or interference.",
            architecture: "Think of it as a huge network of computers all working together to maintain a single 'state' or status of all transactions and accounts.",
            consensus: "After 'The Merge', Ethereum uses Proof of Stake (PoS). People lock up their ETH to secure the network and earn rewards, rather than using energy-intensive mining.",
            tokenomics: "ETH is used to pay for 'gas' (transaction fees). It is also burned during transactions, making it potentially deflationary.",
            governance: "Decisions are made through EIPs (Ethereum Improvement Proposals) discussed by developers and the community, followed by social consensus.",
            roadmap: "Focused on scaling through Layer 2s (Rollups) and improving security and decentralization.",
            comparisons: "Compared to Bitcoin, Ethereum is more flexible. Compared to Solana, it is slower but more decentralized and secure.",
            references: ["Ethereum Whitepaper by Vitalik Buterin", "ethereum.org Documentation"]
        },
        Analyst: {
            overview: "Ethereum is the primary settlement layer for the decentralized economy, hosting the majority of DeFi, NFT, and L2 activity.",
            architecture: "Transitioning from a monolithic to a modular-ready architecture, prioritizing data availability for rollups (Danksharding).",
            consensus: "Ethereum Gasper (Casper FFG + LMD Ghost). Analyzes economic finality and the cost of 51% attacks in a PoS environment.",
            tokenomics: "EIP-1559 implementation and its impact on monetary policy and MEV (Maximal Extractable Value) redistribution.",
            governance: "Off-chain governance model led by the Ethereum Foundation and core developer groups like All Core Devs (ACD).",
            roadmap: "The Surge, The Scourge, The Verge, The Purge, and The Splurge. Prioritizing 100k+ TPS through L2 scaling.",
            comparisons: "Market dominance vs. specialized chains. Solana's monolithic speed vs. Ethereum's rollup-centric roadmap.",
            references: ["Ethereum Economic Policy - Bankless", "Messari State of Ethereum Reports"]
        },
        Developer: {
            overview: "The leading EVM-compatible execution environment for decentralized logic and immutable state management.",
            architecture: "EVM (Ethereum Virtual Machine) stack-based machine. State storage using Modified Merkle Patricia Tries.",
            consensus: "Beacon Chain architecture, validator lifecycle, slashable offenses, and sync committee functioning.",
            tokenomics: "Gas pricing algorithms, execution-level vs. consensus-level rewards, and EIP-4844 'blob' pricing mechanics.",
            governance: "Technical implementation of EIPs, hard fork coordination, and multi-client (Geth, Nethermind, Prysm, Lighthouse) diversity.",
            roadmap: "Implementing Verkle Tries for statelessness and EOF (EVM Object Format) for better execution safety.",
            comparisons: "EVM vs. SVM (Solana VM). Comparing synchronous vs. asynchronous execution models.",
            references: ["The Ethereum Yellow Paper", "Solidity Documentation"]
        },
        Investor: {
            overview: "Ethereum serves as 'Internet Bond' collateral and the primary asset for the world's first programmable financial system.",
            architecture: "Evaluating the 'Ultrasound Money' thesis through the lens of protocol-level revenue and burn rates.",
            consensus: "Risk assessment of staking yields vs. US Treasuries and the impact of institutional ETFs on ETH liquidity.",
            tokenomics: "Supply dynamics post-Merge: Net issuance vs. burn rate. Assessment of L2s paying rent to L1.",
            governance: "Regulatory classification risks (Security vs. Commodity) and the influence of major foundation grants.",
            roadmap: "Long-term value capture of scaling. Will ETH capture value from L2 growth or suffer from fragmentation?",
            comparisons: "ETH/BTC ratio analysis and market share trends against 'ETH Killers'.",
            references: ["BlackRock ETH ETF Filings", "Grayscale Ethereum Trust Reports"]
        }
    },
    {
        id: 'solana',
        name: "Solana",
        type: "L1 Network (High Performance)",
        category: "Infrastructure",
        icon: "Zap",
        color: "#14F195",
        innovations: "Proof of History (PoH), Tower BFT, Gulf Stream, Sealevel (Parallel execution)",
        upgrades: "v1.18 Scheduler, Firedancer (Next-gen client)",
        risks: "Network outages history, Hardware requirements, Centralization in validator set",
        Beginner: {
            overview: "Solana is an ultra-fast blockchain designed for massive scale. It aims to be as fast as traditional financial systems while staying decentralized.",
            architecture: "It uses a special way of keeping time called Proof of History, which allows the network to process thousands of transactions per second.",
            consensus: "Solana uses Proof of Stake combined with Proof of History to achieve speed without sacrificing security.",
            tokenomics: "SOL is the native token used for transaction fees and staking. Some fees are burned, similar to Ethereum.",
            governance: "Solana Labs and the Solana Foundation lead development, with community input on technical proposals.",
            roadmap: "Focused on reaching 100% uptime, launching the Firedancer client, and expanding the mobile ecosystem (Saga).",
            comparisons: "Much faster and cheaper than Ethereum, but requires more expensive hardware to run.",
            references: ["Solana.com Documentation", "Solana Whitepaper"]
        },
        Analyst: {
            overview: "A monolithic high-performance ledger focusing on low-latency execution and high throughput for high-frequency trading and consumer apps.",
            architecture: "Pipelining of transaction processing and the Sealevel parallel runtime for managing thousands of smart contracts.",
            consensus: "Tower BFT (a PoH-optimized version of PBFT). Analysis of sub-second finality and deterministic state updates.",
            tokenomics: "Fixed inflation schedule decreasing over time. Impact of priority fees on network economics.",
            governance: "On-chain signals vs. off-chain foundation-led consensus. Influence of major validator clusters.",
            roadmap: "Token Extensions, Firedancer client (aiming for 1M TPS), and local fee markets implementation.",
            comparisons: "Solana's integrated approach vs. Ethereum's modular approach. Trade-offs in sync vs. async scaling.",
            references: ["Jump Crypto Firedancer Research", "Solana Foundation Reports"]
        },
        Developer: {
            overview: "A high-concurrency execution environment (Sealevel) based on Rust and BPF (Berkeley Packet Filter).",
            architecture: "Non-blocking transaction propagation (Gulf Stream) and GPU-parallelized verification.",
            consensus: "Leader schedule rotations, turbine block propagation, and archival history management via Google BigTable.",
            tokenomics: "Compute budgets, account rent system, and the mechanics of priority fee bidding.",
            governance: "SIMD (Solana Improvement Documents) process and core contributor ecosystem.",
            roadmap: "Zk-compression, SVM (Solana Virtual Machine) portability to other chains like Eclipse.",
            comparisons: "Rust/Anchor vs. Solidity/Hardhat. Account-based model (Solana) vs. Storage-based model (Ethereum).",
            references: ["Solana Docs - SVM Section", "Anchor Framework Documentation"]
        },
        Investor: {
            overview: "Solana represents the leading 'monolithic' bet, prioritizing user experience through speed and extremely low costs.",
            architecture: "Evaluating the 'Integrated' thesis: Does keeping everything on one layer lead to better app-layer innovation?",
            consensus: "Assessing the risk of network stability and the decentralization metrics (Nakamoto Coefficient).",
            tokenomics: "Liquid staking ecosystem growth (Jito, Marinade) and its impact on SOL value accrual.",
            governance: "Ecosystem resilience post-major collapses (FTX) and the strength of the developer community.",
            roadmap: "Institutional adoption potential with Firedancer and mobile-first strategy for mass acquisition.",
            comparisons: "Market share growth in DEX volume and active users relative to Ethereum and L2s.",
            references: ["VanEck Solana Valuation", "Helius Weekly Research"]
        }
    },
    {
        id: 'uniswap',
        name: "Uniswap",
        type: "DEX Protocol",
        category: "DeFi",
        icon: "Network",
        color: "#FF007A",
        innovations: "Automated Market Maker (AMM), Concentrated Liquidity (v3), Hooks (v4)",
        upgrades: "Uniswap v4 (Singleton design), UniswapX (DEX Aggregation)",
        risks: "DEX aggregation competition, Regulatory pressure on front-ends, LP loss (Impermanent Loss)",
        Beginner: {
            overview: "Uniswap is a decentralized exchange where you can swap any crypto token for another without needing an intermediary or a central company.",
            architecture: "It uses liquidity pools—piles of tokens provided by users—which allows for trades to happen automatically.",
            consensus: "Uniswap isn't a blockchain; it's a set of smart contracts running on blockchains like Ethereum and Solana.",
            tokenomics: "UNI is a governance token. Holders can vote on how the protocol is managed and how the treasury is spent.",
            governance: "UNI holders vote on proposals. It is one of the largest and most active DAOs in the Blockchain Intelligence.",
            roadmap: "Launching v4 for more customizable pools and UniswapX for better trading prices.",
            comparisons: "The 'main street' of DeFi. Like a bank but with no managers and open to everyone.",
            references: ["uniswap.org", "Uniswap v3 Whitepaper"]
        },
        Analyst: {
            overview: "The dominant liquidity protocol by volume, transitioning into a multi-chain execution layer for on-chain finance.",
            architecture: "V3 Concentrated Liquidity and the upcoming V4 Singleton + Hooks architecture for infinite customizability.",
            consensus: "Protocol is immutable on-chain. Reliance on Ethereum/L2 security models for transaction finality.",
            tokenomics: "The 'Fee Switch' debate: Will UNI holders ever directly capture protocol fees?",
            governance: "Complex delegated voting system. Influence of major venture firms (a16z) on governance votes.",
            roadmap: "Hooks ecosystem, cross-chain liquidity management, and MEV-aware execution via UniswapX.",
            comparisons: "Uniswap vs. Curve (Stable swaps) vs. PancakeSwap. Market share retention in a competitive DEX landscape.",
            references: ["Uniswap V4 Technical Primer", "Dune Analytics Uniswap Dashboards"]
        },
        Developer: {
            overview: "A library of immutable smart contracts for constant-product and tick-based liquidity provision.",
            architecture: "The Singleton contract model (v4) reduces gas costs by 99% for multi-hop swaps by centralizing all pools.",
            consensus: "Automated pricing via x*y=k (v2) or active liquidity management (v3/v4).",
            tokenomics: "Fee tiers, Oracle integration, and the implementation of custom logic via Hooks.",
            governance: "Implementing protocol changes via timelocks and proxy contracts.",
            roadmap: "Building custom Hooks for dynamic fees, on-chain limit orders, and internalized MEV.",
            comparisons: "Writing v2 logic vs. v3/v4 complexity. Flash swap mechanics and TWAP (Time-Weighted Average Price) oracles.",
            references: ["Uniswap V3 Core GitHub", "v4-core Documentation"]
        },
        Investor: {
            overview: "Uniswap's moat is its brand and deep 'sticky' liquidity, making it the default entry point for most on-chain assets.",
            architecture: "V4 as a platform: Uniswap is becoming the foundation for other DeFi apps, not just a swap tool.",
            consensus: "Regulatory risk assessment: Is the protocol sufficiently decentralized to withstand SEC pressure?",
            tokenomics: "Assessing UNI as a 'governance-only' token vs. the potential for fee redistribution.",
            governance: "Impact of the 'Uniswap Foundation' on the long-term sustainability of the protocol.",
            roadmap: "UniswapX and its role in capturing the growing 'Intent-based' trading market.",
            comparisons: "Valuation based on Volume-to-TVL ratios relative to competitors like Sushiswap or Raydium.",
            references: ["Variant Fund Uniswap Research", "The 'Fee Switch' Proposal Archive"]
        }
    }
];
