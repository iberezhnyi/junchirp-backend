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

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  @Matches(/^[a-zA-Zа-яА-Я\s'-]+$/, {
    message: 'Name can only contain letters, spaces, apostrophes, and hyphens',
  })
  userName: string

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

  @IsEnum(['starter', 'pro', 'business'])
  @IsOptional()
  @Transform(({ value }) => value || 'starter')
  subscription?: string
}
