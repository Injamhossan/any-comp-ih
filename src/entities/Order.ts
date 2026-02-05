import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { OrderStatus } from "./Enums";
import { Specialist } from "./Specialist";
import { User } from "./User";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  specialist_id!: string;

  @Column({ type: "uuid", nullable: true })
  user_id!: string | null;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status!: OrderStatus;

  // Guest Info (used if user_id is null)
  @Column({ type: "varchar", nullable: true })
  customer_name!: string | null;

  @Column({ type: "varchar", nullable: true })
  customer_email!: string | null;

  @Column({ type: "varchar", nullable: true })
  customer_phone!: string | null;

  @Column({ type: "text", nullable: true })
  requirements!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne("Specialist")
  @JoinColumn({ name: "specialist_id" })
  specialist!: Specialist;

  @ManyToOne("User", { nullable: true })
  @JoinColumn({ name: "user_id" })
  user!: User | null;
}
