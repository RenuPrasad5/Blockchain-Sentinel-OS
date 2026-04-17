export const INTELLIGENCE_DATABASE = [
    {
        id: "SRC-7721",
        caseTitle: "Mixer Interaction",
        riskScore: 92,
        status: "CRITICAL",
        time: "2m ago",
        why: "Sequential 100 ETH hops detected targeting a known Tornado Cash relayer cluster.",
        originAddress: "0x742d...492d",
        recipientAddress: "Tornado.Cash Router",
        narrativeSteps: [
            { phase: "Exploit Phase", description: "Inbound volume from high-risk jurisdiction exchange detected.", isCritical: true },
            { phase: "Steal Phase", description: "Automated splitting of 1,420 ETH into prime-number denominations.", isCritical: true },
            { phase: "Liquidation Phase", description: "Bulk deposit into privacy pool for cross-chain obfuscation.", isCritical: false }
        ]
    },
    {
        id: "AML-9904",
        caseTitle: "Structuring Pattern",
        riskScore: 65,
        status: "HIGH RISK",
        time: "8m ago",
        why: "Frequent $9,900 withdrawals observed from 12 distinct protocol contracts within 1 hour.",
        originAddress: "0x918b...1102",
        recipientAddress: "Binance Hot Wallet",
        narrativeSteps: [
            { phase: "Exploit Phase", description: "User withdrawal pattern bypasses $10k reporting thresholds.", isCritical: true },
            { phase: "Steal Phase", description: "Funds consolidated through 15 secondary 'hop' addresses.", isCritical: false },
            { phase: "Liquidation Phase", description: "Final exit via high-liquidity centralized exchange account.", isCritical: true }
        ]
    },
    {
        id: "PHS-1120",
        caseTitle: "Phishing Source",
        riskScore: 88,
        status: "CRITICAL",
        time: "15m ago",
        why: "Direct association with Ledger Connect Kit npm exploit payload delivery.",
        originAddress: "Ledger.Exploit.v4",
        recipientAddress: "Offshore Stealth Wallet",
        narrativeSteps: [
            { phase: "Exploit Phase", description: "Malicious npm package dependency injection detected.", isCritical: true },
            { phase: "Steal Phase", description: "Automated wallet drain triggered upon signature approval.", isCritical: true },
            { phase: "Liquidation Phase", description: "ETH converted to Monero via non-KYC swap protocol.", isCritical: false }
        ]
    },
    {
        id: "BRG-2201",
        caseTitle: "Bridge Anomaly",
        riskScore: 78,
        status: "HIGH RISK",
        time: "22m ago",
        why: "Unusual liquidity drain on the Arbitrum-L1 bridge contract following a state-root update.",
        originAddress: "Arbitrum Bridge L1",
        recipientAddress: "0x00...DEAD",
        narrativeSteps: [
            { phase: "Detection", description: "Real-time monitor flags 4,200 ETH bridging event without L2 proof validation.", isCritical: true },
            { phase: "Confirmation", description: "Sequencer logs confirm a transaction bypass in the validator set.", isCritical: true },
            { phase: "Remediation", description: "Protocol pause triggered. Investigating validator key leakage.", isCritical: false }
        ]
    },
    {
        id: "LIQ-4450",
        caseTitle: "Institutional Move",
        riskScore: 42,
        status: "INFORMATIONAL",
        time: "45m ago",
        why: "Internal wallet migration across Coinbase cold storage clusters. Low risk expected.",
        originAddress: "Coinbase Cold",
        recipientAddress: "Coinbase Hot",
        narrativeSteps: [
            { phase: "Audit", description: "Routine maintenance cycle detected on major exchange cluster.", isCritical: false },
            { phase: "Transfer", description: "85,000 ETH moved to refresh hot-wallet liquidity depth.", isCritical: false },
            { phase: "Verification", description: "Transaction signed by 3/5 known exchange multisig keys.", isCritical: false }
        ]
    }
];
