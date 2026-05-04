import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    riskScore: {
        type: Number,
        required: true,
    },
    riskLevel: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low'],
    },
    mode: {
        type: String,
        required: true,
        enum: ['live', 'history'],
    },
    notes: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        default: [],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

const Case = mongoose.model('Case', CaseSchema);
export default Case;
