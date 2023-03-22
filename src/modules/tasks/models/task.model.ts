import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 2500 })
  summary: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
