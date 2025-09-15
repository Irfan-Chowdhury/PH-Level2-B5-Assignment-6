import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
// import { UserController } from "./user.controller";
// import { Role } from "./user.interface";
// import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { AdminController } from "./admin.controller";
import { Role } from "../user/user.interface";

const router = Router();


// router.post("/register", 
//     validateRequest(createUserZodSchema), 
//     UserController.createUser);


// router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser)

// router.get("/all-users", 
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
//     UserController.getAllUsers
// );

// router.get("/all-agents", 
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
//     UserController.getAllAgents
// );

// router.get("/approve-agent/:agentId", 
//     checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
//     UserController.approveAgent
// );

router.get("/transactions", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    AdminController.getAllTransactions
);





export const AdminRoutes = router;