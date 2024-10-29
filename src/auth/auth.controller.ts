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
import { AuthService } from '@/auth/auth.service'
import { UsersService } from '@/users/users.service'
import { UserModel } from '@/users/schemas'
import { CreateUserDto } from '@/users/dto'
import { IAuthResponse } from '@/auth/interfaces'
import { IUserResponse } from '@/users/interfaces'

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
