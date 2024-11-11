import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserModel, UserModelSchema } from '@/users/schemas'

import { UsersController } from '@/users/users.controller'
import { UsersService } from '@/users/users.service'
import { UploadService } from '@/common/upload-service/upload.service'
import { ConfigModule } from '@/common/configs/config.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UploadService],
  exports: [UsersService],
})
export class UsersModule {}
