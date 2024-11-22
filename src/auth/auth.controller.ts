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
import { UserModel } from '@/users/schemas'
import {
  RegisterUserDto,
  RequestConfirmCodeDto,
  VerifyEmailDto,
} from '@/auth/dto'
import { IAuthResponse } from '@/auth/interfaces'
import { ApiTags } from '@nestjs/swagger'
import { ApiRouteDocumentation } from '@/common/decorators'
import { AuthDocs } from '@/auth/documentation'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* REGISTER
  @ApiRouteDocumentation(AuthDocs.register)
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    return await this.authService.register({ registerUserDto, res })
  }

  //* LOGIN
  @ApiRouteDocumentation(AuthDocs.login)
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

  //* LOGOUT
  @ApiRouteDocumentation(AuthDocs.logout)
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

  //* REFRESH
  @ApiRouteDocumentation(AuthDocs.refresh)
  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    const user = req.user as UserModel

    return await this.authService.refreshTokens({ user, res })
  }

  //* VERIFY
  @ApiRouteDocumentation(AuthDocs.verify)
  @Post('verify')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<IAuthResponse> {
    return await this.authService.verifyEmail(verifyEmailDto)
  }

  //* REQUEST-CONFIRM-CODE
  @ApiRouteDocumentation(AuthDocs.requestConfirmCode)
  @Post('request-confirm-code')
  async requestConfirmCode(
    @Body() requestConfirmCodeDto: RequestConfirmCodeDto,
  ): Promise<IAuthResponse> {
    return await this.authService.requestConfirmCode(requestConfirmCodeDto)
  }
}
