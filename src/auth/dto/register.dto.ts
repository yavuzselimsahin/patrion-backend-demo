import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'user', description: 'User role (e.g., "user", "admin")' })
  roleName: string;

  @ApiProperty({ example: 'company id : 1', description: 'Company id' })
  company: number;
}