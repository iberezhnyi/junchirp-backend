import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from 'src/common/configs'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Request } from 'express'
import { UserModel } from 'src/users/schemas'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,

    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload: { sub: string }): Promise<UserModel> {
    const user = await this.userModel.findById(payload.sub)

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
