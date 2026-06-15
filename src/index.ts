import "dotenv/config";
import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { errorHandler } from "./middlewares/error.middleware"; 
import logger from "./utils/logger"; 
import swaggerUi from "swagger-ui-express";
import { specs } from "./utils/swagger";
import cors from "cors";
import productRoutes from "./routes/product.routes";

app.use(cors()); // Permet à ton HTML de parler librement à ton API
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/products", productRoutes); // 2. Branchement de la route produit

// GESTION DES ERREURS  
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() => {
        logger.info("✅ Connexion à MongoDB réussie");
        app.listen(PORT, () => {
            logger.info(`🚀 Serveur démarré sur http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        logger.error("❌ Erreur de connexion DB: " + error);
    });