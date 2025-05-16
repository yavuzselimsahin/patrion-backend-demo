import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { SensorsModule } from 'src/sensors/sensors.module';
import { InfluxService } from 'src/sensors/influx.service';
import { SensorsService } from 'src/sensors/sensors.service';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [SensorsModule, LogsModule],
  providers: [MqttService]
})
export class MqttModule {}
