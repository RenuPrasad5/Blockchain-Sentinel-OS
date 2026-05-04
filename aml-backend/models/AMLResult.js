import mongoose from 'mongoose';

const amlResultSchema = new mongoose.Schema({
  wallet: String,
  anomalyScore: Number,
  riskLevel: String,
  reason: String,
  timestamp: Number
}, { timestamps: true });

export default mongoose.model('AMLResult', amlResultSchema);