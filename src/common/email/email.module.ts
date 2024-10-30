import { forwardRef, Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { ConfigModule } from '@/common/configs/config.module'
import { UsersModule } from '@/users/users.module'

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule),
    // UsersModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
