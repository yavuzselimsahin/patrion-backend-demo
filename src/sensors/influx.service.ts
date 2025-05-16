// src/sensors/influx.service.ts
import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxService {
  private influx: InfluxDB;
  private writeApi;

  constructor() {
    const token = process.env.INFLUX_TOKEN!;
    const org = process.env.INFLUX_ORG!;
    const bucket = process.env.INFLUX_BUCKET!;
    this.influx = new InfluxDB({ url: process.env.INFLUX_URL!, token });
    this.writeApi = this.influx.getWriteApi(org, bucket);
  }

  async writeSensorData(sensorId: string, data: { temperature: number; humidity: number; timestamp: number }) {
    const point = new Point('sensor_readings')
      .tag('sensor_id', sensorId)
      .floatField('temperature', data.temperature)
      .floatField('humidity', data.humidity)
      .timestamp(new Date(data.timestamp * 1000));

    this.writeApi.writePoint(point);
    await this.writeApi.flush();
  }
}
