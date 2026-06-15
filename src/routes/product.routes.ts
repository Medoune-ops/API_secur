import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const router = Router();
const productController = new ProductController();

// Route pour récupérer tous les produits
router.get("/", productController.getAllProducts);

// Route pour ajouter un produit (Utile pour remplir ta base)
router.post("/", productController.createProduct);

export default router;