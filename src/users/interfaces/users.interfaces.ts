import { UpdateUserDto } from '@/users/dto'
import { UserModel } from '@/users/schemas'

export interface IUser extends Partial<UserModel> {
  // role: string
}

export interface IUpdateUser {
  userId: string
  updateUserDto: UpdateUserDto
}

export interface IUserResponse {
  message: string
  user: IUser
}
