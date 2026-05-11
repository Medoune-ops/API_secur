import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import logger from "../utils/logger";

const JWT_SECRET = "Cle"; // À mettre en .env idéalement

export class AuthController {
    private static get userRepository() {
        return AppDataSource.getMongoRepository(User);
    }

    // POST /auth/register
    static register = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            // Vérifier si l'user existe déjà
            const existingUser = await this.userRepository.findOneBy({ email });
            if (existingUser) return res.status(400).json({ message: "Cet email est déjà utilisé" });

            // Hachage du mot de passe (on ne stocke jamais en clair !)
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = this.userRepository.create({
                email,
                password: hashedPassword
            });

            await this.userRepository.save(user);
            logger.info(`Nouvel utilisateur inscrit : ${email}`);
            
            res.status(201).json({ message: "Utilisateur créé avec succès" });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de l'inscription" });
        }
    };

    // POST /auth/login
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            const user = await this.userRepository.findOneBy({ email });
            if (!user) return res.status(401).json({ message: "Identifiants incorrects" });

            // Comparaison du mot de passe envoyé avec le hachage en DB
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Identifiants incorrects" });

            // Génération du JWT (valable 1 heure)
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            logger.info(`Connexion réussie pour : ${email}`);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la connexion" });
        }
    };
}