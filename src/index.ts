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

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "https://site-e-commerce-green.vercel.app"
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
import orderRoutes from "./routes/order.routes";

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/api/products", productRoutes); 
app.use("/api/orders", orderRoutes);

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