import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class LoginUserDto {
  //* EMAIL
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the user. Must be a valid email format.',
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
  email: string

  //* PASSWORD
  @ApiProperty({
    example: 'Password123!',
    description:
      'The password for the user, must be between 8 and 20 characters and include uppercase, lowercase, numbers, and special characters.',
    minLength: 8,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  password: string
}
