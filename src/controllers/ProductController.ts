import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

export class ProductController {
    private productRepository = AppDataSource.getRepository(Product);

    // GET /api/products
    getAllProducts = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await this.productRepository.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des produits" });
        }
    };

    // POST /api/products (Pour t'aider à ajouter tes premiers produits via Postman/Thunder Client)
    createProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, price, oldPrice, imageUrl, rating, reviewsCount } = req.body;
            const newProduct = this.productRepository.create({ name, price, oldPrice, imageUrl, rating, reviewsCount });
            await this.productRepository.save(newProduct);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ message: "Impossible de créer le produit" });
        }
    };
}