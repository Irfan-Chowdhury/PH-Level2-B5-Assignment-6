"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = require("../user/user.model");
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Count Users & Agents separately
    const userCounts = yield user_model_1.User.aggregate([
        { $match: { role: { $in: ["USER", "AGENT"] } } },
        {
            $group: {
                _id: "$role",
                total: { $sum: 1 },
            },
        },
    ]);
    // Convert array → object like Laravel pluck
    const roleCounts = {};
    userCounts.forEach((item) => {
        roleCounts[item._id] = item.total;
    });
    // Transactions stats
    const stats = yield transaction_model_1.Transaction.aggregate([
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
        totalTransactions: ((_a = stats[0]) === null || _a === void 0 ? void 0 : _a.totalTransactions) || 0,
        totalVolume: ((_b = stats[0]) === null || _b === void 0 ? void 0 : _b.totalVolume) || 0,
    };
    return {
        data: result,
    };
});
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({
        type: { $in: ["cash-in", "cash-out"] },
    });
    const totalTransactions = yield transaction_model_1.Transaction.countDocuments({
        type: { $in: ["cash-in", "cash-out"] },
    });
    return {
        data: transactions,
        meta: {
            total: totalTransactions,
        },
    };
});
const getAllListing = () => __awaiter(void 0, void 0, void 0, function* () {
    // const users = await User.find(
    //     { role: { $in: ["USER", "AGENT"] } },     // whereIn equivalent
    //     { _id: 1, name: 1, role: 1, createdAt: 1 } // select fields
    //   )
    //     .populate({
    //       path: "wallet",
    //       select: "_id user balance isBlocked createdAt updatedAt"
    //     })
    //     .exec();
    const users = yield user_model_1.User.aggregate([
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
});
exports.AdminService = {
    getAllTransactions,
    getAllListing,
    getDashboardStats
};
