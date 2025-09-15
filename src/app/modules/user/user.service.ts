import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "../wallet/wallet.model";


const createUser = async (payload: Partial<IUser>) => {

    const { email, password, role, ...rest } = payload;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        role,
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    if (user.role === Role.USER || user.role === Role.AGENT) {
        await Wallet.create({
            user: user._id,
            balance: 50,
            isBlocked: false,
        });
    }

    return user;
}


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin superadmin - role, isDeleted...
     * 
     * promoting to superadmin - superadmin
     */

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}


const getAllUsers = async () => {
    const users = await User.find({ role: 'USER' }); // 🔍 filter here
    const totalUsers = await User.countDocuments({ role: 'USER' }); // 🔍 same filter

    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};


const getAllAgents = async () => {
    const agents = await User.find({ role: 'AGENT' }); // 🔍 filter here
    const totalUsers = await User.countDocuments({ role: 'USER' }); // 🔍 same filter

    return {
        data: agents,
        meta: {
            total: totalUsers,
        },
    };
};


const updateAgentStatus = async (
    agentId: string,
    isActive: 'ACTIVE' | 'INACTIVE'
): Promise<IUser> => {
    const agent = await User.findOneAndUpdate(
        { _id: agentId, role: 'AGENT' },
        { isActive:isActive },
        { new: true }
    );
    if (!agent) throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
    return agent;
};


const getProfile = async (userId: string) => {
      // Find user by ID and exclude sensitive fields
    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return {
        data: user
    };
};


export const UserService = {
    createUser,
    updateUser,
    getAllUsers,
    getAllAgents,
    updateAgentStatus,
    getProfile
}