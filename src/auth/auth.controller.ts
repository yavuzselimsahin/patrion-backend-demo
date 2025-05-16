import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) throw new Error('Invalid credentials');
        return this.authService.login(user);
    }
    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }
}
