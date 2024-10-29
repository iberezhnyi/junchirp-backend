import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  password: string

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
}
