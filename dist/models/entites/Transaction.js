"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const Account_1 = require("./Account");
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAW"] = "withdrawal";
    TransactionType["TRANSFER"] = "transfer";
    TransactionType["PAYMENT"] = "payment";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Transaction.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: TransactionType }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "referemce", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "pending" }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Account_1.Account, (account) => account.transactions),
    __metadata("design:type", Account_1.Account)
], Transaction.prototype, "account", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)()
], Transaction);
