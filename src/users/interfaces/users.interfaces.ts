import { Response } from 'express'
import { CreateUserDto, UpdateUserDto } from '@/users/dto'
import { UserModel } from '@/users/schemas'

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
