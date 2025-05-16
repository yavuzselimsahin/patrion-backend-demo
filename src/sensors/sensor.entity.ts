// src/sensors/sensor.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensorId: string;

  @Column()
  type: string; 

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
