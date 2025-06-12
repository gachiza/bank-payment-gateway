import { createApp } from "./app";
import dotenv from "dotenv";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DB_HOST!);

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.log("Failed to start server:", error);
  process.exit(1);
});