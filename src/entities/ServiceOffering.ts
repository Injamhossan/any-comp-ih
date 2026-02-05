import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import type { Specialist } from "./Specialist";
import type { ServiceOfferingMasterList } from "./ServiceOfferingMasterList";

@Entity("service_offerings")
export class ServiceOffering {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  specialist_id!: string;

  @Column({ type: "uuid" })
  service_offerings_master_list_id!: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: true })
  price!: number | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne("Specialist", (specialist: Specialist) => specialist.service_offerings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "specialist_id" })
  specialist!: Specialist;

  @ManyToOne("ServiceOfferingMasterList", (master: ServiceOfferingMasterList) => master.service_offerings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "service_offerings_master_list_id" })
  master_list_item!: ServiceOfferingMasterList;
}
