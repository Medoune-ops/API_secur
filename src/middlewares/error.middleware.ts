import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Erreur interne du serveur";

    // On log l'erreur avec notre superbe logger
    logger.error(`${req.method} ${req.url} - ${message}`);

    res.status(status).json({
        success: false,
        status,
        message,
        // On n'affiche la stack trace qu'en développement
        stack: process.env.NODE_ENV === "development" ? err.stack : {}
    });
};