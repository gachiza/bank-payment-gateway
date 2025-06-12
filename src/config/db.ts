import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "../models/entites/user";
import {Account} from "../models/entites/account";
import { Transaction} from "../models/entites/transaction";
import { Payment } from "../models/entites/payment";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_HOST || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Account, Transaction, Payment],
  migrations: [],
  subscribers: [],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

export const initializeDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (error){
    console.error('Database connection error:', error);
    process.exit(1);
  };
  
}