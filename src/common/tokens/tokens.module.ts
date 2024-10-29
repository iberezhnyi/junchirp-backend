import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@/common/configs'
import { TokensService } from '@/common/tokens/tokens.service' //! TODO

@Module({
  imports: [JwtModule.register({}), forwardRef(() => ConfigModule)],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
