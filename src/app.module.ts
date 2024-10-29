import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { ConfigModule, ConfigService, getMongoConfig } from '@/common/configs'
import { LoggerMiddleware } from '@/common/middlewares'
import { AuthModule } from '@/auth'
import { UsersModule } from '@/users'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.configService.isDevelopment)
      consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
