import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { initializeDB } from "./config/db";
import  authRoutes from "./routes/auth.routes";
import paymentRoutes from "./routes/payment.routes";
import accountRoutes from "./routes/account.routes";
import {errorMiddleware} from "./middleware/error.middleware";
import logger from "./utils/logger";

export const createApp = async () => {
  const app = express();
  
  await initializeDB();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use((req,res,next) => {
    logger.info(`${req.method} ${req.path}`);
    next();

  });

  app.use("/api/auth", authRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/accounts", accountRoutes);
  app.get("/health", (req,res) => {
    res.status(200).json({ status: "OK"});
  });

  app.use(errorMiddleware);
  return app;
};



