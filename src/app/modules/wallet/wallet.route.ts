import express from 'express';
import { WalletController } from './wallet.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { validateRequest } from '../../middlewares/validateRequest';
import { WalletValidation } from './wallet.validation';

const router = express.Router();

router.get('/my-wallet', 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    WalletController.getMyWallet);  // done by admin


// Users should be able to : Add money (top-up)
router.post(
    '/add-money',
    checkAuth(Role.USER),
    validateRequest(WalletValidation.addMoneyZodSchema),
    WalletController.addMoney
);

// Users should be able to : withdraw money 
router.post(
    '/withdraw-money',
    checkAuth(Role.USER),
    validateRequest(WalletValidation.withdrawMoneyZodSchema),
    WalletController.withdrawMoney
);

// Users should be able to : Send money to another user
router.post(
    '/send-money',
    checkAuth(Role.USER),
    // validateRequest(WalletValidation.sendMoneyZodSchema),
    WalletController.sendMoney
);

// Agent
router.post(
    '/cash-in',
    checkAuth(Role.AGENT),
    // validateRequest(WalletValidation.cashInZodSchema),
    WalletController.cashIn
);
router.post(
    '/cash-out',
    checkAuth(Role.AGENT),
    // validateRequest(WalletValidation.cashOutZodSchema),
    WalletController.cashOut
);

router.get(
    '/all',
    checkAuth(Role.ADMIN),
    WalletController.getAllWallet
);

router.get(
    "/block/:id",
    checkAuth(Role.ADMIN),
    WalletController.blockWallet
);

router.get(
    "/unblock/:id",
    checkAuth(Role.ADMIN),
    WalletController.unblockWallet
);

export const WalletRoutes = router;
