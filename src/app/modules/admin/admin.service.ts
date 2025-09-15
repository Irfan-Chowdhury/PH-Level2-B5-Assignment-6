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

export const AdminService = {
    getAllTransactions,
    getAllListing,
    getDashboardStats
}