import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Role } from 'src/roles/role.entity';
import { Repository } from 'typeorm';
//import { Company } from 'src/companies/company.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private readonly usersRepo: Repository<User>,
        @InjectRepository(Role) 
        private readonly rolesRepo: Repository<Role>,
        // @InjectRepository(Company) 
        // private readonly companyRepo: Repository<Company>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private jwtService: JwtService,
        ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { 
            email: user.email, 
            sub: user.id, 
            role: user.role.name, 
            company: user.company?.id 
        };
        
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                company: user.company
            },
            access_token: this.jwtService.sign(payload)
        };
    }

    async register(data: { email: string, password: string, roleName: string, company: number }) {
        const role = await this.rolesRepo.findOne({ where: { name: data.roleName as any } });
        //const company = await this.companyRepo.findOne({ where: { id: data.company as any } });
        if (!role) {
            throw new Error(`Role with name ${data.roleName} not found`);
        }
        const user = this.usersRepo.create({
            email: data.email,
            password: await bcrypt.hash(data.password, 10),
            role,
            //company: company || undefined,
        });
        return this.usersRepo.save(user);
    }
}
