"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: String },
    to: { type: String },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['add-money', 'withdraw-money', 'send-money', "receive-money", "cash-in", "cash-out"],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'reversed'],
        default: 'completed',
    },
    timestamp: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
