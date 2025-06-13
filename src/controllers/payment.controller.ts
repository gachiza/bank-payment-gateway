import { Request, Response } from "express";
import { PaymentService } from "../services/payment.services";
import { ApiResponse } from "../utils/apiResponse";


export const PaymentController = {
  async processPayment(req: Request, res: Response) {
    try {
      const {accountId, amount, currency, merchantId, merchantName, description} = req.body;
      if (req.user.id !== accountId && ! req.user.isAdmin) {
        ApiResponse.error(res, "Unauthorized access", 403);
        return;
      }
      const result = await PaymentService.processPayment(
        accountId,
        amount,
        currency,
        merchantId,
        merchantName,
        description
      );
      ApiResponse.success(res, "Payment processed successfully", result);
      return;
    } catch (error: any) {
      ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  },
  async getPaymentDetails(req: Request, res: Response) {
    try {
      const { paymentReference } = req.params;
      const payment = await PaymentService.getPaymentDetails(paymentReference);
      if (payment.account.user.id !== req.user.id && !req.user.isAdmin) {
        ApiResponse.error(res, " Unauthorized access to payment ddetails", 403);
        return;
      }
      ApiResponse.success(res, "Payment details retrieved successfully", payment);
      return;
    } catch (error: any ) {
      ApiResponse.error(res, error.message, error.statusCode || 500);
    }
  }
};



