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



// const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
//     const user = await UserService.createUser(req.body);

//     sendResponse(res, {
//         success : true,
//         statusCode: httpStatus.CREATED,
//         message: "User Created Successfully",
//         data: user
//     });
// });

// const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const userId = req.params.id;
//     const verifiedToken = req.user;

//     const payload = req.body;
//     const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload)


//     sendResponse(res, {
//         success: true,
//         statusCode: httpStatus.CREATED,
//         message: "User Updated Successfully",
//         data: user,
//     })
// })

// const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const result = await UserService.getAllUsers();

//     sendResponse(res, {
//         success : true,
//         statusCode: httpStatus.OK,
//         message: "All users retrieve Successfully",
//         data: result.data,
//         meta: result.meta,
//     });
// });

// const getAllAgents = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const result = await UserService.getAllAgents();

//     sendResponse(res, {
//         success : true,
//         statusCode: httpStatus.OK,
//         message: "All users retrieve Successfully",
//         data: result.data,
//         meta: result.meta,
//     });
// });


// const approveAgent = catchAsync(async (req: Request, res) => {
//     const { agentId } = req.params;
//     const result = await UserService.updateAgentStatus(agentId, 'ACTIVE');
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Agent approved successfully',
//       data: result,
//     });
//   });
  
//   const suspendAgent = catchAsync(async (req: Request, res) => {
//     const { agentId } = req.params;
//     const result = await UserService.updateAgentStatus(agentId, 'INACTIVE');
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: 'Agent suspended successfully',
//       data: result,
//     });
//   });

  

export const AdminController = {
    getAllTransactions,
    getAllListing,
    getDashboardData
    // updateUser,
    // getAllUsers,
    // getAllAgents,
    // approveAgent,
    // suspendAgent,
}


// route matching --> controller --> service --> model --> DB