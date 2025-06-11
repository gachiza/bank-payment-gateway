import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Account } from "./Account";

export enum TransactionType {
  DEPOSIT= "deposit",
  WITHDRAW= "withdrawal",
  TRANSFER= "transfer",
  PAYMENT= "payment"
}


@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0})
  amount: number;


  @Column()
  currency: string;

  @Column({ type: "enum", enum: TransactionType})
  type: TransactionType;

  @Column({nullable: true})
  description: string;

  @Column({ nullable: true})
  referemce: string;

  @Column({ default: "pending"})
  status: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

}
