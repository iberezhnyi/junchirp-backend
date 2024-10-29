import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common'
import { Request } from 'express'

import { JwtAuthGuard, RolesGuard } from 'src/common/guards'
import { Roles } from 'src/common/decorators'
import { UserModel } from '@/users/schemas'
import { UsersService } from '@/users'
import { UpdateUserDto } from '@/users/dto'
import { IUserResponse } from '@/users/interfaces'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
