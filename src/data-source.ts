import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: "mongodb://localhost:27017/API_secur",
    synchronize: true,
    logging: true,
    entities: [User],
    authSource: "admin", 
});