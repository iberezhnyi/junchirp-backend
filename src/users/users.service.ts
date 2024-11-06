import {
  // BadRequestException,
  // forwardRef,
  // Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { UserModel } from '@/users/schemas'
// import { TokensService } from '@/common/tokens/tokens.service'
import { IUpdateUser, IUser, IUserResponse } from '@/users/interfaces'
// import { EmailService } from '@/common/email/email.service'
// import { ResendConfirmCodeDto, VerifyEmailDto } from '@/users/dto'
// import { getConfirmCode, getConfirmExpiresAtDate } from '@/common/helpers'

@Injectable()
export class UsersService {
  constructor(
    // @Inject(forwardRef(() => TokensService))
    // private readonly tokensService: TokensService,

    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  //* CURRENT-USER
  async getCurrentUser(user: UserModel): Promise<IUserResponse> {
    return {
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        // subscription: user.subscription,
        // role: user.roles[0],
      },
    }
  }

  async updateUser({
    userId,
    updateUserDto,
  }: IUpdateUser): Promise<IUserResponse> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .exec()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`)
    }

    return {
      message: 'Update successful',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        // subscription: updatedUser.subscription,
        // role: updatedUser.roles[0],
      },
    }
  }

  async deleteUser(user: UserModel): Promise<IUserResponse> {
    const result = await this.userModel.findByIdAndDelete(user._id).exec()
    if (!result) {
      throw new NotFoundException(`User with ID ${user._id} not found`)
    }

    return {
      message: `User ${user.email} deleted successfully`,
      user: {
        id: user._id,
        email: user.email,
        // subscription: user.subscription,
        // role: user.roles[0],
      },
    }
  }

  // * Internal methods
  async createUser(newUser: IUser): Promise<UserModel> {
    const user = await this.userModel.create(newUser)

    return user
  }

  async findAll(): Promise<UserModel[]> {
    return await this.userModel.find().exec()
  }

  async findOneById(id: string): Promise<UserModel> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return user
  }

  async findOneByEmail(email: string): Promise<UserModel | null> {
    return await this.userModel.findOne({ email }).exec()
  }

  async findOneByEmailAndUpdate(
    email: string,
    updateFields: any,
  ): Promise<any> {
    const user = await this.userModel
      .findOneAndUpdate({ email }, updateFields)
      .exec()

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`)
    }

    return user
  }

  async findOneByIdAndUpdate(id: string, updateFields: any): Promise<any> {
    const user = await this.userModel.findByIdAndUpdate(id, updateFields).exec()

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`)
    }

    return user
  }
}
