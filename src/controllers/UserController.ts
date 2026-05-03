import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { ObjectId } from "mongodb";

export class UserController {
    private static userRepository = AppDataSource.getMongoRepository(User);

    static getAll = async (req: Request, res: Response) => {
        try {
            const users = await this.userRepository.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération" });
        }
    };

    static getOne = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const user = await this.userRepository.findOneBy({ _id: new ObjectId(id) } as any);
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: "ID invalide" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
            const user = this.userRepository.create(req.body);
            const result = await this.userRepository.save(user);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: "Erreur lors de la création" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: req.body },
                { returnDocument: "after" }
            );
            if (!result) return res.status(404).json({ message: "Utilisateur non trouvé" });
            res.json(result);
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
}