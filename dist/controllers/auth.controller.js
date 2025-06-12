"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_services_1 = require("../services/auth.services");
const apiResponse_1 = require("../utils/apiResponse");
exports.AuthController = {
    async register(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;
            const user = await auth_services_1.AuthService.registerUser(email, password, firstName, lastName);
            return apiResponse_1.ApiResponse.success(res, "User registered successfully", { user });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await auth_services_1.AuthService.loginUser(email, password);
            return apiResponse_1.ApiResponse.success(res, "login successful", { token });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    },
    async profile(req, res) {
        try {
            return apiResponse_1.ApiResponse.success(res, "Profile retrieved successfully", { user: req.user });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message);
        }
    }
};
