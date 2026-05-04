import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { validateBody } from "../middlewares/validation.middleware";
import { User } from "../entities/User";

const router = Router();

router.post("/register", validateBody(User), AuthController.register);
router.post("/login", AuthController.login);

export default router;