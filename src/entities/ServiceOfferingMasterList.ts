import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { ServiceOffering } from "@/entities/ServiceOffering";

@Entity("service_offerings_master_list")
export class ServiceOfferingMasterList {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column("text")
  description!: string;

  @Column({ type: "text", nullable: true })
  s3_key!: string | null;

  @Column({ type: "varchar" })
  bucket_name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany("ServiceOffering", (so: ServiceOffering) => so.master_list_item)
  service_offerings!: ServiceOffering[];
}
