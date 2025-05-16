import { 
    Injectable, 
    NotFoundException,
    ConflictException, 
    InternalServerErrorException
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from './user.entity';
  import { Role } from '../roles/role.entity';
  import { Repository } from 'typeorm';
  import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/shared/enums/role.enum';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User) 
      private readonly usersRepo: Repository<User>,
      @InjectRepository(Role) 
      private readonly rolesRepo: Repository<Role>,
    ) {}
  
    async findAll(): Promise<Omit<User, 'password'>[]> {
      const users = await this.usersRepo.find({ relations: ['role'] });
      return users.map(user => {
        const { password, ...result } = user;
        return result;
      });
    }
  
    async findById(id: string) {
      const user = await this.usersRepo.findOne({ 
        where: { id: Number(id) },
        relations: ['role']
      });
      if (!user) return null;
      const { password, ...result } = user;
      return result;
    }
  
    async findByEmail(email: string): Promise<User | null> {
      return this.usersRepo.findOne({ 
        where: { email },
        relations: ['role'],
        select: ['id', 'email', 'password', 'role'] 
      });
    }

    async findByRole(roleName: RoleEnum) {
        const users = await this.usersRepo.find({
          where: {
            role: {
              name: roleName
            }
          },
          relations: ['role']
        });
        
        return users.map(user => {
          const { password, ...result } = user;
          return result;
        });
      }
  
    async create(createUserDto: { 
      email: string; 
      password: string; 
      role: RoleEnum; 
    }) {
      // Email kontrolü
      const existingUser = await this.usersRepo.findOne({ where: { email: createUserDto.email } });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
  
      const role = await this.rolesRepo.findOne({ 
        where: { name: createUserDto.role }
      });
      if (!role) {
        throw new NotFoundException(`Role ${createUserDto.role} not found`);
      }
  
      const user = this.usersRepo.create({
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        role,
      });
  
      const savedUser = await this.usersRepo.save(user);
      const { password, ...result } = savedUser;
      return result;
    }
  
    async update(
      id: string, 
      updateUserDto: { email?: string; role?: string }
    ): Promise<Omit<User, 'password'>> {
      const user = await this.usersRepo.findOne({ 
        where: { id: Number(id) },
        relations: ['role']
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      if (updateUserDto.email) {
        user.email = updateUserDto.email;
      }
  
      if (updateUserDto.role) {
        const role = await this.rolesRepo.findOne({ 
          where: { name: updateUserDto.role as RoleEnum }
        });
        if (!role) {
          throw new NotFoundException(`Role ${updateUserDto.role} not found`);
        }
        user.role = role;
      }
  
      const updatedUser = await this.usersRepo.save(user);
      const { password, ...result } = updatedUser;
      return result;
    }
  
    async remove(id: string): Promise<void> {
      const result = await this.usersRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    }
  
    // Özel sorgular (gerekirse)
    async searchUsers(criteria: Partial<User>): Promise<Omit<User, 'password'>[]> {
      const users = await this.usersRepo.find({
        where: criteria,
        relations: ['role']
      });
      return users.map(user => {
        const { password, ...result } = user;
        return result;
      });
    }
      
  }