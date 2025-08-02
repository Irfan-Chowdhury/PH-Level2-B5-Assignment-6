import { Request } from 'express';
// import catchAsync from '../../../shared/catchAsync';
// import sendResponse from '../../../shared/sendResponse';
// import httpStatus from 'http-status';
import { WalletService } from './wallet.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

const addMoney = catchAsync(async (req: Request, res) => {
    const decodeToken = req.user as JwtPayload;
    const result = await WalletService.addMoney(req, decodeToken.userId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Money added successfully',
        data: result,
    });
});

const withdrawMoney = catchAsync(async (req: Request, res) => {
    const decodeToken = req.user as JwtPayload;
    const result = await WalletService.withdrawMoney(req, decodeToken.userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Money withdrawn successfully',
        data: result,
    });
});

const sendMoney = catchAsync(async (req: Request, res) => {
    const decodeToken = req.user as JwtPayload;
    const result = await WalletService.sendMoney(req, decodeToken.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Money sent successfully',
        data: result,
    });
});

const cashIn = catchAsync(async (req: Request, res) => {
    const decodeToken = req.user as JwtPayload;
    const result = await WalletService.cashIn(req, decodeToken.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cash-in successful',
        data: result,
    });
});

const cashOut = catchAsync(async (req: Request, res) => {
    const decodeToken = req.user as JwtPayload;
    const result = await WalletService.cashOut(req, decodeToken.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Cash-out successful',
        data: result,
    });
});

const getMyWallet = catchAsync(async (req: Request, res) => {
    const decodeToken = req.user as JwtPayload;
    const result = await WalletService.getMyWallet(req, decodeToken.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Wallet fetched successfully',
        data: result,
    });
});

const getAllWallet = catchAsync(async (req: Request, res) => {
    const result = await WalletService.getAllWallets();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Wallet fetched successfully',
        data: result,
    });
});

export const WalletController = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    getMyWallet,
    getAllWallet
};
