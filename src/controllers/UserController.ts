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

    static create = async (req: Request, res: Response) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = this.userRepository.create({ ...req.body, password: hashedPassword });
            const result = await this.userRepository.save(user) as unknown as User;
            const { password, ...safeResult } = result;
            res.status(201).json(safeResult);
        } catch (error) {
            res.status(400).json({ message: "Erreur lors de la création" });
        }
    };

    static update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const updateData = { ...req.body };
            if (updateData.password) {
                updateData.password = await bcrypt.hash(updateData.password, 10);
            }
            const result = await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: "after" }
            );
            if (!result) return res.status(404).json({ message: "Utilisateur non trouvé" });
            const { password, ...safeResult } = result as unknown as User;
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
}