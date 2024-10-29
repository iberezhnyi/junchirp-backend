import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { LoginUserDto } from '@/auth/dto'

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { email, password } = request.body

    const loginUserDto = plainToInstance(LoginUserDto, { email, password })
    const errors = await validate(loginUserDto)

    //! if production mode change error message?
    if (errors.length > 0) {
      //   throw new UnauthorizedException('Invalid email or password format')
      const validationErrors = errors
        .map((error: ValidationError) =>
          Object.values(error.constraints || {}).join(', '),
        )
        .join('; ')

      throw new UnauthorizedException(`Validation failed: ${validationErrors}`)
    }

    return super.canActivate(context) as Promise<boolean>
  }
}
