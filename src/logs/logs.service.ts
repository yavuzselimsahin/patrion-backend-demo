// src/logs/logs.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogsService {
  constructor(@InjectRepository(Log) private logsRepo: Repository<Log>) {}

  async logUserAction(action: string, userEmail?: string, userId?: number, data: any = null) {
    const log = this.logsRepo.create({ userId, userEmail, action, data });
    return this.logsRepo.save(log);
  }

  async getUserLogs(userId: number) {
    return this.logsRepo.find({ where: { userId }, order: { timestamp: 'DESC' } });
  }

  async getAllLogs() {
    return this.logsRepo.find({ order: { timestamp: 'DESC' } });
  }
}
