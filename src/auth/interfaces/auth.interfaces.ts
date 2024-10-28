import { Response } from 'express'
import { UserModel } from 'src/users/schemas'

interface IUser extends Partial<UserModel> {
  role: string
}

export interface IAuthParams {
  user: UserModel
  res: Response
}

export interface IAuthResponse {
  message: string
  access_token?: string
  user?: IUser
}
