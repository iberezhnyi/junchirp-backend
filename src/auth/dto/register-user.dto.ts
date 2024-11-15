import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator'
import { IsEmailUnique } from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterUserDto {
  @ApiProperty({
    example: 'John Doe',
    description:
      'The name of the user, must contain only letters, spaces, apostrophes, and hyphens',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-Я\s'’\-]+$/, {
    message: 'Name can only contain letters, spaces, apostrophes, and hyphens',
  })
  userName: string

  @ApiProperty({
    example: 'johndoe@example.com',
    description:
      'The email of the user. It must be unique and follow a valid email format.',
    minLength: 5,
    maxLength: 254,
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(5, 254, { message: 'Email must be between 5 and 254 characters' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,}$/,
    {
      message: 'Email format is invalid',
    },
  )
  @Validate(IsEmailUnique)
  email: string

  @ApiProperty({
    example: 'Password123!',
    description:
      'The password for the user, must be between 8 and 20 characters and include uppercase, lowercase, numbers, and special characters.',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter (A-Z)',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter (a-z)',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'Password must contain at least one number (0-9)',
  })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message: 'Password must contain at least one special character',
  })
  password: string

  // @ApiProperty({
  //   example: 'starter',
  //   description:
  //     'Subscription type of the user, optional, defaults to "starter".',
  //   enum: ['starter', 'pro', 'business'],
  //   required: false,
  // })
  @IsEnum(['starter', 'pro', 'business'])
  @IsOptional()
  @Transform(({ value }) => value || 'starter')
  subscription?: string
}
