import { Response } from 'express'

export interface IAuthTokens {
  access_token: string
  refresh_token: string
}

export interface ISetRefreshTokenCookieParams {
  refresh_token: string
  res: Response
}
