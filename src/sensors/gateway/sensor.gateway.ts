// src/sensors/gateway/sensor.gateway.ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SensorGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any) {
    return 'pong';
  }

  broadcastSensorData(sensorData: any) {
    console.log("webscoket sensor data:", sensorData);
    this.server.emit('sensor-data', sensorData);
  }
}
