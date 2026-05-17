import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    eventType: { type: String, required: true },
    walletAddress: { type: String },
    caseId: { type: String },
    timestamp: { type: Date, default: Date.now },
    investigatorId: { type: String, required: true },
    actionSummary: { type: String, required: true },
    riskLevel: { type: String }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
