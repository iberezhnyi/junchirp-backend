import { InternalServerErrorException } from '@nestjs/common'
import { IAuthTokens, IGenerateAndUpdateTokensParams } from '../interfaces'

export const generateAndUpdateTokens = async ({
  configService,
  jwtService,
  userModel,
  userId,
}: IGenerateAndUpdateTokensParams): Promise<IAuthTokens> => {
  const access_token = jwtService.sign(
    { id: userId },
    {
      expiresIn: '30s',
      secret: configService.jwtSecret,
    },
  )

  const refresh_token = jwtService.sign(
    { id: userId },
    {
      expiresIn: '7d',
      secret: configService.refreshJwtSecret,
    },
  )

  if (!access_token || !refresh_token) {
    throw new InternalServerErrorException()
  }

  await userModel.findByIdAndUpdate(userId, { access_token, refresh_token })

  return { access_token, refresh_token }
}
