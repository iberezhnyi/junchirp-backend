import { ConfigService } from '@/common/configs/config.service'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const getSmtpConfig = async (
  configService: ConfigService,
): Promise<SMTPTransport.Options> => {
  return {
    host: configService.smtpHost,
    port: configService.smtpPort,
    secure: configService.smtpPort === 465, // secure true on port 465
    auth: {
      user: configService.smtpUser,
      pass: configService.smtpPassword,
    },
  }
}
