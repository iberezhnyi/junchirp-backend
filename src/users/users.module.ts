import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TokensModule } from '@/common/tokens/tokens.module'
import { UserModel, UserModelSchema } from '@/users/schemas'
// import { AuthModule } from '@/auth/auth.module'
import { UsersController } from '@/users/users.controller'
import { UsersService } from '@/users/users.service'
import { EmailModule } from '@/common/email/email.module'
// import { EmailService } from '@/common/email/email.service'

@Module({
  imports: [
    // forwardRef(() => AuthModule),

    TokensModule,
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
    forwardRef(() => EmailModule),
    // EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
