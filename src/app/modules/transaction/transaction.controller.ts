import { Request, Response } from 'express';
import { TransactionService } from './transaction.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

export const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload

  const result = await TransactionService.getMyTransactions(decodeToken.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'The Transaction history fetched successfully!',
    data: result,
  });
});

export const getAllTransactions = catchAsync(async (req: Request, res: Response) => {

  const result = await TransactionService.getAllTransactions();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All Transaction history fetched successfully!',
    data: result,
  });
});
