import { Response } from 'express'
import { UserModel } from '@/users/schemas'
import { RegisterUserDto } from '@/auth/dto'
import { IUser } from '@/users/interfaces'

export interface IRegisterUser {
  res: Response
  registerUserDto: RegisterUserDto
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
