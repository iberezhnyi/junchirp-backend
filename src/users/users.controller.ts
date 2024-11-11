import {
  Controller,
  UseGuards,
  Get,
  Req,
  // Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common'
import { Express, Request } from 'express'
import { JwtAuthGuard } from 'src/common/guards'
import { UserModel } from '@/users/schemas'
import { UsersService } from '@/users/users.service'
import { IUserResponse } from '@/users/interfaces'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileValidationPipe } from '@/common/pipes'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //* CURRENT-USER
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Profile fetched successfully. Returns message and user data.',
    schema: {
      example: {
        message: 'Profile fetched successfully',
        user: {
          id: '605c3c65e2e45b3b3c234d3d',
          userName: 'John Doe',
          email: 'johndoe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async getCurrentUser(@Req() req: Request): Promise<IUserResponse> {
    return await this.usersService.getCurrentUser(req.user as UserModel)
  }

  //* UPLOAD AVATAR
  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Req() req: Request,
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
  ) {
    const user = req.user as UserModel

    return await this.usersService.uploadUserAvatar({ user, file })
  }

  //* DELETE AVATAR
  @UseGuards(JwtAuthGuard)
  @Delete('avatar')
  async deleteAvatar(@Req() req: Request) {
    const user = req.user as UserModel

    return await this.usersService.deleteUserAvatar(user)
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch()
  // async updateUser(
  //   @Req() req: Request,
  //   @Body() updateUserDto: UpdateUserDto,
  // ): Promise<IUserResponse> {
  //   const user = req.user as UserModel

  //   return await this.usersService.updateUser({
  //     userId: user.id,
  //     updateUserDto,
  //   })
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete()
  // async deleteUser(@Req() req: Request): Promise<IUserResponse> {
  //   const user = req.user as UserModel

  //   return await this.usersService.deleteUser(user)
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  // @Get()
  // async findAll(): Promise<UserModel[]> {
  //   return await this.usersService.findAll()
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  // @Get(':id')
  // async findOneById(@Param('id') id: string): Promise<UserModel> {
  //   return await this.usersService.findOneById(id)
  // }
}
