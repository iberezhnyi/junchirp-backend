import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
// import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@/common/configs/config.module'
import { TokensModule } from '@/common/tokens/tokens.module'
import { UsersModule } from '@/users/users.module'
import {
  JwtStrategy,
  LocalStrategy,
  RefreshJwtStrategy,
} from '@/common/strategies'
import { AuthService } from '@/auth/auth.service'
import { AuthController } from '@/auth/auth.controller'
import { NormalizeEmailMiddleware } from '@/common/middlewares'
// import {
// IsEmailUniqueValidator,
// NotContainUserNameValidator,
// NotWeakPasswordValidator,
// } from '@/common/validators'
import { EmailModule } from '@/common/email/email.module'

@Module({
  imports: [
    // Pass portModule,
    ConfigModule,
    TokensModule,
    EmailModule,
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    // IsEmailUniqueValidator,
    // NotWeakPasswordValidator,
    // NotContainUserNameValidator,
  ],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(NormalizeEmailMiddleware)
      .forRoutes(
        'auth/login',
        'auth/register',
        'auth/verify',
        'auth/request-confirm-code',
      )
  }
}
