import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./Enums";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", nullable: true })
  name!: string | null;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  password!: string | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role!: UserRole;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
