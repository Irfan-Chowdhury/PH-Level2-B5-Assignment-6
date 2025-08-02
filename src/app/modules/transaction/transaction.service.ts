import { Transaction } from './transaction.model';
import { ITransaction } from './transaction.interface';

const createTransaction = async (data: ITransaction): Promise<ITransaction> => {
  const transaction = await Transaction.create(data);
  return transaction;
};

const getMyTransactions = async (userId: string) => {
  const transactions = await Transaction.find({
    $or: [
      { from: userId, to: { $ne: userId } },
      { to: userId, from: { $ne: userId } }
    ]
  }).sort({ createdAt: -1 });

  return transactions;
};



const getAllTransactions = async () => {
    const transactions = await Transaction.find({});
    const totalTransactions = await Transaction.countDocuments();

    return {
        data: transactions,
        meta: {
            total: totalTransactions
        }
    };
}

export const TransactionService = {
  createTransaction,
  getMyTransactions,
  getAllTransactions
};
