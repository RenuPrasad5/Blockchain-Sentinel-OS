export const INTELLIGENCE_DATABASE = [
    {
        id: "SRC-7721",
        caseTitle: "Mixer Interaction",
        riskScore: 92,
        riskLevel: "CRITICAL",
        confidence: 94,
        status: "CRITICAL",
        time: "2m ago",
        hopCount: 12,
        clustering: { addressCount: 450, primaryEntity: "High-Risk Exchange Cluster" },
        behavioralIndicators: ["Rapid Layering", "Automated Splitting", "Mixer Dependency"],
        why: "Sequential 100 ETH hops detected targeting a known Tornado Cash relayer cluster.",
        whyRisky: "This wallet is using advanced automation to move large sums of ETH into a privacy mixer. This behavior is almost exclusively associated with fund obfuscation following a high-value exploit.",
        suggestedAction: "Immediately freeze associated exchange accounts and flag the destination relayer in real-time monitors.",
        investigationSummaryShort: "Funds moved from a high-risk origin -> split into small batches -> deposited into Tornado Cash.",
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
        riskLevel: "HIGH",
        confidence: 78,
        status: "HIGH RISK",
        time: "8m ago",
        hopCount: 6,
        clustering: { addressCount: 18, primaryEntity: "Unidentified Retail Cluster" },
        behavioralIndicators: ["Threshold Bypassing", "Smurfing", "Cyclical Flow"],
        why: "Frequent $9,900 withdrawals observed from 12 distinct protocol contracts within 1 hour.",
        whyRisky: "The user is intentionally keeping transactions just below the $10,000 reporting threshold to avoid regulatory detection. This is a classic indicator of money laundering (smurfing).",
        suggestedAction: "Monitor linked wallets for further consolidation and prepare an AML suspicious activity report (SAR).",
        investigationSummaryShort: "Systematic withdrawals -> consolidated through 12 addresses -> final exit at Binance.",
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
        riskLevel: "CRITICAL",
        confidence: 98,
        status: "CRITICAL",
        time: "15m ago",
        hopCount: 3,
        clustering: { addressCount: 124, primaryEntity: "Draining Infrastructure" },
        behavioralIndicators: ["Signature Fraud", "Mass Drainage", "Real-time Exfiltration"],
        why: "Direct association with Ledger Connect Kit npm exploit payload delivery.",
        whyRisky: "This address is the primary hub for a supply-chain attack that drained hundreds of user wallets. It is actively receiving stolen assets in real-time.",
        suggestedAction: "Blacklist this address globally and notify wallet providers to warn users about signature requests from associated dApps.",
        investigationSummaryShort: "Malicious script injection -> automated wallet drains -> assets moved to a stealth wallet.",
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
        riskLevel: "HIGH",
        confidence: 82,
        status: "HIGH RISK",
        time: "22m ago",
        hopCount: 8,
        clustering: { addressCount: 52, primaryEntity: "Compromised Validator Set" },
        behavioralIndicators: ["Proof Bypass", "Sudden Outflow", "Multi-sig Anomaly"],
        why: "Unusual liquidity drain on the Arbitrum-L1 bridge contract following a state-root update.",
        whyRisky: "Large amounts of ETH are leaving the bridge without corresponding proofs from the L2 network. This suggests a potential vulnerability or compromised validator key.",
        suggestedAction: "Trigger protocol pause and initiate a multi-sig audit of the bridge's current state root.",
        investigationSummaryShort: "Proofless withdrawal -> large ETH outflow -> assets moved to an unverified sink.",
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
        riskLevel: "LOW",
        confidence: 96,
        status: "INFORMATIONAL",
        time: "45m ago",
        hopCount: 2,
        clustering: { addressCount: 1540, primaryEntity: "Coinbase Cold Storage" },
        behavioralIndicators: ["Multisig Signing", "Cold Migration", "Low Velocity"],
        why: "Internal wallet migration across Coinbase cold storage clusters. Low risk expected.",
        whyRisky: "This is a routine operational transfer between known institutional silos. The security patterns (multisig) match historical maintenance behavior.",
        suggestedAction: "No action required. Log as routine institutional maintenance.",
        investigationSummaryShort: "Cold storage cluster A -> multisig verification -> Refreshing Hot Wallet liquidity.",
        originAddress: "Coinbase Cold",
        recipientAddress: "Coinbase Hot",
        narrativeSteps: [
            { phase: "Audit", description: "Routine maintenance cycle detected on major exchange cluster.", isCritical: false },
            { phase: "Transfer", description: "85,000 ETH moved to refresh hot-wallet liquidity depth.", isCritical: false },
            { phase: "Verification", description: "Transaction signed by 3/5 known exchange multisig keys.", isCritical: false }
        ]
    }
];
