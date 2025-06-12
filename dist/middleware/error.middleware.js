"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const apiResponse_1 = require("../utils/apiResponse");
const errorMiddleware = (error, req, res, next) => {
    console.error(error.stack);
    return apiResponse_1.ApiResponse.error(res, " Internal server error", 500);
};
exports.errorMiddleware = errorMiddleware;
exports.default = exports.errorMiddleware;
