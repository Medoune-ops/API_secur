import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";

export class UserController {
    private static get userRepository() {
        return AppDataSource.getMongoRepository(User);
    }

    static getAll = async (req: Request, res: Response) => {
        try {
            const users = await this.userRepository.find();
            const safeUsers = users.map(user => { const { password, ...u } = user; return u; });
            res.json(safeUsers);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération" });
        }
    };

    static getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
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
}