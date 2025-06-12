import { Request, Response } from "express";
import { AccountService } from "../services/account.services";
import { ApiResponse } from "../utils/apiResponse";


export const AccountController = {
  async createAccount (req: Request, res: Response ) {
    try {
      const { currency } = req.body;
      const userId = req.user.id;
      const account = await AccountService.createAccount(userId, currency);
      ApiResponse.success(res, " Account created successfully", { account });
      return;
    } catch (error: any ) {
      ApiResponse.error(res, error.message, error.statusCode || 500);
      
    }
  },
  async getAccountDetails(req: Request, res: Response) {
    try {
      const { accountId } = req.params;
      const account = await AccountService.getAccountDetails(accountId, req.user.id);
      ApiResponse.success(res, "Acccount details retrieved successfully", {account});
      return;
    } catch (error: any) {
      ApiResponse.error(res, error.message, error.statusCode || 500);
      
    }
  },

  async getUserAccounts(req: Request, res: Response) {
    try {
      const accounts = await AccountService.getUserAccounts(req.user.id);
      ApiResponse.success(res, "User accounts retreived successfully", {accounts});
      return;
    } catch (error: any) {
      ApiResponse.error(res,error.message, error.statusCode || 500);
      return;
    }
  },
  async deposit(req: Request, res:Response) {
    try {
      const { accountId, amount, currency, description } = req.body;
      if (!req.user.isAdmin) {
        await AccountService.getAccountDetails(accountId,req.user.id);
      }
      const result = await AccountService.deposit(accountId, amount, currency, description);
      ApiResponse.success(res, "Deposit successful");
      return;
    } catch (error: any) {
      ApiResponse.error(res, error.message, error.statusCode || 500 );
      return;
    }
  }
};