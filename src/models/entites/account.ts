import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";


@Entity()
export class Account {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: 'varchar', unique: true })
  accountNumber!: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0})
  balance!: number;

  @Column({type: 'varchar'})
  currency!: string;

  @ManyToOne(() => User, (user) => user.accounts)
  user!: User;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions!: Transaction[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt!: Date;

};
