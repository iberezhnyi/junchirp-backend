export const Messages = {
  AUTH: {
    REGISTRATION_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REFRESH_SUCCESS: 'Refresh successful',
    ACCOUNT_VERIFIED: 'Account successfully verified',
    CONFIRM_CODE_SENT: 'Confirmation code sent successfully',
  },
  ERRORS: {
    EMAIL_ALREADY_EXISTS: (email: string) => `Email ${email} already exists`,
    USER_NOT_FOUND: 'User not found.',
    ACCOUNT_ALREADY_CONFIRMED: 'Account already confirmed.',
    TOO_MANY_REQUESTS:
      'Too many request attempts. Wait until the current code expires.',
  },
}
