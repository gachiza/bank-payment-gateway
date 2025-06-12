"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, message = "Success", data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
    static error(res, message = "Error", statusCode = 400, options = {}) {
        const { errors, data } = options;
        return res.status(statusCode).json({
            success: false,
            message,
            data
        });
    }
}
exports.ApiResponse = ApiResponse;
class ApiError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
