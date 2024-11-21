import { UsersService } from '@/users/users.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { format } from 'date-fns'
import { ConfigService } from '@/common/configs/config.service'
import { sendEmail } from '@/common/configs/email'
import { UserModel } from '@/users/schemas'

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  private readonly MAX_ATTEMPTS = 3

  async sendConfirmCode({
    email,
    confirmCode,
    confirmCodeExpiresAt,
  }: {
    email: string
    confirmCode: number
    confirmCodeExpiresAt: Date
  }): Promise<void> {
    // const confirmCode = getConfirmCode()
    // const confirmExpiresAtDate = getConfirmExpiresAtDate()

    // await this.usersService.findOneByEmailAndUpdate({
    //   email,
    //   updateFields: {
    //     confirmCode: confirmCode,
    //     confirmCodeExpiresAt: confirmExpiresAtDate,
    //     // $inc: { confirmAttempts: 1 },
    //   },
    // })

    // if (user.confirmAttempts >= 3)
    //   throw new Error('Exceeded the number of code request attempts.')

    const formattedExpiresAt = format(
      confirmCodeExpiresAt,
      'eee MMM dd yyyy HH:mm',
    )

    await sendEmail({
      configService: this.configService,
      to: email,
      subject: 'Confirmation code',
      text: `Your confirmation code: ${confirmCode}.
      Expires At: ${formattedExpiresAt}`,
      html: `<p>Your confirmation code: ${confirmCode}</p>
      <p>Expires At: ${formattedExpiresAt}</p>`,
    })

    // return confirmCode
  }

  async verifyCode(email: string, code: number) {
    const user = await this.usersService.findOneByEmail(email)

    if (!user) throw new BadRequestException('User not found.')

    if (user.isConfirmed)
      throw new BadRequestException('Account already confirmed.')

    if (user.confirmCodeExpiresAt && new Date() > user.confirmCodeExpiresAt) {
      await this.resetConfirmCode(email)

      throw new BadRequestException('Code expired. Please request a new code.')
    }

    if (user.confirmCode !== code) {
      await this.handleInvalidCodeAttempt(user)

      throw new BadRequestException('Invalid code.')
    }

    return await this.verifyUser(email)
  }

  private async resetConfirmCode(email: string) {
    await this.usersService.findOneByEmailAndUpdate(email, {
      confirmCode: null,
      // confirmCodeExpiresAt: null,
      confirmAttempts: 0,
    })
  }

  private async handleInvalidCodeAttempt(user: UserModel) {
    const newAttempts = user.confirmAttempts + 1

    if (newAttempts >= this.MAX_ATTEMPTS) {
      await this.resetConfirmCode(user.email)

      throw new BadRequestException(
        'Too many attempts. Code reset. Request a new code.',
      )
    }

    await this.usersService.findOneByEmailAndUpdate(user.email, {
      confirmAttempts: newAttempts,
    })
  }

  private async verifyUser(email: string) {
    return this.usersService.findOneByEmailAndUpdate(email, {
      isConfirmed: true,
      confirmCode: null,
      confirmCodeExpiresAt: null,
      confirmAttempts: 0,
      requestCodeAttempts: 0,
    })
  }
}
