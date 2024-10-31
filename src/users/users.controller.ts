import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Post,
} from '@nestjs/common'
import { Request } from 'express'

import { JwtAuthGuard, RolesGuard } from 'src/common/guards'
import { Roles } from 'src/common/decorators'
import { UserModel } from '@/users/schemas'
import { UsersService } from '@/users/users.service'
import { ResendConfirmCodeDto, UpdateUserDto } from '@/users/dto'
import { IUserResponse } from '@/users/interfaces'
import { VerifyEmailDto } from '@/users/dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('verify')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<IUserResponse> {
    return await this.usersService.verifyEmail(verifyEmailDto)
  }

  @Post('resend-confirm-code')
  async resendConfirmCode(
    @Body() resendConfirmCodeDto: ResendConfirmCodeDto,
  ): Promise<IUserResponse> {
    return await this.usersService.resendConfirmCode(resendConfirmCodeDto)
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = req.user as UserModel

    return await this.usersService.updateUser({
      userId: user.id,
      updateUserDto,
    })
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: Request): Promise<IUserResponse> {
    const user = req.user as UserModel

    return await this.usersService.deleteUser(user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(): Promise<UserModel[]> {
    return await this.usersService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<UserModel> {
    return await this.usersService.findOneById(id)
  }
}
