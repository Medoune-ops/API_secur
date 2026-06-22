import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order";
import { User } from "../entities/User";
import { ObjectId } from "mongodb";
import logger from "../utils/logger";

export class OrderController {
    private static get orderRepository() {
        return AppDataSource.getMongoRepository(Order);
    }
    private static get userRepository() {
        return AppDataSource.getMongoRepository(User);
    }

    // POST /api/orders
    static createOrder = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { items, totalAmount, paymentMethod, mobileMoneyPhone, deliveryMethod, deliveryAddress } = req.body;

            if (!items || items.length === 0) {
                return res.status(400).json({ message: "Le panier est vide" });
            }

            // Créer la commande
            const newOrder = this.orderRepository.create({
                userId,
                items,
                totalAmount,
                paymentMethod,
                mobileMoneyPhone,
                deliveryMethod,
                deliveryAddress,
                status: "pending"
            });

            await this.orderRepository.save(newOrder);

            // Vider le panier de l'utilisateur en base de données
            await this.userRepository.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: { cart: [] } }
            );

            logger.info(`Nouvelle commande créée par ${userId}`);
            res.status(201).json({ message: "Commande validée avec succès", order: newOrder });
        } catch (error) {
            logger.error("Erreur createOrder: " + error);
            res.status(500).json({ message: "Impossible de créer la commande" });
        }
    };

    // GET /api/orders/me
    static getUserOrders = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const orders = await this.orderRepository.find({ where: { userId } as any });
            
            // Trier les commandes par date (les plus récentes d'abord)
            orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            res.json(orders);
        } catch (error) {
            logger.error("Erreur getUserOrders: " + error);
            res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
        }
    };
    // GET /api/orders/all (Pour le dashboard vendeur)
    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await this.orderRepository.find();
            
            // Trier les commandes par date (les plus récentes d'abord)
            orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            // Récupérer les emails des utilisateurs pour l'affichage
            const users = await this.userRepository.find();
            const userMap = new Map();
            users.forEach(u => userMap.set(u._id.toString(), u.email));

            const ordersWithEmails = orders.map(o => ({
                ...o,
                userEmail: userMap.get(o.userId) || "Utilisateur inconnu"
            }));

            res.json(ordersWithEmails);
        } catch (error) {
            logger.error("Erreur getAllOrders: " + error);
            res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
        }
    };
}
