// src/mqtt/mqtt.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { LogsService } from 'src/logs/logs.service';
import { SensorGateway } from 'src/sensors/gateway/sensor.gateway';
import { InfluxService } from 'src/sensors/influx.service';
import { SensorsService } from 'src/sensors/sensors.service';

@Injectable()
export class MqttService implements OnModuleInit {
    private client: MqttClient;
    private readonly logger = new Logger('MQTT');
    constructor(
    private readonly sensorsService: SensorsService,
    private readonly influxService: InfluxService,
    private logsService: LogsService,
    private readonly gateway: SensorGateway
    ) {}
    

    onModuleInit() {
        this.connectToBroker();
    }

    private connectToBroker() {
        this.client = connect(process.env.MQTT_URL!);

        this.client.on('connect', () => {
            this.logger.log('Connected to MQTT broker');
            this.client.subscribe('sensor/data', (err) => {
                if (err) {
                    this.logger.error('Subscription error:', err.message);
                } else {
                    this.logger.log('Subscribed to sensor/data topic');
                }
            });
        });

        this.client.on('message', async (topic: string, message: Buffer) => {
            try {
                const data = JSON.parse(message.toString());

                this.logger.log(`Received message from ${topic}: ${message.toString()}`);

                // Basit veri doğrulama
                if (!data.sensor_id || !data.timestamp || data.temperature == null || data.humidity == null) {
                    this.logger.warn('Invalid message format');
                    await this.logsService.logUserAction('invalid_mqtt_message', undefined, undefined,  {
                        reason: 'invalid_format',
                        rawMessage: message.toString(),
                    })
                    return;
                }

                this.gateway.broadcastSensorData(data);


                await this.sensorsService.registerIfNotExists(data.sensor_id, 'environment');
                
                // Influx’a veri yaz
                await this.influxService.writeSensorData(data.sensor_id, {
                    temperature: data.temperature,
                    humidity: data.humidity,
                    timestamp: data.timestamp,
                });

                this.logger.log(`Saved data from ${data.sensor_id}`);
               

            } catch (err) {
                this.logger.error(`Error parsing message: ${err.message}`);
            }
        });

        this.client.on('error', (error) => {
            this.logger.error(`MQTT connection error: ${error.message}`);
        });
    }
}
