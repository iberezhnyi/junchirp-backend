import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@/common/configs/config.module'
import { TokensService } from '@/common/tokens/tokens.service'
import { UsersModule } from '@/users/users.module'

@Module({
  // imports: [JwtModule.register({}), forwardRef(() => ConfigModule)],
  imports: [
    JwtModule.register({}),
    ConfigModule,
    forwardRef(() => UsersModule),
  ],

  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
