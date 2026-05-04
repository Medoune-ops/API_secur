import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authGuard } from "../middlewares/auth.middleware";
const router = Router();

router.get("/", authGuard, UserController.getAll);
router.get("/:id", authGuard, UserController.getOne);
router.put("/:id", authGuard, UserController.update);
router.delete("/:id", authGuard, UserController.delete);

router.post("/", UserController.create);

export default router;