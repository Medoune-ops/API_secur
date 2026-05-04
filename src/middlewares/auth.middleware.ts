import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import logger from "../utils/logger";

const JWT_SECRET = "ta_cle_secrete_super_securisee_2026";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
    // 1. Récupérer le header Authorization (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.warn(`Tentative d'accès non autorisé à ${req.url}`);
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    // 2. Extraire le token
    const token = authHeader.split(" ")[1];

    try {
        // 3. Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 4. Stocker les infos du user dans la requête pour les utiliser plus tard
        (req as any).user = decoded;

        next(); // On laisse passer à la route suivante
    } catch (error) {
        logger.error("Token JWT invalide ou expiré");
        return res.status(401).json({ message: "Token invalide ou expiré." });
    }
};