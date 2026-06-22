import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const vendorGuard = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== "vendor") {
        logger.warn(`Tentative d'accès non autorisé (vendeur requis) à ${req.url}`);
        return res.status(403).json({ message: "Accès refusé. Compte vendeur requis." });
    }

    next();
};
