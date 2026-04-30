import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

const app = express(); // On crée l'instance ici directement
app.use(express.json());

const PORT = 3000;

AppDataSource.initialize()
    .then(() => {
        console.log(" Connexion à MongoDB réussie avec TypeORM");
        
        app.listen(PORT, () => {
            console.log(` Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(" Erreur lors de la connexion à la DB :", error);
    });