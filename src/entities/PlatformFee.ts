import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { TierName } from "./Enums";

@Entity("platform_fee")
export class PlatformFee {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
      type: "enum",
      enum: TierName
  })
  tier_name!: TierName;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  min_value!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  max_value!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  platform_fee_percentage!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
