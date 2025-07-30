import { Types } from "mongoose";

export interface ITransaction {
  user: Types.ObjectId;
  from?: string;  
  to?: string;    
  amount: number;
  type: 'add-money' | 'withdraw-money' | 'send-money' | 'receive-money';
  status: 'success' | 'failed';
  timestamp?: Date;
}
