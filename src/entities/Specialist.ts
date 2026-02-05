import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { VerificationStatus } from "./Enums";
import type { Media } from "./Media";
import type { ServiceOffering } from "./ServiceOffering";

@Entity("specialists")
export class Specialist {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0.0, nullable: true })
  average_rating!: number | null;

  @Column({ type: "boolean", default: true })
  is_draft!: boolean;

  @Column({ type: "int", default: 0 })
  total_number_of_ratings!: number;

  @Column({ type: "int", default: 0 })
  purchase_count!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "varchar", unique: true })
  slug!: string;

  @Column("text")
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  base_price!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  platform_fee!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  final_price!: number;

  @Column({
      type: "enum",
      enum: VerificationStatus,
      default: VerificationStatus.PENDING
  })
  verification_status!: VerificationStatus;

  @Column({ type: "boolean", default: false })
  is_verified!: boolean;
  
  // Secretary Profile
  @Column({ type: "varchar", nullable: true })
  secretary_name!: string | null;

  @Column({ type: "varchar", nullable: true })
  secretary_company!: string | null;

  @Column({ type: "text", nullable: true })
  secretary_company_logo!: string | null;

  @Column({ type: "varchar", nullable: true })
  secretary_email!: string | null;

  @Column({ type: "varchar", nullable: true })
  secretary_phone!: string | null;

  @Column({ type: "text", nullable: true })
  secretary_bio!: string | null;

  @Column({ type: "text", nullable: true })
  avatar_url!: string | null;

  @Column("text", { array: true, default: [] })
  certifications!: string[];

  @Column("jsonb", { nullable: true })
  additional_offerings!: any | null;

  @Column({ type: "int" })
  duration_days!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;

  @OneToMany("Media", (media: Media) => media.specialist, { cascade: true })
  media!: Media[];

  @OneToMany("ServiceOffering", (offering: ServiceOffering) => offering.specialist, { cascade: true })
  service_offerings!: ServiceOffering[];
}
