import { Response } from 'express'
import { UserModel } from '../schemas'
import { CreateUserDto, UpdateUserDto } from '../dto'

interface IUser extends Partial<UserModel> {
  role: string
}

export interface ICreateUser {
  createUserDto: CreateUserDto
  res: Response
}

export interface IUpdateUser {
  userId: string
  updateUserDto: UpdateUserDto
}

export interface IUserResponse {
  message: string
  user: IUser
}
