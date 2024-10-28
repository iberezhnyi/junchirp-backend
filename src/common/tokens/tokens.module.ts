import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from 'src/common/configs'
import { TokensService } from './tokens.service'

@Module({
  imports: [JwtModule.register({})],
  providers: [TokensService, ConfigService],
  exports: [TokensService],
})
export class TokensModule {}
