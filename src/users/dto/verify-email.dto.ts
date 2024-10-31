import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator'

export class VerifyEmailDto {
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

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Code must be exactly 6 characters' })
  code: string
}
