import * as nodemailer from 'nodemailer'
import { ConfigService } from '@/common/configs/config.service'
import { getSmtpConfig } from '@/common/configs/email'
import Mail from 'nodemailer/lib/mailer'

type SendEmailDto = {
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
}: SendEmailDto): Promise<void> => {
  const smtpConfig = await getSmtpConfig(configService)
  const transporter = nodemailer.createTransport(smtpConfig)

  const mailOptions = {
    from: {
      address: configService.smtpSenderEmail,
      name: configService.smtpSenderName,
    },
    to,
    subject,
    text,
    html,
  }

  // console.log('mailOptions :>> ', mailOptions)

  await transporter.sendMail(mailOptions)
  // const result = await transporter.sendMail(mailOptions)

  // console.log('result :>> ', result)
}
