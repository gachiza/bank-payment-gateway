import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Account } from "./Account";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: 'varchar', unique: true})
  email!: string;

  @Column({type: 'varchar'})
  password!: string;

  @Column({type: 'varchar'})
  firstName!: string;

  @Column({type: 'varchar'})
  lastName!: string;

  @Column({type: 'varchar', default: true})
  isAdmin!: boolean;

  @Column({type: 'varchar', default: true})
  isActive!: boolean;

  @OneToMany(() => Account, (account) => account.user)
  accounts!: Account[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
  updatedAt!: Date;
}