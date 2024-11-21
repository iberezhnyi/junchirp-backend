import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ConfigService {
  private readonly uploadDir = path.join(__dirname, '..', '..', 'uploads')
  private readonly tempDir = path.join(this.uploadDir, 'temp')
  private readonly _defaultAvatarsPath = path.join(
    __dirname,
    '..',
    '..',
    'assets/images/avatars',
  )
  private _defaultAvatarUrl = ''

  constructor(private readonly nestConfigService: NestConfigService) {
    if (!fs.existsSync(this.uploadDir))
      fs.mkdirSync(this.uploadDir, { recursive: true })

    if (!fs.existsSync(this.tempDir))
      fs.mkdirSync(this.tempDir, { recursive: true })
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

  //* File system
  get tempFolderPath(): string {
    if (!this.tempDir) throw new Error('Temporary directory is not defined')

    return this.tempDir
  }

  get uploadFolderPath(): string {
    if (!this.uploadDir) throw new Error('Upload directory is not defined')

    return this.uploadDir
  }

  get defaultAvatarsPath(): string {
    if (!this._defaultAvatarsPath)
      throw new Error('Default avatars directory is not defined')

    return this._defaultAvatarsPath
  }

  get defaultAvatarUrl(): string {
    return this._defaultAvatarUrl
  }

  set defaultAvatarUrl(url: string) {
    this._defaultAvatarUrl = url
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

  //* Cloudinary
  get cloudinaryCloudName(): string {
    const cloudName = this.nestConfigService.get<string>(
      'CLOUDINARY_CLOUD_NAME',
    )

    if (!cloudName)
      throw new Error(
        'CLOUDINARY_CLOUD_NAME is not defined in the environment variables',
      )

    return cloudName
  }

  get cloudinaryApiKey(): string {
    const apiKey = this.nestConfigService.get<string>('CLOUDINARY_API_KEY')

    if (!apiKey)
      throw new Error(
        'CLOUDINARY_API_KEY is not defined in the environment variables',
      )

    return apiKey
  }

  get cloudinaryApiSecret(): string {
    const apiSecret = this.nestConfigService.get<string>(
      'CLOUDINARY_API_SECRET',
    )

    if (!apiSecret)
      throw new Error(
        'CLOUDINARY_API_SECRET is not defined in the environment variables',
      )

    return apiSecret
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

  get smtpSenderEmail(): string {
    const senderEmail = this.nestConfigService.get<string>('SMTP_SENDER_EMAIL')

    if (!senderEmail)
      throw new Error(
        'SMTP_SENDER_EMAIL is not defined in the environment variables',
      )

    return senderEmail
  }

  get smtpSenderName(): string {
    const senderName = this.nestConfigService.get<string>('SMTP_SENDER_NAME')

    if (!senderName)
      throw new Error(
        'SMTP_SENDER_NAME is not defined in the environment variables',
      )

    return senderName
  }

  //* Swagger

  get swaggerUser(): string {
    const user = this.nestConfigService.get<string>('SWAGGER_USER')

    if (!user)
      throw new Error(
        'SWAGGER_USER is not defined in the environment variables',
      )

    return user
  }

  get swaggerPassword(): string {
    const password = this.nestConfigService.get<string>('SWAGGER_PASSWORD')

    if (!password)
      throw new Error(
        'SWAGGER_PASSWORD is not defined in the environment variables',
      )

    return password
  }
}
