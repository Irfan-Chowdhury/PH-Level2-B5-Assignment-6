import { Types } from "mongoose";

export interface ITransaction {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  from?: string;  
  to?: string;    
  amount: number;
  type: 'add-money' | 'withdraw-money' | 'send-money' | 'receive-money' | 'cash-in' | 'cash-out';
  status: 'success' | 'failed';
  timestamp?: Date;
}
