import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';
import { MqttModule } from './mqtt/mqtt.module';
import { SensorsModule } from './sensors/sensors.module';
import { Sensor } from './sensors/sensor.entity';
import { LogsModule } from './logs/logs.module';
import { Log } from './logs/log.entity';
// import { CompaniesModule } from './companies/companies.module';
// import { Company } from './companies/company.entity';
import { CompaniesModule } from './companies/companies.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User, Role, Sensor, Log],
      synchronize: true,
    }),
    AuthModule, UsersModule, RolesModule, MqttModule, SensorsModule, LogsModule, CompaniesModule],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
