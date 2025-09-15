import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { AdminController } from "./admin.controller";
import { Role } from "../user/user.interface";

const router = Router();


router.get("/dashboard", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    AdminController.getDashboardData
);
router.get("/transactions", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    AdminController.getAllTransactions
);

router.get("/listings", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    AdminController.getAllListing,
);


export const AdminRoutes = router;