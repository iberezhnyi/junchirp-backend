import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@/common/configs'
import { Response } from 'express'
import { Model } from 'mongoose'
import { UserModel } from '@/users/schemas'

export interface IAuthTokens {
  access_token: string
  refresh_token: string
}

export interface INormalizedEmailAndFindUser {
  email: string
  userModel: Model<UserModel>
}

export interface IGenerateAndUpdateTokensParams {
  userId: string
  jwtService: JwtService
  configService: ConfigService
  userModel: Model<UserModel>
}

export interface ISetRefreshTokenCookieParams {
  configService: ConfigService
  refresh_token: string
  res: Response
}
