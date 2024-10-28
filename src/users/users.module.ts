import { Module } from '@nestjs/common'
import { ConfigModule } from 'src/common/configs'
// import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UserModel, UserModelSchema } from './schemas'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TokensModule } from '@/common/tokens/tokens.module'

@Module({
  imports: [
    TokensModule,
    // JwtModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserModelSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
