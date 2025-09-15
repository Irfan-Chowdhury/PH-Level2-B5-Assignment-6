import { NextFunction, Request, Response } from "express";
// import { User } from "./user.model";
import httpStatus from "http-status-codes";
// import { UserService } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { AdminService } from "./admin.service";



const getDashboardData = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getDashboardStats();

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.OK,
        message: "All dashboard data retrieve Successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllTransactions();

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.OK,
        message: "All transactions retrieve Successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getAllListing = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await AdminService.getAllListing();

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.OK,
        message: "All Listing retrieve Successfully",
        data: result.data,
    });
});


export const AdminController = {
    getAllTransactions,
    getAllListing,
    getDashboardData
}


