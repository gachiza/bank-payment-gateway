"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentDetailsSchema = exports.processPaymentSchema = exports.PaymentService = void 0;
const db_1 = require("../config/db");
const Account_1 = require("../models/entites/Account");
const Payment_1 = require("../models/entites/Payment");
const Transaction_1 = require("../models/entites/Transaction");
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
exports.PaymentService = {
    async processPayment(accountId, amount, currency, merchantId, merchantName, description) {
        const accountRepository = db_1.AppDataSource.getRepository(Account_1.Account);
        const paymentRepository = db_1.AppDataSource.getRepository(Payment_1.Payment);
        const transactionRepository = db_1.AppDataSource.getRepository(Transaction_1.Transaction);
        //start a transaction
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // lock the account for update 
            const account = await queryRunner.manager.findOne(Account_1.Account, {
                where: { id: accountId },
                lock: { mode: "pessimistic_write" }
            });
            if (!account) {
                throw new apiResponse_1.ApiError(" Account not Found", 404);
            }
            if (account.balance < amount) {
                throw new apiResponse_1.ApiError(" Insufficient funds", 400);
            }
            if (account.currency !== currency) {
                throw new apiResponse_1.ApiError(" Currency mismatch", 400);
            }
            // generate a unique payment reference
            const paymentReference = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            // create payment record 
            const payment = paymentRepository.create({
                amount,
                currency,
                merchantId,
                merchantName,
                description,
                paymentReference,
                status: Payment_1.PaymentStatus.PENDING,
                account
            });
            // deduct from account balance
            account.balance = Number(account.balance) - Number(amount);
            //create transaction record
            const transaction = transactionRepository.create({
                amount,
                currency,
                type: "payment",
                description: `payment to ${merchantName}`,
                reference: paymentReference,
                status: "completed",
                account
            });
            // update payment status
            payment.status;
            //save all changes 
            await queryRunner.manager.save(account);
            await queryRunner.manager.save(payment);
            await queryRunner.manager.save(transaction);
            await queryRunner.commitTransaction();
            return {
                paymentReference,
                newBalance: account.balance,
                transactionId: transaction.id
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    },
    async getPaymentDetails(paymentReference) {
        const paymentRepository = db_1.AppDataSource.getRepository(Payment_1.Payment);
        const payment = await paymentRepository.findOne({
            where: { paymentReference },
            relations: ["account"]
        });
        if (!payment) {
            throw new apiResponse_1.ApiError("Payment not Found", 404);
        }
        return payment;
    }
};
//Zod validation schemas
exports.processPaymentSchema = zod_1.z.object({
    account: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    merchantId: zod_1.z.string().min(1),
    merchantName: zod_1.z.string().min(1),
    description: zod_1.z.string().optional()
});
exports.paymentDetailsSchema = zod_1.z.object({
    paymentReference: zod_1.z.string().min(1)
});
