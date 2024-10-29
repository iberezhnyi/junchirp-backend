import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@/common/configs'
import { UserModel } from '@/users/schemas'
import { UsersService } from '@/users'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,

    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: { sub: string }): Promise<UserModel> {
    const user = await this.usersService.findOneById(payload.sub)

    if (user === null) {
      throw new UnauthorizedException('User not found!')
    }

    const tokenFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()(req)

    if (user.access_token !== tokenFromRequest) {
      throw new UnauthorizedException('Invalid access token')
    }

    return user
  }
}
