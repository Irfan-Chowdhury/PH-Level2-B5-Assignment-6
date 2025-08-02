"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const wallet_validation_1 = require("./wallet.validation");
const router = express_1.default.Router();
router.get('/my-wallet', (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT, user_interface_1.Role.USER), wallet_controller_1.WalletController.getMyWallet);
// Users should be able to : Add money (top-up)
router.post('/add-money', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.WalletValidation.addMoneyZodSchema), wallet_controller_1.WalletController.addMoney);
// Users should be able to : withdraw money 
router.post('/withdraw-money', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), (0, validateRequest_1.validateRequest)(wallet_validation_1.WalletValidation.withdrawMoneyZodSchema), wallet_controller_1.WalletController.withdrawMoney);
// Users should be able to : Send money to another user
router.post('/send-money', (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER), 
// validateRequest(WalletValidation.sendMoneyZodSchema),
wallet_controller_1.WalletController.sendMoney);
// Agent
router.post('/cash-in', (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), 
// validateRequest(WalletValidation.cashInZodSchema),
wallet_controller_1.WalletController.cashIn);
router.post('/cash-out', (0, checkAuth_1.checkAuth)(user_interface_1.Role.AGENT), 
// validateRequest(WalletValidation.cashOutZodSchema),
wallet_controller_1.WalletController.cashOut);
router.get('/all', (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.getAllWallet);
router.get("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.blockWallet);
router.get("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.unblockWallet);
exports.WalletRoutes = router;
