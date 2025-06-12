"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_services_1 = require("../services/payment.services");
const apiResponse_1 = require("../utils/apiResponse");
exports.PaymentController = {
    async processPayment(req, res) {
        try {
            const { accountId, amount, currency, merchantId, merchantName, description } = req.body;
            if (req.user.id !== accountId && !req.user.isAdmin) {
                return apiResponse_1.ApiResponse.error(res, "Unauthorized access", 403);
            }
            const result = await payment_services_1.PaymentService.processPayment(accountId, amount, currency, merchantId, merchantName, description);
            return apiResponse_1.ApiResponse.success(res, "Payment processed successfully", result);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    },
    async getPaymentDetails(req, res) {
        try {
            const { paymentReference } = req.params;
            const payment = await payment_services_1.PaymentService.getPaymentDetails(paymentReference);
            if (payment.account.user.id !== req.user.id && !req.user.isAdmin) {
                return apiResponse_1.ApiResponse.error(res, " Unauthorized access to payment ddetails", 403);
            }
            return apiResponse_1.ApiResponse.success(res, "Payment details retrieved successfully", payment);
        }
        catch (error) {
            return apiResponse_1.ApiResponse.error(res, error.message, error.statusCode || 500);
        }
    }
};
