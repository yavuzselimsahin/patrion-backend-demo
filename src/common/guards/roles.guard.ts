// src/common/guards/roles.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  import { RoleEnum } from '../../shared/enums/role.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles || requiredRoles.length === 0) return true;
  
      const request = context.switchToHttp().getRequest();
      const user = request['user'];
      console.log('RolesGuard user:', user);
  
      if (!user || !user.role) {
        throw new ForbiddenException('User role not found.');
      }
  
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Access denied: insufficient role.');
      }
  
      return true;
    }
  }
  