import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@/common/configs'
import { UserModel } from '@/users/schemas'
import { UsersService } from '@/users'

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['refresh_token']
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.refreshJwtSecret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: { sub: string }): Promise<UserModel> {
    const user = await this.usersService.findOneById(payload.sub)

    if (user === null) {
      throw new UnauthorizedException('User not found!')
    }

    const refreshToken = req.cookies['refresh_token']

    if (user.refresh_token !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return user
  }
}
