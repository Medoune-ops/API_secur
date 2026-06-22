import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import { authGuard } from "../middlewares/auth.middleware";
import { vendorGuard } from "../middlewares/vendor.middleware";

const router = Router();

// Créer une commande (Checkout)
router.post("/", authGuard, OrderController.createOrder);

// Récupérer les commandes de l'utilisateur connecté
router.get("/me", authGuard, OrderController.getUserOrders);

// Récupérer toutes les commandes (Pour le tableau de bord vendeur)
router.get("/all", authGuard, vendorGuard, OrderController.getAllOrders);

export default router;
