import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { TokensModule } from '@/common/tokens'
import { UserModel, UserModelSchema } from '@/users/schemas'
import { AuthModule } from '@/auth'
import { UsersController, UsersService } from '@/users'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TokensModule,
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
