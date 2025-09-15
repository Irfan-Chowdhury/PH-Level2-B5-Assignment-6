import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
// import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
// import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";
import { Transaction } from "../transaction/transaction.model";
import { User } from "../user/user.model";


const getDashboardStats = async () => {
    // Count Users & Agents separately
    const userCounts = await User.aggregate([
        { $match: { role: { $in: ["USER", "AGENT"] } } },
        {
        $group: {
            _id: "$role",
            total: { $sum: 1 },
        },
        },
    ]);

    // Convert array → object like Laravel pluck
    const roleCounts: Record<string, number> = {};
    userCounts.forEach((item) => {
        roleCounts[item._id] = item.total;
    });

    // Transactions stats
    const stats = await Transaction.aggregate([
        {
        $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalVolume: { $sum: "$amount" },
        },
        },
    ]);

    const result = {
        totalUsers: roleCounts["USER"] || 0,
        totalAgents: roleCounts["AGENT"] || 0,
        totalTransactions: stats[0]?.totalTransactions || 0,
        totalVolume: stats[0]?.totalVolume || 0,
    };

    return {
        data: result,
    };
    
};


const getAllTransactions = async () => {

    const transactions = await Transaction.find({
        type: { $in: ["cash-in", "cash-out"] },
    });

    const totalTransactions = await Transaction.countDocuments({
        type: { $in: ["cash-in", "cash-out"] },
    });

    return {
        data: transactions,
        meta: {
            total: totalTransactions,
        },
    };
};

const getAllListing = async () => {
    // const users = await User.find(
    //     { role: { $in: ["USER", "AGENT"] } },     // whereIn equivalent
    //     { _id: 1, name: 1, role: 1, createdAt: 1 } // select fields
    //   )
    //     .populate({
    //       path: "wallet",
    //       select: "_id user balance isBlocked createdAt updatedAt"
    //     })
    //     .exec();

    const users = await User.aggregate([
        {
          $match: { role: { $in: ["USER", "AGENT"] } }
        },
        {
          $project: { _id: 1, name: 1, role: 1, createdAt: 1 }
        },
        {
          $lookup: {
            from: "wallets", // collection name
            localField: "_id",
            foreignField: "user",
            as: "wallet"
          }
        },
        {
          $unwind: { path: "$wallet", preserveNullAndEmptyArrays: true }
        }
      ]);

    return {
        data: users,
    };
};

// const createUser = async (payload: Partial<IUser>) => {

//     const { email, password, role, ...rest } = payload;

//     const isUserExist = await User.findOne({ email });

//     if (isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
//     }

//     const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

//     const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

//     const user = await User.create({
//         role,
//         email,
//         password: hashedPassword,
//         auths: [authProvider],
//         ...rest
//     })

//     if (user.role === Role.USER || user.role === Role.AGENT) {
//         await Wallet.create({
//             user: user._id,
//             balance: 50,
//             isBlocked: false,
//         });
//     }

//     return user;
// }


// const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

//     const ifUserExist = await User.findById(userId);

//     if (!ifUserExist) {
//         throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
//     }

//     /**
//      * email - can not update
//      * name, phone, password address
//      * password - re hashing
//      *  only admin superadmin - role, isDeleted...
//      * 
//      * promoting to superadmin - superadmin
//      */

//     if (payload.role) {
//         if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//         }

//         if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//         }
//     }

//     if (payload.isActive || payload.isDeleted || payload.isVerified) {
//         if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
//             throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
//         }
//     }

//     if (payload.password) {
//         payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
//     }

//     const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

//     return newUpdatedUser
// }


// const getAllUsers = async () => {
//     const users = await User.find({ role: 'USER' }); // 🔍 filter here
//     const totalUsers = await User.countDocuments({ role: 'USER' }); // 🔍 same filter

//     return {
//         data: users,
//         meta: {
//             total: totalUsers,
//         },
//     };
// };


// const getAllAgents = async () => {
//     const agents = await User.find({ role: 'AGENT' }); // 🔍 filter here
//     const totalUsers = await User.countDocuments({ role: 'USER' }); // 🔍 same filter

//     return {
//         data: agents,
//         meta: {
//             total: totalUsers,
//         },
//     };
// };


// const updateAgentStatus = async (
//     agentId: string,
//     isActive: 'ACTIVE' | 'INACTIVE'
// ): Promise<IUser> => {
//     const agent = await User.findOneAndUpdate(
//         { _id: agentId, role: 'AGENT' },
//         { isActive:isActive },
//         { new: true }
//     );
//     if (!agent) throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
//     return agent;
// };



export const AdminService = {
    getAllTransactions,
    getAllListing,
    getDashboardStats
    // getAllUsers,
    // getAllAgents,
    // updateAgentStatus
}