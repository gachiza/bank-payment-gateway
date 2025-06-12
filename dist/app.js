"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const account_routes_1 = __importDefault(require("./routes/account.routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const createApp = async () => {
    const app = (0, express_1.default)();
    await (0, db_1.initializeDB)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((req, res, next) => {
        logger_1.default.info(`${req.method} ${req.path}`);
        next();
    });
    app.use("/api/auth", auth_routes_1.default);
    app.use("/api/payments", payment_routes_1.default);
    app.use("/api/accounts", account_routes_1.default);
    app.get("/health", (req, res) => {
        res.status(200).json({ status: "OK" });
    });
    //app.use(errorMiddleware);
    return app;
};
exports.createApp = createApp;
