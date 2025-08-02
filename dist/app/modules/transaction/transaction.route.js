"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import auth from '../middlewares/auth';
const transaction_controller_1 = require("./transaction.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
// Users should be able to : View transaction history
router.get('/my-transactions', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), transaction_controller_1.getMyTransactions);
router.get('/all', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), transaction_controller_1.getAllTransactions);
exports.TransactionRoutes = router;
