import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import * as dotenv from "dotenv";
import { Product } from "./entities/Product";
import { Order } from "./entities/Order";

dotenv.config(); // Charge les variables du fichier .env

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [User, Product, Order],
    authSource: "admin",
});


  