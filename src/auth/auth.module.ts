import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@/common/configs'
import { TokensModule } from '@/common/tokens'
import { UsersModule } from '@/users/users.module' //! TODO
import {
  JwtStrategy,
  LocalStrategy,
  RefreshJwtStrategy,
} from '@/common/strategies'
import { AuthService } from '@/auth/auth.service' //! TODO
import { AuthController } from '@/auth/auth.controller' //! TODO
import { NormalizeEmailMiddleware } from '@/common/middlewares'
import { IsEmailUnique } from '@/common/validators'

@Module({
  imports: [
    TokensModule,
    PassportModule,
    forwardRef(() => UsersModule),
    ConfigModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    IsEmailUnique,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NormalizeEmailMiddleware)
      .forRoutes('auth/login', 'auth/register')
  }
}
