import { Controller, Get, NotFoundException, Param, Query, Req, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('logs')
export class LogsController {
    constructor(private logsService: LogsService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Get('view')
    async logVisit(@Req() req) {
        await this.logsService.logUserAction('viewed_logs', req.user.email, req.user.userId, {
            page: 'log_page',
        });
        return { status: 'ok' };
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    @ApiQuery({ name: 'userId', required: false })
    @ApiOperation({ summary: 'Get All logs with optional params' })
    @ApiResponse({ status: 404, description: 'currently no logs written' })
    async findAll(@Query('userId') userId?: number,) {
        if (userId) {
            const logs = await this.logsService.getUserLogs(userId);
            if (!logs) throw new NotFoundException('User not found');
            return logs;
        }
        const logs = await this.logsService.getAllLogs();
        if (!logs) throw new NotFoundException('No logs');
        return logs;
    }

}
