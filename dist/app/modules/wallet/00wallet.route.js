"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const wallet_validation_1 = require("./wallet.validation");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
// import { Role } from "../../enums/role"; // assuming you have a Role enum
const router = (0, express_1.Router)();
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.AGENT), wallet_controller_1.WalletController.getMyWallet);
router.patch("/update/:id", 
//   checkAuth(Role.ADMIN),
(0, validateRequest_1.validateRequest)(wallet_validation_1.updateWalletSchema), wallet_controller_1.WalletController.updateWallet);
router.patch("/block/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.blockWallet);
router.patch("/unblock/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN), wallet_controller_1.WalletController.unblockWallet);
exports.WalletRoutes = router;
