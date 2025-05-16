import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: 'SystemAdmin' | 'CompanyAdmin' | 'User';
}