import { AppDataSource } from "../config/db";
import { Account } from "../models/entites/account";
import { User } from "../models/entites/user";
import { Transaction } from "../models/entites/Transaction";
import { z} from "zod";
import { ApiError } from "../utils/apiResponse";

export const AccountService = {
  async createAccount(userId: string, currency: string= " USD"): Promise<Account> {
    const accountRepository = AppDataSource.getRepository(Account);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {id: userId}});
    if (!user){
      throw new ApiError("User not found", 404);
    }
    const accountNumber = `AC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const account = accountRepository.create({
      accountNumber,
      balance: 0,
      currency,
      user
    });
    await accountRepository.save(account);
    return account;
  },
  async getAccountDetails(accountId: string, userId?: string): Promise<Account> {
    const accountRepository = AppDataSource.getRepository(Account);
    const account = await accountRepository.findOne({
      where: {id: accountId},
      relations: ["user", "transactions"]
    });

    if (!account) {
      throw new ApiError("Unauthorized access to account", 403);
    }
    return account;
  },
  async getUserAccounts(userId: string): Promise<Account[]> {
    const accountRepository = AppDataSource.getRepository(Account);
    return accountRepository.find({
      where: {user: { id: userId}},
      relations: ["transactions"]
    });
  },
  async deposit(
    accountId: string,
    amount: number,
    currency: string,
    description?: string
  ): Promise<{ newBalance: number; transactionId: string}> {
    const accountRepository = AppDataSource.getRepository(Account);
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const account = await queryRunner.manager.findOne(Account, {
        where: { id: accountId},
        lock: {mode: "pessimistic_write"}
      });
      if (!account) {
        throw new ApiError(" Account not found", 404);
      }
      if (account.currency !== currency) {
        throw new ApiError(" Currency mismatch", 400);
      }
      account.balance = Number(account.balance) + Number(amount);

      const transaction = transactionRepository.create({
        amount,
        currency,
        type: "deposit",
        description: description || "Amount deposit",
        status: "completed",
        account
      });
      await queryRunner.manager.save(amount);
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return {
        newBalance: account.balance,
        transactionId: transaction.id
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }
};

export const createAccountSchema = z.object({
  currency: z.string().length(3).optional()
});

export const accountDetailsSchema = z.object({
  accountId: z.string().uuid()
});

export const depositSchema = z.object({
  accountId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: z.string().optional()
});