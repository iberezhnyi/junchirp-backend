import * as nodemailer from 'nodemailer'
import { ConfigService } from '@/common/configs/config.service'
import { getSmtpConfig } from '@/common/configs/email'
import Mail from 'nodemailer/lib/mailer'

type ISendEmailDto = {
  configService: ConfigService
  to: string | Mail.Address
  subject: string
  html: string
  text: string
}

export const sendEmail = async ({
  configService,
  to,
  subject,
  text,
  html,
}: ISendEmailDto): Promise<void> => {
  const smtpConfig = await getSmtpConfig(configService)
  const transporter = nodemailer.createTransport(smtpConfig)

  const mailOptions = {
    from: configService.smtpUser,
    to,
    subject,
    text,
    html,
  }

  await transporter.sendMail(mailOptions)
}
