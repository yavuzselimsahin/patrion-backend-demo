import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Param,
    Put,
    Delete,
    NotFoundException,
    UseGuards,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiQuery,
    ApiParam,
    ApiResponse,
    ApiBearerAuth,
    ApiBody
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/role.entity';
import { RoleEnum } from 'src/shared/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';


@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @UseGuards(RolesGuard)
    @Get()
    @ApiOperation({ summary: 'Get all users with optional filters' })
    @ApiQuery({ name: 'email', required: false })
    @ApiQuery({ name: 'role', required: false })
    async findAll(
        @Query('email') email?: string,
        @Query('role') role?: RoleEnum
    ) {
        if (email) {
            const user = await this.usersService.findByEmail(email);
            if (!user) throw new NotFoundException('User not found');
            const { password, ...result } = user;
            return [result];
        }

        if (role) {
            const users = await this.usersService.findByRole(role);
            if (!users) throw new NotFoundException('No users found with the specified role');
            return users.map(user => {
                return user;
            });
        }

        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiParam({ name: 'id', type: String })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findById(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Post()
    @ApiOperation({ summary: 'Create new user' })
    @ApiBody({ type: CreateUserDto })
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return user;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user' })
    @ApiParam({ name: 'id', type: String })
    @ApiBody({ type: UpdateUserDto })
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        const user = await this.usersService.update(id, updateUserDto);
        return user;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({ name: 'id', type: String })
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    // Özel arama endpoint'i (gerekirse)
    @Get('search/by-email')
    @ApiOperation({ summary: 'Find user by email (exact match)' })
    @ApiQuery({ name: 'email', required: true })
    async findByEmail(@Query('email') email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        const { password, ...result } = user;
        return result;
    }

}