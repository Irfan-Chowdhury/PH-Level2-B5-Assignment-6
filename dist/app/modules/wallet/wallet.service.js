"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// import AppError from '../../../errors/AppError';
const wallet_model_1 = require("./wallet.model");
const user_model_1 = require("../user/user.model"); // যদি ইউজার চেক লাগে
// import { Transaction } from '../transaction/transaction.model';
const mongoose_1 = require("mongoose");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_model_1 = require("../transaction/transaction.model");
const addMoney = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    let wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        wallet = yield wallet_model_1.Wallet.create({
            user: userId,
            balance: 50,
            isBlocked: false,
        });
        // throw new AppError(httpStatus.NOT_FOUND, 'Wallet not found');
    }
    wallet.balance += amount;
    yield wallet.save();
    let transaction = yield transaction_model_1.Transaction.create({
        user: new mongoose_1.Types.ObjectId(userId),
        from: 'external-source',
        to: new mongoose_1.Types.ObjectId(userId),
        type: 'add-money',
        amount,
        status: 'completed',
    });
    return { wallet, transaction };
});
// const withdrawMoney = async (req: Request, userId: string): Promise<{ wallet: IWallet; transaction: ITransaction }> => {
const withdrawMoney = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Insufficient balance');
    }
    wallet.balance -= amount;
    yield wallet.save();
    let transaction = yield transaction_model_1.Transaction.create({
        user: userId,
        from: userId,
        to: 'external-source',
        type: 'withdraw-money',
        amount,
        status: 'completed',
    });
    const withdrawInfo = {
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
});
const sendMoney = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, receiverPhone } = req.body;
    const senderId = userId;
    try {
        const senderWallet = yield wallet_model_1.Wallet.findOne({ user: senderId });
        if (!senderWallet || senderWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Insufficient balance');
        }
        const receiverUser = yield user_model_1.User.findOne({ phone: receiverPhone });
        if (!receiverUser) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Receiver not found');
        }
        const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverUser._id });
        if (!receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Receiver wallet not found');
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        yield senderWallet.save();
        yield receiverWallet.save();
        let transaction = yield transaction_model_1.Transaction.create({
            user: userId,
            from: senderId,
            to: receiverUser._id,
            type: 'send-money',
            amount,
            status: 'completed',
        });
        const sendMoneyInfo = {
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
    }
    catch (error) {
        throw error;
    }
});
const cashIn = (req, agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, receiverPhone } = req.body;
    const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agentId });
    if (!agentWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Wallet not found');
    }
    const receiverUser = yield user_model_1.User.findOne({ phone: receiverPhone });
    if (!receiverUser) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Receiver not found');
    }
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ user: receiverUser._id });
    if (!receiverWallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Receiver wallet not found');
    }
    if (!agentWallet || agentWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Insufficient balance');
    }
    agentWallet.balance -= amount;
    yield agentWallet.save();
    receiverWallet.balance += amount;
    yield receiverWallet.save();
    let transaction = yield transaction_model_1.Transaction.create({
        user: agentId,
        from: agentId,
        to: receiverUser._id,
        type: 'cash-in',
        amount,
        status: 'completed',
    });
    const cashInInfo = {
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
});
// const cashOut = async (req: Request, userId: string): Promise<IWallet> => {
//     const { amount } = req.body;
//     const wallet = await Wallet.findOne({ user: userId });
//     if (!wallet || wallet.balance < amount) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
//     }
//     wallet.balance -= amount;
//     await wallet.save();
//     await Transaction.create({
//         user: userId,
//         type: 'cash_out',
//         amount,
//         status: 'completed',
//     });
//     return wallet;
// };
const cashOut = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, userPhone } = req.body;
    const agentId = userId;
    try {
        const user = yield user_model_1.User.findOne({ phone: userPhone });
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Receiver not found');
        }
        const userWallet = yield wallet_model_1.Wallet.findOne({ user: user._id });
        if (!userWallet || userWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Insufficient balance');
        }
        const agentWallet = yield wallet_model_1.Wallet.findOne({ user: agentId });
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Agent wallet not found');
        }
        userWallet.balance -= amount;
        yield userWallet.save();
        agentWallet.balance += amount;
        yield agentWallet.save();
        let transaction = yield transaction_model_1.Transaction.create({
            user: agentId,
            from: user._id,
            to: agentId,
            type: 'cash-out',
            amount,
            status: 'completed',
        });
        const cashOutInfo = {
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
    }
    catch (error) {
        throw error;
    }
});
const getMyWallet = (req, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    return wallet;
});
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find({});
    const totalwallets = yield wallet_model_1.Wallet.countDocuments();
    return {
        data: wallets,
        meta: {
            total: totalwallets
        }
    };
});
const blockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ _id: walletId }, { isBlocked: true }, { new: true });
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Wallet not found');
    return wallet;
});
const unBlockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOneAndUpdate({ _id: walletId }, { isBlocked: false }, { new: true });
    if (!wallet)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Wallet not found');
    return wallet;
});
exports.WalletService = {
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
