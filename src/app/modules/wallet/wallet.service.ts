import { Request } from 'express';
import httpStatus from "http-status-codes";
// import AppError from '../../../errors/AppError';
import { Wallet } from './wallet.model';
import { User } from '../user/user.model'; // যদি ইউজার চেক লাগে
import { ICashInInfo, ICashOutInfo, ISendMoneyInfo, IWallet, IWithdrawInfo } from './wallet.interface';
// import { Transaction } from '../transaction/transaction.model';
import mongoose, { Types } from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { Transaction } from '../transaction/transaction.model';
import { ITransaction } from '../transaction/transaction.interface';

const addMoney = async (req: Request, userId: string): Promise<{ wallet: IWallet; transaction: ITransaction }> => {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
        wallet = await Wallet.create({
            user: userId,
            balance: 50,
            isBlocked: false,
        });
        // throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    wallet.balance += amount;
    await wallet.save();
    
    let transaction = await Transaction.create({
        user: new Types.ObjectId(userId),
        from:'external-source',  
        to: new Types.ObjectId(userId), 
        type: 'add-money',
        amount,
        status: 'completed',
    });

    return { wallet, transaction };
};

// const withdrawMoney = async (req: Request, userId: string): Promise<{ wallet: IWallet; transaction: ITransaction }> => {
const withdrawMoney = async (req: Request, userId: string): Promise<{ withdrawInfo: IWithdrawInfo }> => {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    wallet.balance -= amount;
    await wallet.save();

    let transaction =  await Transaction.create({
        user: userId,
        from:userId,  
        to: 'external-source', 
        type: 'withdraw-money',
        amount,
        status: 'completed',
    });


    const withdrawInfo: IWithdrawInfo = {
        user: userId,
        wallet: wallet._id,
        transaction: transaction.id,
        type: 'withdraw-money',
        withdrawAmount: transaction.amount,
        RemainingBalance: wallet.balance,
        from: userId,
        to: 'external-source',
        timestamp: transaction.timestamp,
      };

    return { withdrawInfo };
};



const sendMoney = async (req: Request, userId: string): Promise<{sendMoneyInfo : ISendMoneyInfo}> => {
    const { amount, receiverPhone } = req.body;
    const senderId = userId;

    try {
        const senderWallet = await Wallet.findOne({ user: senderId });

        if (!senderWallet || senderWallet.balance < amount) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
        }

        const receiverUser = await User.findOne({ phone: receiverPhone });
        if (!receiverUser) {
            throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
        }

        const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
        if (!receiverWallet) {
            throw new AppError(httpStatus.NOT_FOUND, 'Receiver wallet not found');
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save();
        await receiverWallet.save();

        let transaction = await Transaction.create({
            user: userId,
            from:senderId,
            to: receiverUser._id, 
            type: 'send-money',
            amount,
            status: 'completed',
        });

        const sendMoneyInfo: ISendMoneyInfo = {
            senderWallet: senderWallet._id,
            transaction: transaction._id,
            sender: senderId,
            receiver: receiverUser._id,
            type: 'send-money',
            sendAmount: amount,
            remainingBalance: senderWallet.balance,
            timestamp: transaction.timestamp,
          };
    
        return { sendMoneyInfo };

    } catch (error) {
        throw error;
    }
};



const cashIn = async (req: Request, agentId: string): Promise<{cashInInfo : ICashInInfo}> => {
    const { amount, receiverPhone } = req.body;

    const agentWallet = await Wallet.findOne({ user: agentId });
    if (!agentWallet) {
        throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    } 

    const receiverUser = await User.findOne({ phone: receiverPhone });
    if (!receiverUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
    }
    const receiverWallet = await Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet) {
        throw new AppError(httpStatus.NOT_FOUND, 'Receiver wallet not found');
    }

    if (!agentWallet || agentWallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }


    agentWallet.balance -= amount;
    await agentWallet.save();

    receiverWallet.balance += amount;
    await receiverWallet.save();

    let transaction = await Transaction.create({
        user: agentId,
        from: agentId,
        to: receiverUser._id, 
        type: 'cash-in',
        amount,
        status: 'completed',
    });


    const cashInInfo: ICashInInfo = {
        agentWallet: agentWallet._id,
        transaction: transaction._id,
        sender_agent: agentId,
        receiver_user: receiverUser._id,
        type: 'cash-in',
        sendAmount: amount,
        remainingBalance: agentWallet.balance,
        timestamp: transaction.timestamp,
    };


    return { cashInInfo };
};


const cashOut = async (req: Request, userId: string): Promise<{cashOutInfo : ICashOutInfo}> => {
    const { amount, userPhone } = req.body;
    const agentId = userId;

    try {

        const user = await User.findOne({ phone: userPhone });
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
        }

        const userWallet = await Wallet.findOne({ user: user._id });
        if (!userWallet || userWallet.balance < amount) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
        }

        const agentWallet = await Wallet.findOne({ user: agentId });
        if (!agentWallet) {
            throw new AppError(httpStatus.NOT_FOUND, 'Agent wallet not found');
        }

        userWallet.balance -= amount;
        await userWallet.save();

        agentWallet.balance += amount;
        await agentWallet.save();

        let transaction = await Transaction.create({
            user: agentId,
            from:user._id,
            to: agentId,
            type: 'cash-out',
            amount,
            status: 'completed',
        });

        const cashOutInfo: ICashOutInfo = {
            agentWallet: userWallet._id,
            transaction: transaction._id,
            sender_user: user._id,
            receiver_agent: agentId,
            type: 'cash-out',
            sendAmount: amount,
            remainingBalance: agentWallet.balance,
            timestamp: transaction.timestamp,
          };
    
        return { cashOutInfo };

    } catch (error) {
        throw error;
    }
};




const getMyWallet = async (req: Request, userId: string): Promise<IWallet | null> => {
    const wallet = await Wallet.findOne({ user: userId });
    return wallet;
};


const getAllWallets = async () => {
    const wallets = await Wallet.find({});
    const totalwallets = await Wallet.countDocuments();

    return {
        data: wallets,
        meta: {
            total: totalwallets
        }
    };
}

const blockWallet = async (walletId: string): Promise<IWallet> => {
    const wallet = await Wallet.findOneAndUpdate(
      { _id: walletId },
      { isBlocked: true },
      { new: true }
    );
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    return wallet;
  };
  

const unBlockWallet = async (walletId: string): Promise<IWallet> => {
    const wallet = await Wallet.findOneAndUpdate(
      { _id: walletId },
      { isBlocked: false },
      { new: true }
    );
    if (!wallet) throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    return wallet;
  };
  

export const WalletService = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    getMyWallet,
    getAllWallets,
    blockWallet,
    unBlockWallet
};
