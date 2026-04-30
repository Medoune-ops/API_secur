import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = "...";

export class  AuthController {
    static register = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getMongoRepository(User);

        try {
            const existingUser = await userRepository.findOneBy({email});
            if (existingUser) return res.status(400).json({message:"Email deja utilise"})
                const hashedPassword = await bcrypt.hash(password, 10);
            const user = userRepository.create({email, password: hashedPassword});
            await userRepository.save(user);
            res.status(201).json({message:"utilisateur cree avec succes"});
        } catch (error) {
            res.status(500).json({message:"Erreur serveur", error})
        }
    };
    static login = async (req:Request, res:Response) => {
        const {email, password}=req.body;
        const userRepository = AppDataSource.getMongoRepository(User);

        try {
            const user = await userRepository.findOneBy({email});
            if (!user) return res.status(401).json({message:"identifiants invalides"});
            const isPasswordValid  = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({message:"identifiants invalides"});
            const token = jwt.sign({id:user._id},JWT_SECRET,{expiresIn:"1h"});
            res.json({token});
        }catch (error) {
            res.status(500).json({message:"Erreur serveur"}); 
        }
    };
}