import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ConfigService } from '@/common/configs'
import { Model } from 'mongoose'
import { UserModel } from '@/users/schemas'
import { IAuthTokens } from '@/common/interfaces'
import { Response } from 'express'

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAndUpdateTokens(
    userId: string,
    userModel: Model<UserModel>,
  ): Promise<IAuthTokens> {
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

    // Check this exception!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (!access_token || !refresh_token)
      throw new InternalServerErrorException(
        isDevelopment ? 'Failed to generate tokens' : '',
      )

    await userModel.findByIdAndUpdate(userId, { access_token, refresh_token })

    return { access_token, refresh_token }
  }

  // Async needed?????????????
  async setRefreshTokenCookie(
    refresh_token: string,
    res: Response,
  ): Promise<void> {
    await res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: this.configService.isProduction,
      sameSite: this.configService.isProduction ? 'none' : 'lax',
    })
  }

  // async updateTokensInDB(
  //   userId: string,
  //   userModel: Model<UserModel>,
  // ): Promise<void> {
  //   const { access_token, refresh_token } = await this.generateTokens(userId)

  //   await userModel.findByIdAndUpdate(userId, { access_token, refresh_token })
  // }

  // async verifyToken(token: string, isRefreshToken = false) {
  //   try {
  //     const secret = isRefreshToken
  //       ? this.configService.get<string>('JWT_REFRESH_SECRET')
  //       : this.configService.get<string>('JWT_SECRET')
  //     return await this.jwtService.verifyAsync(token, { secret })
  //   } catch (error) {
  //     return null
  //   }
  // }

  // async refreshTokens(refreshToken: string) {
  //   const payload = await this.verifyToken(refreshToken, true)
  //   if (!payload) {
  //     throw new Error('Invalid refresh token')
  //   }
  //   return this.generateTokens(payload.sub)
  // }
}
