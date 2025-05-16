// src/sensors/sensors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(Sensor)
    private sensorsRepo: Repository<Sensor>,
  ) {}

  async findBySensorId(sensorId: string): Promise<Sensor | null> {
    return this.sensorsRepo.findOne({ where: { sensorId } });
  }

  async registerIfNotExists(sensorId: string, type: string) {
    const existing = await this.findBySensorId(sensorId);
    if (!existing) {
      const newSensor = this.sensorsRepo.create({ sensorId, type });
      return this.sensorsRepo.save(newSensor);
    }
    return existing;
  }
}
