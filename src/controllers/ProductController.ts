import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { ObjectId } from "mongodb";

export class ProductController {
    private productRepository = AppDataSource.getMongoRepository(Product);

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
            const { name, price, oldPrice, imageUrl, rating, reviewsCount, stock } = req.body;
            const newProduct = this.productRepository.create({ name, price, oldPrice, imageUrl, rating, reviewsCount, stock });
            await this.productRepository.save(newProduct);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(400).json({ message: "Impossible de créer le produit" });
        }
    };

    // PUT /api/products/:id
    updateProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const updateData = req.body;
            const result = await this.productRepository.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: updateData },
                { returnDocument: "after" }
            );
            if (!result) { res.status(404).json({ message: "Produit non trouvé" }); return; }
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: "Impossible de modifier le produit" });
        }
    };

    // DELETE /api/products/:id
    deleteProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const result = await this.productRepository.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) { res.status(404).json({ message: "Produit non trouvé" }); return; }
            res.json({ message: "Produit supprimé" });
        } catch (error) {
            res.status(400).json({ message: "Impossible de supprimer le produit" });
        }
    };
}