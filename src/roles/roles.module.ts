import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService],
  exports: [RolesModule],
})
export class RolesModule {}
