import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post("/register", AuthController.create);
// router.post("/login", AuthController.login); // TODO: implémenter la méthode login dans AuthController

export default router;