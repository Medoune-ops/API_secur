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

app.use("/api", swaggerUi.serve, swaggerUi.setup(specs));
// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// GESTION DES ERREURS  
app.use(errorHandler);

const PORT = 3000;

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