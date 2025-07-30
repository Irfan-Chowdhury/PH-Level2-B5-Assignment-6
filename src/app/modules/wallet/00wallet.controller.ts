import { Request, Response } from "express";
import { WalletService } from "./wallet.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
    const decodeToken = req.user as JwtPayload
    
//   const user = req.user;
//   const result = await WalletService.getMyWallet(User._id);
  const result = await WalletService.getMyWallet(req.body, decodeToken.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My wallet retrieved successfully",
    data: result,
  });
});

const blockWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.blockWallet(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet blocked",
    data: result,
  });
});

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.unblockWallet(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet unblocked",
    data: result,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletService.updateWallet(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Wallet updated",
    data: result,
  });
});

export const WalletController = {
  getMyWallet,
  blockWallet,
  unblockWallet,
  updateWallet,
};
