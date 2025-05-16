import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUserByEmailDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address to search for',
  })
  @IsEmail()
  email: string;
}