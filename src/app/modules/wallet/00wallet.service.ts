import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.interface";
import { Types } from "mongoose";

// const getMyWallet = async (userId: Types.ObjectId) => {
const getMyWallet = async (payload: Partial<IWallet>, userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new Error("Wallet not found");
  }
  return wallet;
};

const getWalletByUserId = async (userId: string) => {
  const wallet = await Wallet.findOne({ user: userId });
  return wallet;
};

const updateWallet = async (id: string, payload: Partial<IWallet>) => {
  const updated = await Wallet.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const blockWallet = async (id: string) => {
  const wallet = await Wallet.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  return wallet;
};

const unblockWallet = async (id: string) => {
  const wallet = await Wallet.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
  return wallet;
};

export const WalletService = {
  getMyWallet,
  getWalletByUserId,
  updateWallet,
  blockWallet,
  unblockWallet,
};
