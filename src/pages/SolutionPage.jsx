import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, Briefcase, LineChart, Cpu, ShieldCheck, Scale, CheckCircle2, ArrowRight, Activity } from 'lucide-react';

const solutionData = {
    'government': {
        title: 'Government Agencies & Regulators',
        subtitle: 'National security, oversight, and sovereign blockchain intelligence.',
        icon: <ShieldAlert size={40} className="text-emerald-500" />,
        useCases: ['National Security Threat Monitoring', 'Cross-border AML tracking', 'Sanctions Evasion Detection'],
        workflow: '1. Monitor national mempool traffic -> 2. Flag high-risk wallets -> 3. Generate automated intelligence reports',
        investigation: 'Tracing state-sponsored cyber warfare funds moving through decentralized mixers.',
        compliance: 'Aligns with FATF Travel Rule and global AML standards for sovereign entities.',
        theme: 'emerald'
    },
    'law-enforcement': {
        title: 'Law Enforcement Divisions',
        subtitle: 'Cybercrime investigation and crypto forensics operating system.',
        icon: <ShieldCheck size={40} className="text-blue-500" />,
        useCases: ['Ransomware Payment Tracing', 'Dark Web Market Takedowns', 'Stolen Asset Recovery'],
        workflow: '1. Input suspect wallet -> 2. Run multi-hop trace -> 3. Identify fiat off-ramps -> 4. Subpoena exchanges',
        investigation: 'Mapping a 3-hop money laundering topology from a known ransomware group to an offshore exchange.',
        compliance: 'Generates court-admissible PDF intelligence dossiers with cryptographic hashing.',
        theme: 'blue'
    },
    'ca-firms': {
        title: 'CA Firms & Tax Auditors',
        subtitle: 'Crypto taxation, compliance auditing, and forensic accounting.',
        icon: <Briefcase size={40} className="text-indigo-500" />,
        useCases: ['PMLA Compliance Audits', 'VDA Tax Liability Calculations', 'DeFi Yield Accounting'],
        workflow: '1. Import client wallet -> 2. Auto-classify trades vs. income -> 3. Export India compliance tax report',
        investigation: 'Auditing a corporate treasury to ensure no interactions with sanctioned smart contracts.',
        compliance: 'Pre-configured for Indian VDA Tax Rules (1% TDS, 30% Tax) and PMLA reporting.',
        theme: 'indigo'
    },
    'financial': {
        title: 'Financial Institutions & Banks',
        subtitle: 'VASP integration, risk mitigation, and institutional crypto compliance.',
        icon: <LineChart size={40} className="text-emerald-400" />,
        useCases: ['VASP Risk Scoring', 'Customer Deposit Screening', 'Liquidity Pool Auditing'],
        workflow: '1. Intercept inbound crypto deposit -> 2. Run real-time risk engine -> 3. Freeze or accept transaction',
        investigation: 'Assessing the counterparty risk of a decentralized lending protocol before committing institutional capital.',
        compliance: 'Enterprise API access for automated high-volume transaction screening.',
        theme: 'emerald'
    },
    'enterprise': {
        title: 'Enterprise Security Teams',
        subtitle: 'Internal treasury monitoring and corporate blockchain defense.',
        icon: <Cpu size={40} className="text-rose-500" />,
        useCases: ['Corporate Treasury Defense', 'Employee Wallet Monitoring', 'Smart Contract Risk Analysis'],
        workflow: '1. Setup 24/7 autonomous sentinels -> 2. Detect unauthorized multi-sig movements -> 3. Trigger immediate lockdown',
        investigation: 'Tracing funds leaked from a compromised corporate multi-sig wallet across bridges.',
        compliance: 'Internal audit trails and SOX-compliant reporting structures.',
        theme: 'rose'
    }
};

const SolutionPage = () => {
    const { id } = useParams();
    const data = solutionData[id];

    if (!data) {
        return (
            <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 text-white flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Solution Not Found</h1>
                <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                    <ArrowRight size={16} className="rotate-180" /> Return to Intelligence Hub
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-2xl bg-${data.theme}-500/10 border border-${data.theme}-500/20`}>
                            {data.icon}
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        {data.subtitle}
                    </p>
                </div>

                {/* Core Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    
                    {/* Primary Use Cases */}
                    <div className="glass p-8 rounded-2xl border border-slate-700/50">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
                            <Briefcase size={20} className={`text-${data.theme}-500`} />
                            Primary Intelligence Use Cases
                        </h3>
                        <ul className="space-y-4">
                            {data.useCases.map((uc, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                    <CheckCircle2 size={18} className={`text-${data.theme}-500 mt-1 shrink-0`} />
                                    <span>{uc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Investigation Workflow */}
                    <div className="glass p-8 rounded-2xl border border-slate-700/50">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
                            <Activity size={20} className={`text-${data.theme}-500`} />
                            Standard Operating Workflow
                        </h3>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-slate-300 text-sm font-mono leading-relaxed">
                            {data.workflow.split('->').map((step, i) => (
                                <div key={i} className="mb-2 last:mb-0">
                                    <span className={`text-${data.theme}-400 mr-2`}>&gt;</span>
                                    {step.trim()}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Deep Dive Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800/80">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-200">
                            <ShieldAlert size={20} className="text-rose-500" />
                            Forensic Investigation Example
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            {data.investigation}
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-800/80">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-200">
                            <Scale size={20} className="text-blue-500" />
                            Regulatory & Compliance Alignment
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            {data.compliance}
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12 pt-8 border-t border-slate-800">
                    <Link to="/tools/analyzer" className={`inline-flex items-center gap-2 bg-${data.theme}-600 hover:bg-${data.theme}-500 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg shadow-${data.theme}-500/20`}>
                        Initialize Investigation Environment <ArrowRight size={18} />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default SolutionPage;
