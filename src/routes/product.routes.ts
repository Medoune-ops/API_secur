import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authGuard } from "../middlewares/auth.middleware";
import { vendorGuard } from "../middlewares/vendor.middleware";

const router = Router();
const productController = new ProductController();

// Route publique
router.get("/", productController.getAllProducts);

// Routes protégées (vendeurs uniquement)
router.post("/", authGuard, vendorGuard, productController.createProduct);
router.put("/:id", authGuard, vendorGuard, productController.updateProduct);
router.delete("/:id", authGuard, vendorGuard, productController.deleteProduct);

export default router;