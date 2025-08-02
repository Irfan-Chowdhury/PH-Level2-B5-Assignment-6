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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const wallet_model_1 = require("./wallet.model");
// const getMyWallet = async (userId: Types.ObjectId) => {
const getMyWallet = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!wallet) {
        throw new Error("Wallet not found");
    }
    return wallet;
});
const getWalletByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ user: userId });
    return wallet;
});
const updateWallet = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield wallet_model_1.Wallet.findByIdAndUpdate(id, payload, { new: true });
    return updated;
});
const blockWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    return wallet;
});
const unblockWallet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    return wallet;
});
exports.WalletService = {
    getMyWallet,
    getWalletByUserId,
    updateWallet,
    blockWallet,
    unblockWallet,
};
