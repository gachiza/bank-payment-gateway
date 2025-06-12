"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map(err => ({
                    path: err.path.join("."),
                    message: err.message
                }));
                return apiResponse_1.ApiResponse.error(res, "Validation failed", 400, { errors });
            }
            return apiResponse_1.ApiResponse.error(res, "Internal server error", 500);
        }
    };
};
exports.validate = validate;
