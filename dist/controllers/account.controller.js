"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const account_services_1 = require("../services/account.services");
const apiResponse_1 = require("../utils/apiResponse");
exports.AccountController = {
    async createAccount(req, res) {
        try {
            const { currency } = req.body;
            const userId = req.user.id;
            const account = await account_services_1.AccountService.createAccount(userId, currency);
            return apiResponse_1.ApiResponse.success(res, " Account created successfully", { account });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    },
    async getAccountDetails(req, res) {
        try {
            const { accountId } = req.params;
            const account = await account_services_1.AccountService.getAccountDetails(accountId, req.user.id);
            return apiResponse_1.ApiResponse.success(res, "Acccount details retrieved successfully", { account });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    },
    async getUserAccounts(req, res) {
        try {
            const accounts = await account_services_1.AccountService.getUserAccounts(req.user.id);
            return apiResponse_1.ApiResponse.success(res, "User accounts retreived successfully", { accounts });
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    },
    async deposit(req, res) {
        try {
            const { accountId, amount, currency, description } = req.body;
            if (!req.user.isAdmin) {
                await account_services_1.AccountService.getAccountDetails(accountId, req.user.id);
            }
            const result = await account_services_1.AccountService.deposit(accountId, amount, currency, description);
            return apiResponse_1.ApiResponse.success(res, "Deposit successful");
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }
};
