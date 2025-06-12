import { AppDataSource } from "../config/db";
import { Account } from "../models/entites/account";
import { Payment } from "../models/entites/payment";
import { Transaction } from "../models/entites/Transaction";
import { z } from "zod";
import { ApiError} from "../utils/apiResponse";

export const PaymentService = {
  async processPayment(
    accountId: string,
    amount: number,
    currency: string,
    merchantId: string,
    merchantName: string,
    description?: string
  ) {
    const accountRepository = AppDataSource.getRepository(Account);
    const paymentRepository = AppDataSource.getRepository(Payment);
    const transactionRepository = AppDataSource.getRepository(Transaction);
    //start a transaction
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // lock the account for update 
      const account = await queryRunner.manager.findOne(Account, {
        where: { id: accountId},
        lock: {mode: "pessimistic_write"}
      });
      if (!account) {
        throw new ApiError(" Account not Found", 404);
      }
      if (account.balance < amount ) {
        throw new ApiError(" Insufficient funds", 400);
      }
      if (account.currency !== currency) {
        throw new ApiError(" Currency mismatch", 400);
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
        status: "pending",
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

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  },
  async getPaymentDetails(paymentReference: string ) {
    const paymentRepository = AppDataSource.getRepository(Payment);
    const payment = await paymentRepository.findOne({
      where: { paymentReference },
      relations: ["account"]
    });

    if (!payment) {
      throw new ApiError("Payment not Found", 404);
    }
    return payment;
  }
};
//Zod validation schemas
export const processPaymentSchema = z.object({
  account: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  merchantId: z.string().min(1),
  merchantName: z.string().min(1),
  description: z.string().optional()
});

export const paymentDetailsSchema = z.object({
  paymentReference: z.string().min(1)
});
