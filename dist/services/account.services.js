"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositSchema = exports.accountDetailsSchema = exports.createAccountSchema = exports.AccountService = void 0;
const db_1 = require("../config/db");
const Account_1 = require("../models/entites/Account");
const User_1 = require("../models/entites/User");
const Transaction_1 = require("../models/entites/Transaction");
const zod_1 = require("zod");
const apiResponse_1 = require("../utils/apiResponse");
exports.AccountService = {
    async createAccount(userId, currency = " USD") {
        const accountRepository = db_1.AppDataSource.getRepository(Account_1.Account);
        const userRepository = db_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new apiResponse_1.ApiError("User not found", 404);
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
    async getAccountDetails(accountId, userId) {
        const accountRepository = db_1.AppDataSource.getRepository(Account_1.Account);
        const account = await accountRepository.findOne({
            where: { id: accountId },
            relations: ["user", "transactions"]
        });
        if (!account) {
            throw new apiResponse_1.ApiError("Unauthorized access to account", 403);
        }
        return account;
    },
    async getUserAccounts(userId) {
        const accountRepository = db_1.AppDataSource.getRepository(Account_1.Account);
        return accountRepository.find({
            where: { user: { id: userId } },
            relations: ["transactions"]
        });
    },
    async deposit(accountId, amount, currency, description) {
        const accountRepository = db_1.AppDataSource.getRepository(Account_1.Account);
        const transactionRepository = db_1.AppDataSource.getRepository(Transaction_1.Transaction);
        const queryRunner = db_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const account = await queryRunner.manager.findOne(Account_1.Account, {
                where: { id: accountId },
                lock: { mode: "pessimistic_write" }
            });
            if (!account) {
                throw new apiResponse_1.ApiError(" Account not found", 404);
            }
            if (account.currency !== currency) {
                throw new apiResponse_1.ApiError(" Currency mismatch", 400);
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
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.createAccountSchema = zod_1.z.object({
    currency: zod_1.z.string().length(3).optional()
});
exports.accountDetailsSchema = zod_1.z.object({
    accountId: zod_1.z.string().uuid()
});
exports.depositSchema = zod_1.z.object({
    accountId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive(),
    currency: zod_1.z.string().length(3),
    description: zod_1.z.string().optional()
});
