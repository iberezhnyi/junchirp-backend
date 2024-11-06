import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@/common/configs/config.service'
import { UsersService } from '@/users/users.service'
import {
  IAuthTokens,
  ISetRefreshTokenCookieParams,
} from '@/common/tokens/interfaces'

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async generateAndUpdateTokens(userId: string): Promise<IAuthTokens> {
    const access_token = await this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: '5m',
        secret: this.configService.jwtSecret,
      },
    )

    const refresh_token = await this.jwtService.signAsync(
      { sub: userId },
      {
        expiresIn: '7d',
        secret: this.configService.refreshJwtSecret,
      },
    )

    const isDevelopment = this.configService.isDevelopment

    //! Check this exception!
    if (!access_token || !refresh_token)
      throw new InternalServerErrorException(
        isDevelopment ? 'Failed to generate tokens' : '',
      )

    await this.usersService.findOneByIdAndUpdate(userId, {
      access_token,
      refresh_token,
    })

    return { access_token, refresh_token }
  }

  //! Async needed?
  async setRefreshTokenCookie({
    refresh_token,
    res,
  }: ISetRefreshTokenCookieParams): Promise<void> {
    await res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.isProduction,
      sameSite: this.configService.isProduction ? 'none' : 'lax',
    })
  }
}
