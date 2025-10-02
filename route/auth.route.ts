import { Router } from "express";
import {
	loginController,
	registerController,
} from "../controller/auth.controller";
import { validateBody } from "../middleware/validation";
import { loginSchema, registerSchema } from "../validator/auth.validator";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerController);
authRouter.post("/login", validateBody(loginSchema), loginController);
