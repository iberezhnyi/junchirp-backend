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
  // @Transform(({ value }) => value.toLowerCase())
  @Validate(IsEmailUnique)
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEnum(['starter', 'pro', 'business'])
  @IsOptional()
  @Transform(({ value }) => value || 'starter')
  subscription?: string
}
