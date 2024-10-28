import { ISetRefreshTokenCookieParams } from '../interfaces'

export const setRefreshTokenCookie = ({
  configService,
  refresh_token,
  res,
}: ISetRefreshTokenCookieParams): void => {
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: configService.isProduction,
    sameSite: configService.isProduction ? 'none' : 'lax',
  })
}
