import { UpdateUserDto } from '@/users/dto'
import { UserModel } from '@/users/schemas'

export interface ICreateUser extends Partial<UserModel> {}

export interface IUser
  extends Pick<UserModel, 'userName' | 'email' | 'avatar' | 'roles'> {
  id: string
}

export interface IUpdateUser {
  userId: string
  updateUserDto: UpdateUserDto
}

export interface IUserResponse {
  message: string
  user: IUser
}
