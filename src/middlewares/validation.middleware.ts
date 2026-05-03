import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";

export const validateBody = (entityClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const entityInstance = plainToInstance(entityClass, req.body);
        
        const errors: ValidationError[] = await validate(entityInstance);

        if (errors.length > 0) {
            const formattedErrors = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));
            
            return res.status(400).json({ 
                message: "Erreur de validation", 
                errors: formattedErrors 
            });
        }

        next();
    };
};