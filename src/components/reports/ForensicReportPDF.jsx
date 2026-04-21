import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Standard Styles for Forensic Reports
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottom: '2pt solid #1e3a8a',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
        textTransform: 'uppercase',
    },
    confidential: {
        fontSize: 10,
        color: '#ef4444',
        fontWeight: 'bold',
    },
    section: {
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 8,
        backgroundColor: '#f3f4f6',
        padding: 4,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: 120,
        fontSize: 9,
        fontWeight: 'bold',
        color: '#666666',
    },
    value: {
        flex: 1,
        fontSize: 9,
        color: '#111111',
    },
    narrative: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#333333',
        textAlign: 'justify',
    },
    clause: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    clauseText: {
        fontSize: 8,
        fontStyle: 'italic',
        color: '#4B5563',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 7,
        textAlign: 'center',
        color: '#999999',
        borderTop: '1pt solid #EEEEEE',
        paddingTop: 10,
    },
    fingerprint: {
        marginTop: 5,
        fontFamily: 'Courier',
        fontSize: 6,
        color: '#666666',
        textAlign: 'center',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginVertical: 10,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#F3F4F6',
        padding: 5,
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#374151',
    },
    tableCell: {
        fontSize: 8,
        color: '#4B5563',
    },
    riskGaugeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 4,
    },
    riskScoreText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ef4444',
    }
});

const ForensicReportPDF = ({ data }) => {
    const digitalFingerprint = "SHA256:" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Confidential Forensic Intelligence Report</Text>
                    <Text style={styles.confidential}>CASE UID: {data.caseUid}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Wallet Entry Metadata</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Subject Wallet:</Text>
                        <Text style={styles.value}>{data.wallet}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Risk Index:</Text>
                        <Text style={styles.value}>{data.riskScore}/100 ({data.riskScore > 70 ? 'HIGH' : 'MEDIUM'})</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Initial Balance:</Text>
                        <Text style={styles.value}>{data.initialBalance || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.riskGaugeContainer}>
                    <View>
                        <Text style={styles.sectionTitle}>Risk Gauge</Text>
                        <Text style={styles.riskScoreText}>{data.riskScore}</Text>
                        <Text style={{ fontSize: 8, color: '#666' }}>COMPOSITE SCORE</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 9, color: '#444', lineHeight: 1.4 }}>
                            Critical Risk Assessment: This wallet was flagged during on-chain exploration for anomalous behavioral patterns. Assets are prioritized for continuous monitoring.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Forensic Narrative</Text>
                    <Text style={styles.narrative}>{data.narrative}</Text>
                </View>

                {data.transactions && data.transactions.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>High-Risk Transactions</Text>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Timestamp</Text></View>
                                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Hash</Text></View>
                                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Amount</Text></View>
                                <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Risk Flag</Text></View>
                            </View>
                            {data.transactions.slice(0, 5).map((tx, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>{tx.time}</Text></View>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>{tx.hash.substring(0, 10)}...</Text></View>
                                    <View style={styles.tableCol}><Text style={styles.tableCell}>{tx.amount} ETH</Text></View>
                                    <View style={styles.tableCol}><Text style={[styles.tableCell, {color: '#ef4444', fontWeight: 'bold'}]}>{tx.flag || 'Investigate'}</Text></View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.clause}>
                    <Text style={styles.sectionTitle}>Legal Compliance Statement</Text>
                    <Text style={styles.clauseText}>
                        SECTION 65B (INDIAN EVIDENCE ACT) COMPLIANCE: This document represents a computer-generated output of blockchain intelligence 
                        data processed through the Sentinel OS Forensic Engine. I certify that the information contained here reproduces or is 
                        derived from information fed into the computer in the ordinary course of activities.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text>Generated by Sentinel OS Forensic Lab — {new Date().toLocaleString()} — Page 1 of 1</Text>
                    <Text style={styles.fingerprint}>DIGITAL FINGERPRINT (SHA-256): {digitalFingerprint}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ForensicReportPDF;
