import { Schema, model } from 'mongoose';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
      enum: ['success', 'failed'],
      default: 'success',
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
