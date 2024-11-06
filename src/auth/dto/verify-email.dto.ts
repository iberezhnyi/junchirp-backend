import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import { LoginUserDto } from '@/auth/dto'

export class VerifyEmailDto extends PickType(LoginUserDto, ['email']) {
  // @ApiProperty({
  //   example: 'johndoe@example.com',
  //   description: 'The email of the user. Must be a valid email format.',
  //   minLength: 5,
  //   maxLength: 254,
  // })
  // @IsEmail()
  // @IsNotEmpty()
  // @Length(5, 254, { message: 'Email must be between 5 and 254 characters' })
  // @Matches(
  //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*\.[a-zA-Z]{2,}$/,
  //   {
  //     message: 'Email format is invalid',
  //   },
  // )
  // email: string

  @ApiProperty({
    example: '123456',
    description: "Confirmation code sent to user's email",
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Code must be exactly 6 characters' })
  code: string
}
