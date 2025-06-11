import { Request, Response } from "express";
import { AccountService } from "../services/account.services";
import { ApiResponse } from "../utils/apiResponse";
import { authMiddleware } from "../middleware/auth.middleware";

export const AccountController = {
  async createAccount (req: Request, res: Response ) {
    try {
      const { currency } = req.body;
      const userId = req.user.id;
      const account = await AccountService.createAccount(userId, currency);
      return ApiResponse.success(res, " Account created successfully", { account });
    } catch (error: any ) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  },
  async getAccountDetails(req: Request, res: Response) {
    try {
      const { accountId } = req.params;
      const account = await AccountService.getAccountDetails(accountId, req.user.id);
      return ApiResponse.success(res, "Acccount details retrieved successfully", {account});
    } catch (error: any) {
      return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  },

  async getUserAccounts(req: Request, res: Response) {
    try {
      const accounts = await AccountService.getUserAccounts(req.user.id);
      return ApiResponse.success(res, "User accounts retreived successfully", {accounts});
    } catch (error: any) {
      return ApiResponse.error(res,error.message, error.statusCode || 500);
    }
  },
  async deposit(req: Request, res:Response) {
    try {
      const { accountId, amount, currency, description } = req.body;
      if (!req.user.isAdmin) {
        await AccountService.getAccountDetails(accountId,req.user.id);
      }
      const result = await AccountService.deposit(accountId, amount, currency, description);
      return ApiResponse.success(res, "Deposit successful");
    } catch (error: any) {
      return ApiResponse.error(res, error.message, error.statusCode || 500 );
    }
  }
};