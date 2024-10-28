import { Injectable } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'

@Injectable()
export class ConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

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

  // MongoDB
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
}
