import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Get,
} from '@nestjs/common'
import { Request, Response } from 'express'
import {
  JwtAuthGuard,
  LocalAuthGuard,
  RefreshJwtGuard,
} from 'src/common/guards'
import { UserModel } from 'src/users/schemas'
import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from 'src/users/dto'
import { IAuthResponse } from './interfaces'
import { IUserResponse } from 'src/users/interfaces'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,

    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    return await this.usersService.createUser({ createUserDto, res })
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    const user = req.user as UserModel

    return await this.authService.login({ user, res })
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<IUserResponse> {
    return await this.usersService.getProfile(req.user as UserModel)
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    const user = req.user as UserModel

    return await this.authService.logout({ user, res })
  }

  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    const user = req.user as UserModel

    return await this.authService.refreshTokens({ user, res })
  }
}
