import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();


router.post("/register", 
    validateRequest(createUserZodSchema), 
    UserController.createUser);


router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserController.updateUser)
// /api/v1/user/:id


router.get("/all-users", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    UserController.getAllUsers
);
router.get("/all-agents", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    UserController.getAllAgents
);




export const UserRoutes = router;