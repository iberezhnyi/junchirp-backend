// import { UsersService } from '@/users/users.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@/common/configs/config.service'
import { TokensService } from '@/common/tokens/tokens.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
// import { EmailService } from '@/common/email/email.service'
import { UserModel } from '@/users/schemas'
import { IAuthParams, IAuthResponse } from '@/auth/interfaces'

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,

    private readonly configService: ConfigService,

    // private readonly usersService: UsersService,

    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async login({ res, user }: any): Promise<IAuthResponse> {
    const userId = user._id as string

    const { access_token, refresh_token } =
      await this.tokensService.generateAndUpdateTokens(userId, this.userModel)

    await this.tokensService.setRefreshTokenCookie(refresh_token, res)

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

    const { access_token, refresh_token } =
      await this.tokensService.generateAndUpdateTokens(userId, this.userModel)

    await this.tokensService.setRefreshTokenCookie(refresh_token, res)

    return {
      message: 'Refresh successful',
      access_token,
    }
  }
}
