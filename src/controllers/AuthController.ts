import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import logger from "../utils/logger";

export class AuthController {
    private static get userRepository() {
        return AppDataSource.getMongoRepository(User);
    }

    // POST /auth/register
    static register = async (req: Request, res: Response) => {
        const { name, email, password, phone } = req.body;

        try {
            const existingUser = await this.userRepository.findOneBy({ email });
            if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé" });

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = this.userRepository.create({
                name,
                phone,
                email,
                password: hashedPassword
            });

            await this.userRepository.save(user);
            logger.info(`Nouvel utilisateur inscrit : ${email}`);

            const token = jwt.sign(
                { userId: user._id.toString(), email: user.email, name: user.name, role: user.role, shopName: user.shopName },
                process.env.JWT_SECRET!,
                { expiresIn: "30d" }
            );

            res.status(201).json({ message: "Utilisateur créé avec succès", token });
        } catch (error) {
            logger.error("Erreur register: " + error);
            res.status(500).json({ message: "Erreur lors de l'inscription", detail: String(error) });
        }
    };

    // POST /auth/login
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const user = await this.userRepository.findOneBy({ email });
            if (!user) return res.status(401).json({ message: "Identifiants incorrects" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Identifiants incorrects" });

            const token = jwt.sign(
                { userId: user._id.toString(), email: user.email, name: user.name, role: user.role, shopName: user.shopName },
                process.env.JWT_SECRET!,
                { expiresIn: "30d" }
            );

            logger.info(`Connexion réussie pour : ${email}`);
            res.json({ token });
        } catch (error) {
            logger.error("Erreur login: " + error);
            res.status(500).json({ message: "Erreur lors de la connexion", detail: String(error) });
        }
    };
}