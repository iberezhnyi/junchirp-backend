import { UsersService } from '@/users/users.service'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@/common/configs/config.service'
import { sendEmail } from '@/common/configs/email'

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async sendVerificationCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from the current time

    const user = await this.usersService.findOneByEmailAndUpdate({
      email,
      updateFields: {
        confirmationCode: code,
        confirmationCodeExpiresAt: expiresAt,
        $inc: { confirmationAttempts: 1 },
      },
    })

    if (user.confirmationAttempts >= 3) {
      throw new Error('Exceeded the number of code request attempts.')
    }

    //! TODO: Reset the number of attempts

    await sendEmail({
      configService: this.configService,
      to: email,
      subject: 'Verification code',
      text: `Your verification code: ${code}`,
      html: `<p>Your verification code: ${code}</p>`,
    })
    return code
  }

  async verifyCode(email: string, code: string) {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) throw new Error('User not found.')
    if (user.confirmationCode !== code) throw new Error('Invalid code.')
    if (
      user.confirmationCodeExpiresAt &&
      new Date() > user.confirmationCodeExpiresAt
    )
      throw new Error('Code expired.')

    const verifyUser = await this.usersService.findOneByEmailAndUpdate({
      email,
      updateFields: {
        isConfirmed: true,
        verificationCode: null,
        verificationCodeExpiresAt: null,
        // confirmationAttempts: 0,
      },
    })

    return verifyUser
  }
}
