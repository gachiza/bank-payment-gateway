import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Account } from "./Account";


export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed"
}


@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({type: 'varchar'})
  paymentReference!: string;

  @Column({ type: "decimal", precision: 15, scale: 2, default: 0})
  amount!: number;

  @Column({type: 'varchar'})
  currency!: string;

  @Column({type: 'varchar'})
  merchantID!: string;

  @Column({type: 'varchar'})
  merchantname!: string;

  @Column({ type: 'varchar',nullable: true})
  description!: string;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.PENDING})
  status!: PaymentStatus;

  @ManyToOne(() => Account, (account) => account.id)
  account!: Account;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

}