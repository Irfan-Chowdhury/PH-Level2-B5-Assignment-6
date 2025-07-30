import { Request } from 'express';
import httpStatus from "http-status-codes";
// import AppError from '../../../errors/AppError';
import { Wallet } from './wallet.model';
import { User } from '../user/user.model'; // যদি ইউজার চেক লাগে
import { IWallet } from './wallet.interface';
// import { Transaction } from '../transaction/transaction.model';
import mongoose from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { Transaction } from '../transaction/transaction.model';

const addMoney = async (req: Request, userId: string): Promise<IWallet> => {
    const { amount } = req.body;

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        wallet = await Wallet.create({
            user: userId,
            // from:'external-source',  
            // to: userId, 
            balance: 50,
            isBlocked: false,
        });
        // throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
        user: userId,
        from:'external-source',  
        to: userId, 
        type: 'add-money',
        amount,
        status: 'success',
    });

    return wallet;
};

const withdrawMoney = async (req: Request, userId: string): Promise<IWallet> => {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
        user: userId,
        from:userId,  
        to: 'external-source', 
        type: 'withdraw-money',
        amount,
        status: 'success',
    });

    return wallet;
};

const sendMoney = async (req: Request, userId: string): Promise<IWallet> => {
    const { amount, receiverPhone } = req.body;
    const senderId = userId;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const senderWallet = await Wallet.findOne({ user: senderId }).session(session);
        if (!senderWallet || senderWallet.balance < amount) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
        }

        const receiverUser = await User.findOne({ phone: receiverPhone });
        if (!receiverUser) {
            throw new AppError(httpStatus.NOT_FOUND, 'Receiver not found');
        }

        const receiverWallet = await Wallet.findOne({ user: receiverUser._id }).session(session);
        if (!receiverWallet) {
            throw new AppError(httpStatus.NOT_FOUND, 'Receiver wallet not found');
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        await Transaction.create(
                {
                    user: userId,
                    from:senderId,
                    to: receiverUser._id, 
                    type: 'send-money',
                    amount,
                    status: 'success',
                },
                // {
                //     user: receiverUser._id,
                //     type: 'receive-money',
                //     amount,
                //     status: 'success',
                // },
            
            { session }
        );

        // await Transaction.create({
        //     user: userId,
        //     from:senderId,
        //     to: receiverUser._id, 
        //     type: 'send-money',
        //     amount,
        //     status: 'success',
        // });

        await session.commitTransaction();
        session.endSession();

        return senderWallet;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const cashIn = async (req: Request, userId: string): Promise<IWallet> => {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }

    wallet.balance += amount;
    await wallet.save();

    await Transaction.create({
        user: userId,
        type: 'cash_in',
        amount,
        status: 'completed',
    });

    return wallet;
};

const cashOut = async (req: Request, userId: string): Promise<IWallet> => {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    wallet.balance -= amount;
    await wallet.save();

    await Transaction.create({
        user: userId,
        type: 'cash_out',
        amount,
        status: 'completed',
    });

    return wallet;
};

const getMyWallet = async (req: Request, userId: string): Promise<IWallet | null> => {
    const wallet = await Wallet.findOne({ user: userId });
    return wallet;
};

export const WalletService = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    getMyWallet,
};
