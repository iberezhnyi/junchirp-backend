import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ConfigService {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads')
  private readonly avatarsDir = path.join(this.uploadDir, 'avatars')

  constructor(private readonly nestConfigService: NestConfigService) {
    if (!fs.existsSync(this.uploadDir))
      fs.mkdirSync(this.uploadDir, { recursive: true })

    if (!fs.existsSync(this.avatarsDir))
      fs.mkdirSync(this.avatarsDir, { recursive: true })
  }

  //* Common
  get isProduction(): boolean {
    return this.nestConfigService.get<string>('NODE_ENV') === 'production'
  }

  get isDevelopment(): boolean {
    return this.nestConfigService.get<string>('NODE_ENV') === 'development'
  }

  get port(): number {
    const port = this.nestConfigService.get<number>('PORT')

    if (!port)
      throw new Error('PORT is not defined in the environment variables')

    return port
  }

  //* JWT
  get jwtSecret(): string {
    const secret = this.nestConfigService.get<string>('JWT_SECRET')

    if (!secret)
      throw new Error('JWT_SECRET is not defined in the environment variables')

    return secret
  }

  get refreshJwtSecret(): string {
    const secret = this.nestConfigService.get<string>('REFRESH_JWT_SECRET')

    if (!secret)
      throw new Error(
        'REFRESH_JWT_SECRET is not defined in the environment variables',
      )

    return secret
  }

  //* MongoDB
  get mongoUser(): string {
    const user = this.nestConfigService.get<string>('MONGO_USER')

    if (!user)
      throw new Error('MONGO_USER is not defined in the environment variables')

    return user
  }

  get mongoPassword(): string {
    const password = this.nestConfigService.get<string>('MONGO_PASSWORD')

    if (!password)
      throw new Error(
        'MONGO_PASSWORD is not defined in the environment variables',
      )

    return password
  }

  get mongoHost(): string {
    const host = this.nestConfigService.get<string>('MONGO_HOST')

    if (!host)
      throw new Error('MONGO_HOST is not defined in the environment variables')

    return host
  }

  get mongoDbName(): string {
    const dbName = this.nestConfigService.get<string>('MONGO_DB_NAME')

    if (!dbName)
      throw new Error(
        'MONGO_DB_NAME is not defined in the environment variables',
      )

    return dbName
  }

  //* Email
  get smtpHost(): string {
    const host = this.nestConfigService.get<string>('SMTP_HOST')

    if (!host)
      throw new Error('SMTP_HOST is not defined in the environment variables')

    return host
  }

  get smtpPort(): number {
    const port = this.nestConfigService.get<number>('SMTP_PORT')

    if (!port)
      throw new Error('SMTP_PORT is not defined in the environment variables')

    return port
  }

  get smtpUser(): string {
    const user = this.nestConfigService.get<string>('SMTP_USER')

    if (!user)
      throw new Error('SMTP_USER is not defined in the environment variables')

    return user
  }

  get smtpPassword(): string {
    const password = this.nestConfigService.get<string>('SMTP_PASSWORD')

    if (!password)
      throw new Error(
        'SMTP_PASSWORD is not defined in the environment variables',
      )

    return password
  }

  //* Files
  get uploadFolderPath(): string {
    if (!this.uploadDir) throw new Error('Upload directory is not defined')

    return this.uploadDir
  }

  get uploadAvatarPath(): string {
    if (!this.avatarsDir) throw new Error('Upload directory is not defined')

    return this.avatarsDir
  }

  get defaultAvatarFilePath(): string {
    return path.join(this.avatarsDir, 'user-avatar.jpg')
    // return path.join(this.avatarsDir, 'user-avatar.png')
  }
}
