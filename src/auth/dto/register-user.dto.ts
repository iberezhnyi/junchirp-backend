import { Transform } from 'class-transformer'
import {
  IsEmail,
  // IsEnum,
  IsNotEmpty,
  // IsOptional,
  IsString,
  Length,
  Matches,
  Validate,
} from 'class-validator'
import {
  NotRuDomainValidator,
  NotContainUserNameValidator,
  NotWeakPasswordValidator,
} from '@/common/validators'
import { ApiProperty } from '@nestjs/swagger'
import { normalizeText } from '@/common/helpers'

export class RegisterUserDto {
  //* USER NAME
  @ApiProperty({
    example: 'John Doe',
    description:
      'The name of the user, must be valid and meet the criteria: 3-50 characters, start-end with a letter, and only include letters, spaces, hyphens, and apostrophes between words',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ']+([ \-'][a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ']+)*$/u, {
    message:
      'Name must be valid and meet the criteria: 3-50 characters, start-end with a letter, and only include letters (a-z, A-Z, а-я, А-Я), spaces, hyphens, and apostrophes between words',
  })
  @Transform(({ value }) => normalizeText(value))
  userName: string

  //* EMAIL
  @ApiProperty({
    example: 'johndoe@example.com',
    description:
      'The email of the user. It must be unique, between 7 and 254 characters and follow a valid email format.',
    minLength: 7,
    maxLength: 254,
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(7, 254, { message: 'Email must be between 7 and 254 characters' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,4}$/,
    {
      message: 'Email format is invalid',
    },
  )
  @Validate(NotRuDomainValidator)
  email: string

  //* PASSWORD
  @ApiProperty({
    example: 'Password123!',
    description:
      'The password for the user, must be between 8 and 20 characters and include uppercase, lowercase, numbers, and special characters and must not contain spaces.',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
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
  @Matches(/^\S+$/, {
    message: 'Password must not contain spaces.',
  })
  @Validate(NotWeakPasswordValidator)
  @Validate(NotContainUserNameValidator)
  password: string

  // //* ROLE
  // @IsEnum(['Junior', 'Mentor', 'Investor', 'Partner'])
  // @Transform(({ value }) => value || 'Junior')
  // roles: string[]

  // @IsEnum(['starter', 'pro', 'business'])
  // @IsOptional()
  // @Transform(({ value }) => value || 'starter')
  // subscription?: string
}
