import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '@/common/decorators'
import { UserModel } from '@/users/schemas'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredRoles) {
      return true
    }

    const { user }: { user: UserModel } = context.switchToHttp().getRequest()

    if (!requiredRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      )
    }

    return true
  }
}
