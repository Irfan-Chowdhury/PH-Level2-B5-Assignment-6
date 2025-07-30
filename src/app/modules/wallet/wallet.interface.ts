import { Types } from "mongoose";

export interface IWallet {
  user: Types.ObjectId;
//   from?: string | Types.ObjectId;  
//   to?: string | Types.ObjectId;   
  balance: number;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
