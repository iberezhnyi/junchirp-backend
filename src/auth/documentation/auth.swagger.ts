import {
  LoginUserDto,
  RegisterUserDto,
  RequestConfirmCodeDto,
  VerifyEmailDto,
} from '@/auth/dto'

export const AuthDocs = {
  //* REGISTER
  register: {
    // summary: 'User registration',
    responses: {
      201: {
        // description:
        //   'Registration successful. Returns message, access token and user data.',
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
      },
      400: 'Bad request with validation errors.',
      409: 'Email already exists.',
      500: 'Internal server error.',
    },
    bodyType: RegisterUserDto,
  },

  //* LOGIN
  login: {
    // summary: 'User login',
    responses: {
      200: {
        // description:
        //   'Login successful. Returns message, access token and user data.',
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
      },
      400: 'Bad request with validation errors.',
      401: 'Unauthorized. Invalid email or password.',
      500: 'Internal server error.',
    },
    bodyType: LoginUserDto,
  },

  //* LOGOUT
  logout: {
    // summary: 'User logout',
    responses: {
      200: {
        // description: 'Logout successful. Returns message.',
        schema: {
          example: {
            message: 'Logout successful',
          },
        },
      },
      401: 'Unauthorized. Invalid email or password.',
      500: 'Internal server error.',
    },
    isBearerAuth: true,
  },

  //* REFRESH
  refresh: {
    summary: 'Refresh access token using cookie',
    responses: {
      200: {
        // description: 'Refresh successful. Returns message and access token.',
        schema: {
          example: {
            message: 'Refresh successful',
            access_token: 'eyJhbGc...',
          },
        },
      },
      401: 'Unauthorized. Invalid or expired refresh token.',
      500: 'Internal server error.',
    },
    isBearerAuth: true,
  },

  //* VERIFY
  verify: {
    // summary: 'Verify user email',
    responses: {
      200: {
        // description: 'Account successfully verified. Returns message.',
        schema: {
          example: {
            message: 'Account successfully verified',
          },
        },
      },
      400: 'Invalid or expired code, or account already confirmed.',
      500: 'Internal server error.',
    },
    bodyType: VerifyEmailDto,
  },

  //* REQUEST CONFIRM CODE
  requestConfirmCode: {
    // summary: 'Request a new confirmation code',
    responses: {
      200: {
        // description: 'Confirmation code sent successfully. Returns message.',
        schema: {
          example: {
            message: 'Confirmation code sent successfully',
          },
        },
      },
      400: 'Account already confirmed or too many attempts.',
      404: 'User not found.',
      500: 'Internal server error.',
    },
    bodyType: RequestConfirmCodeDto,
  },
}
