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
  id!: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0})
  amount!: number;


  @Column({ type: 'varchar' })
  currency!: string;
  

  @Column({ type: "enum", enum: TransactionType})
  type!: TransactionType;

  @Column({type: 'varchar'})
  description!: string;

  @Column({ type: 'varchar'})
  reference!: string;

  @Column({ type: 'varchar', default: "pending"})
  status!: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  account!: Account;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

}
