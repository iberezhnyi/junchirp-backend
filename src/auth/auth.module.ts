import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from 'src/common/configs'
import { JwtStrategy, LocalStrategy, RefreshJwtStrategy } from './strategies'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { IsEmailUnique } from '@/common/validators'

@Module({
  imports: [
    PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.jwtSecret,
    //     signOptions: { expiresIn: '30s' },
    //   }),
    //   inject: [ConfigService],
    // }),
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    ConfigService,

    IsEmailUnique,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
