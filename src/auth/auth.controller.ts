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
  LoginUserDto,
  RegisterUserDto,
  ResendConfirmCodeDto,
  VerifyEmailDto,
} from '@/auth/dto'
import { IAuthResponse } from '@/auth/interfaces'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* REGISTER
  @ApiResponse({
    status: 201,
    description:
      'Registration successful. Returns message, access token and user data.',
    schema: {
      example: {
        message: 'Registration successful',
        access_token: 'eyJhbGc...',
        user: {
          id: '605c3c65e2e45b3b3c234d3d',
          userName: 'John Doe',
          email: 'johndoe@example.com',
          avatar: 'https://example.com/uploads/default-avatar.jpg',
          roles: ['Junior', 'Investor'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request with validation errors.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    return await this.authService.register({ registerUserDto, res })
  }

  //* LOGIN
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Returns message, access token and user data.',
    schema: {
      example: {
        message: 'Login successful',
        access_token: 'eyJhbGc...',
        user: {
          id: '605c3c65e2e45b3b3c234d3d',
          userName: 'John Doe',
          email: 'johndoe@example.com',
          avatar: 'https://example.com/uploads/default-avatar.jpg',
          roles: ['Junior', 'Investor'],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request with validation errors.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid email or password.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
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
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Logout successful. Returns message.',
    schema: {
      example: {
        message: 'Logout successful',
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token using cookie' })
  @ApiResponse({
    status: 200,
    description: 'Refresh successful. Returns message and access token.',
    schema: {
      example: {
        message: 'Refresh successful',
        access_token: 'eyJhbGc...',
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
  @ApiResponse({
    status: 200,
    description: 'Account successfully verified. Returns message.',
    schema: { example: { message: 'Account successfully verified' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired code, or account already confirmed',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  @Post('verify')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<IAuthResponse> {
    return await this.authService.verifyEmail(verifyEmailDto)
  }

  //* RESEND-CONFIRM-CODE
  @ApiResponse({
    status: 200,
    description: 'Confirmation code sent successfully. Returns message.',
    schema: { example: { message: 'Confirmation code sent successfully' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Account already confirmed or too many attempts',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Post('resend-confirm-code')
  async resendConfirmCode(
    @Body() resendConfirmCodeDto: ResendConfirmCodeDto,
  ): Promise<IAuthResponse> {
    return await this.authService.resendConfirmCode(resendConfirmCodeDto)
  }
}
