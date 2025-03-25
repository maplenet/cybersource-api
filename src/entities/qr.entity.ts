import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Status } from "../constants/status";

@Entity()
export class Qr extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  idUser: number = 0;

  @Column()
  refNumber: string = "";

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: Status.PENDING })
  status: string = Status.PENDING;
}
