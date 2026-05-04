import mongoose from 'mongoose';

const walletCacheSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    data: {
        type: Object,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const WalletCache = mongoose.model('WalletCache', walletCacheSchema);

export default WalletCache;