import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
// import { NestjsFormDataModule } from 'nestjs-form-data'
import { getMongoConfig } from '@/common/configs/mongo'
import { ConfigModule } from '@/common/configs/config.module'
import { ConfigService } from '@/common/configs/config.service'
import { LoggerMiddleware } from '@/common/middlewares'
import { TokensModule } from '@/common/tokens/tokens.module'
import { EmailModule } from '@/common/email/email.module'
import { AuthModule } from '@/auth/auth.module'
import { UsersModule } from '@/users/users.module'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    // NestjsFormDataModule,
    TokensModule,
    EmailModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    // if (this.configService.isDevelopment)
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
