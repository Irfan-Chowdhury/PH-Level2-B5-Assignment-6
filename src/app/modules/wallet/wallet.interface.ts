import { Types } from "mongoose";

export interface IWallet {
  // _id?: Types.ObjectId;
  user: Types.ObjectId;
//   from?: string | Types.ObjectId;  
//   to?: string | Types.ObjectId;   
  balance: number;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IWithdrawInfo {
  user: string | Types.ObjectId;
  wallet: string | Types.ObjectId;
  transaction: string | Types.ObjectId;
  type: 'withdraw-money';
  withdrawAmount: number;
  RemainingBalance: number;
  from: string;
  to: string;
  timestamp?: Date;
}

export interface ISendMoneyInfo {
  senderWallet: string | Types.ObjectId;
  transaction: string | Types.ObjectId;
  sender: string | Types.ObjectId;    // ✅ allow ObjectId
  receiver: string | Types.ObjectId;
  type: 'send-money';
  sendAmount: number;
  remainingBalance: number;
  timestamp?: Date;
}

export interface ICashInInfo {
  agentWallet: string | Types.ObjectId;
  transaction: string | Types.ObjectId;
  agent: string | Types.ObjectId;    // ✅ allow ObjectId
  receiver: string | Types.ObjectId;
  type: 'cash-in';
  sendAmount: number;
  remainingBalance: number;
  timestamp?: Date;
}
