import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authGuard } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 *       401:
 *         description: Non autorisé
 */
router.get("/", authGuard, UserController.getAll);

router.get("/me/cart", authGuard, UserController.getCart);
router.post("/me/cart", authGuard, UserController.saveCart);
router.get("/me/wishlist", authGuard, UserController.getWishlist);
router.post("/me/wishlist", authGuard, UserController.saveWishlist);
router.post("/me/become-vendor", authGuard, UserController.becomeVendor);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par son ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get("/:id", authGuard, UserController.getOne);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "nouveauMotDePasse123"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       400:
 *         description: Erreur lors de la mise à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put("/:id", authGuard, UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete("/:id", authGuard, UserController.delete);

export default router;