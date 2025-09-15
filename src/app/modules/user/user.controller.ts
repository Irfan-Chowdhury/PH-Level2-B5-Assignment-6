import { NextFunction, Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { UserService } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";



const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const user = await UserService.createUser(req.body);

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data: user
    });
});

const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string, envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user;

    const payload = req.body;
    const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload)

    // res.status(httpStatus.CREATED).json({
    //     message: "User Created Successfully",
    //     user
    // })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Updated Successfully",
        data: user,
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.OK,
        message: "All users retrieve Successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getAllAgents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.getAllAgents();

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.OK,
        message: "All users retrieve Successfully",
        data: result.data,
        meta: result.meta,
    });
});


const approveAgent = catchAsync(async (req: Request, res) => {
    const { agentId } = req.params;
    const result = await UserService.updateAgentStatus(agentId, 'ACTIVE');
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Agent approved successfully',
      data: result,
    });
  });
  
  const suspendAgent = catchAsync(async (req: Request, res) => {
    const { agentId } = req.params;
    const result = await UserService.updateAgentStatus(agentId, 'INACTIVE');
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Agent suspended successfully',
      data: result,
    });
  });


  const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const result = await UserService.getProfile(userId);

    sendResponse(res, {
        success : true,
        statusCode: httpStatus.OK,
        message: "Profile retrieve Successfully",
        data: result.data,
    });
});

  

export const UserController = {
    createUser,
    updateUser,
    getAllUsers,
    getAllAgents,
    approveAgent,
    suspendAgent,
    getProfile
}


// route matching --> controller --> service --> model --> DB