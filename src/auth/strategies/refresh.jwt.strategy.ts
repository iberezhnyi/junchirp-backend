import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from 'src/common/configs'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Request } from 'express'
import { UserModel } from 'src/users/schemas'

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
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

  async validate(req: Request, payload: { id: string }): Promise<UserModel> {
    const user = await this.userModel.findById(payload.id)

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
