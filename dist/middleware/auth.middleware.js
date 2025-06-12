"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiResponse_1 = require("../utils/apiResponse");
const JWT_SECRET = process.env.JWT_SECRET || " your-secret-key";
exports.authMiddleware = {
    authenticate: (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer", "");
        if (!token) {
            return apiResponse_1.ApiResponse.error(res, "Authentication required", 401);
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, "Invalid token ", 401);
        }
    },
    authorizeAdmin: (req, res, next) => {
        if (!req.user?.isAdmin) {
            return apiResponse_1.ApiResponse.error(res, "Admin Access Required", 403);
        }
        next();
    }
};
