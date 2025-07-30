import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateWalletSchema } from "./wallet.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
// import { Role } from "../../enums/role"; // assuming you have a Role enum

const router = Router();

router.get("/me", 
    checkAuth(Role.USER, Role.AGENT), 
    WalletController.getMyWallet);

router.patch(
  "/update/:id",
//   checkAuth(Role.ADMIN),
  validateRequest(updateWalletSchema),
  WalletController.updateWallet
);

router.patch("/block/:id", checkAuth(Role.ADMIN), WalletController.blockWallet);
router.patch("/unblock/:id", checkAuth(Role.ADMIN), WalletController.unblockWallet);

export const WalletRoutes = router;
