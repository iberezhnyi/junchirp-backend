import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModel, UserModelSchema } from '@/users/schemas'
import { UsersController } from '@/users/users.controller'
import { UsersService } from '@/users/users.service'
import { ConfigModule } from '@/common/configs/config.module'
import { UploadModule } from '@/common/upload/upload.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
    ConfigModule,
    UploadModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
