import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import type { Specialist } from "./Specialist";
import { MimeType, MediaType } from "./Enums";

@Entity("media")
export class Media {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  specialist_id!: string;

  @Column({ type: "varchar" })
  file_name!: string;

  @Column({ type: "int" })
  file_size!: number;

  @Column({ type: "int", default: 0 })
  display_order!: number;

  @Column({ type: "text" })
  url!: string;

  @Column({
      type: "enum",
      enum: MimeType
  })
  mime_type!: MimeType;

  @Column({
      type: "enum",
      enum: MediaType
  })
  media_type!: MediaType;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  uploaded_at!: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne("Specialist", (specialist: Specialist) => specialist.media, { onDelete: "CASCADE" })
  @JoinColumn({ name: "specialist_id" })
  specialist!: Specialist;
}
