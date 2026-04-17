export const alertsData = [
    {
        id: 1,
        title: 'High Risk Mixer Interaction',
        score: 92,
        level: 'High',
        desc: 'This wallet interacted with a known mixer (Tornado Cash) and shows rapid fund movement across 12 distinct hops.',
        action: 'Flag for Investigation',
        narrative: {
            caseName: 'Mixer Obfuscation Trace',
            vulnerability: 'Tornado Cash Intersect',
            totalLoss: '1,420 ETH',
            blockchain: 'Ethereum Mainnet',
            nodes: {
                source: 'Aggregator Wallet',
                mid: '12 Hops / Peeling',
                outcome: 'Tornado.Cash Router'
            },
            steps: [
                {
                    step: 'Aggregation',
                    description: 'Funds collected from 5 distinct exchange wallets into a single master address.',
                    isCritical: false
                },
                {
                    step: 'Peeling',
                    description: 'Automated script moving precisely 100 ETH to unique intermediate addresses every 45 seconds.',
                    isCritical: true
                },
                {
                    step: 'Deposit',
                    description: 'Final 1,420 ETH deposited into Tornado Cash pool. 98.2% obfuscation achieved.',
                    isCritical: true
                }
            ]
        }
    },
    {
        id: 2,
        title: 'Suspicious Structuring Pattern',
        score: 65,
        level: 'Medium',
        desc: 'Multiple transaction sequences just below the threshold of regulatory reporting (AML structuring detected).',
        action: 'Review Flow',
        narrative: {
            caseName: 'Structuring Detection #442',
            vulnerability: 'Reporting Threshold Bypassing',
            totalLoss: '$2.4M USD',
            blockchain: 'Polygon Network',
            nodes: {
                source: 'User 0x921',
                mid: 'Layer 2 Bridge',
                outcome: 'Centralized Exchange'
            },
            steps: [
                {
                    step: 'Withdrawal',
                    description: 'User initiated 15 withdrawals of $9,900 each from decentralized lending protocols.',
                    isCritical: true
                },
                {
                    step: 'Mapping',
                    description: 'Funds routed through Layer-2 bridges to hide the direct link between origin and destination.',
                    isCritical: false
                },
                {
                    step: 'Exit',
                    description: 'Assets deposited into a high-volume exchange account. AML threshold alert triggered.',
                    isCritical: true
                }
            ]
        }
    },
    {
        id: 3,
        title: 'Phishing Source Link',
        score: 88,
        level: 'High',
        desc: 'Wallet has received assets linked directly to the recent Ledger Connect Kit security breach.',
        action: 'Block Address',
        narrative: {
            caseName: 'Ledger Phishing Forensic',
            vulnerability: 'Social Engineering / Injection',
            totalLoss: '$840k USD',
            blockchain: 'Ethereum / Solana',
            nodes: {
                source: 'Exploit Contract',
                mid: 'Stealer Wallet',
                outcome: 'Offshore Exchange'
            },
            steps: [
                {
                    step: 'Exploit',
                    description: 'Ledger Connect Kit library was injected with malicious code via npm compromise.',
                    isCritical: true
                },
                {
                    step: 'Steal',
                    description: 'Victim signatures manipulated to approve full asset spending to the exploiter address.',
                    isCritical: true
                },
                {
                    step: 'Liquidation',
                    description: 'Solana assets converted to ETH and bridged to an unregulated offshore platform.',
                    isCritical: false
                }
            ]
        }
    }
];
