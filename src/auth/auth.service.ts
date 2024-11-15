import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@/common/configs/config.service'
import { TokensService } from '@/common/tokens/tokens.service'
import { IAuthParams, IAuthResponse } from '@/auth/interfaces'
import { UsersService } from '@/users/users.service'
import { IRegisterUser } from '@/auth/interfaces'
import { getConfirmCode, getConfirmExpiresAtDate } from '@/common/helpers'
// import { IUserResponse } from '@/users/interfaces'
import { ResendConfirmCodeDto, VerifyEmailDto } from '@/auth/dto'
import { EmailService } from '@/common/email/email.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  //* REGISTER
  async register({
    registerUserDto,
    res,
  }: IRegisterUser): Promise<IAuthResponse> {
    const { email, password, userName } = registerUserDto

    const hashedPassword = await bcrypt.hash(password, 10)
    const confirmCode = getConfirmCode()
    const confirmCodeExpiresAt = getConfirmExpiresAtDate()

    const user = await this.usersService.createUser({
      userName,
      email,
      password: hashedPassword,
      avatar: this.configService.defaultAvatarUrl,
      confirmCode,
      confirmCodeExpiresAt,
    })

    // const userId = user._id as string

    const { access_token, refresh_token } =
      await this.tokensService.generateAndUpdateTokens(user.id)

    await this.tokensService.setRefreshTokenCookie({ refresh_token, res })

    // await this.emailService.sendConfirmCode({ email, confirmCode })

    return {
      message: 'Registration successful',
      access_token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        // subscription: user.subscription,
        // role: user.roles[0],
      },
    }
  }

  //* LOGIN
  async login({ res, user }: IAuthParams): Promise<IAuthResponse> {
    // const userId = user.id

    const { access_token, refresh_token } =
      await this.tokensService.generateAndUpdateTokens(user.id)

    await this.tokensService.setRefreshTokenCookie({ refresh_token, res })

    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        // subscription: user.subscription,
        // role: user.roles[0],
      },
    }
  }

  //* LOGOUT
  async logout({ user, res }: IAuthParams): Promise<IAuthResponse> {
    await this.usersService.findOneByIdAndUpdate(user.id, {
      refresh_token: null,
      access_token: null,
    })

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: this.configService.isProduction,
      sameSite: 'lax',
      expires: new Date(0),
    })

    return { message: 'Logout successful' }
  }

  //* REFRESH
  async refreshTokens({ user, res }: IAuthParams): Promise<IAuthResponse> {
    // const userId = user._id as string

    const { access_token, refresh_token } =
      await this.tokensService.generateAndUpdateTokens(user.id)

    await this.tokensService.setRefreshTokenCookie({ refresh_token, res })

    return {
      message: 'Refresh successful',
      access_token,
    }
  }

  //* VERIFY
  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const { email, code } = verifyEmailDto

    await this.emailService.verifyCode(email, code)

    return { message: 'Account successfully verified' }
  }

  //* RESEND-CONFIRM-CODE
  async resendConfirmCode(resendConfirmCodeDto: ResendConfirmCodeDto) {
    const { email } = resendConfirmCodeDto

    const user = await this.usersService.findOneByEmail(email)

    if (!user) throw new NotFoundException('User not found.')
    if (user.isConfirmed)
      throw new BadRequestException('Account already confirmed.')

    const confirmCode = getConfirmCode()
    const confirmExpiresAtDate = getConfirmExpiresAtDate()

    await this.usersService.findOneByEmailAndUpdate(email, {
      confirmCode: confirmCode,
      confirmCodeExpiresAt: confirmExpiresAtDate,
      // $inc: { confirmAttempts: 1 },
    })

    // await this.emailService.sendConfirmCode({ email, confirmCode })

    return { message: 'Confirmation code sent successfully' }
  }
}
