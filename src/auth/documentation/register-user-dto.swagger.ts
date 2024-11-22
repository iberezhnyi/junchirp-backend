import { ApiPropertyOptions } from '@nestjs/swagger'

export const RegisterUserDocs = {
  userName: {
    example: 'John Doe',
    description:
      'The name of the user, must be valid and meet the criteria: 3-50 characters, start-end with a letter, and only include letters, spaces, hyphens, and apostrophes between words',
    minLength: 3,
    maxLength: 50,
  } as ApiPropertyOptions,
  email: {
    example: 'johndoe@example.com',
    description:
      'The email of the user. It must be unique, between 7 and 254 characters and follow a valid email format.',
    minLength: 7,
    maxLength: 254,
  } as ApiPropertyOptions,
  password: {
    example: 'Password123!',
    description:
      'The password for the user, must be between 8 and 20 characters and include uppercase, lowercase, numbers, and special characters and must not contain spaces.',
    minLength: 8,
    maxLength: 20,
  } as ApiPropertyOptions,
}
