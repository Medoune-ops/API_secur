import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.get("/", AuthController.getAll);
router.get("/:id", AuthController.getOne);
router.post("/", AuthController.create);
router.put("/:id", AuthController.update);
router.delete("/:id", AuthController.delete);

export default router;