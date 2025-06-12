"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    const app = await (0, app_1.createApp)();
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
};
startServer().catch((error) => {
    console.log("Failed to start server:", error);
    process.exit(1);
});
