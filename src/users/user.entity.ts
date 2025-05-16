// src/users/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from '../roles/role.entity';
//import { Company } from 'src/companies/company.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToOne(() => Role)
    role: Role;

    // @ManyToOne(() => Company, (company) => company.users, { nullable: true })
    // company: Company;
}
