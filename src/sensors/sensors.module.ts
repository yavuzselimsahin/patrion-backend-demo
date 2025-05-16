import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './sensor.entity';
import { InfluxService } from './influx.service';
import { SensorGateway } from './gateway/sensor.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor])],
  providers: [SensorsService, InfluxService, SensorGateway],
  controllers: [SensorsController],
  exports: [SensorsService, InfluxService, SensorGateway]
})
export class SensorsModule {}
