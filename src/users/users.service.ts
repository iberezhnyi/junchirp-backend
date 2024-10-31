import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { UserModel } from '@/users/schemas'
import { TokensService } from '@/common/tokens/tokens.service'
import { ICreateUser, IUpdateUser, IUserResponse } from '@/users/interfaces'
import { IAuthResponse } from '@/auth/interfaces'
import { EmailService } from '@/common/email/email.service'
import { ResendConfirmCodeDto, VerifyEmailDto } from '@/users/dto'
import { getConfirmCode, getConfirmExpiresAtDate } from '@/common/helpers'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,

    private readonly tokensService: TokensService,

    private readonly emailService: EmailService,
  ) {}

  // * Methods used by the controller
  async createUser({
    createUserDto,
    res,
  }: ICreateUser): Promise<IAuthResponse> {
    const { email, password, userName } = createUserDto

    const hashedPassword = await bcrypt.hash(password, 10)
    const confirmCode = getConfirmCode()
    const confirmExpiresAtDate = getConfirmExpiresAtDate()

    const user = await this.userModel.create({
      userName,
      email,
      password: hashedPassword,
      confirmCode,
      confirmExpiresAtDate,
    })

    const userId = user._id as string

    const { access_token, refresh_token } =
      await this.tokensService.generateAndUpdateTokens(userId, this.userModel)

    await this.tokensService.setRefreshTokenCookie(refresh_token, res)

    await this.emailService.sendConfirmCode({ email, confirmCode })

    return {
      message: 'Registration successful',
      access_token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        subscription: user.subscription,
        role: user.roles[0],
      },
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto

    const user = await this.emailService.verifyCode(email, code)

    return {
      message: 'Account successfully verified',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        subscription: user.subscription,
        role: user.roles[0],
      },
    }
  }

  async resendConfirmCode(resendConfirmCodeDto: ResendConfirmCodeDto) {
    const { email } = resendConfirmCodeDto

    const user = await this.findOneByEmail(email)

    if (!user) throw new NotFoundException('User not found.')
    if (user.isConfirmed)
      throw new BadRequestException('Account already confirmed.')

    const confirmCode = getConfirmCode()
    const confirmExpiresAtDate = getConfirmExpiresAtDate()

    await this.findOneByEmailAndUpdate({
      email,
      updateFields: {
        confirmCode: confirmCode,
        confirmCodeExpiresAt: confirmExpiresAtDate,
        // $inc: { confirmAttempts: 1 },
      },
    })

    await this.emailService.sendConfirmCode({ email, confirmCode })

    return {
      message: 'Confirmation code send successfully',
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        subscription: user.subscription,
        role: user.roles[0],
      },
    }
  }

  async getProfile(user: UserModel): Promise<IUserResponse> {
    return {
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        email: user.email,
        subscription: user.subscription,
        role: user.roles[0],
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
        subscription: updatedUser.subscription,
        role: updatedUser.roles[0],
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
        subscription: user.subscription,
        role: user.roles[0],
      },
    }
  }

  // * Internal methods
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

  async findOneByEmailAndUpdate({
    email,
    updateFields,
  }: {
    email: string
    updateFields: any
  }): Promise<any> {
    const user = await this.userModel
      .findOneAndUpdate({ email }, updateFields)
      .exec()

    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`)
    }

    return user
  }
}
