import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export class UserController {
    private static get userRepository() {
        return AppDataSource.getMongoRepository(User);
    }

    static getAll = async (req: Request, res: Response) => {
        // Route désactivée — aucun utilisateur ne doit pouvoir lister tous les comptes
        return res.status(403).json({ message: "Accès interdit" });
    };

    static getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requestingUserId = (req as any).user.userId;

            // Vérifier que l'utilisateur ne consulte que son propre profil
            if (requestingUserId !== id) {
                return res.status(403).json({ message: "Accès interdit : vous ne pouvez consulter que votre propre profil" });
            }

            const user = await this.userRepository.findOneBy({ _id: new ObjectId(id) } as any);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
            const { password, ...safeUser } = user;
            res.json(safeUser);
        } catch (error) {
            res.status(400).json({ message: "ID invalide" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requestingUserId = (req as any).user.userId;

            // Vérifier que l'utilisateur ne modifie que son propre profil
            if (requestingUserId !== id) {
                return res.status(403).json({ message: "Accès interdit : vous ne pouvez modifier que votre propre profil" });
            }

            const { email, password } = req.body;
            const updateData: Record<string, string> = {};
            if (email) updateData.email = email;
            if (password) updateData.password = await bcrypt.hash(password, 10);
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "Aucun champ valide à mettre à jour" });
            }
            const result = await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: "after" }
            );
            if (!result) return res.status(404).json({ message: "Utilisateur non trouvé" });
            const { password: _pwd, ...safeResult } = result as unknown as User;
            res.json(safeResult);
        } catch (error) {
            res.status(400).json({ message: "Erreur lors de la mise à jour" });
        }
    };

    static delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const requestingUserId = (req as any).user.userId;

            // Vérifier que l'utilisateur ne supprime que son propre compte
            if (requestingUserId !== id) {
                return res.status(403).json({ message: "Accès interdit : vous ne pouvez supprimer que votre propre compte" });
            }

            const result = await this.userRepository.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
            res.json({ message: "Utilisateur supprimé" });
        } catch (error) {
            res.status(400).json({ message: "ID invalide" });
        }
    };

    static getCart = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const user = await this.userRepository.findOneBy({ _id: new ObjectId(userId) } as any);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
            res.json(user.cart || []);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération du panier" });
        }
    };

    static saveCart = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { cart } = req.body;
            await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: { cart } },
                { returnDocument: "after" }
            );
            res.json({ message: "Panier sauvegardé" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la sauvegarde du panier" });
        }
    };

    static getWishlist = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const user = await this.userRepository.findOneBy({ _id: new ObjectId(userId) } as any);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
            res.json(user.wishlist || []);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des favoris" });
        }
    };

    static saveWishlist = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { wishlist } = req.body;
            await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: { wishlist } },
                { returnDocument: "after" }
            );
            res.json({ message: "Favoris sauvegardés" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la sauvegarde des favoris" });
        }
    };

    static becomeVendor = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { shopName, shopDescription } = req.body;

            if (!shopName) {
                return res.status(400).json({ message: "Le nom de la boutique est requis" });
            }

            const result = await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: { role: "vendor", shopName, shopDescription } },
                { returnDocument: "after" }
            );

            if (!result) return res.status(404).json({ message: "Utilisateur non trouvé" });
            const user = result as unknown as User;

            const token = jwt.sign(
                { userId: user._id.toString(), email: user.email, name: user.name, role: user.role, shopName: user.shopName },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ message: "Vous êtes maintenant vendeur", token });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la mise à jour du rôle vendeur" });
        }
    };
}