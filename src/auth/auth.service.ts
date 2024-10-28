import { Injectable } from '@nestjs/common'
import { ConfigService } from 'src/common/configs'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import {
  generateAndUpdateTokens,
  setRefreshTokenCookie,
} from 'src/common/helpers'
import { UserModel } from 'src/users/schemas'
import { IAuthParams, IAuthResponse } from './interfaces'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,

    private readonly jwtService: JwtService,

    private readonly configService: ConfigService,
  ) {}

  async login({ user, res }: IAuthParams): Promise<IAuthResponse> {
    const userId = user._id as string

    const { access_token, refresh_token } = await generateAndUpdateTokens({
      jwtService: this.jwtService,
      configService: this.configService,
      userId,
      userModel: this.userModel,
    })

    // console.log(
    //   'this.configService.isProduction :>> ',
    //   this.configService.isProduction,
    // )

    setRefreshTokenCookie({
      configService: this.configService,
      refresh_token,
      res,
    })

    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
        role: user.roles[0],
      },
    }
  }

  async logout({ user, res }: IAuthParams): Promise<IAuthResponse> {
    await this.userModel.findByIdAndUpdate(user.id, {
      refresh_token: null,
    })

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: this.configService.isProduction,
      sameSite: 'lax',
      expires: new Date(0),
    })

    return { message: 'Logout successful' }
  }

  async refreshTokens({ user, res }: IAuthParams): Promise<IAuthResponse> {
    const userId = user._id as string

    const { access_token, refresh_token } = await generateAndUpdateTokens({
      jwtService: this.jwtService,
      configService: this.configService,
      userId,
      userModel: this.userModel,
    })

    setRefreshTokenCookie({
      configService: this.configService,
      refresh_token,
      res,
    })

    return {
      message: 'Refresh successful',
      access_token,
    }
  }
}
