import {
  // forwardRef,
  Module,
} from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@/common/configs/config.module'
import { TokensService } from '@/common/tokens/tokens.service'

@Module({
  // imports: [JwtModule.register({}), forwardRef(() => ConfigModule)],
  imports: [JwtModule.register({}), ConfigModule],

  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
