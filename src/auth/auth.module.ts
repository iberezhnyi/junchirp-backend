import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
// import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from 'src/common/configs'
import { JwtStrategy, LocalStrategy, RefreshJwtStrategy } from './strategies'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
// import { UsersService } from '@/users/users.service'
import { IsEmailUnique } from '@/common/validators'
import { TokensModule } from '@/common/tokens/tokens.module'
import { NormalizeEmailMiddleware } from '@/common/middlewares'

@Module({
  imports: [
    TokensModule,
    PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.jwtSecret,
    //     signOptions: { expiresIn: '30s' },
    //   }),
    //   inject: [ConfigService],
    // }),
    // JwtModule.register({}),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    ConfigService,
    // UsersService,
    IsEmailUnique,
  ],
  controllers: [AuthController],
})
// export class AuthModule {}
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NormalizeEmailMiddleware)
      .forRoutes('auth/login', 'auth/register')
  }
}
